/**
 * Catálogo y consultas server-side del sistema RBAC.
 * Las decisiones de autorización se respaldan en Neon, no en la interfaz.
 */
import { queryOne } from "@/lib/db";
import type { UserRole } from "@/types/auth";

export const ROLE_LEVEL: Record<UserRole, number> = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  DISTRIBUTION_MANAGER: 3,
  MANAGER: 4,
  ARTIST: 5,
  VIEWER: 6,
};

export const PERMISSION_KEYS = [
  "dashboard.view",
  "artists.view",
  "artists.manage",
  "applications.view",
  "applications.manage",
  "invitations.view",
  "invitations.manage",
  "contracts.view",
  "contracts.manage",
  "releases.view",
  "releases.manage",
  "distribution.view",
  "distribution.manage",
  "analytics.view",
  "income.view",
  "income.manage",
  "messages.view",
  "messages.manage",
  "accounts.view",
  "accounts.manage",
  "roles.view",
  "roles.manage",
  "settings.view",
  "settings.manage",
  "audit.view",
] as const;

export type Permission = (typeof PERMISSION_KEYS)[number];

export function isPermission(value: string): value is Permission {
  return (PERMISSION_KEYS as readonly string[]).includes(value);
}

/** Consulta la asignación efectiva del rol en Neon. */
export async function hasPermission(
  role: UserRole,
  permission: Permission,
): Promise<boolean> {
  if (role === "SUPER_ADMIN") return true;

  const row = await queryOne<{ allowed: boolean }>(
    `SELECT EXISTS (
       SELECT 1
       FROM role_permissions rp
       INNER JOIN permissions p ON p.id = rp.permission_id
       WHERE rp.role = $1 AND p.name = $2
     ) AS allowed`,
    [role, permission],
  );

  return row?.allowed === true;
}

export async function hasAllPermissions(
  role: UserRole,
  permissions: Permission[],
): Promise<boolean> {
  for (const permission of permissions) {
    if (!(await hasPermission(role, permission))) return false;
  }
  return true;
}

export function isRoleAtLeast(roleA: UserRole, roleB: UserRole): boolean {
  return ROLE_LEVEL[roleA] <= ROLE_LEVEL[roleB];
}

export async function getPermissionsForRole(
  role: UserRole,
): Promise<Permission[]> {
  const rows = await import("@/lib/db").then(({ query }) =>
    query<{ name: string }>(
      `SELECT p.name
       FROM permissions p
       INNER JOIN role_permissions rp ON rp.permission_id = p.id
       WHERE rp.role = $1
       ORDER BY p.name`,
      [role],
    ),
  );

  return rows.map((row) => row.name).filter(isPermission);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Administrador",
  ADMIN: "Administrador",
  DISTRIBUTION_MANAGER: "Gestor de Distribución",
  MANAGER: "Manager",
  ARTIST: "Artista",
  VIEWER: "Observador",
};