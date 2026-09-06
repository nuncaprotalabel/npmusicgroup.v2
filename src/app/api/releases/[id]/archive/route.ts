import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { requireArtistContext, type ReleaseRow } from "@/lib/releases";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    const { id } = await params;
    const current = await queryOne<ReleaseRow>(
      `SELECT id, artist_id, title, type, status, release_date, cover_url, created_at, updated_at
       FROM releases WHERE id = $1 AND artist_id = $2`,
      [id, auth.artistId],
    );
    if (!current) return NextResponse.json({ error: "Release no encontrado." }, { status: 404 });
    if (current.status === "ARCHIVED") return NextResponse.json({ error: "El release ya está archivado." }, { status: 409 });

    const archived = await queryOne<ReleaseRow>(
      `UPDATE releases SET status = 'ARCHIVED', updated_at = NOW()
       WHERE id = $1 AND artist_id = $2
       RETURNING id, artist_id, title, type, status, release_date, cover_url, created_at, updated_at`,
      [id, auth.artistId],
    );
    if (!archived) return NextResponse.json({ error: "El release no pudo archivarse." }, { status: 409 });

    await logAudit({
      userId: auth.session.userId,
      username: auth.session.username,
      action: "RELEASE_ARCHIVED",
      entityType: "release",
      entityId: id,
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
    return NextResponse.json({ release: { ...archived, tracks: [] } });
  } catch (error) {
    console.error("[POST /api/releases/:id/archive]", error);
    return NextResponse.json({ error: "No se pudo archivar el release." }, { status: 500 });
  }
}