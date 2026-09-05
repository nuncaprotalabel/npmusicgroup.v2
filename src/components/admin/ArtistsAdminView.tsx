"use client";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ExternalLink, Loader2, Users } from "lucide-react";
import type { ArtistProfile } from "@/types/artists";
import { getAdminArtists } from "@/services/adminArtistsService";

export function ArtistsAdminView() {
  const [artists, setArtists] = useState<ArtistProfile[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setError(null);
    const result = await getAdminArtists();
    if (result.error) setError(result.error); else setArtists(result.artists ?? []);
  }, []);
  useEffect(() => { void load(); }, [load]);
  return <div className="mx-auto w-full max-w-6xl space-y-6">
    <header><p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">Administración</p><h1 className="text-2xl font-bold text-white">Artistas</h1><p className="mt-1 text-sm text-[#737373]">Perfiles creados desde onboarding real.</p></header>
    {error && <div className="flex gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-[#EF4444]" role="alert"><AlertCircle size={15}/><span className="flex-1">{error}</span><button onClick={() => void load()} className="underline">Reintentar</button></div>}
    <section className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]">
      {artists === null ? <div className="flex justify-center py-16 text-sm text-[#525252]"><Loader2 className="mr-2 animate-spin" size={18}/>Consultando PostgreSQL…</div> : artists.length === 0 ? <div className="flex flex-col items-center py-16 text-center"><Users className="mb-3 text-[#333]" size={28}/><p className="text-sm text-white">No hay artistas registrados</p><p className="mt-1 text-sm text-[#525252]">Aparecerán al completar onboarding.</p></div> : <div className="divide-y divide-[#141414]">{artists.map((artist) => <div key={artist.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[1.3fr_1.2fr_1fr_100px] sm:items-center"><div><p className="text-sm font-medium text-white">{artist.nombreArtistico}</p><p className="text-xs text-[#525252]">{artist.username}</p></div><span className="truncate text-sm text-[#A3A3A3]">{artist.email}</span><span className="text-sm text-[#A3A3A3]">{artist.pais} · {artist.generoPrincipal}</span><a href={artist.enlacePrincipal} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[#F5C518]"><ExternalLink size={12}/>Perfil</a></div>)}</div>}
    </section>
  </div>;
}