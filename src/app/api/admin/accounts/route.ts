import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import type { PoolClient } from "pg";
import { db, query } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { logAudit, getClientIp } from "@/lib/audit";
import type { UserRole } from "@/types/auth";
import type { Account } from "@/types/accounts";

const VALID_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "DISTRIBUTION_MANAGER",
  "MANAGER",
  "ARTIST",
  "VIEWER",
];

interface AccountRow {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

function toAccount(row: AccountRow): Account {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
  };
}

function authError(error: unknown): NextResponse | null {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}

function isValidEmail(email: string): boolean {
  return email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUsername(username: string): boolean {
  return /^[A-Za-z0-9_-]{3,50}$/.test(username);
}

function isValidRole(role: unknown): role is UserRole {
  return typeof role === "string" && VALID_ROLES.includes(role as UserRole);
}

async function accountById(id: string): Promise<AccountRow | null> {
  return (
    (await query<AccountRow>(
      `SELECT id, username, email, role, is_active, created_at, updated_at, last_login_at
       FROM users WHERE id = $1`,
      [id],
    ))[0] ?? null
  );
}

export async function GET(): Promise<NextResponse> {
  try {
    await requirePermission("accounts.view");
    const rows = await query<AccountRow>(
      `SELECT id, username, email, role, is_active, created_at, updated_at, last_login_at
       FROM users
       ORDER BY created_at DESC`,
    );
    return NextResponse.json({ accounts: rows.map(toAccount) });
  } catch (error) {
    const response = authError(error);
    if (response) return response;
    console.error("[GET /api/admin/accounts]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let client: PoolClient | undefined;
  try {
    const session = await requirePermission("accounts.manage");
    const body = await request.json().catch(() => null);

    if (!body || typeof body.username !== "string" || typeof body.email !== "string") {
      return NextResponse.json(
        { error: "Username, correo y rol son requeridos." },
        { status: 400 },
      );
    }

    const username = body.username.trim();
    const email = body.email.trim().toLowerCase();
    const role = body.role;

    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: "El username debe tener entre 3 y 50 caracteres y solo usar letras, números, guion o guion bajo." },
        { status: 400 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "El correo no tiene un formato válido." }, { status: 400 });
    }
    if (!isValidRole(role)) {
      return NextResponse.json({ error: "El rol seleccionado no es válido." }, { status: 400 });
    }

    const duplicate = await query<{ username: string; email: string }>(
      `SELECT username, email FROM users
       WHERE LOWER(username) = LOWER($1) OR LOWER(email) = $2
       LIMIT 1`,
      [username, email],
    );
    if (duplicate.length > 0) {
      const sameUsername = duplicate[0].username.toLowerCase() === username.toLowerCase();
      return NextResponse.json(
        { error: sameUsername ? "Ese username ya está en uso." : "Ese correo ya está en uso." },
        { status: 409 },
      );
    }

    // El hash aleatorio hace que la cuenta no sea utilizable hasta establecer contraseña.
    // El secreto solo existe en memoria y el enlace se entrega una única vez en la respuesta.
    const passwordHash = await hashPassword(randomBytes(32).toString("base64url"));
    const setupToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    client = await db.connect();
    await client.query("BEGIN");
    const userResult = await client.query<AccountRow>(
      `INSERT INTO users (username, email, password_hash, role, is_active, created_by)
       VALUES ($1, $2, $3, $4, false, $5)
       RETURNING id, username, email, role, is_active, created_at, updated_at, last_login_at`,
      [username, email, passwordHash, role, session.userId],
    );
    await client.query(
      `INSERT INTO invitations (email, role, token, invited_by, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, role, setupToken, session.userId, expiresAt],
    );
    await client.query("COMMIT");

    const account = toAccount(userResult.rows[0]);
    await logAudit({
      userId: session.userId,
      username: session.username,
      action: "ACCOUNT_CREATED",
      entityType: "user",
      entityId: account.id,
      metadata: { username, email, role, isActive: false },
      ipAddress: getClientIp(request.headers),
      severity: "INFO",
    });

    return NextResponse.json(
      {
        account,
        setupUrl: `/invitar/${setupToken}`,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    const response = authError(error);
    if (response) return response;
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "El username o correo ya está en uso." }, { status: 409 });
    }
    console.error("[POST /api/admin/accounts]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  } finally {
    client?.release();
  }
}