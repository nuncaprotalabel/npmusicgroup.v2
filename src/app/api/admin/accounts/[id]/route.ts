import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
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

function isValidEmail(email: string): boolean {
  return email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUsername(username: string): boolean {
  return /^[A-Za-z0-9_-]{3,50}$/.test(username);
}

function isValidRole(role: unknown): role is UserRole {
  return typeof role === "string" && VALID_ROLES.includes(role as UserRole);
}

function authError(error: unknown): NextResponse | null {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const session = await requirePermission("accounts.manage");
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const existing = (
      await query<AccountRow>(
        `SELECT id, username, email, role, is_active, created_at, updated_at, last_login_at
         FROM users WHERE id = $1`,
        [id],
      )
    )[0];

    if (!existing) return NextResponse.json({ error: "Cuenta no encontrada." }, { status: 404 });
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const hasUsername = body.username !== undefined;
    const hasEmail = body.email !== undefined;
    const hasRole = body.role !== undefined;
    const hasActive = body.isActive !== undefined;

    if (!hasUsername && !hasEmail && !hasRole && !hasActive) {
      return NextResponse.json({ error: "No hay cambios para guardar." }, { status: 400 });
    }

    const username = hasUsername ? String(body.username).trim() : existing.username;
    const email = hasEmail
      ? (body.email ? String(body.email).trim().toLowerCase() : null)
      : existing.email;
    const role = hasRole ? body.role : existing.role;
    const isActive = hasActive ? body.isActive : existing.is_active;

    if (!isValidUsername(username)) {
      return NextResponse.json({ error: "El username no es válido." }, { status: 400 });
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "El correo no tiene un formato válido." }, { status: 400 });
    }
    if (!isValidRole(role)) {
      return NextResponse.json({ error: "El rol seleccionado no es válido." }, { status: 400 });
    }
    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "El estado de la cuenta no es válido." }, { status: 400 });
    }

    const duplicate = await query<{ id: string }>(
      `SELECT id FROM users
       WHERE id <> $1 AND (LOWER(username) = LOWER($2) OR LOWER(email) = $3)
       LIMIT 1`,
      [id, username, email],
    );
    if (duplicate.length > 0) {
      return NextResponse.json({ error: "El username o correo ya está en uso." }, { status: 409 });
    }

    const removingOnlySuperAdmin =
      existing.role === "SUPER_ADMIN" &&
      ((hasActive && isActive === false && existing.is_active) ||
        (hasRole && role !== "SUPER_ADMIN"));
    if (removingOnlySuperAdmin) {
      const countRow = await query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM users
         WHERE role = 'SUPER_ADMIN' AND is_active = true`,
      );
      if (Number(countRow[0]?.count ?? 0) <= 1) {
        return NextResponse.json(
          { error: "No puedes dejar el sistema sin un SUPER_ADMIN activo." },
          { status: 409 },
        );
      }
    }

    const updated = (
      await query<AccountRow>(
        `UPDATE users
         SET username = $1, email = $2, role = $3, is_active = $4, updated_at = NOW()
         WHERE id = $5
         RETURNING id, username, email, role, is_active, created_at, updated_at, last_login_at`,
        [username, email, role, isActive, id],
      )
    )[0];

    const roleChanged = existing.role !== role;
    const deactivated = existing.is_active && !isActive;
    if (roleChanged || deactivated) {
      await query(
        `UPDATE sessions
         SET is_active = false, ended_at = NOW()
         WHERE user_id = $1 AND is_active = true`,
        [id],
      );
      await logAudit({
        userId: session.userId,
        username: session.username,
        action: deactivated ? "ACCOUNT_DEACTIVATED_SESSIONS_INVALIDATED" : "ACCOUNT_ROLE_CHANGED_SESSIONS_INVALIDATED",
        entityType: "user",
        entityId: id,
        metadata: { previousRole: existing.role, role, previousActive: existing.is_active, isActive },
        ipAddress: getClientIp(request.headers),
        severity: "INFO",
      });
    }

    await logAudit({
      userId: session.userId,
      username: session.username,
      action: roleChanged ? "ACCOUNT_ROLE_CHANGED" : deactivated ? "ACCOUNT_DEACTIVATED" : !existing.is_active && isActive ? "ACCOUNT_ACTIVATED" : "ACCOUNT_UPDATED",
      entityType: "user",
      entityId: id,
      metadata: {
        previousUsername: existing.username,
        username,
        previousEmail: existing.email,
        email,
        previousRole: existing.role,
        role,
        previousActive: existing.is_active,
        isActive,
      },
      ipAddress: getClientIp(request.headers),
      severity: "INFO",
    });

    return NextResponse.json({ account: toAccount(updated) });
  } catch (error) {
    const response = authError(error);
    if (response) return response;
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "El username o correo ya está en uso." }, { status: 409 });
    }
    console.error("[PATCH /api/admin/accounts/:id]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}