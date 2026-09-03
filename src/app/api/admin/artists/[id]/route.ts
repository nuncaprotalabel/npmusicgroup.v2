import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { toArtistProfile, type ArtistProfileRow } from "@/lib/artists";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    await requirePermission("artists.view");
    const { id } = await params;
    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json({ error: "Artista no encontrado." }, { status: 404 });
    }

    const artist = await queryOne<ArtistProfileRow>(
      `SELECT a.id, a.user_id, a.onboarding_id, u.username, u.email,
              a.nombre_artistico, a.pais, a.genero_principal, a.enlace_principal,
              a.instagram, a.tiktok, a.bio, a.status, a.created_at, a.updated_at
       FROM artists a
       INNER JOIN users u ON u.id = a.user_id
       WHERE a.id = $1`,
      [id],
    );
    if (!artist) return NextResponse.json({ error: "Artista no encontrado." }, { status: 404 });
    return NextResponse.json({ artist: toArtistProfile(artist) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[GET /api/admin/artists/:id]", error);
    return NextResponse.json({ error: "No se pudo consultar el artista." }, { status: 500 });
  }
}
