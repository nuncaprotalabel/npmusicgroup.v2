import type { ArtistProfile } from "@/types/artists";
export async function getAdminArtists(): Promise<{ artists?: ArtistProfile[]; error?: string }> {
  try {
    const response = await fetch("/api/admin/artists", { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return { error: body.error ?? "No se pudieron consultar los artistas." };
    return { artists: body.artists ?? [] };
  } catch { return { error: "No se pudo conectar con el servidor." }; }
}