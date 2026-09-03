export type ContractStatus = "BORRADOR" | "PENDIENTE_FIRMA" | "FIRMADO" | "RECHAZADO" | "CANCELADO";
export type ContractType = "CONTRATO_ARTISTA";

export type ContractSections = {
  identification?: string;
  object?: string;
  services?: string;
  rights?: string;
  economics?: string;
  termination?: string;
  obligations?: string;
  term?: string;
  signatures?: string;
  [key: string]: unknown;
};

export interface Contract {
  id: string;
  solicitudId: string;
  invitationId: string;
  nombreArtistico: string;
  email: string;
  type: ContractType;
  title: string;
  version: string;
  content: string;
  sections: ContractSections;
  status: ContractStatus;
  artistPercentage: number;
  companyPercentage: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  invitationExpiresAt: string;
  signedAt: string | null;
  signedVersion: string | null;
}

export interface ContractResult {
  contract?: Contract;
  contractId?: string;
  error?: string;
  missing?: string[];
}