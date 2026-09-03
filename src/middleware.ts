/**
 * Middleware de protección de rutas — Edge runtime.
 * Verifica JWT y rol antes de permitir acceso a rutas privadas.
 * No accede a la DB (Edge-compatible via jose).
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME, clearCookieOptions } from '@/lib/auth';
import type { UserRole } from '@/types/auth';

// ─── Configuración de rutas protegidas ────────────────────────────────────────

interface RouteRule {
  /** Roles con acceso permitido. Vacío = cualquier usuario autenticado. */
  roles?: UserRole[];
  /** Ruta de redirección si no tiene permisos (default: /login). */
  forbidden?: string;
}

const PROTECTED_ROUTES: Record<string, RouteRule> = {
  '/np-control': { roles: ['SUPER_ADMIN'] },
  '/dashboard':  { roles: ['SUPER_ADMIN', 'ADMIN', 'DISTRIBUTION_MANAGER', 'MANAGER', 'ARTIST', 'VIEWER'] },
  '/admin':      { roles: ['SUPER_ADMIN'] },
};

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Encontrar regla aplicable (match por prefijo)
  const rule = Object.entries(PROTECTED_ROUTES).find(([prefix]) =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (!rule) return NextResponse.next();

  const [, routeRule] = rule;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Sin token → redirigir a login
  if (!token) {
    return redirectToLogin(request, pathname);
  }

  // Token inválido → borrar cookie y redirigir
  const session = await verifyToken(token);
  if (!session) {
    return clearAndRedirect(request, pathname);
  }

  // Sin restricción de rol → permitir
  if (!routeRule.roles || routeRule.roles.length === 0) {
    return NextResponse.next();
  }

  // Verificar rol
  if (!routeRule.roles.includes(session.role)) {
    const forbidden = routeRule.forbidden ?? '/403';
    return NextResponse.redirect(new URL(forbidden, request.url));
  }

  // Pasar datos de sesión como headers internos (lectura en Server Components)
  const response = NextResponse.next();
  response.headers.set('x-user-id',       session.userId);
  response.headers.set('x-user-username', session.username);
  response.headers.set('x-user-role',     session.role);
  return response;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function redirectToLogin(req: NextRequest, from: string): NextResponse {
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('from', from);
  return NextResponse.redirect(loginUrl);
}

function clearAndRedirect(req: NextRequest, from: string): NextResponse {
  const response = redirectToLogin(req, from);
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

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    '/np-control/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
