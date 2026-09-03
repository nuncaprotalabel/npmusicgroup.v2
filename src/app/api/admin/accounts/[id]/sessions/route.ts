import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { logAudit, getClientIp } from "@/lib/audit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const session = await requirePermission("accounts.manage");
    const { id } = await params;
    const exists = await query<{ id: string }>("SELECT id FROM users WHERE id = $1", [id]);
    if (exists.length === 0) {
      return NextResponse.json({ error: "Cuenta no encontrada." }, { status: 404 });
    }

    const result = await query<{ id: string }>(
      `UPDATE sessions
       SET is_active = false, ended_at = NOW()
       WHERE user_id = $1 AND is_active = true
       RETURNING id`,
      [id],
    );

    await logAudit({
      userId: session.userId,
      username: session.username,
      action: "ACCOUNT_SESSIONS_INVALIDATED",
      entityType: "user",
      entityId: id,
      metadata: { count: result.length },
      ipAddress: getClientIp(request.headers),
      severity: "INFO",
    });

    return NextResponse.json({ invalidated: result.length });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[POST /api/admin/accounts/:id/sessions]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}