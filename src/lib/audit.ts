/**
 * Módulo de auditoría — registra acciones críticas del sistema.
 * Independiente: los fallos de auditoría no deben interrumpir el flujo principal.
 * Solo usar desde el runtime de Node.js.
 */
import { query } from '@/lib/db';

export type AuditSeverity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface AuditEntry {
  userId?:    string;
  username?:  string;
  action:     string;
  entityType?: string;
  entityId?:  string;
  metadata?:  Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  severity?:  AuditSeverity;
}

/**
 * Registra una acción en el log de auditoría.
 * Silencia errores propios para no interrumpir el flujo principal.
 */
export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    await query(
      `INSERT INTO audit_log
         (user_id, username, action, entity_type, entity_id, metadata, ip_address, user_agent, severity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        entry.userId    ?? null,
        entry.username  ?? null,
        entry.action,
        entry.entityType ?? null,
        entry.entityId   ?? null,
        entry.metadata   ? JSON.stringify(entry.metadata) : null,
        entry.ipAddress  ?? null,
        entry.userAgent  ?? null,
        entry.severity   ?? 'INFO',
      ]
    );
  } catch (err) {
    // Auditoría nunca bloquea el flujo principal
    console.error('[AUDIT] Error al registrar:', err);
  }
}

/** Registra un evento de login. */
export function logLogin(params: {
  userId: string;
  username: string;
  success: boolean;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  return logAudit({
    userId:    params.userId,
    username:  params.username,
    action:    params.success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
    metadata:  params.reason ? { reason: params.reason } : undefined,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    severity:  params.success ? 'INFO' : 'WARN',
  });
}

/** Registra un evento de logout. */
export function logLogout(params: {
  userId: string;
  username: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  return logAudit({
    userId:    params.userId,
    username:  params.username,
    action:    'LOGOUT',
    metadata:  params.sessionId ? { sessionId: params.sessionId } : undefined,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    severity:  'INFO',
  });
}

/** Extrae IP del request de Next.js. */
export function getClientIp(headers: Headers): string | undefined {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    headers.get('x-real-ip') ??
    undefined
  );
}
