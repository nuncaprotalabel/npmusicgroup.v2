import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import type { Solicitud, SolicitudErrorResponse } from '@/types/solicitud';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/i;
const MAX_MESSAGE_LENGTH = 1000;

interface SolicitudRow {
  id: string;
  nombre_artistico: string;
  email: string;
  pais: string;
  genero_principal: string;
  enlace_principal: string;
  instagram: string | null;
  tiktok: string | null;
  mensaje: string | null;
  estado: string;
  created_at: string;
}

function validate(body: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const required = [
    ['nombreArtistico', 'El nombre artístico es obligatorio.'],
    ['email', 'El correo electrónico es obligatorio.'],
    ['pais', 'El país es obligatorio.'],
    ['generoPrincipal', 'El género musical principal es obligatorio.'],
    ['enlacePrincipal', 'El enlace principal es obligatorio.'],
  ] as const;

  for (const [field, message] of required) {
    if (typeof body[field] !== 'string' || !body[field].trim()) errors[field] = message;
  }
  if (typeof body.email === 'string' && body.email.trim() && !EMAIL_RE.test(body.email.trim())) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }
  if (typeof body.enlacePrincipal === 'string' && body.enlacePrincipal.trim() && !URL_RE.test(body.enlacePrincipal.trim())) {
    errors.enlacePrincipal = 'El enlace debe comenzar con http:// o https://.';
  }
  if (typeof body.mensaje === 'string' && body.mensaje.trim().length > MAX_MESSAGE_LENGTH) {
    errors.mensaje = `El mensaje no puede superar ${MAX_MESSAGE_LENGTH} caracteres.`;
  }
  return errors;
}

function mapRow(row: SolicitudRow): Solicitud {
  return {
    id: row.id,
    nombreArtistico: row.nombre_artistico,
    email: row.email,
    pais: row.pais,
    generoPrincipal: row.genero_principal,
    enlacePrincipal: row.enlace_principal,
    instagram: row.instagram,
    tiktok: row.tiktok,
    mensaje: row.mensaje,
    estado: row.estado as Solicitud['estado'],
    createdAt: row.created_at,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json<SolicitudErrorResponse>({ error: 'Cuerpo de solicitud inválido.' }, { status: 400 });
    }
    const errors = validate(body as Record<string, unknown>);
    if (Object.keys(errors).length) {
      return NextResponse.json({ error: 'Revisa los campos indicados.', fields: errors }, { status: 422 });
    }

    const values = body as Record<string, string>;
    const email = values.email.trim().toLowerCase();
    const pending = await queryOne<{ id: string }>(
      `SELECT id FROM solicitudes WHERE email = $1 AND estado = 'PENDIENTE' LIMIT 1`,
      [email],
    );
    if (pending) {
      return NextResponse.json<SolicitudErrorResponse>({
        error: 'Ya existe una solicitud pendiente con este correo electrónico. El equipo la revisará pronto.',
        duplicate: true,
      }, { status: 409 });
    }

    const rows = await query<SolicitudRow>(
      `INSERT INTO solicitudes
        (nombre_artistico, email, pais, genero_principal, enlace_principal, instagram, tiktok, mensaje)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        values.nombreArtistico.trim(), email, values.pais.trim(), values.generoPrincipal.trim(),
        values.enlacePrincipal.trim(), values.instagram?.trim() || null, values.tiktok?.trim() || null,
        values.mensaje?.trim() || null,
      ],
    );
    return NextResponse.json({ solicitud: mapRow(rows[0]) }, { status: 201 });
  } catch (error) {
    console.error('[SOLICITUDES] POST error:', error);
    return NextResponse.json<SolicitudErrorResponse>(
      { error: 'Error interno del servidor. Intenta de nuevo más tarde.' },
      { status: 500 },
    );
  }
}