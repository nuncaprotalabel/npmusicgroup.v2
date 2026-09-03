import type { PoolClient } from "pg";
import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { hashPassword } from "@/lib/password";
import { createActivationToken, usernameBase } from "@/lib/onboarding";

interface ContractOnboardingContext {
  contract_id: string;
  solicitud_id: string;
  invitation_id: string;
  nombre_artistico: string;
  email: string;
  solicitud_status: string;
  invitation_status: string;
  contract_status: string;
  signature_id: string | null;
  signature_invitation_id: string | null;
  signature_status: string | null;
}

interface ExistingOnboarding {
  id: string;
  user_id: string | null;
  status: string;
}

interface ExistingUser {
  id: string;
  username: string;
  role: string;
  email: string | null;
}

async function findAvailableUsername(
  client: PoolClient,
  nombreArtistico: string,
  email: string,
): Promise<string> {
  const base = usernameBase(nombreArtistico, email);
  for (let suffix = 0; suffix < 1000; suffix += 1) {
    const candidate = suffix === 0 ? base : `${base.slice(0, 46)}_${suffix}`;
    const result = await client.query<{ id: string }>(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1",
      [candidate],
    );
    if (result.rowCount === 0) return candidate;
  }
  throw new Error("No fue posible generar un username disponible.");
}

function authError(error: unknown): NextResponse | null {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  let client: PoolClient | undefined;
  try {
    const session = await requirePermission("contracts.manage");
    const { id } = await params;

    client = await db.connect();
    await client.query("BEGIN");

    const context = (
      await client.query<ContractOnboardingContext>(
        `SELECT c.id AS contract_id, c.solicitud_id, c.invitation_id,
                s.nombre_artistico, s.email, s.estado AS solicitud_status,
                i.status AS invitation_status, c.status AS contract_status,
                cs.id AS signature_id, cs.invitation_id AS signature_invitation_id,
                cs.status AS signature_status
         FROM contracts c
         INNER JOIN solicitudes s ON s.id = c.solicitud_id
         INNER JOIN invitations i ON i.id = c.invitation_id
         LEFT JOIN contract_signatures cs ON cs.contract_id = c.id
         WHERE c.id = $1
         FOR UPDATE OF c, s, i`,
        [id],
      )
    ).rows[0];

    if (!context) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 });
    }
    if (context.solicitud_status !== "APROBADA") {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "La solicitud relacionada no está aprobada." },
        { status: 409 },
      );
    }
    if (context.invitation_status !== "UTILIZADA") {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "La invitación relacionada no ha sido utilizada." },
        { status: 409 },
      );
    }
    if (
      context.contract_status !== "FIRMADO" ||
      !context.signature_id ||
      context.signature_status !== "FIRMADO" ||
      context.signature_invitation_id !== context.invitation_id
    ) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "El contrato no tiene una firma válida para iniciar el onboarding." },
        { status: 409 },
      );
    }

    const existingOnboarding = (
      await client.query<ExistingOnboarding>(
        `SELECT id, user_id, status
         FROM artist_onboarding
         WHERE contract_id = $1
         FOR UPDATE`,
        [context.contract_id],
      )
    ).rows[0];

    if (existingOnboarding?.status === "CUENTA_ACTIVA") {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "El onboarding de esta cuenta ya fue completado." },
        { status: 409 },
      );
    }
    if (existingOnboarding?.user_id) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "El onboarding de esta cuenta ya fue iniciado. Usa el enlace existente." },
        { status: 409 },
      );
    }

    const existingUser = (
      await client.query<ExistingUser>(
        `SELECT id, username, role, email
         FROM users
         WHERE LOWER(email) = LOWER($1)
         FOR UPDATE`,
        [context.email.trim().toLowerCase()],
      )
    ).rows[0];

    if (existingUser) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "El correo de esta solicitud ya pertenece a una cuenta incompatible." },
        { status: 409 },
      );
    }

    const username = await findAvailableUsername(client, context.nombre_artistico, context.email);
    const unusablePasswordHash = await hashPassword(randomBytes(32).toString("base64url"));
    const user = (
      await client.query<{ id: string; username: string }>(
        `INSERT INTO users (username, email, password_hash, role, is_active, created_by)
         VALUES ($1, $2, $3, 'ARTIST', false, $4)
         RETURNING id, username`,
        [
          username,
          context.email.trim().toLowerCase(),
          unusablePasswordHash,
          session.userId,
        ],
      )
    ).rows[0];

    const activation = createActivationToken();
    const onboarding = (
      await client.query<{ id: string }>(
      `INSERT INTO artist_onboarding
        (solicitud_id, invitation_id, contract_id, user_id, status,
         activation_token_hash, activation_expires_at)
       VALUES ($1, $2, $3, $4, 'PENDIENTE_PASSWORD', $5, $6)
       RETURNING id`,
      [
        context.solicitud_id,
        context.invitation_id,
        context.contract_id,
        user.id,
        activation.tokenHash,
        activation.expiresAt,
      ],
      )
    ).rows[0];

    const artist = (
      await client.query<{ id: string }>(
      `INSERT INTO artists
        (user_id, onboarding_id, nombre_artistico, pais, genero_principal,
         enlace_principal, instagram, tiktok, bio, status)
       SELECT $1, $2, s.nombre_artistico, s.pais, s.genero_principal,
              s.enlace_principal, s.instagram, s.tiktok, s.mensaje,
              'ONBOARDING_PENDIENTE'
       FROM solicitudes s
       WHERE s.id = $3
       RETURNING id`,
      [user.id, onboarding.id, context.solicitud_id],
      )
    ).rows[0];

    await client.query("COMMIT");

    const auditContext = {
      solicitudId: context.solicitud_id,
      invitationId: context.invitation_id,
      contractId: context.contract_id,
      artistId: artist.id,
      role: "ARTIST",
    };
    const auditRequest = {
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
      severity: "INFO" as const,
    };
    await Promise.all([
      logAudit({
        userId: session.userId,
        username: session.username,
        action: "ARTIST_CREATED",
        entityType: "artist",
        entityId: artist.id,
        metadata: auditContext,
        ...auditRequest,
      }),
      logAudit({
        userId: session.userId,
        username: session.username,
        action: "ARTIST_ACCOUNT_CREATED",
        entityType: "user",
        entityId: user.id,
        metadata: { ...auditContext, username: user.username },
        ...auditRequest,
      }),
      logAudit({
        userId: session.userId,
        username: session.username,
        action: "ARTIST_ONBOARDING_STARTED",
        entityType: "artist_onboarding",
        entityId: context.contract_id,
        metadata: auditContext,
        ...auditRequest,
      }),
    ]);

    return NextResponse.json(
      {
        status: "PENDIENTE_PASSWORD",
        username: user.username,
        activationUrl: `/activar/${activation.token}`,
        expiresAt: activation.expiresAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    const response = authError(error);
    if (response) return response;
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "La cuenta del artista ya existe o el onboarding ya fue iniciado." },
        { status: 409 },
      );
    }
    console.error("[POST /api/admin/contratos/:id/onboarding]", error);
    return NextResponse.json({ error: "No se pudo iniciar el onboarding." }, { status: 500 });
  } finally {
    client?.release();
  }
}
