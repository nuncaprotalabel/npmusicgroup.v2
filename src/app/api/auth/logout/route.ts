/**
 * POST /api/auth/logout
 * Cierra la sesión activa y borra la cookie.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME, clearCookieOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { logLogout, getClientIp } from '@/lib/audit';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const ip        = getClientIp(request.headers);
    const userAgent = request.headers.get('user-agent') ?? undefined;

    if (token) {
      const session = await verifyToken(token);
      if (session) {
        // Marcar sesión como finalizada
        await query(
          `UPDATE sessions
           SET is_active = false, ended_at = NOW()
           WHERE id = $1`,
          [session.sessionId]
        );

        await logLogout({
          userId:    session.userId,
          username:  session.username,
          sessionId: session.sessionId,
          ipAddress: ip,
          userAgent,
        });
      }
    }

    const response = NextResponse.json({ ok: true });
    const opts = clearCookieOptions();
    response.cookies.set(opts.name, opts.value, {
      httpOnly: opts.httpOnly,
      secure:   opts.secure,
      sameSite: opts.sameSite,
      maxAge:   opts.maxAge,
      path:     opts.path,
    });

    return response;
  } catch (err) {
    console.error('[AUTH] Logout error:', err);
    // Igual borramos la cookie aunque haya error interno
    const response = NextResponse.json({ ok: true });
    const opts = clearCookieOptions();
    response.cookies.set(opts.name, opts.value, {
      httpOnly: opts.httpOnly,
      secure:   opts.secure,
      sameSite: opts.sameSite,
      maxAge:   opts.maxAge,
      path:     opts.path,
    });
    return response;
  }
}
