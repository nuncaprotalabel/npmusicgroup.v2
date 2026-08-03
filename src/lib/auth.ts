/**
 * Módulo de autenticación — JWT + cookies HTTP-only.
 * Edge-compatible: no usa Node.js APIs, solo jose.
 * Centraliza toda la lógica de sesión del sistema.
 */
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import type { UserRole } from '@/types/auth';

// ─── Constantes ──────────────────────────────────────────────────────────────

export const COOKIE_NAME = 'np_session';
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 días en segundos

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET no está definido.');
  return new TextEncoder().encode(secret);
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface SessionPayload extends JWTPayload {
  userId: string;
  username: string;
  role: UserRole;
  sessionId: string;
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

/** Firma un JWT con los datos de sesión. */
export async function signToken(
  payload: Pick<SessionPayload, 'userId' | 'username' | 'role' | 'sessionId'>
): Promise<string> {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

/** Verifica y decodifica un JWT. Retorna null si es inválido o expirado. */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Sesión activa ────────────────────────────────────────────────────────────

/** Lee la sesión del usuario desde la cookie HTTP-only. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Requiere sesión activa. Lanza error si no existe. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error('No autenticado.');
  return session;
}

/** Requiere un rol específico. Lanza error si el rol es insuficiente. */
export async function requireRole(
  allowedRoles: UserRole[]
): Promise<SessionPayload> {
  const session = await requireSession();
  if (!allowedRoles.includes(session.role)) {
    throw new Error('Permisos insuficientes.');
  }
  return session;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

/** Retorna los atributos de la cookie de sesión. */
export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_MAX_AGE,
    path: '/',
  };
}

/** Atributos para borrar la cookie de sesión. */
export function clearCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  };
}
