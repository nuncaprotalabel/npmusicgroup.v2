import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { TRACK_SELECT, toTrack, type TrackRow } from "@/lib/releases";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("releases.view");
    const id = (await params).id;
    const tracks = await query<TrackRow>(`${TRACK_SELECT} WHERE release_id = $1 ORDER BY track_number ASC`, [id]);
    return NextResponse.json({ tracks: tracks.map(toTrack) });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "No se pudieron consultar los tracks." }, { status: 500 });
  }
}