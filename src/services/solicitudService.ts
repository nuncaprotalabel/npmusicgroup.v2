import type { CreateSolicitudRequest, Solicitud, SolicitudErrorResponse } from '@/types/solicitud';
import type { InvitationLinkResult } from '@/types/invitations';

export interface SubmitSolicitudResult {
  solicitud?: Solicitud;
  error?: string;
  duplicate?: boolean;
}

export async function submitSolicitud(data: CreateSolicitudRequest): Promise<SubmitSolicitudResult> {
  try {
    const response = await fetch('/api/solicitudes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const payload = await response.json() as Solicitud | SolicitudErrorResponse;
    if (!response.ok) {
      const error = payload as SolicitudErrorResponse;
      return { error: error.error || 'No se pudo enviar la solicitud.', duplicate: error.duplicate };
    }
    return { solicitud: (payload as unknown as { solicitud: Solicitud }).solicitud };
  } catch {
    return { error: 'No se pudo conectar con el servidor. Intenta de nuevo.' };
  }
}

export interface GetSolicitudesResult {
  solicitudes?: Solicitud[];
  error?: string;
}

export interface UpdateSolicitudResult {
  solicitud?: Solicitud;
  error?: string;
}

export async function getSolicitudes(): Promise<GetSolicitudesResult> {
  try {
    const response = await fetch('/api/admin/solicitudes', { cache: 'no-store' });
    const payload = await response.json() as GetSolicitudesResult;
    if (!response.ok) return { error: payload.error || 'No se pudieron cargar las solicitudes.' };
    return { solicitudes: payload.solicitudes ?? [] };
  } catch {
    return { error: 'No se pudo conectar con el servidor. Intenta de nuevo.' };
  }
}

export async function updateSolicitudStatus(
  id: string,
  estado: Extract<Solicitud['estado'], 'APROBADA' | 'RECHAZADA'>,
): Promise<UpdateSolicitudResult> {
  try {
    const response = await fetch(`/api/admin/solicitudes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });
    const payload = await response.json() as UpdateSolicitudResult;
    if (!response.ok) return { error: payload.error || 'No se pudo actualizar la solicitud.' };
    return { solicitud: payload.solicitud };
  } catch {
    return { error: 'No se pudo conectar con el servidor. Intenta de nuevo.' };
  }
}

export async function createInvitationForSolicitud(
  solicitudId: string,
): Promise<InvitationLinkResult> {
  try {
    const response = await fetch('/api/admin/invitaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ solicitudId }),
    });
    const payload = await response.json() as InvitationLinkResult;
    if (!response.ok) return { error: payload.error || 'No se pudo crear la invitación.' };
    return payload;
  } catch {
    return { error: 'No se pudo conectar con el servidor. Intenta de nuevo.' };
  }
}