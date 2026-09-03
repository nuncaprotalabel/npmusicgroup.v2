import type { Contract, ContractSections, ContractStatus, ContractType } from "@/types/contracts";

export interface ContractRow {
  id: string;
  solicitud_id: string;
  invitation_id: string;
  nombre_artistico: string;
  email: string;
  type: ContractType;
  title: string;
  version: string;
  content: string;
  sections: ContractSections | string;
  status: ContractStatus;
  solicitud_status?: string;
  invitation_status?: string;
  artist_percentage: string | number;
  company_percentage: string | number;
  created_by_username: string | null;
  created_at: string;
  updated_at: string;
  invitation_expires_at: string;
}

export const CONTRACT_SELECT = `
  SELECT c.id, c.solicitud_id, c.invitation_id, s.nombre_artistico, c.email,
         c.type, c.title, c.version, c.content, c.sections, c.status,
         c.artist_percentage, c.company_percentage,
         s.estado AS solicitud_status, i.status AS invitation_status,
         u.username AS created_by_username,
         c.created_at, c.updated_at, i.expires_at AS invitation_expires_at
  FROM contracts c
  INNER JOIN solicitudes s ON s.id = c.solicitud_id
  INNER JOIN invitations i ON i.id = c.invitation_id
  LEFT JOIN users u ON u.id = c.created_by
`;

export function mapContractRow(row: ContractRow): Contract {
  let sections = row.sections;
  if (typeof sections === "string") {
    try {
      sections = JSON.parse(sections) as ContractSections;
    } catch {
      sections = {};
    }
  }
  return {
    id: row.id,
    solicitudId: row.solicitud_id,
    invitationId: row.invitation_id,
    nombreArtistico: row.nombre_artistico,
    email: row.email,
    type: row.type,
    title: row.title,
    version: row.version,
    content: row.content,
    sections: sections ?? {},
    status: row.status,
    artistPercentage: Number(row.artist_percentage),
    companyPercentage: Number(row.company_percentage),
    createdBy: row.created_by_username,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    invitationExpiresAt: row.invitation_expires_at,
  };
}

export const SECTION_LABELS: Record<string, string> = {
  identification: "Identificación de las partes",
  object: "Objeto del acuerdo",
  services: "Servicios de NP Music Group",
  rights: "Titularidad de derechos",
  economics: "Distribución económica",
  termination: "Terminación / rescisión",
  obligations: "Obligaciones de las partes",
  term: "Vigencia / condiciones aplicables",
  signatures: "Firmas",
};

export const EMPTY_CONTRACT_SECTIONS: ContractSections = {
  identification: "",
  object: "",
  services: "",
  rights: "",
  economics: "",
  termination: "",
  obligations: "",
  term: "",
  signatures: "",
};

export function validateContractForSubmission(contract: {
  type: string;
  title: string;
  version: string;
  content: string;
  sections: ContractSections;
  artistPercentage: number;
  companyPercentage: number;
}): string[] {
  const missing: string[] = [];
  if (contract.type !== "CONTRATO_ARTISTA") missing.push("tipo de contrato");
  if (!contract.title.trim()) missing.push("título");
  if (!contract.version.trim()) missing.push("versión");
  if (!contract.content.trim()) missing.push("contenido contractual");
  if (!String(contract.sections.rights ?? "").trim()) missing.push("Titularidad de derechos");
  if (!String(contract.sections.termination ?? "").trim()) missing.push("Terminación / rescisión");
  if (!String(contract.sections.economics ?? "").trim()) missing.push("Distribución económica");
  if (contract.artistPercentage !== 85) missing.push("85% para el artista");
  if (contract.companyPercentage !== 15) missing.push("15% para NP Music Group");
  if (contract.artistPercentage + contract.companyPercentage !== 100) missing.push("suma de porcentajes igual a 100%");
  return missing;
}