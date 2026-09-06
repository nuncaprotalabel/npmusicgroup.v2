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

type RouteContext = { params: Promise<{ id: string }> };

async function ownedRelease(artistId: string, id: string) {
  return queryOne<ReleaseRow>(`${RELEASE_SELECT} WHERE id = $1 AND artist_id = $2`, [id, artistId]);
}

async function releaseWithTracks(artistId: string, id: string) {
  const release = await ownedRelease(artistId, id);
  if (!release) return null;
  const tracks = await query<TrackRow>(`${TRACK_SELECT} WHERE release_id = $1 ORDER BY track_number`, [id]);
  return toRelease(release, tracks.map(toTrack));
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    const { id } = await context.params;
    const release = await releaseWithTracks(auth.artistId, id);
    if (!release) return NextResponse.json({ error: "Release no encontrado." }, { status: 404 });
    return NextResponse.json({ release });
  } catch (error) {
    console.error("[GET /api/releases/:id]", error);
    return NextResponse.json({ error: "No se pudo consultar el release." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireArtistContext();
    if ("error" in auth) return auth.error;
    const { id } = await context.params;
    const current = await ownedRelease(auth.artistId, id);
    if (!current) return NextResponse.json({ error: "Release no encontrado." }, { status: 404 });
    if (current.status !== "DRAFT") {
      return NextResponse.json({ error: "Solo puedes editar releases en estado DRAFT." }, { status: 409 });
    }

    const parsed = parseReleaseInput(await request.json().catch(() => null), true);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    if (parsed.status && !["DRAFT", "READY"].includes(parsed.status)) {
      return NextResponse.json({ error: "Ese estado solo puede establecerse mediante un flujo autorizado." }, { status: 403 });
    }
    const fields: string[] = [];
    const values: unknown[] = [];
    const add = (column: string, value: unknown) => {
      fields.push(`${column} = $${values.length + 2}`);
      values.push(value);
    };
    if (parsed.title !== undefined) add("title", parsed.title);
    if (parsed.type !== undefined) add("type", parsed.type);
    if (parsed.status !== undefined) add("status", parsed.status);
    if (parsed.releaseDate !== undefined) add("release_date", parsed.releaseDate);
    if (parsed.coverUrl !== undefined) add("cover_url", parsed.coverUrl);
    if (!fields.length) return NextResponse.json({ error: "No hay cambios para guardar." }, { status: 400 });

    const saved = await queryOne<ReleaseRow>(
      `UPDATE releases
       SET ${fields.join(", ")}, updated_at = NOW()
       WHERE id = $1 AND artist_id = $${values.length + 2} AND status = 'DRAFT'
       RETURNING id, artist_id, title, type, status, release_date, cover_url, created_at, updated_at`,
      [id, ...values, auth.artistId],
    );
    if (!saved) return NextResponse.json({ error: "El release no pudo actualizarse." }, { status: 409 });

    await logAudit({
      userId: auth.session.userId,
      username: auth.session.username,
      action: "RELEASE_UPDATED",
      entityType: "release",
      entityId: saved.id,
      metadata: { fields: Object.keys(parsed).filter((key) => parsed[key as keyof typeof parsed] !== undefined) },
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
    return NextResponse.json({ release: await releaseWithTracks(auth.artistId, saved.id) });
  } catch (error) {
    console.error("[PATCH /api/releases/:id]", error);
    return NextResponse.json({ error: "No se pudo actualizar el release." }, { status: 500 });
  }
}