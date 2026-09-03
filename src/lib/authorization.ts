/**
 * Guards server-side para endpoints y Server Components.
 * Nunca debe sustituirse por ocultar elementos en React.
 */
import { getActiveSession } from "@/lib/session";
import { hasPermission, type Permission } from "@/lib/permissions";

export class AuthorizationError extends Error {
  status: 401 | 403;

  constructor(status: 401 | 403, message: string) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

export async function requirePermission(permission: Permission) {
  const session = await getActiveSession();
  if (!session) throw new AuthorizationError(401, "No autenticado.");

  const allowed = await hasPermission(session.role, permission);
  if (!allowed) throw new AuthorizationError(403, "Permisos insuficientes.");

  return session;
}

export async function requireAnyPermission(permissions: Permission[]) {
  const session = await getActiveSession();
  if (!session) throw new AuthorizationError(401, "No autenticado.");

  for (const permission of permissions) {
    if (await hasPermission(session.role, permission)) return session;
  }

  throw new AuthorizationError(403, "Permisos insuficientes.");
}