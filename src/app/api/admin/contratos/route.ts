import type { PoolClient } from "pg";
import { NextRequest, NextResponse } from "next/server";
import { db, query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { getClientIp, logAudit } from "@/lib/audit";
import {
  CONTRACT_SELECT,
  EMPTY_CONTRACT_SECTIONS,
  mapContractRow,
  type ContractRow,
} from "@/lib/contracts";

export async function GET(): Promise<NextResponse> {
  try {
    await requirePermission("contracts.view");
    const rows = await query<ContractRow>(
      `${CONTRACT_SELECT}
       ORDER BY c.updated_at DESC, c.created_at DESC`,
    );
    return NextResponse.json({ contracts: rows.map(mapContractRow) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[GET /api/admin/contratos]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let client: PoolClient | undefined;
  try {
    const session = await requirePermission("contracts.manage");
    const body = await request.json().catch(() => null);
    const invitationId = body?.invitationId;
    if (typeof invitationId !== "string" || !invitationId.trim()) {
      return NextResponse.json({ error: "La invitación relacionada es obligatoria." }, { status: 400 });
    }

    client = await db.connect();
    await client.query("BEGIN");
    const invitation = (
      await client.query<{
        id: string;
        solicitud_id: string;
        nombre_artistico: string;
        email: string;
        invitation_status: string;
        invitation_expires_at: string;
        solicitud_status: string;
      }>(
        `SELECT i.id, i.solicitud_id, s.nombre_artistico, i.email,
                i.status AS invitation_status, i.expires_at AS invitation_expires_at,
                s.estado AS solicitud_status
         FROM invitations i
         INNER JOIN solicitudes s ON s.id = i.solicitud_id
         WHERE i.id = $1
         FOR UPDATE`,
        [invitationId],
      )
    ).rows[0];

    if (!invitation) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Invitación no encontrada." }, { status: 404 });
    }
    if (invitation.solicitud_status !== "APROBADA") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "La solicitud relacionada no está aprobada." }, { status: 409 });
    }
    if (
      invitation.invitation_status !== "PENDIENTE" ||
      new Date(invitation.invitation_expires_at).getTime() <= Date.now()
    ) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "La invitación no está vigente." }, { status: 409 });
    }

    const existing = (
      await client.query<{ id: string }>(
        `SELECT id FROM contracts
         WHERE invitation_id = $1 AND status IN ('BORRADOR', 'PENDIENTE_FIRMA')
         LIMIT 1`,
        [invitationId],
      )
    ).rows[0];
    if (existing) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Esta invitación ya tiene un contrato activo.", contractId: existing.id },
        { status: 409 },
      );
    }

    const created = (
      await client.query<ContractRow>(
        `INSERT INTO contracts
          (solicitud_id, invitation_id, type, title, version, content, sections,
           status, artist_percentage, company_percentage, created_by)
         VALUES ($1, $2, 'CONTRATO_ARTISTA', $3, '1.0', '', $4::jsonb,
                 'BORRADOR', 85.00, 15.00, $5)
         RETURNING id, solicitud_id, invitation_id, $6::text AS nombre_artistico,
                   email, type, title, version, content, sections, status,
                   artist_percentage, company_percentage, $7::text AS created_by_username,
                   created_at, updated_at, $8::timestamptz AS invitation_expires_at`,
        [
          invitation.solicitud_id,
          invitationId,
          `Borrador de contrato — ${invitation.nombre_artistico}`,
          JSON.stringify(EMPTY_CONTRACT_SECTIONS),
          session.userId,
          invitation.nombre_artistico,
          session.username,
          invitation.invitation_expires_at,
        ],
      )
    ).rows[0];
    await client.query("COMMIT");

    await logAudit({
      userId: session.userId,
      username: session.username,
      action: "CONTRACT_CREATED",
      entityType: "contract",
      entityId: created.id,
      metadata: { solicitudId: invitation.solicitud_id, invitationId, type: "CONTRATO_ARTISTA" },
      ipAddress: getClientIp(request.headers),
      severity: "INFO",
    });
    return NextResponse.json({ contract: mapContractRow(created) }, { status: 201 });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Esta invitación ya tiene un contrato activo." }, { status: 409 });
    }
    console.error("[POST /api/admin/contratos]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  } finally {
    client?.release();
  }
}