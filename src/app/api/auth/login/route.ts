/**
 * POST /api/auth/login
 * Autentica al usuario y establece la sesión en una cookie HTTP-only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';
import { comparePassword } from '@/lib/password';
import { signToken, sessionCookieOptions } from '@/lib/auth';
import { logLogin, getClientIp } from '@/lib/audit';

interface UserRow {
  id: string;
  username: string;
  email: string | null;
  password_hash: string;
  role: string;
  is_active: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
      return NextResponse.json(
        { error: 'Correo electrónico y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    const password = body.password;

    if (!email || !password || email.length > 255 || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Correo electrónico y contraseña son requeridos.' },
        { status: 400 }
      );
    }

    const ip        = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') ?? undefined;

    // Buscar usuario
    const user = await queryOne<UserRow>(
      `SELECT id, username, email, password_hash, role, is_active
       FROM users
       WHERE LOWER(email) = $1`,
      [email]
    );

    // Usuario no encontrado o inactivo (mismo mensaje para no revelar existencia)
    if (!user || !user.is_active) {
      if (user) {
        await logLogin({ userId: user.id, username: user.username, success: false, reason: 'account_inactive', ipAddress: ip, userAgent });
      }
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      await logLogin({ userId: user.id, username: user.username, success: false, reason: 'invalid_password', ipAddress: ip, userAgent });
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Crear registro de sesión en DB
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionRows = await query<{ id: string }>(
      `INSERT INTO sessions (user_id, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [user.id, ip ?? null, userAgent ?? null, expiresAt]
    );
    const sessionId = sessionRows[0].id;

    // Actualizar last_login_at
    await query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Firmar JWT
    const token = await signToken({
      userId:    user.id,
      username:  user.username,
      role:      user.role as import('@/types/auth').UserRole,
      sessionId,
    });

    // Registrar éxito en auditoría
    await logLogin({ userId: user.id, username: user.username, success: true, ipAddress: ip, userAgent });

    // Responder con cookie
    const response = NextResponse.json({
      user: {
        id:       user.id,
        username: user.username,
        email:    user.email,
        role:     user.role,
      },
    });

    const cookie = sessionCookieOptions(token);
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure:   cookie.secure,
      sameSite: cookie.sameSite,
      maxAge:   cookie.maxAge,
      path:     cookie.path,
    });

    return response;
  } catch (err) {
    console.error('[AUTH] Login error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
