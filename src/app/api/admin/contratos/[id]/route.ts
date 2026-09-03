import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requirePermission, AuthorizationError } from "@/lib/authorization";
import { getClientIp, logAudit } from "@/lib/audit";
import {
  CONTRACT_SELECT,
  mapContractRow,
  validateContractForSubmission,
  type ContractRow,
} from "@/lib/contracts";
import type { ContractSections } from "@/types/contracts";

interface ContractWithRelations extends ContractRow {
  solicitud_status: string;
  invitation_status: string;
  invitation_expires_at: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const session = await requirePermission("contracts.manage");
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const current = (
      await query<ContractWithRelations>(
        `${CONTRACT_SELECT} WHERE c.id = $1`,
        [id],
      )
    )[0];
    if (!current) return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 });

    if (body?.action === "submit") {
      if (current.status !== "BORRADOR") {
        return NextResponse.json({ error: "Solo los borradores pueden pasar a pendiente de firma." }, { status: 409 });
      }
      const contract = mapContractRow(current);
      const missing = validateContractForSubmission(contract);
      if (current.solicitud_status !== "APROBADA") missing.push("solicitud aprobada");
      if (
        current.invitation_status !== "PENDIENTE" ||
        new Date(current.invitation_expires_at).getTime() <= Date.now()
      ) {
        missing.push("invitación válida y vigente");
      }
      if (missing.length) {
        return NextResponse.json(
          { error: "El contrato aún no cumple los requisitos de validación.", missing },
          { status: 422 },
        );
      }

      const submitted = (
        await query<ContractRow>(
          `UPDATE contracts SET status = 'PENDIENTE_FIRMA', updated_at = NOW()
           WHERE id = $1 AND status = 'BORRADOR'
           RETURNING id, solicitud_id, invitation_id, $2::text AS nombre_artistico,
                     email, type, title, version, content, sections, status,
                     artist_percentage, company_percentage, $3::text AS created_by_username,
                     created_at, updated_at, $4::timestamptz AS invitation_expires_at`,
          [id, current.nombre_artistico, current.created_by_username, current.invitation_expires_at],
        )
      )[0];
      if (!submitted) return NextResponse.json({ error: "El contrato ya no está en borrador." }, { status: 409 });

      await logAudit({
        userId: session.userId,
        username: session.username,
        action: "CONTRACT_SENT_FOR_SIGNATURE",
        entityType: "contract",
        entityId: id,
        metadata: { solicitudId: current.solicitud_id, invitationId: current.invitation_id },
        ipAddress: getClientIp(request.headers),
        severity: "INFO",
      });
      return NextResponse.json({ contract: mapContractRow(submitted) });
    }

    if (current.status !== "BORRADOR") {
      return NextResponse.json({ error: "Los contratos enviados a firma no se pueden editar." }, { status: 409 });
    }

    const title = typeof body?.title === "string" ? body.title.trim() : current.title;
    const version = typeof body?.version === "string" ? body.version.trim() : current.version;
    const content = typeof body?.content === "string" ? body.content : current.content;
    const sections: ContractSections =
      body?.sections && typeof body.sections === "object" && !Array.isArray(body.sections)
        ? body.sections
        : (typeof current.sections === "string" ? JSON.parse(current.sections) : current.sections);

    if (!title || !version) {
      return NextResponse.json({ error: "Título y versión son obligatorios." }, { status: 422 });
    }

    const updated = (
      await query<ContractRow>(
        `UPDATE contracts
         SET title = $1, version = $2, content = $3, sections = $4::jsonb,
             updated_at = NOW()
         WHERE id = $5 AND status = 'BORRADOR'
         RETURNING id, solicitud_id, invitation_id, $6::text AS nombre_artistico,
                   email, type, title, version, content, sections, status,
                   artist_percentage, company_percentage, $7::text AS created_by_username,
                   created_at, updated_at, $8::timestamptz AS invitation_expires_at`,
        [
          title,
          version,
          content,
          JSON.stringify(sections),
          id,
          current.nombre_artistico,
          current.created_by_username,
          current.invitation_expires_at,
        ],
      )
    )[0];
    if (!updated) return NextResponse.json({ error: "El contrato ya no está en borrador." }, { status: 409 });

    await logAudit({
      userId: session.userId,
      username: session.username,
      action: "CONTRACT_UPDATED",
      entityType: "contract",
      entityId: id,
      metadata: { solicitudId: current.solicitud_id, invitationId: current.invitation_id },
      ipAddress: getClientIp(request.headers),
      severity: "INFO",
    });
    return NextResponse.json({ contract: mapContractRow(updated) });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[PATCH /api/admin/contratos/:id]", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}