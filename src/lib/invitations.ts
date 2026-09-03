import { createHash } from "crypto";
import { queryOne } from "@/lib/db";
import type { InvitationStatus } from "@/types/invitations";
import type { ContractSections, ContractStatus, ContractType } from "@/types/contracts";

export type PublicInvitationStatus =
  | "VALIDA"
  | "CONTRATO_NO_DISPONIBLE"
  | "CONTRATO_PENDIENTE"
  | "CONTRATO_FIRMADO"
  | "CONTRATO_CANCELADO"
  | "EXPIRADA"
  | "REVOCADA"
  | "UTILIZADA"
  | "INVALIDA";

export interface PublicInvitationContract {
  id: string;
  type: ContractType;
  title: string;
  version: string;
  content: string;
  sections: ContractSections;
  status: ContractStatus;
  artistPercentage: number;
  companyPercentage: number;
}

export interface PublicInvitation {
  status: PublicInvitationStatus;
  nombreArtistico?: string;
  email?: string;
  expiresAt?: string;
  contract?: PublicInvitationContract;
  signedAt?: string;
  signedVersion?: string;
}

interface PublicInvitationRow {
  id: string;
  nombre_artistico: string;
  email: string;
  status: InvitationStatus;
  expires_at: string;
  contract_id: string | null;
  contract_type: ContractType | null;
  contract_title: string | null;
  contract_version: string | null;
  contract_content: string | null;
  contract_sections: ContractSections | string | null;
  contract_status: ContractStatus | null;
  artist_percentage: string | number | null;
  company_percentage: string | number | null;
  signed_at: string | null;
  signed_version: string | null;
}

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function validatePublicInvitation(token: string): Promise<PublicInvitation> {
  if (!/^[A-Za-z0-9_-]{32,100}$/.test(token)) return { status: "INVALIDA" };

  const row = await queryOne<PublicInvitationRow>(
    `SELECT i.id, s.nombre_artistico, i.email, i.status, i.expires_at,
            c.id AS contract_id, c.type AS contract_type, c.title AS contract_title,
            c.version AS contract_version, c.content AS contract_content,
            c.sections AS contract_sections, c.status AS contract_status,
            c.artist_percentage, c.company_percentage,
            cs.accepted_at AS signed_at, cs.contract_version AS signed_version
     FROM invitations i
     INNER JOIN solicitudes s ON s.id = i.solicitud_id
     LEFT JOIN contracts c ON c.invitation_id = i.id
     LEFT JOIN contract_signatures cs ON cs.contract_id = c.id
     WHERE i.token_hash = $1
     ORDER BY c.created_at DESC NULLS LAST
     LIMIT 1`,
    [hashInvitationToken(token)],
  );

  if (!row) return { status: "INVALIDA" };

  if (row.status === "PENDIENTE" && new Date(row.expires_at).getTime() <= Date.now()) {
    await queryOne(
      `UPDATE invitations
       SET status = 'EXPIRADA', updated_at = NOW()
       WHERE id = $1 AND status = 'PENDIENTE'
       RETURNING id`,
      [row.id],
    );
    return { status: "EXPIRADA", nombreArtistico: row.nombre_artistico, email: row.email };
  }

  if (row.status === "PENDIENTE") {
    if (row.contract_status === "PENDIENTE_FIRMA" && row.contract_id) {
      return { ...toPublicInvitationBase(row), status: "CONTRATO_PENDIENTE", contract: toPublicContract(row) };
    }
    if (row.contract_status === "CANCELADO") {
      return { status: "CONTRATO_CANCELADO", nombreArtistico: row.nombre_artistico, email: row.email };
    }
    if (row.contract_id) {
      return { status: "CONTRATO_NO_DISPONIBLE", nombreArtistico: row.nombre_artistico, email: row.email };
    }
    return {
      status: "VALIDA",
      nombreArtistico: row.nombre_artistico,
      email: row.email,
      expiresAt: row.expires_at,
    };
  }
  if (row.status === "EXPIRADA") return { status: "EXPIRADA", nombreArtistico: row.nombre_artistico };
  if (row.status === "REVOCADA") return { status: "REVOCADA", nombreArtistico: row.nombre_artistico };
  if (row.contract_status === "FIRMADO") {
    return {
      status: "CONTRATO_FIRMADO",
      nombreArtistico: row.nombre_artistico,
      signedAt: row.signed_at ?? undefined,
      signedVersion: row.signed_version ?? row.contract_version ?? undefined,
    };
  }
  return { status: "UTILIZADA", nombreArtistico: row.nombre_artistico };
}

function toPublicInvitationBase(row: PublicInvitationRow): PublicInvitation {
  return {
    status: "CONTRATO_PENDIENTE",
    nombreArtistico: row.nombre_artistico,
    email: row.email,
    expiresAt: row.expires_at,
  };
}

function toPublicContract(row: PublicInvitationRow): PublicInvitationContract {
  let sections = row.contract_sections;
  if (typeof sections === "string") {
    try {
      sections = JSON.parse(sections) as ContractSections;
    } catch {
      sections = {};
    }
  }
  return {
    id: row.contract_id!,
    type: row.contract_type!,
    title: row.contract_title!,
    version: row.contract_version!,
    content: row.contract_content ?? "",
    sections: sections ?? {},
    status: row.contract_status!,
    artistPercentage: Number(row.artist_percentage),
    companyPercentage: Number(row.company_percentage),
  };
}