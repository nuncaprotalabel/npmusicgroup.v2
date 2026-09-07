import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { parseCreditInput, requireArtistContext, toCredit, type CreditRow } from "@/lib/releases";

type Context = { params: Promise<{ id: string; trackId: string; creditId: string }> };
const CREDIT = `SELECT c.id,c.track_id,c.name,c.role,c.created_at,c.updated_at FROM track_credits c JOIN tracks t ON t.id=c.track_id JOIN releases r ON r.id=t.release_id WHERE c.id=$1 AND c.track_id=$2 AND t.release_id=$3`;

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const auth = await requireArtistContext(); if ("error" in auth) return auth.error;
    const { id, trackId, creditId } = await params;
    const existing = await queryOne<CreditRow>(`${CREDIT} AND r.artist_id=$4`, [creditId, trackId, id, auth.artistId]);
    if (!existing) return NextResponse.json({ error: "Crédito no encontrado." }, { status: 404 });
    const release = await queryOne<{ status: string }>("SELECT status FROM releases WHERE id=$1 AND artist_id=$2", [id, auth.artistId]);
    if (release?.status !== "DRAFT") return NextResponse.json({ error: "Solo puedes modificar créditos de un release DRAFT." }, { status: 409 });
    const parsed = parseCreditInput(await request.json().catch(() => null));
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const saved = await queryOne<CreditRow>("UPDATE track_credits SET name=$1,role=$2,updated_at=NOW() WHERE id=$3 AND track_id=$4 RETURNING id,track_id,name,role,created_at,updated_at", [parsed.name, parsed.role, creditId, trackId]);
    if (!saved) return NextResponse.json({ error: "El crédito no pudo actualizarse." }, { status: 409 });
    await logAudit({ userId: auth.session.userId, username: auth.session.username, action: "TRACK_CREDIT_UPDATED", entityType: "track_credit", entityId: creditId, metadata: { trackId }, ipAddress: getClientIp(request.headers), userAgent: request.headers.get("user-agent") ?? undefined });
    return NextResponse.json({ credit: toCredit(saved) });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return NextResponse.json({ error: "Ese crédito ya existe para el track." }, { status: 409 });
    return NextResponse.json({ error: "No se pudo actualizar el crédito." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const auth = await requireArtistContext(); if ("error" in auth) return auth.error;
    const { id, trackId, creditId } = await params;
    const existing = await queryOne<CreditRow>(`${CREDIT} AND r.artist_id=$4`, [creditId, trackId, id, auth.artistId]);
    if (!existing) return NextResponse.json({ error: "Crédito no encontrado." }, { status: 404 });
    const release = await queryOne<{ status: string }>("SELECT status FROM releases WHERE id=$1 AND artist_id=$2", [id, auth.artistId]);
    if (release?.status !== "DRAFT") return NextResponse.json({ error: "Solo puedes modificar créditos de un release DRAFT." }, { status: 409 });
    await queryOne("DELETE FROM track_credits WHERE id=$1 AND track_id=$2 RETURNING id", [creditId, trackId]);
    await logAudit({ userId: auth.session.userId, username: auth.session.username, action: "TRACK_CREDIT_DELETED", entityType: "track_credit", entityId: creditId, metadata: { trackId }, ipAddress: getClientIp(request.headers), userAgent: request.headers.get("user-agent") ?? undefined });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo eliminar el crédito." }, { status: 500 });
  }
}