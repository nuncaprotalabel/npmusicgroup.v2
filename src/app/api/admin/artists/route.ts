import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { toAdminArtistSummary, type AdminArtistRow } from "@/lib/artists";

export async function GET() {
  try {
    await requirePermission("artists.view");
    const rows = await query<AdminArtistRow>(
      `SELECT a.id, a.user_id, a.onboarding_id, u.username, u.email,
              a.nombre_artistico, a.pais, a.genero_principal, a.enlace_principal,
               a.instagram, a.tiktok, a.bio, a.status, a.created_at, a.updated_at,
               u.role, u.is_active,
               COUNT(r.id)::int AS release_count
       FROM artists a
       INNER JOIN users u ON u.id = a.user_id
       LEFT JOIN releases r ON r.artist_id = a.id
       GROUP BY a.id, u.id
       ORDER BY a.created_at DESC`,
    );
    return NextResponse.json({ artists: rows.map(toAdminArtistSummary) });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[GET /api/admin/artists]", error);
    return NextResponse.json({ error: "No se pudieron consultar los artistas." }, { status: 500 });
  }
}