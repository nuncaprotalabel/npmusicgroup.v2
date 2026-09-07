import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { requirePermission, AuthorizationError } from "@/lib/authorization";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requirePermission("releases.manage");
    const id = (await params).id;
    const current = await queryOne<{ id: string; status: string }>("SELECT id, status FROM releases WHERE id = $1", [id]);
    if (!current) return NextResponse.json({ error: "Release no encontrado." }, { status: 404 });
    if (current.status === "ARCHIVED") return NextResponse.json({ error: "El release ya está archivado." }, { status: 409 });
    const archived = await queryOne<{ id: string; status: string }>("UPDATE releases SET status = 'ARCHIVED', updated_at = NOW() WHERE id = $1 RETURNING id, status", [id]);
    if (!archived) return NextResponse.json({ error: "El release no pudo archivarse." }, { status: 409 });
    await logAudit({ userId: session.userId, username: session.username, action: "RELEASE_ARCHIVED", entityType: "release", entityId: id, ipAddress: getClientIp(request.headers), userAgent: request.headers.get("user-agent") ?? undefined });
    return NextResponse.json({ release: archived });
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("[POST /api/admin/releases/:id/archive]", error);
    return NextResponse.json({ error: "No se pudo archivar el release." }, { status: 500 });
  }
}