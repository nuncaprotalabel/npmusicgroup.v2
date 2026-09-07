import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { parseCreditInput, requireArtistContext, toCredit, CREDIT_SELECT, type CreditRow } from "@/lib/releases";

type Context = { params: Promise<{ id: string; trackId: string }> };

async function ownedTrack(artistId: string, releaseId: string, trackId: string) {
  return queryOne<{ id: string; status: string }>(
    `SELECT t.id, r.status FROM tracks t JOIN releases r ON r.id=t.release_id WHERE t.id=$1 AND t.release_id=$2 AND r.artist_id=$3`,
    [trackId, releaseId, artistId],
  );
}

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const auth = await requireArtistContext(); if ("error" in auth) return auth.error;
    const { id, trackId } = await params;
    if (!await ownedTrack(auth.artistId, id, trackId)) return NextResponse.json({ error: "Track no encontrado." }, { status: 404 });
    const credits = await query<CreditRow>(`${CREDIT_SELECT} WHERE track_id=$1 ORDER BY created_at`, [trackId]);
    return NextResponse.json({ credits: credits.map(toCredit) });
  } catch (error) {
    console.error("[GET /api/releases/:id/tracks/:trackId/credits]", error);
    return NextResponse.json({ error: "No se pudieron consultar los créditos." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const auth = await requireArtistContext(); if ("error" in auth) return auth.error;
    const { id, trackId } = await params;
    const track = await ownedTrack(auth.artistId, id, trackId);
    if (!track) return NextResponse.json({ error: "Track no encontrado." }, { status: 404 });
    if (track.status !== "DRAFT") return NextResponse.json({ error: "Solo puedes modificar créditos de un release DRAFT." }, { status: 409 });
    const parsed = parseCreditInput(await request.json().catch(() => null));
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const credit = await queryOne<CreditRow>(
      `INSERT INTO track_credits (track_id,name,role) VALUES ($1,$2,$3) RETURNING id,track_id,name,role,created_at,updated_at`,
      [trackId, parsed.name, parsed.role],
    );
    if (!credit) return NextResponse.json({ error: "No se pudo crear el crédito." }, { status: 500 });
    await logAudit({ userId: auth.session.userId, username: auth.session.username, action: "TRACK_CREDIT_CREATED", entityType: "track_credit", entityId: credit.id, metadata: { trackId, role: credit.role }, ipAddress: getClientIp(request.headers), userAgent: request.headers.get("user-agent") ?? undefined });
    return NextResponse.json({ credit: toCredit(credit) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return NextResponse.json({ error: "Ese crédito ya existe para el track." }, { status: 409 });
    console.error("[POST /api/releases/:id/tracks/:trackId/credits]", error);
    return NextResponse.json({ error: "No se pudo crear el crédito." }, { status: 500 });
  }
}