import type { PoolClient } from "pg";
import { NextRequest, NextResponse } from "next/server";
import { db, queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { hashPassword } from "@/lib/password";
import {
  hashActivationToken,
  isValidActivationToken,
  isValidPassword,
} from "@/lib/onboarding";

interface ActivationRow {
  id: string;
  user_id: string;
  username: string;
  nombre_artistico: string;
  status: string;
  activation_expires_at: string;
  activation_used_at: string | null;
  is_active: boolean;
}

function invalidTokenResponse(status = 404): NextResponse {
  return NextResponse.json(
    { error: "El enlace de activación no es válido o ya no está disponible." },
    { status },
  );
}

async function findActivation(token: string): Promise<ActivationRow | null> {
  return queryOne<ActivationRow>(
    `SELECT o.id, o.user_id, u.username, s.nombre_artistico, o.status,
            o.activation_expires_at, o.activation_used_at, u.is_active
     FROM artist_onboarding o
     INNER JOIN users u ON u.id = o.user_id
     INNER JOIN solicitudes s ON s.id = o.solicitud_id
     WHERE o.activation_token_hash = $1`,
    [hashActivationToken(token)],
  );
}

function validatePasswordBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return "La contraseña y su confirmación son obligatorias.";
  const password = (body as { password?: unknown }).password;
  const confirmation = (body as { confirmation?: unknown }).confirmation;
  if (typeof password !== "string" || typeof confirmation !== "string" || !password || !confirmation) {
    return "La contraseña y su confirmación son obligatorias.";
  }
  if (!isValidPassword(password)) {
    return "La contraseña debe tener al menos 12 caracteres y no superar el límite permitido.";
  }
  if (password !== confirmation) return "Las contraseñas no coinciden.";
  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  try {
    const { token } = await params;
    if (!isValidActivationToken(token)) return invalidTokenResponse();

    const activation = await findActivation(token);
    if (!activation) return invalidTokenResponse();
    if (activation.activation_used_at || activation.is_active || activation.status === "CUENTA_ACTIVA") {
      return invalidTokenResponse(410);
    }
    if (new Date(activation.activation_expires_at).getTime() <= Date.now()) {
      return invalidTokenResponse(410);
    }
    if (activation.status !== "PENDIENTE_PASSWORD") return invalidTokenResponse(409);

    return NextResponse.json({
      status: "PENDIENTE_PASSWORD",
      artistName: activation.nombre_artistico,
      username: activation.username,
      expiresAt: activation.activation_expires_at,
    });
  } catch (error) {
    console.error("[GET /api/activar/:token]", error);
    return NextResponse.json({ error: "No se pudo validar el enlace de activación." }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  let client: PoolClient | undefined;
  try {
    const { token } = await params;
    if (!isValidActivationToken(token)) return invalidTokenResponse();

    const body = await request.json().catch(() => null);
    const validationError = validatePasswordBody(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const password = (body as { password: string }).password;
    const passwordHash = await hashPassword(password);

    client = await db.connect();
    await client.query("BEGIN");
    const activation = (
      await client.query<ActivationRow>(
        `SELECT o.id, o.user_id, u.username, s.nombre_artistico, o.status,
                o.activation_expires_at, o.activation_used_at, u.is_active
         FROM artist_onboarding o
         INNER JOIN users u ON u.id = o.user_id
         INNER JOIN solicitudes s ON s.id = o.solicitud_id
         WHERE o.activation_token_hash = $1
         FOR UPDATE OF o, u`,
        [hashActivationToken(token)],
      )
    ).rows[0];

    if (!activation) {
      await client.query("ROLLBACK");
      return invalidTokenResponse();
    }
    if (activation.activation_used_at || activation.is_active || activation.status === "CUENTA_ACTIVA") {
      await client.query("ROLLBACK");
      return invalidTokenResponse(410);
    }
    if (new Date(activation.activation_expires_at).getTime() <= Date.now()) {
      await client.query("ROLLBACK");
      return invalidTokenResponse(410);
    }
    if (activation.status !== "PENDIENTE_PASSWORD") {
      await client.query("ROLLBACK");
      return invalidTokenResponse(409);
    }

    const updatedUser = await client.query(
      `UPDATE users
       SET password_hash = $1, is_active = true, updated_at = NOW()
       WHERE id = $2 AND is_active = false`,
      [passwordHash, activation.user_id],
    );
    if (updatedUser.rowCount !== 1) {
      throw new Error("La cuenta no pudo activarse.");
    }

    const updatedOnboarding = await client.query(
      `UPDATE artist_onboarding
       SET status = 'CUENTA_ACTIVA',
           activation_used_at = NOW(),
           password_set_at = NOW(),
           activated_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
         AND activation_token_hash = $2
         AND activation_used_at IS NULL
         AND status = 'PENDIENTE_PASSWORD'`,
      [activation.id, hashActivationToken(token)],
    );
    if (updatedOnboarding.rowCount !== 1) {
      throw new Error("El onboarding no pudo completarse.");
    }
    await client.query("COMMIT");

    const auditRequest = {
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
      severity: "INFO" as const,
    };
    await Promise.all([
      logAudit({
        userId: activation.user_id,
        username: activation.username,
        action: "ARTIST_PASSWORD_SET",
        entityType: "user",
        entityId: activation.user_id,
        metadata: { onboardingId: activation.id },
        ...auditRequest,
      }),
      logAudit({
        userId: activation.user_id,
        username: activation.username,
        action: "ARTIST_ACCOUNT_ACTIVATED",
        entityType: "user",
        entityId: activation.user_id,
        metadata: { onboardingId: activation.id, role: "ARTIST" },
        ...auditRequest,
      }),
    ]);

    return NextResponse.json({
      status: "CUENTA_ACTIVA",
      message: "CUENTA ACTIVADA",
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    console.error("[POST /api/activar/:token]", error);
    return NextResponse.json({ error: "No se pudo activar la cuenta." }, { status: 500 });
  } finally {
    client?.release();
  }
}
