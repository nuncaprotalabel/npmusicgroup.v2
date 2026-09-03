import type { PoolClient } from "pg";
import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { hashInvitationToken } from "@/lib/invitations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  let client: PoolClient | undefined;
  try {
    const { token } = await params;
    if (!/^[A-Za-z0-9_-]{32,100}$/.test(token)) {
      return NextResponse.json({ error: "La invitación no es válida." }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    if (body?.readConfirmed !== true || body?.acceptConfirmed !== true || body?.intentConfirmed !== true) {
      return NextResponse.json(
        { error: "Debes confirmar que leíste el contrato, que lo aceptas y que deseas firmarlo." },
        { status: 400 },
      );
    }

    client = await db.connect();
    await client.query("BEGIN");
    const row = (
      await client.query<{
        invitation_id: string;
        invitation_status: string;
        expires_at: string;
        contract_id: string | null;
        contract_status: string | null;
        contract_version: string | null;
      }>(
        `SELECT i.id AS invitation_id, i.status AS invitation_status, i.expires_at,
                c.id AS contract_id, c.status AS contract_status, c.version AS contract_version
         FROM invitations i
         LEFT JOIN contracts c ON c.invitation_id = i.id
         WHERE i.token_hash = $1
         ORDER BY c.created_at DESC NULLS LAST
         LIMIT 1
         FOR UPDATE OF i`,
        [hashInvitationToken(token)],
      )
    ).rows[0];

    if (!row) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "La invitación no es válida." }, { status: 404 });
    }
    if (row.invitation_status === "PENDIENTE" && new Date(row.expires_at).getTime() <= Date.now()) {
      await client.query(
        `UPDATE invitations SET status = 'EXPIRADA', updated_at = NOW()
         WHERE id = $1 AND status = 'PENDIENTE'`,
        [row.invitation_id],
      );
      await client.query("COMMIT");
      return NextResponse.json({ error: "La invitación ha expirado." }, { status: 410 });
    }
    if (row.invitation_status === "REVOCADA") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "La invitación fue revocada." }, { status: 410 });
    }
    if (row.invitation_status === "UTILIZADA") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Esta invitación ya fue utilizada." }, { status: 409 });
    }
    if (!row.contract_id || row.contract_status !== "PENDIENTE_FIRMA" || !row.contract_version) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "El contrato todavía no está disponible para aceptación." }, { status: 409 });
    }

    const clientIp = getClientIp(request.headers);
    const signature = (
      await client.query<{ id: string }>(
        `INSERT INTO contract_signatures
          (contract_id, invitation_id, contract_version, accepted_at, method, status, ip_address, user_agent)
         VALUES ($1, $2, $3, NOW(), 'INTERNAL_ACCEPTANCE', 'FIRMADO', $4, $5)
         RETURNING id`,
        [
          row.contract_id,
          row.invitation_id,
          row.contract_version,
          clientIp && isIP(clientIp) ? clientIp : null,
          request.headers.get("user-agent") ?? null,
        ],
      )
    ).rows[0];

    const contractUpdated = await client.query(
      `UPDATE contracts SET status = 'FIRMADO', updated_at = NOW()
       WHERE id = $1 AND status = 'PENDIENTE_FIRMA'`,
      [row.contract_id],
    );
    const invitationUpdated = await client.query(
      `UPDATE invitations SET status = 'UTILIZADA', updated_at = NOW()
       WHERE id = $1 AND status = 'PENDIENTE'`,
      [row.invitation_id],
    );
    if (contractUpdated.rowCount !== 1 || invitationUpdated.rowCount !== 1) {
      throw new Error("La aceptación no pudo completar todas las actualizaciones.");
    }
    await client.query("COMMIT");

    const auditContext = {
      contractId: row.contract_id,
      invitationId: row.invitation_id,
      contractVersion: row.contract_version,
      signatureId: signature.id,
      method: "INTERNAL_ACCEPTANCE",
    };
    const auditRequest = {
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
      severity: "INFO" as const,
    };
    await Promise.all([
      logAudit({ action: "CONTRACT_SIGNED", entityType: "contract", entityId: row.contract_id, metadata: auditContext, ...auditRequest }),
      logAudit({ action: "CONTRACT_ACCEPTANCE_RECORDED", entityType: "contract_signature", entityId: signature.id, metadata: auditContext, ...auditRequest }),
      logAudit({ action: "INVITATION_USED", entityType: "invitation", entityId: row.invitation_id, metadata: auditContext, ...auditRequest }),
    ]);

    return NextResponse.json({
      status: "FIRMADO",
      message: "Contrato firmado y aceptado. Onboarding pendiente.",
      contractId: row.contract_id,
      contractVersion: row.contract_version,
      signatureId: signature.id,
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Este contrato ya fue firmado." }, { status: 409 });
    }
    console.error("[POST /api/invitacion/:token/aceptar]", error);
    return NextResponse.json({ error: "No se pudo registrar la aceptación." }, { status: 500 });
  } finally {
    client?.release();
  }
}