import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { toRelease, toTrack, type ReleaseRow, type TrackRow } from "@/lib/releases";

export async function GET() {
  try {
    await requirePermission("releases.view");
    const releases = await query<(ReleaseRow & { artist_name: string; track_count: string })>(
      `SELECT r.id,r.artist_id,r.title,r.type,r.status,r.release_date,r.cover_url,r.created_at,r.updated_at,
              COALESCE(a.nombre_artistico,u.username) AS artist_name,
              COUNT(t.id)::text AS track_count
       FROM releases r JOIN artists a ON a.id=r.artist_id JOIN users u ON u.id=a.user_id
       LEFT JOIN tracks t ON t.release_id=r.id
       GROUP BY r.id,a.nombre_artistico,u.username ORDER BY r.created_at DESC`,
    );
    const tracks = await query<TrackRow>(`SELECT id,release_id,title,track_number,duration_seconds,audio_url,created_at,updated_at FROM tracks ORDER BY track_number ASC`);
    const grouped = new Map<string, TrackRow[]>();
    tracks.forEach((track) => grouped.set(track.release_id, [...(grouped.get(track.release_id) ?? []), track]));
    return NextResponse.json({ releases: releases.map((row) => ({ ...toRelease(row, (grouped.get(row.id) ?? []).map(toTrack)), artistName: row.artist_name, trackCount: Number(row.track_count) })) });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[GET /api/admin/releases]", error);
    return NextResponse.json({ error: "No se pudieron consultar los lanzamientos." }, { status: 500 });
  }
}