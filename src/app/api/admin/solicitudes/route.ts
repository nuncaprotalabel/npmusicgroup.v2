import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import type { Solicitud, SolicitudEstado } from "@/types/solicitud";

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

export async function GET(): Promise<NextResponse> {
  try {
    await requirePermission("applications.view");
    const rows = await query<SolicitudRow>(
      `SELECT id, nombre_artistico, email, pais, genero_principal,
              enlace_principal, instagram, tiktok, mensaje, estado, created_at
       FROM solicitudes
       ORDER BY
         CASE estado WHEN 'PENDIENTE' THEN 0 ELSE 1 END,
         created_at DESC`,
    );
    return NextResponse.json({ solicitudes: rows.map(mapRow) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[GET /api/admin/solicitudes]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}