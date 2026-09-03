/**
 * Tipos TypeScript compartidos para autenticación y autorización.
 * Solo definiciones — sin lógica de negocio.
 */

// ─── Roles ────────────────────────────────────────────────────────────────────

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'DISTRIBUTION_MANAGER'
  | 'MANAGER'
  | 'ARTIST'
  | 'VIEWER';

// ─── Usuario ──────────────────────────────────────────────────────────────────

export interface User {
  id:           string;
  username:     string;
  email:        string | null;
  role:         UserRole;
  isActive:     boolean;
  createdAt:    string;
  updatedAt:    string;
  lastLoginAt:  string | null;
}

/** Versión pública del usuario (sin password_hash ni datos internos). */
export type PublicUser = Pick<User, 'id' | 'username' | 'email' | 'role'>;

// ─── Sesión ───────────────────────────────────────────────────────────────────

export interface SessionRecord {
  id:         string;
  userId:     string;
  ipAddress:  string | null;
  userAgent:  string | null;
  expiresAt:  string;
  createdAt:  string;
  endedAt:    string | null;
  isActive:   boolean;
}

// ─── API auth responses ───────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: PublicUser;
}

export interface AuthErrorResponse {
  error: string;
}

// ─── Auditoría ────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id:          number;
  userId:      string | null;
  username:    string | null;
  action:      string;
  entityType:  string | null;
  entityId:    string | null;
  metadata:    Record<string, unknown> | null;
  ipAddress:   string | null;
  userAgent:   string | null;
  severity:    string;
  createdAt:   string;
}
