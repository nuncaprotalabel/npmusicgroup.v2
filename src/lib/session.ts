/**
 * Verificación server-side de la sesión persistida.
 * Este módulo usa PostgreSQL y no debe importarse desde middleware Edge.
 */
import { queryOne } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

interface ActiveSessionRow {
  id: string;
  user_id: string;
  username: string;
  role: UserRole;
}

export async function getActiveSession() {
  const tokenSession = await getSession();
  if (!tokenSession) return null;

  return queryOne<ActiveSessionRow>(
    `SELECT s.id, s.user_id, u.username, u.role
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.id = $1
       AND s.user_id = $2
       AND s.is_active = true
       AND s.expires_at > NOW()
       AND u.is_active = true`,
    [tokenSession.sessionId, tokenSession.userId]
  ).then((row) =>
    row
      ? {
          userId: row.user_id,
          username: row.username,
          role: row.role,
          sessionId: row.id,
        }
      : null
  );
}