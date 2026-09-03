/**
 * Middleware de protección de rutas — Edge runtime.
 * Verifica JWT y rol antes de permitir acceso a rutas privadas.
 * No accede a la DB (Edge-compatible via jose).
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME, clearCookieOptions } from '@/lib/auth';
import type { UserRole } from '@/types/auth';
import type { Permission } from '@/lib/permissions';

// ─── Configuración de rutas protegidas ────────────────────────────────────────

interface RouteRule {
  /** Roles con acceso permitido. Vacío = cualquier usuario autenticado. */
  roles?: UserRole[];
  /** Ruta de redirección si no tiene permisos (default: /login). */
  forbidden?: string;
  permission?: Permission;
}

const PROTECTED_ROUTES: Record<string, RouteRule> = {
  '/np-control': { roles: ['SUPER_ADMIN'] },
  '/dashboard':  { roles: ['SUPER_ADMIN', 'ADMIN', 'DISTRIBUTION_MANAGER', 'MANAGER', 'ARTIST', 'VIEWER'] },
  '/admin/artistas':       { permission: 'artists.view' },
  '/admin/solicitudes':    { permission: 'applications.view' },
  '/admin/invitaciones':   { permission: 'invitations.view' },
  '/admin/contratos':      { permission: 'contracts.view' },
  '/admin/lanzamientos':   { permission: 'releases.view' },
  '/admin/recibidos':      { permission: 'releases.view' },
  '/admin/analiticas':     { permission: 'analytics.view' },
  '/admin/ingresos':       { permission: 'income.view' },
  '/admin/mensajes':       { permission: 'messages.view' },
  '/admin/cuentas':        { permission: 'accounts.view' },
  '/admin/permisos':       { permission: 'roles.view' },
  '/admin/configuracion':  { permission: 'settings.view' },
  '/admin':                { permission: 'dashboard.view' },
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
    if (!routeRule.permission || session.role === 'SUPER_ADMIN' || session.permissions?.includes(routeRule.permission)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(routeRule.forbidden ?? '/403', request.url));
  }

  // Verificar rol
  if (!routeRule.roles.includes(session.role)) {
    const forbidden = routeRule.forbidden ?? '/403';
    return NextResponse.redirect(new URL(forbidden, request.url));
  }

  if (routeRule.permission && session.role !== 'SUPER_ADMIN' && !session.permissions?.includes(routeRule.permission)) {
    return NextResponse.redirect(new URL(routeRule.forbidden ?? '/403', request.url));
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
