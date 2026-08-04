/**
 * POST /api/applications
 * Recibe y almacena una solicitud de artista en Neon.
 * Público — no requiere autenticación.
 */
import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getClientIp } from '@/lib/audit';

// ─── Validaciones ──────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 1000;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

// ─── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
    }

    // ── Campos obligatorios ──
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

    // ── Validar email ──
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'El correo electrónico no es válido.' },
        { status: 400 }
      );
    }

    // ── Validar longitud del mensaje ──
    if (message && message.length > MESSAGE_MAX) {
      return NextResponse.json(
        { error: `El mensaje no puede superar los ${MESSAGE_MAX} caracteres.` },
        { status: 400 }
      );
    }

    // ── Verificar solicitud duplicada ──
    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM applications
       WHERE email = $1 AND status = 'PENDIENTE'
       LIMIT 1`,
      [email]
    );

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una solicitud pendiente con este correo. Nos pondremos en contacto pronto.' },
        { status: 409 }
      );
    }

    // ── Insertar solicitud ──
    const ip = getClientIp(request.headers);

    const rows = await query<{ id: string }>(
      `INSERT INTO applications
         (artistic_name, email, country, genre, main_link, instagram, tiktok, message, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [artisticName, email, country, genre, mainLink, instagram, tiktok, message, ip ?? null]
    );

    return NextResponse.json({ application: { id: rows[0].id } }, { status: 201 });

  } catch (err) {
    console.error('[APPLICATIONS] Error al crear solicitud:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
