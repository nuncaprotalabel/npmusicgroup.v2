export type SolicitudEstado = 'PENDIENTE' | 'REVISANDO' | 'APROBADA' | 'RECHAZADA';

export interface Solicitud {
  id: string;
  nombreArtistico: string;
  email: string;
  pais: string;
  generoPrincipal: string;
  enlacePrincipal: string;
  instagram: string | null;
  tiktok: string | null;
  mensaje: string | null;
  estado: SolicitudEstado;
  createdAt: string;
}

export interface CreateSolicitudRequest {
  nombreArtistico: string;
  email: string;
  pais: string;
  generoPrincipal: string;
  enlacePrincipal: string;
  instagram?: string;
  tiktok?: string;
  mensaje?: string;
}

export interface SolicitudErrorResponse {
  error: string;
  duplicate?: boolean;
}