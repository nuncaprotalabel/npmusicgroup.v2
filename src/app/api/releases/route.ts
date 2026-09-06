import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import {
  RELEASE_SELECT,
  TRACK_SELECT,
  parseReleaseInput,
  requireArtistContext,
  toRelease,
  toTrack,
  type ReleaseRow,
  type TrackRow,
} from "@/lib/releases";

async function releasesForArtist(artistId: string) {
  const rows = await query<ReleaseRow>(`${RELEASE_SELECT} WHERE artist_id = $1 ORDER BY created_at DESC`, [artistId]);
  if (!rows.length) return [];
  const tracks = await query<TrackRow>(
    `${TRACK_SELECT} WHERE release_id = ANY($1::uuid[]) ORDER BY track_number ASC`,
    [rows.map((row) => row.id)],
  );
  const tracksByRelease = new Map<string, TrackRow[]>();
  for (const track of tracks) {
    const current = tracksByRelease.get(track.release_id) ?? [];
    current.push(track);
    tracksByRelease.set(track.release_id, current);
  }
  return rows.map((row) => toRelease(row, (tracksByRelease.get(row.id) ?? []).map(toTrack)));
}

export async function GET() {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    return NextResponse.json({ releases: await releasesForArtist(auth.artistId) });
  } catch (error) {
    console.error("[GET /api/releases]", error);
    return NextResponse.json({ error: "No se pudieron consultar los releases." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    const parsed = parseReleaseInput(await request.json().catch(() => null));
    if ("error" in parsed || !parsed.title || !parsed.type) {
      return NextResponse.json({ error: "Revisa el título y el tipo del release." }, { status: 400 });
    }
    if (parsed.status && parsed.status !== "DRAFT") {
      return NextResponse.json({ error: "Los releases de artistas se crean inicialmente como DRAFT." }, { status: 403 });
    }

    const inserted = await queryOne<ReleaseRow>(
      `INSERT INTO releases (artist_id, title, type, status, release_date, cover_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, artist_id, title, type, status, release_date, cover_url, created_at, updated_at`,
      [
        auth.artistId,
        parsed.title,
        parsed.type,
        parsed.status ?? "DRAFT",
        parsed.releaseDate ?? null,
        parsed.coverUrl ?? null,
      ],
    );
    if (!inserted) return NextResponse.json({ error: "No se pudo crear el release." }, { status: 500 });

    await logAudit({
      userId: auth.session.userId,
      username: auth.session.username,
      action: "RELEASE_CREATED",
      entityType: "release",
      entityId: inserted.id,
      metadata: { type: inserted.type, status: inserted.status },
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
    return NextResponse.json({ release: toRelease(inserted) }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/releases]", error);
    return NextResponse.json({ error: "No se pudo crear el release." }, { status: 500 });
  }
}