import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import {
  TRACK_SELECT,
  parseTrackInput,
  requireArtistContext,
  toTrack,
  type TrackRow,
} from "@/lib/releases";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    const { id } = await params;
    const owned = await queryOne<{ id: string }>(
      `SELECT id FROM releases WHERE id = $1 AND artist_id = $2`,
      [id, auth.artistId],
    );
    if (!owned) return NextResponse.json({ error: "Release no encontrado." }, { status: 404 });
    const tracks = await query<TrackRow>(`${TRACK_SELECT} WHERE release_id = $1 ORDER BY track_number`, [id]);
    return NextResponse.json({ tracks: tracks.map(toTrack) });
  } catch (error) {
    console.error("[GET /api/releases/:id/tracks]", error);
    return NextResponse.json({ error: "No se pudieron consultar los tracks." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    const { id } = await params;
    const release = await queryOne<{ id: string; type: string; status: string }>(
      `SELECT id, type, status FROM releases WHERE id = $1 AND artist_id = $2`,
      [id, auth.artistId],
    );
    if (!release) return NextResponse.json({ error: "Release no encontrado." }, { status: 404 });
    if (release.status !== "DRAFT") {
      return NextResponse.json({ error: "Solo puedes modificar tracks de un release DRAFT." }, { status: 409 });
    }
    if (release.type === "SINGLE") {
      const count = await queryOne<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM tracks WHERE release_id = $1`,
        [id],
      );
      if (Number(count?.count ?? 0) >= 1) {
        return NextResponse.json({ error: "Un SINGLE solo puede contener un track." }, { status: 409 });
      }
    }

    const parsed = parseTrackInput(await request.json().catch(() => null));
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const track = await queryOne<TrackRow>(
       `INSERT INTO tracks (release_id, title, track_number, duration_seconds, audio_url, isrc, version, language, explicit)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, release_id, title, track_number, duration_seconds, audio_url, isrc, version, language, explicit, created_at, updated_at`,
      [id, parsed.title, parsed.trackNumber, parsed.durationSeconds, parsed.audioUrl, parsed.isrc ?? null, parsed.version ?? null, parsed.language ?? null, parsed.explicit ?? false],
    );
    if (!track) return NextResponse.json({ error: "No se pudo crear el track." }, { status: 500 });

    await logAudit({
      userId: auth.session.userId,
      username: auth.session.username,
      action: "TRACK_CREATED",
      entityType: "track",
      entityId: track.id,
      metadata: { releaseId: id, trackNumber: track.track_number },
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
    return NextResponse.json({ track: toTrack(track) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Ya existe un track con ese número en el release." }, { status: 409 });
    }
    console.error("[POST /api/releases/:id/tracks]", error);
    return NextResponse.json({ error: "No se pudo crear el track." }, { status: 500 });
  }
}