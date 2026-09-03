/**
 * GET /api/auth/me
 * Retorna los datos del usuario autenticado.
 * Usado por el cliente para verificar sesión activa.
 */
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { getActiveSession } from '@/lib/session';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const session = await getActiveSession();
    if (!session) {
      return NextResponse.json({ error: 'Sesión inválida o expirada.' }, { status: 401 });
    }

    // Verificar que el usuario sigue activo en DB
    const user = await queryOne<{
      id: string;
      username: string;
      email: string | null;
      role: string;
      last_login_at: string | null;
    }>(
      `SELECT id, username, email, role, last_login_at
       FROM users
       WHERE id = $1 AND is_active = true`,
      [session.userId]
    );

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id:          user.id,
        username:    user.username,
        email:       user.email,
        role:        user.role,
        lastLoginAt: user.last_login_at,
      },
    });
  } catch (err) {
    console.error('[AUTH] /me error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
