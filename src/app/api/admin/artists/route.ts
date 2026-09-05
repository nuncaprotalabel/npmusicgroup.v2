import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { toArtistProfile, type ArtistProfileRow } from "@/lib/artists";

export async function GET() {
  try {
    await requirePermission("artists.view");
    const rows = await query<ArtistProfileRow>(
      `SELECT a.id, a.user_id, a.onboarding_id, u.username, u.email,
              a.nombre_artistico, a.pais, a.genero_principal, a.enlace_principal,
              a.instagram, a.tiktok, a.bio, a.status, a.created_at, a.updated_at
       FROM artists a INNER JOIN users u ON u.id = a.user_id ORDER BY a.created_at DESC`,
    );
    return NextResponse.json({ artists: rows.map(toArtistProfile) });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[GET /api/admin/artists]", error);
    return NextResponse.json({ error: "No se pudieron consultar los artistas." }, { status: 500 });
  }
}