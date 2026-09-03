export type InvitationStatus = "PENDIENTE" | "UTILIZADA" | "EXPIRADA" | "REVOCADA";

export interface Invitation {
  id: string;
  solicitudId: string;
  nombreArtistico: string;
  email: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
  createdBy: string | null;
}

export interface InvitationLinkResult {
  invitation?: Invitation;
  invitationUrl?: string;
  expiresAt?: string;
  error?: string;
}