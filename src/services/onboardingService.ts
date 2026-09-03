export interface StartArtistOnboardingResult {
  status?: string;
  username?: string;
  activationUrl?: string;
  expiresAt?: string;
  error?: string;
}

export interface ActivationInfo {
  status: "PENDIENTE_PASSWORD";
  artistName: string;
  username: string;
  expiresAt: string;
}

async function readResponse<T>(response: Response): Promise<T & { error?: string }> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      ...(body as object),
      error: body.error ?? "La operación no pudo completarse.",
    } as T & { error?: string };
  }
  return body as T & { error?: string };
}

export async function startArtistOnboarding(
  contractId: string,
): Promise<StartArtistOnboardingResult> {
  try {
    return await readResponse(
      await fetch(`/api/admin/contratos/${contractId}/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getActivationInfo(
  token: string,
): Promise<ActivationInfo | { error: string }> {
  try {
    return await readResponse(
      await fetch(`/api/activar/${encodeURIComponent(token)}`, { cache: "no-store" }),
    );
  } catch {
    return { error: "No se pudo validar el enlace de activación." };
  }
}

export async function activateArtistAccount(
  token: string,
  password: string,
  confirmation: string,
): Promise<{ status?: string; message?: string; error?: string }> {
  try {
    return await readResponse(
      await fetch(`/api/activar/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmation }),
      }),
    );
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}
