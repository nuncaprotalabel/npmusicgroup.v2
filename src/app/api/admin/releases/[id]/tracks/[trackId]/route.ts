import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { parseTrackInput, toTrack, type TrackRow } from "@/lib/releases";

type Context = { params: Promise<{ id: string; trackId: string }> };
const TRACK = `SELECT t.id,t.release_id,t.title,t.track_number,t.duration_seconds,t.audio_url,t.isrc,t.version,t.language,t.explicit,t.created_at,t.updated_at FROM tracks t JOIN releases r ON r.id=t.release_id WHERE t.id=$1 AND t.release_id=$2`;

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const session = await requirePermission("releases.manage");
    const { id, trackId } = await params;
    const existing = await queryOne<TrackRow>(TRACK, [trackId, id]);
    if (!existing) return NextResponse.json({ error: "Track no encontrado." }, { status: 404 });
    const parsed = parseTrackInput(await request.json().catch(() => null));
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const updated = await queryOne<TrackRow>(`UPDATE tracks SET title=$1,track_number=$2,duration_seconds=$3,audio_url=$4,isrc=$5,version=$6,language=$7,explicit=$8,updated_at=NOW() WHERE id=$9 AND release_id=$10 RETURNING id,release_id,title,track_number,duration_seconds,audio_url,isrc,version,language,explicit,created_at,updated_at`, [parsed.title, parsed.trackNumber, parsed.durationSeconds, parsed.audioUrl, parsed.isrc ?? null, parsed.version ?? null, parsed.language ?? null, parsed.explicit ?? false, trackId, id]);
    if (!updated) return NextResponse.json({ error: "El track no pudo actualizarse." }, { status: 409 });
    await logAudit({ userId: session.userId, username: session.username, action: "TRACK_UPDATED", entityType: "track", entityId: trackId, metadata: { releaseId: id }, ipAddress: getClientIp(request.headers), userAgent: request.headers.get("user-agent") ?? undefined });
    return NextResponse.json({ track: toTrack(updated) });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    if ((error as { code?: string }).code === "23505") return NextResponse.json({ error: "Ya existe un track con ese número en el release." }, { status: 409 });
    return NextResponse.json({ error: "No se pudo actualizar el track." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const session = await requirePermission("releases.manage");
    const { id, trackId } = await params;
    const existing = await queryOne<TrackRow>(TRACK, [trackId, id]);
    if (!existing) return NextResponse.json({ error: "Track no encontrado." }, { status: 404 });
    const deleted = await queryOne<{ id: string }>("DELETE FROM tracks WHERE id=$1 AND release_id=$2 RETURNING id", [trackId, id]);
    if (!deleted) return NextResponse.json({ error: "El track no pudo eliminarse." }, { status: 409 });
    await logAudit({ userId: session.userId, username: session.username, action: "TRACK_DELETED", entityType: "track", entityId: trackId, metadata: { releaseId: id }, ipAddress: getClientIp(request.headers), userAgent: request.headers.get("user-agent") ?? undefined });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "No se pudo eliminar el track." }, { status: 500 });
  }
}