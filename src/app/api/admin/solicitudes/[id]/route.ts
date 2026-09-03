import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { getClientIp, logAudit } from "@/lib/audit";
import type { Solicitud, SolicitudEstado } from "@/types/solicitud";

const ALLOWED_TRANSITIONS = ["APROBADA", "RECHAZADA"] as const;
type AdministrativeStatus = (typeof ALLOWED_TRANSITIONS)[number];

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
  estado: SolicitudEstado;
  created_at: string;
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
    estado: row.estado,
    createdAt: row.created_at,
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const session = await requirePermission("applications.manage");
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const nextStatus = body?.estado;

    if (!ALLOWED_TRANSITIONS.includes(nextStatus as AdministrativeStatus)) {
      return NextResponse.json(
        { error: "La transición de estado no es válida." },
        { status: 400 },
      );
    }

    const current = (
      await query<SolicitudRow>(
        `SELECT id, nombre_artistico, email, pais, genero_principal,
                enlace_principal, instagram, tiktok, mensaje, estado, created_at
         FROM solicitudes WHERE id = $1`,
        [id],
      )
    )[0];

    if (!current) {
      return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
    }
    if (current.estado !== "PENDIENTE") {
      return NextResponse.json(
        { error: "Solo se pueden procesar solicitudes pendientes." },
        { status: 409 },
      );
    }

    const updated = (
      await query<SolicitudRow>(
        `UPDATE solicitudes
         SET estado = $1, updated_at = NOW()
         WHERE id = $2 AND estado = 'PENDIENTE'
         RETURNING id, nombre_artistico, email, pais, genero_principal,
                   enlace_principal, instagram, tiktok, mensaje, estado, created_at`,
        [nextStatus, id],
      )
    )[0];

    if (!updated) {
      return NextResponse.json(
        { error: "La solicitud ya fue procesada por otro usuario." },
        { status: 409 },
      );
    }

    const approved = nextStatus === "APROBADA";
    await logAudit({
      userId: session.userId,
      username: session.username,
      action: approved ? "SOLICITUD_APROBADA" : "SOLICITUD_RECHAZADA",
      entityType: "solicitud",
      entityId: id,
      metadata: {
        previousStatus: "PENDIENTE",
        nextStatus,
        nombreArtistico: current.nombre_artistico,
        email: current.email,
      },
      ipAddress: getClientIp(request.headers),
      severity: approved ? "INFO" : "WARN",
    });

    return NextResponse.json({ solicitud: mapRow(updated) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[PATCH /api/admin/solicitudes/:id]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}