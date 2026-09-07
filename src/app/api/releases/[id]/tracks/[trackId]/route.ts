import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { parseTrackInput, requireArtistContext, toTrack, type TrackRow } from "@/lib/releases";

type RouteContext = { params: Promise<{ id: string; trackId: string }> };

async function ownedTrack(artistId: string, releaseId: string, trackId: string) {
  return queryOne<TrackRow>(
    `SELECT t.id, t.release_id, t.title, t.track_number, t.duration_seconds, t.audio_url, t.isrc, t.version, t.language, t.explicit, t.created_at, t.updated_at
     FROM tracks t
     INNER JOIN releases r ON r.id = t.release_id
     WHERE t.id = $1 AND t.release_id = $2 AND r.artist_id = $3`,
    [trackId, releaseId, artistId],
  );
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    const { id, trackId } = await context.params;
    const existing = await ownedTrack(auth.artistId, id, trackId);
    if (!existing) return NextResponse.json({ error: "Track no encontrado." }, { status: 404 });
    const release = await queryOne<{ status: string }>(
      `SELECT status FROM releases WHERE id = $1 AND artist_id = $2`,
      [id, auth.artistId],
    );
    if (release?.status !== "DRAFT") {
      return NextResponse.json({ error: "Solo puedes editar tracks de un release DRAFT." }, { status: 409 });
    }
    const body = await request.json().catch(() => null);
    const input = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const parsed = parseTrackInput({
       ...input,
      title: input.title ?? existing.title,
      trackNumber: input.trackNumber ?? existing.track_number,
      durationSeconds: input.durationSeconds ?? existing.duration_seconds,
       audioUrl: input.audioUrl ?? existing.audio_url,
       isrc: input.isrc ?? existing.isrc,
       version: input.version ?? existing.version,
       language: input.language ?? existing.language,
       explicit: input.explicit ?? existing.explicit,
    });
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const updated = await queryOne<TrackRow>(
      `UPDATE tracks
        SET title = $1, track_number = $2, duration_seconds = $3, audio_url = $4, isrc = $5, version = $6, language = $7, explicit = $8, updated_at = NOW()
        WHERE id = $9 AND release_id = $10
        RETURNING id, release_id, title, track_number, duration_seconds, audio_url, isrc, version, language, explicit, created_at, updated_at`,
      [parsed.title, parsed.trackNumber, parsed.durationSeconds, parsed.audioUrl, parsed.isrc ?? null, parsed.version ?? null, parsed.language ?? null, parsed.explicit ?? false, trackId, id],
    );
    if (!updated) return NextResponse.json({ error: "El track no pudo actualizarse." }, { status: 409 });

    await logAudit({
      userId: auth.session.userId,
      username: auth.session.username,
      action: "TRACK_UPDATED",
      entityType: "track",
      entityId: trackId,
      metadata: { releaseId: id, trackNumber: updated.track_number },
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
    return NextResponse.json({ track: toTrack(updated) });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Ya existe un track con ese número en el release." }, { status: 409 });
    }
    console.error("[PATCH /api/releases/:id/tracks/:trackId]", error);
    return NextResponse.json({ error: "No se pudo actualizar el track." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    const { id, trackId } = await context.params;
    const existing = await ownedTrack(auth.artistId, id, trackId);
    if (!existing) return NextResponse.json({ error: "Track no encontrado." }, { status: 404 });
    const release = await queryOne<{ status: string }>(
      `SELECT status FROM releases WHERE id = $1 AND artist_id = $2`,
      [id, auth.artistId],
    );
    if (release?.status !== "DRAFT") {
      return NextResponse.json({ error: "Solo puedes eliminar tracks de un release DRAFT." }, { status: 409 });
    }
    await queryOne(`DELETE FROM tracks WHERE id = $1 AND release_id = $2 RETURNING id`, [trackId, id]);
    await logAudit({
      userId: auth.session.userId,
      username: auth.session.username,
      action: "TRACK_DELETED",
      entityType: "track",
      entityId: trackId,
      metadata: { releaseId: id },
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/releases/:id/tracks/:trackId]", error);
    return NextResponse.json({ error: "No se pudo eliminar el track." }, { status: 500 });
  }
}