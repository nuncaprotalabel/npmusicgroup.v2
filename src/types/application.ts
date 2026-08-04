/**
 * Tipos TypeScript compartidos para solicitudes de artistas.
 * Solo definiciones — sin lógica de negocio.
 */

// ─── Entidad ──────────────────────────────────────────────────────────────────

export type ApplicationStatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export interface Application {
  id:           string;
  artisticName: string;
  email:        string;
  country:      string;
  genre:        string;
  mainLink:     string;
  instagram:    string | null;
  tiktok:       string | null;
  message:      string | null;
  status:       ApplicationStatus;
  ipAddress:    string | null;
  createdAt:    string;
}

// ─── Formulario público ───────────────────────────────────────────────────────

export interface ApplicationFormData {
  artisticName: string;
  email:        string;
  country:      string;
  genre:        string;
  mainLink:     string;
  instagram?:   string;
  tiktok?:      string;
  message?:     string;
}

export interface ApplicationSubmitResponse {
  application?: { id: string };
  error?:       string;
}

// ─── Admin — lista ────────────────────────────────────────────────────────────

export interface ApplicationListParams {
  search?: string;
  status?: ApplicationStatus;
  page?:   number;
  limit?:  number;
}

export interface ApplicationListResponse {
  applications: Application[];
  total:        number;
  page:         number;
  totalPages:   number;
}

export interface ApplicationListError {
  error: string;
}

// ─── Admin — acción ───────────────────────────────────────────────────────────

export interface ApplicationStatusUpdate {
  status: 'APROBADA' | 'RECHAZADA';
}

export interface ApplicationUpdateResponse {
  application?: { id: string; status: ApplicationStatus };
  error?:       string;
}
