import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import {
  toAdminArtistDetail,
  type AdminArtistReleaseRow,
  type AdminArtistRow,
} from "@/lib/artists";

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

    const artist = await queryOne<AdminArtistRow>(
      `SELECT a.id, a.user_id, a.onboarding_id, u.username, u.email,
              a.nombre_artistico, a.pais, a.genero_principal, a.enlace_principal,
               a.instagram, a.tiktok, a.bio, a.status, a.created_at, a.updated_at,
               u.role, u.is_active,
               COUNT(r.id)::int AS release_count
       FROM artists a
       INNER JOIN users u ON u.id = a.user_id
       LEFT JOIN releases r ON r.artist_id = a.id
       WHERE a.id = $1`,
      [id],
    );
    if (!artist) return NextResponse.json({ error: "Artista no encontrado." }, { status: 404 });
    const releases = await query<AdminArtistReleaseRow>(
      `SELECT r.id, r.title, r.type, r.status, r.release_date, r.created_at,
              COUNT(t.id)::int AS track_count
       FROM releases r
       LEFT JOIN tracks t ON t.release_id = r.id
       WHERE r.artist_id = $1
       GROUP BY r.id
       ORDER BY r.created_at DESC`,
      [id],
    );
    return NextResponse.json({
      artist: toAdminArtistDetail(artist, releases.map((release) => ({
        id: release.id,
        title: release.title,
        type: release.type,
        status: release.status,
        releaseDate: release.release_date,
        trackCount: Number(release.track_count ?? 0),
        createdAt: release.created_at,
      }))),
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[GET /api/admin/artists/:id]", error);
    return NextResponse.json({ error: "No se pudo consultar el artista." }, { status: 500 });
  }
}
