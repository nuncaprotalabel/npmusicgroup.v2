/**
 * applicationService — cliente de API para solicitudes de artistas.
 * Toda comunicación con /api/applications se concentra aquí.
 * Solo usar desde Client Components.
 */
import type { ApplicationFormData, ApplicationSubmitResponse } from '@/types/application';

/**
 * Envía una solicitud de artista al backend.
 * Retorna `{ application: { id } }` en éxito o `{ error: string }` en fallo.
 */
export async function submitApplication(
  data: ApplicationFormData
): Promise<ApplicationSubmitResponse> {
  try {
    const res = await fetch('/api/applications', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({ error: 'Respuesta inesperada del servidor.' }));

    if (!res.ok) {
      return { error: json.error ?? 'Error al enviar la solicitud.' };
    }

    return json as ApplicationSubmitResponse;
  } catch {
    return { error: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.' };
  }
}
