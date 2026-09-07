import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { parseReleaseInput, toRelease, toTrack, RELEASE_SELECT, TRACK_SELECT, type ReleaseRow, type TrackRow } from "@/lib/releases";

type Context = { params: Promise<{ id: string }> };

async function getRelease(id: string) {
  const release = await queryOne<ReleaseRow>(`${RELEASE_SELECT} WHERE id = $1`, [id]);
  if (!release) return null;
  const tracks = await query<TrackRow>(`${TRACK_SELECT} WHERE release_id = $1 ORDER BY track_number ASC`, [id]);
  const artist = await queryOne<{ name: string }>(
    `SELECT COALESCE(a.nombre_artistico, u.username) AS name FROM artists a JOIN users u ON u.id = a.user_id WHERE a.id = $1`,
    [release.artist_id],
  );
  return { ...toRelease(release, tracks.map(toTrack)), artistName: artist?.name ?? "—" };
}

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    await requirePermission("releases.view");
    const release = await getRelease((await params).id);
    if (!release) return NextResponse.json({ error: "Release no encontrado." }, { status: 404 });
    return NextResponse.json({ release });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[GET /api/admin/releases/:id]", error);
    return NextResponse.json({ error: "No se pudo consultar el release." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const session = await requirePermission("releases.manage");
    const id = (await params).id;
    const current = await queryOne<ReleaseRow>(`${RELEASE_SELECT} WHERE id = $1`, [id]);
    if (!current) return NextResponse.json({ error: "Release no encontrado." }, { status: 404 });
    if (current.status === "ARCHIVED" || current.status === "RELEASED") {
      return NextResponse.json({ error: "Los releases archivados o publicados no se pueden editar." }, { status: 409 });
    }
    const parsed = parseReleaseInput(await request.json().catch(() => null), true);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    if (parsed.status === "READY") {
      const count = await queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM tracks WHERE release_id = $1", [id]);
      if (Number(count?.count ?? 0) < 1) return NextResponse.json({ error: "Añade al menos un track antes de marcar el release como listo." }, { status: 409 });
    }
    const fields: string[] = [];
    const values: unknown[] = [];
    const add = (column: string, value: unknown) => { fields.push(`${column} = $${values.length + 2}`); values.push(value); };
    if (parsed.title !== undefined) add("title", parsed.title);
    if (parsed.type !== undefined) add("type", parsed.type);
    if (parsed.status !== undefined) add("status", parsed.status);
    if (parsed.releaseDate !== undefined) add("release_date", parsed.releaseDate);
    if (parsed.coverUrl !== undefined) add("cover_url", parsed.coverUrl);
    if (!fields.length) return NextResponse.json({ error: "No hay cambios para guardar." }, { status: 400 });
    const saved = await queryOne<ReleaseRow>(
      `UPDATE releases SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $1 AND status IN ('DRAFT','READY')
       RETURNING id, artist_id, title, type, status, release_date, cover_url, created_at, updated_at`,
      [id, ...values],
    );
    if (!saved) return NextResponse.json({ error: "El release no pudo actualizarse." }, { status: 409 });
    await logAudit({ userId: session.userId, username: session.username, action: "RELEASE_UPDATED", entityType: "release", entityId: id, metadata: { fields: Object.keys(parsed).filter((key) => parsed[key as keyof typeof parsed] !== undefined) }, ipAddress: getClientIp(request.headers), userAgent: request.headers.get("user-agent") ?? undefined });
    return NextResponse.json({ release: await getRelease(id) });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[PATCH /api/admin/releases/:id]", error);
    return NextResponse.json({ error: "No se pudo actualizar el release." }, { status: 500 });
  }
}