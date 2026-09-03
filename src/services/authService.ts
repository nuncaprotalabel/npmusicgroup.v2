/**
 * authService — cliente de la API de autenticación.
 * Toda comunicación con /api/auth/* debe pasar por aquí.
 * Nunca hacer fetch directo desde componentes visuales.
 */
import type { PublicUser } from '@/types/auth';

const BASE = '/api/auth';

export interface LoginResult {
  user?: PublicUser;
  error?: string;
}

/** Inicia sesión y retorna el usuario si es exitoso. */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${BASE}/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error ?? 'Error desconocido.' };
    return { user: data.user };
  } catch {
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

/** Cierra la sesión activa. */
export async function logout(): Promise<void> {
  await fetch(`${BASE}/logout`, { method: 'POST' }).catch(() => null);
}

/** Obtiene el usuario de la sesión activa. Retorna null si no autenticado. */
export async function getMe(): Promise<PublicUser | null> {
  try {
    const res = await fetch(`${BASE}/me`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}
