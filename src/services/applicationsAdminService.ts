/**
 * applicationsAdminService — cliente de API para administración de solicitudes.
 * Solo usar desde Client Components autorizados (SUPER_ADMIN, ADMIN, DISTRIBUTION_MANAGER).
 * Toda comunicación con /api/applications se concentra aquí.
 */
import type {
  ApplicationListParams,
  ApplicationListResponse,
  ApplicationListError,
  ApplicationStatus,
  ApplicationUpdateResponse,
  Application,
} from '@/types/application';

// ─── Lista ────────────────────────────────────────────────────────────────────

export async function getApplications(
  params: ApplicationListParams = {}
): Promise<ApplicationListResponse | ApplicationListError> {
  try {
    const qs = new URLSearchParams();
    if (params.search) qs.set('search', params.search);
    if (params.status) qs.set('status', params.status);
    if (params.page)   qs.set('page',   String(params.page));
    if (params.limit)  qs.set('limit',  String(params.limit));

    const res = await fetch(`/api/applications?${qs.toString()}`, {
      method: 'GET',
      cache:  'no-store',
    });

    const json = await res.json().catch(() => ({ error: 'Respuesta inesperada del servidor.' }));

    if (!res.ok) {
      return { error: json.error ?? 'Error al cargar solicitudes.' };
    }

    return json as ApplicationListResponse;
  } catch {
    return { error: 'No se pudo conectar con el servidor. Verifica tu conexión.' };
  }
}

// ─── Detalle ──────────────────────────────────────────────────────────────────

export async function getApplication(
  id: string
): Promise<{ application: Application } | { error: string }> {
  try {
    const res = await fetch(`/api/applications/${id}`, {
      method: 'GET',
      cache:  'no-store',
    });

    const json = await res.json().catch(() => ({ error: 'Respuesta inesperada del servidor.' }));

    if (!res.ok) {
      return { error: json.error ?? 'Error al cargar la solicitud.' };
    }

    return json as { application: Application };
  } catch {
    return { error: 'No se pudo conectar con el servidor.' };
  }
}

// ─── Actualizar estado ────────────────────────────────────────────────────────

export async function updateApplicationStatus(
  id: string,
  status: 'APROBADA' | 'RECHAZADA'
): Promise<ApplicationUpdateResponse> {
  try {
    const res = await fetch(`/api/applications/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    });

    const json = await res.json().catch(() => ({ error: 'Respuesta inesperada del servidor.' }));

    if (!res.ok) {
      return { error: json.error ?? 'Error al actualizar la solicitud.' };
    }

    return json as ApplicationUpdateResponse;
  } catch {
    return { error: 'No se pudo conectar con el servidor. Verifica tu conexión.' };
  }
}
