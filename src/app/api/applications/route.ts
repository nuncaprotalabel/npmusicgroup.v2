/**
 * /api/applications
 * POST — Envía una solicitud de artista (público).
 * GET  — Lista solicitudes con búsqueda y filtro (admin).
 */
import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getClientIp } from '@/lib/audit';
import { requireRole } from '@/lib/auth';

// ─── Constantes ────────────────────────────────────────────────────────────────

const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 1000;

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'DISTRIBUTION_MANAGER'] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// ─── GET — lista de solicitudes (admin) ────────────────────────────────────────

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar rol
    await requireRole([...ADMIN_ROLES]);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status  = searchParams.get('status')?.trim() || '';
    const page    = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit   = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const offset  = (page - 1) * limit;

    // Construir condiciones dinámicas
    const conditions: string[] = [];
    const params: unknown[]    = [];
    let paramIdx = 1;

    if (status && ['PENDIENTE', 'APROBADA', 'RECHAZADA'].includes(status)) {
      conditions.push(`status = $${paramIdx++}`);
      params.push(status);
    }

    if (search) {
      conditions.push(
        `(artistic_name ILIKE $${paramIdx} OR email ILIKE $${paramIdx} OR country ILIKE $${paramIdx})`
      );
      params.push(`%${search}%`);
      paramIdx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total
    const countRows = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM applications ${where}`,
      params
    );
    const total = parseInt(countRows[0]?.count || '0', 10);

    // Datos
    const rows = await query<{
      id: string;
      artistic_name: string;
      email: string;
      country: string;
      genre: string;
      main_link: string;
      instagram: string | null;
      tiktok: string | null;
      message: string | null;
      status: string;
      ip_address: string | null;
      created_at: string;
    }>(
      `SELECT id, artistic_name, email, country, genre, main_link,
              instagram, tiktok, message, status, ip_address, created_at
       FROM applications
       ${where}
       ORDER BY created_at DESC
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...params, limit, offset]
    );

    const applications = rows.map(r => ({
      id:           r.id,
      artisticName: r.artistic_name,
      email:        r.email,
      country:      r.country,
      genre:        r.genre,
      mainLink:     r.main_link,
      instagram:    r.instagram,
      tiktok:       r.tiktok,
      message:      r.message,
      status:       r.status,
      ipAddress:    r.ip_address,
      createdAt:    r.created_at,
    }));

    return NextResponse.json({
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno.';
    if (message === 'No autenticado.') {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    if (message === 'Permisos insuficientes.') {
      return NextResponse.json({ error: 'Sin permiso para esta acción.' }, { status: 403 });
    }
    console.error('[APPLICATIONS GET] Error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

// ─── POST — nueva solicitud (público) ──────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
    }

    // Campos obligatorios
    const required = ['artisticName', 'email', 'country', 'genre', 'mainLink'] as const;
    for (const field of required) {
      if (!isNonEmptyString(body[field])) {
        return NextResponse.json(
          { error: `El campo "${field}" es obligatorio.` },
          { status: 400 }
        );
      }
    }

    const artisticName = (body.artisticName as string).trim();
    const email        = (body.email        as string).trim().toLowerCase();
    const country      = (body.country      as string).trim();
    const genre        = (body.genre        as string).trim();
    const mainLink     = (body.mainLink     as string).trim();
    const instagram    = isNonEmptyString(body.instagram) ? body.instagram.trim() : null;
    const tiktok       = isNonEmptyString(body.tiktok)    ? body.tiktok.trim()    : null;
    const message      = isNonEmptyString(body.message)   ? body.message.trim()   : null;

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'El correo electrónico no es válido.' }, { status: 400 });
    }

    if (message && message.length > MESSAGE_MAX) {
      return NextResponse.json(
        { error: `El mensaje no puede superar los ${MESSAGE_MAX} caracteres.` },
        { status: 400 }
      );
    }

    // Verificar duplicado
    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM applications WHERE email = $1 AND status = 'PENDIENTE' LIMIT 1`,
      [email]
    );

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una solicitud pendiente con este correo. Nos pondremos en contacto pronto.' },
        { status: 409 }
      );
    }

    const ip   = getClientIp(request.headers);
    const rows = await query<{ id: string }>(
      `INSERT INTO applications
         (artistic_name, email, country, genre, main_link, instagram, tiktok, message, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [artisticName, email, country, genre, mainLink, instagram, tiktok, message, ip ?? null]
    );

    return NextResponse.json({ application: { id: rows[0].id } }, { status: 201 });

  } catch (err) {
    console.error('[APPLICATIONS POST] Error:', err);
    return NextResponse.json({ error: 'Error interno del servidor. Intenta nuevamente.' }, { status: 500 });
  }
}
