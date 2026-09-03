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

const INVITATION_SELECT = `
  SELECT i.id, i.solicitud_id, s.nombre_artistico, i.email, i.status,
         i.created_at, i.expires_at, u.username AS created_by_username
  FROM invitations i
  INNER JOIN solicitudes s ON s.id = i.solicitud_id
  LEFT JOIN users u ON u.id = i.created_by
`;

export async function GET(): Promise<NextResponse> {
  try {
    await requirePermission("invitations.view");
    await query(
      `UPDATE invitations
       SET status = 'EXPIRADA', updated_at = NOW()
       WHERE solicitud_id IS NOT NULL AND status = 'PENDIENTE' AND expires_at <= NOW()`,
    );
    const rows = await query<InvitationRow>(
      `${INVITATION_SELECT}
       ORDER BY CASE i.status WHEN 'PENDIENTE' THEN 0 WHEN 'EXPIRADA' THEN 1 ELSE 2 END,
                i.created_at DESC`,
    );
    return NextResponse.json({ invitaciones: rows.map(mapRow) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[GET /api/admin/invitaciones]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let client: PoolClient | undefined;
  try {
    const session = await requirePermission("invitations.manage");
    const body = await request.json().catch(() => null);
    const solicitudId = body?.solicitudId;
    if (typeof solicitudId !== "string" || !solicitudId.trim()) {
      return NextResponse.json({ error: "La solicitud relacionada es obligatoria." }, { status: 400 });
    }

    const rawToken = randomBytes(32).toString("base64url");
    const tokenHash = hashInvitationToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    client = await db.connect();
    await client.query("BEGIN");
    const solicitud = (
      await client.query<{ id: string; nombre_artistico: string; email: string; estado: string }>(
        `SELECT id, nombre_artistico, email, estado
         FROM solicitudes WHERE id = $1 FOR UPDATE`,
        [solicitudId],
      )
    ).rows[0];

    if (!solicitud) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
    }
    if (solicitud.estado !== "APROBADA") {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Solo las solicitudes aprobadas pueden generar invitaciones." },
        { status: 409 },
      );
    }

    await client.query(
      `UPDATE invitations
       SET status = 'EXPIRADA', updated_at = NOW()
       WHERE solicitud_id = $1 AND status = 'PENDIENTE' AND expires_at <= NOW()`,
      [solicitudId],
    );
    const active = (
      await client.query<{ id: string }>(
        `SELECT id FROM invitations
         WHERE solicitud_id = $1 AND status = 'PENDIENTE' AND expires_at > NOW()
         LIMIT 1`,
        [solicitudId],
      )
    ).rows[0];
    if (active) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Esta solicitud ya tiene una invitación pendiente y vigente." },
        { status: 409 },
      );
    }

    const invitation = (
      await client.query<InvitationRow>(
        `INSERT INTO invitations
          (solicitud_id, email, token_hash, expires_at, status, created_by)
         VALUES ($1, $2, $3, $4, 'PENDIENTE', $5)
         RETURNING id, solicitud_id, $6::text AS nombre_artistico, email, status,
                   created_at, expires_at, $7::text AS created_by_username`,
        [
          solicitudId,
          solicitud.email,
          tokenHash,
          expiresAt,
          session.userId,
          solicitud.nombre_artistico,
          session.username,
        ],
      )
    ).rows[0];
    await client.query("COMMIT");

    await logAudit({
      userId: session.userId,
      username: session.username,
      action: "INVITATION_CREATED",
      entityType: "invitation",
      entityId: invitation.id,
      metadata: { solicitudId, email: solicitud.email },
      ipAddress: getClientIp(request.headers),
      severity: "INFO",
    });

    return NextResponse.json(
      {
        invitation: mapRow(invitation),
        invitationUrl: `/invitacion/${rawToken}`,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "Esta solicitud ya tiene una invitación pendiente y vigente." },
        { status: 409 },
      );
    }
    console.error("[POST /api/admin/invitaciones]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  } finally {
    client?.release();
  }
}