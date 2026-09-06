import type { AdminArtistDetail, AdminArtistSummary } from "@/types/artists";

async function readError(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({}));
  return body.error ?? fallback;
}

export async function getAdminArtists(): Promise<{ artists?: AdminArtistSummary[]; error?: string }> {
  try {
    const response = await fetch("/api/admin/artists", { cache: "no-store" });
    if (!response.ok) return { error: await readError(response, "No se pudieron consultar los artistas.") };
    const body = await response.json();
    return { artists: body.artists ?? [] };
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}

export async function getAdminArtist(id: string): Promise<{ artist?: AdminArtistDetail; error?: string; status?: number }> {
  try {
    const response = await fetch(`/api/admin/artists/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!response.ok) {
      return {
        error: await readError(response, "No se pudo consultar el artista."),
        status: response.status,
      };
    }
    const body = await response.json();
    return { artist: body.artist };
  } catch {
    return { error: "No se pudo conectar con el servidor." };
  }
}