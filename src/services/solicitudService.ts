import type { CreateSolicitudRequest, Solicitud, SolicitudErrorResponse } from '@/types/solicitud';

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