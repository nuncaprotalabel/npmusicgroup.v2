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

interface AccountActivationRow {
  invitation_id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  expires_at: string;
  is_active: boolean;
}

function invalidResponse(status = 404) {
  return NextResponse.json(
    { error: "El enlace de activación no es válido o ya no está disponible." },
    { status },
  );
}

function validateBody(body: unknown): string | null {
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

async function findActivation(token: string): Promise<AccountActivationRow | null> {
  return queryOne<AccountActivationRow>(
    `SELECT i.id AS invitation_id, i.email, u.username, u.role::text AS role,
            i.status, i.expires_at, u.is_active
     FROM invitations i
     INNER JOIN users u ON LOWER(u.email) = LOWER(i.email)
     WHERE i.token_hash = $1 AND i.solicitud_id IS NULL
     ORDER BY i.created_at DESC
     LIMIT 1`,
    [hashActivationToken(token)],
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  try {
    const { token } = await params;
    if (!isValidActivationToken(token)) return invalidResponse();
    const activation = await findActivation(token);
    if (!activation) return invalidResponse();
    if (activation.status !== "PENDIENTE" || activation.is_active) return invalidResponse(410);
    if (new Date(activation.expires_at).getTime() <= Date.now()) return invalidResponse(410);
    return NextResponse.json({
      status: "PENDIENTE_PASSWORD",
      username: activation.username,
      role: activation.role,
      expiresAt: activation.expires_at,
    });
  } catch (error) {
    console.error("[GET /api/activar-cuenta/:token]", error);
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
    if (!isValidActivationToken(token)) return invalidResponse();
    const body = await request.json().catch(() => null);
    const validationError = validateBody(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    client = await db.connect();
    await client.query("BEGIN");
    const activation = (
      await client.query<AccountActivationRow>(
        `SELECT i.id AS invitation_id, i.email, u.username, u.role::text AS role,
                i.status, i.expires_at, u.is_active
         FROM invitations i
         INNER JOIN users u ON LOWER(u.email) = LOWER(i.email)
         WHERE i.token_hash = $1 AND i.solicitud_id IS NULL
         ORDER BY i.created_at DESC
         LIMIT 1
         FOR UPDATE OF i, u`,
        [hashActivationToken(token)],
      )
    ).rows[0];

    if (!activation) {
      await client.query("ROLLBACK");
      return invalidResponse();
    }
    if (activation.status !== "PENDIENTE" || activation.is_active) {
      await client.query("ROLLBACK");
      return invalidResponse(410);
    }
    if (new Date(activation.expires_at).getTime() <= Date.now()) {
      await client.query(
        `UPDATE invitations SET status = 'EXPIRADA', updated_at = NOW() WHERE id = $1`,
        [activation.invitation_id],
      );
      await client.query("COMMIT");
      return invalidResponse(410);
    }

    const password = (body as { password: string }).password;
    const passwordHash = await hashPassword(password);
    const updatedUser = await client.query<{ id: string }>(
      `UPDATE users
       SET password_hash = $1, is_active = true, updated_at = NOW()
       WHERE LOWER(email) = LOWER($2) AND is_active = false
       RETURNING id`,
      [passwordHash, activation.email],
    );
    if (updatedUser.rowCount !== 1) throw new Error("La cuenta no pudo activarse.");

    await client.query(
      `UPDATE invitations
       SET status = 'UTILIZADA', accepted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND status = 'PENDIENTE'`,
      [activation.invitation_id],
    );
    await client.query("COMMIT");

    await logAudit({
      userId: updatedUser.rows[0]?.id,
      username: activation.username,
      action: "ACCOUNT_ACTIVATED",
      entityType: "user",
      metadata: { invitationId: activation.invitation_id, role: activation.role },
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
      severity: "INFO",
    });

    return NextResponse.json({ status: "CUENTA_ACTIVA", message: "Cuenta activada correctamente." });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    console.error("[POST /api/activar-cuenta/:token]", error);
    return NextResponse.json({ error: "No se pudo activar la cuenta." }, { status: 500 });
  } finally {
    client?.release();
  }
}