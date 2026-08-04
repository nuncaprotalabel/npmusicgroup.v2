/**
 * /api/applications/[id]
 * GET   — Detalle de una solicitud (admin).
 * PATCH — Cambia estado: APROBADA | RECHAZADA (admin).
 */
import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { requireRole, getSession } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import type { ApplicationStatus } from '@/types/application';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'DISTRIBUTION_MANAGER'] as const;
const VALID_STATUSES: ApplicationStatus[] = ['APROBADA', 'RECHAZADA'];

// ─── GET — detalle ─────────────────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await requireRole([...ADMIN_ROLES]);

    const { id } = await params;

    const row = await queryOne<{
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
       WHERE id = $1`,
      [id]
    );

    if (!row) {
      return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 });
    }

    return NextResponse.json({
      application: {
        id:           row.id,
        artisticName: row.artistic_name,
        email:        row.email,
        country:      row.country,
        genre:        row.genre,
        mainLink:     row.main_link,
        instagram:    row.instagram,
        tiktok:       row.tiktok,
        message:      row.message,
        status:       row.status,
        ipAddress:    row.ip_address,
        createdAt:    row.created_at,
      },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'No autenticado.') {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    if (message === 'Permisos insuficientes.') {
      return NextResponse.json({ error: 'Sin permiso para esta acción.' }, { status: 403 });
    }
    console.error('[APPLICATIONS GET/:id] Error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

// ─── PATCH — cambiar estado ────────────────────────────────────────────────────

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await requireRole([...ADMIN_ROLES]);
    const { id }  = await params;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Cuerpo de solicitud inválido.' }, { status: 400 });
    }

    const newStatus = body.status as ApplicationStatus;
    if (!VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}.` },
        { status: 400 }
      );
    }

    // Verificar existencia y obtener estado actual
    const existing = await queryOne<{ id: string; status: string; artistic_name: string }>(
      `SELECT id, status, artistic_name FROM applications WHERE id = $1`,
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 });
    }

    const previousStatus = existing.status;

    // Aplicar cambio
    await query(
      `UPDATE applications SET status = $1 WHERE id = $2`,
      [newStatus, id]
    );

    // Registrar en auditoría
    await logAudit({
      userId:     session.userId,
      username:   session.username,
      action:     newStatus === 'APROBADA' ? 'APPLICATION_APPROVED' : 'APPLICATION_REJECTED',
      entityType: 'application',
      entityId:   id,
      metadata:   {
        artisticName:   existing.artistic_name,
        previousStatus,
        newStatus,
      },
      severity: 'INFO',
    });

    return NextResponse.json({
      application: { id, status: newStatus },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'No autenticado.') {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }
    if (message === 'Permisos insuficientes.') {
      return NextResponse.json({ error: 'Sin permiso para esta acción.' }, { status: 403 });
    }
    console.error('[APPLICATIONS PATCH/:id] Error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
