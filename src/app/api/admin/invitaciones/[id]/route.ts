import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import type { PoolClient } from "pg";
import { db, query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { getClientIp, logAudit } from "@/lib/audit";
import { hashInvitationToken } from "@/lib/invitations";
import type { Invitation, InvitationStatus } from "@/types/invitations";

interface InvitationRow {
  id: string;
  solicitud_id: string;
  nombre_artistico: string;
  email: string;
  status: InvitationStatus;
  created_at: string;
  expires_at: string;
  created_by_username: string | null;
}

function mapRow(row: InvitationRow): Invitation {
  return {
    id: row.id,
    solicitudId: row.solicitud_id,
    nombreArtistico: row.nombre_artistico,
    email: row.email,
    status: row.status,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    createdBy: row.created_by_username,
  };
}

const SELECT_ONE = `
  SELECT i.id, i.solicitud_id, s.nombre_artistico, i.email, i.status,
         i.created_at, i.expires_at, u.username AS created_by_username,
         s.estado AS solicitud_estado
  FROM invitations i
  INNER JOIN solicitudes s ON s.id = i.solicitud_id
  LEFT JOIN users u ON u.id = i.created_by
`;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const session = await requirePermission("invitations.manage");
    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (body?.action !== "revoke") {
      return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
    }

    const current = (await query<InvitationRow & { solicitud_estado: string }>(
      `${SELECT_ONE} WHERE i.id = $1`,
      [id],
    ))[0];
    if (!current) return NextResponse.json({ error: "Invitación no encontrada." }, { status: 404 });
    if (current.status !== "PENDIENTE" || new Date(current.expires_at).getTime() <= Date.now()) {
      if (current.status === "PENDIENTE") {
        await query(
          `UPDATE invitations SET status = 'EXPIRADA', updated_at = NOW()
           WHERE id = $1 AND status = 'PENDIENTE'`,
          [id],
        );
      }
      return NextResponse.json({ error: "Solo se pueden revocar invitaciones pendientes y vigentes." }, { status: 409 });
    }

    const updated = (await query<InvitationRow>(
      `UPDATE invitations SET status = 'REVOCADA', updated_at = NOW()
       WHERE id = $1 AND status = 'PENDIENTE' AND expires_at > NOW()
       RETURNING id, solicitud_id, $2::text AS nombre_artistico, email, status,
                 created_at, expires_at, $3::text AS created_by_username`,
      [id, current.nombre_artistico, current.created_by_username],
    ))[0];
    if (!updated) return NextResponse.json({ error: "La invitación ya no está vigente." }, { status: 409 });

    await logAudit({
      userId: session.userId,
      username: session.username,
      action: "INVITATION_REVOKED",
      entityType: "invitation",
      entityId: id,
      metadata: { solicitudId: current.solicitud_id },
      ipAddress: getClientIp(request.headers),
      severity: "WARN",
    });
    return NextResponse.json({ invitation: mapRow(updated) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[PATCH /api/admin/invitaciones/:id]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  let client: PoolClient | undefined;
  try {
    const session = await requirePermission("invitations.manage");
    const { id } = await params;
    const rawToken = randomBytes(32).toString("base64url");
    const tokenHash = hashInvitationToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    client = await db.connect();
    await client.query("BEGIN");
    const current = (
      await client.query<InvitationRow & { solicitud_estado: string }>(
        `${SELECT_ONE} WHERE i.id = $1 FOR UPDATE`,
        [id],
      )
    ).rows[0];
    if (!current) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Invitación no encontrada." }, { status: 404 });
    }
    if (current.status === "PENDIENTE" && new Date(current.expires_at).getTime() <= Date.now()) {
      await client.query(
        `UPDATE invitations SET status = 'EXPIRADA', updated_at = NOW()
         WHERE id = $1 AND status = 'PENDIENTE'`,
        [id],
      );
      current.status = "EXPIRADA";
    }
    if (current.status !== "EXPIRADA") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Solo se pueden regenerar invitaciones expiradas." }, { status: 409 });
    }
    if (current.solicitud_estado !== "APROBADA") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "La solicitud relacionada ya no está aprobada." }, { status: 409 });
    }

    await client.query(
      `UPDATE invitations SET status = 'EXPIRADA', updated_at = NOW()
       WHERE id = $1`,
      [id],
    );
    const next = (
      await client.query<InvitationRow>(
        `INSERT INTO invitations
          (solicitud_id, email, token_hash, expires_at, status, created_by)
         VALUES ($1, $2, $3, $4, 'PENDIENTE', $5)
         RETURNING id, solicitud_id, $6::text AS nombre_artistico, email, status,
                   created_at, expires_at, $7::text AS created_by_username`,
        [
          current.solicitud_id,
          current.email,
          tokenHash,
          expiresAt,
          session.userId,
          current.nombre_artistico,
          session.username,
        ],
      )
    ).rows[0];
    await client.query("COMMIT");

    await logAudit({
      userId: session.userId,
      username: session.username,
      action: "INVITATION_REGENERATED",
      entityType: "invitation",
      entityId: next.id,
      metadata: { solicitudId: current.solicitud_id, previousInvitationId: id },
      ipAddress: getClientIp(request.headers),
      severity: "INFO",
    });
    return NextResponse.json({
      invitation: mapRow(next),
      invitationUrl: `/invitacion/${rawToken}`,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[POST /api/admin/invitaciones/:id]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  } finally {
    client?.release();
  }
}