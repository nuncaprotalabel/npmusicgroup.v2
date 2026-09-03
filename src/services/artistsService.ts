import type { ArtistProfile, ArtistProfileUpdate } from "@/types/artists";

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

export async function getMyArtistProfile(): Promise<{ artist?: ArtistProfile; error?: string }> {
  try {
    return await readResponse(await fetch("/api/artists/me", { cache: "no-store" }));
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function updateMyArtistProfile(
  changes: ArtistProfileUpdate,
): Promise<{ artist?: ArtistProfile; error?: string }> {
  try {
    return await readResponse(
      await fetch("/api/artists/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      }),
    );
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}
