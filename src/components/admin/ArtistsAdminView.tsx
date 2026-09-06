"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ExternalLink, Loader2, Music2, UserRound, Users } from "lucide-react";
import type { AdminArtistDetail, AdminArtistSummary } from "@/types/artists";
import { getAdminArtist, getAdminArtists } from "@/services/adminArtistsService";
import { useTranslation } from "@/i18n/useTranslation";
import type { Translations } from "@/i18n/translations";

type Copy = Translations["adminArtists"];

function formatDate(value: string | null, language: "es" | "en", fallback: string) {
  if (!value) return fallback;
  return new Intl.DateTimeFormat(language, { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(value));
}

function ArtistStatus({ artist, copy }: { artist: AdminArtistSummary; copy: Copy }) {
  const active = artist.status === "ACTIVO" && artist.accountActive;
  return (
    <span
      className="inline-flex rounded-full px-2 py-1 text-[0.625rem] font-semibold"
      style={{
        background: active ? "rgba(74,222,128,.1)" : "rgba(245,197,24,.1)",
        color: active ? "#86efac" : "#F5C518",
      }}
    >
      {active ? copy.active : copy.artistStatuses[artist.status]}
    </span>
  );
}

export function ArtistsAdminView() {
  const { t, language } = useTranslation();
  const copy = t.adminArtists;
  const [artists, setArtists] = useState<AdminArtistSummary[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminArtistDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const result = await getAdminArtists();
    if (result.error) setError(result.error);
    else setArtists(result.artists ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }
    let cancelled = false;
    setSelected(null);
    setDetailLoading(true);
    setError(null);
    void getAdminArtist(selectedId).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error);
      else setSelected(result.artist ?? null);
      setDetailLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const selectedSummary = useMemo(
    () => artists?.find((artist) => artist.id === selectedId) ?? null,
    [artists, selectedId],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <header>
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "#F5C518" }}>
          {copy.eyebrow}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-white">{copy.title}</h1>
        <p className="mt-1 text-sm" style={{ color: "#737373" }}>{copy.subtitle}</p>
      </header>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400" role="alert">
          <AlertCircle className="mt-0.5 shrink-0" size={15} />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={() => void load()} className="shrink-0 underline">{copy.retry}</button>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.4fr)]">
        <section className="overflow-hidden rounded-xl border" style={{ background: "#0A0A0A", borderColor: "#1E1E1E" }}>
          {artists === null ? (
            <div className="flex min-h-[300px] items-center justify-center text-sm" style={{ color: "#737373" }}>
              <Loader2 className="mr-2 animate-spin" size={17} />{copy.loading}
            </div>
          ) : artists.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <Users className="mb-3" style={{ color: "#333" }} size={30} />
              <p className="text-sm font-medium text-white">{copy.emptyTitle}</p>
              <p className="mt-1 max-w-xs text-sm leading-6" style={{ color: "#525252" }}>{copy.emptyDescription}</p>
            </div>
          ) : (
            <div className="divide-y divide-[#181818]">
              {artists.map((artist) => (
                <button
                  type="button"
                  key={artist.id}
                  onClick={() => setSelectedId(artist.id)}
                  className="grid w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-[#111] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  style={{ background: selectedId === artist.id ? "#151515" : "transparent" }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">{artist.nombreArtistico}</span>
                    <span className="mt-1 block truncate text-xs" style={{ color: "#737373" }}>{artist.email || artist.username}</span>
                    <span className="mt-2 block text-xs" style={{ color: "#525252" }}>
                      {artist.pais} · {artist.generoPrincipal} · {copy.releaseCount(artist.releaseCount)}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <ArtistStatus artist={artist} copy={copy} />
                    <span className="text-[0.6875rem]" style={{ color: "#525252" }}>
                      {formatDate(artist.createdAt, language, copy.noValue)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="min-h-[420px] rounded-xl border p-5 sm:p-6" style={{ background: "#0A0A0A", borderColor: "#1E1E1E" }}>
          {detailLoading ? (
            <div className="flex min-h-[360px] items-center justify-center text-sm" style={{ color: "#737373" }}>
              <Loader2 className="mr-2 animate-spin" size={17} />{copy.loading}
            </div>
          ) : !selected ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <UserRound size={34} strokeWidth={1.2} style={{ color: "#F5C518" }} />
              <h2 className="mt-4 text-base font-semibold text-white">{copy.selectTitle}</h2>
              <p className="mt-1 max-w-xs text-sm leading-6" style={{ color: "#737373" }}>{copy.selectDescription}</p>
            </div>
          ) : (
            <ArtistDetail artist={selected} summary={selectedSummary} copy={copy} language={language} />
          )}
        </section>
      </div>
    </div>
  );
}

function ArtistDetail({
  artist,
  summary,
  copy,
  language,
}: {
  artist: AdminArtistDetail;
  summary: AdminArtistSummary | null;
  copy: Copy;
  language: "es" | "en";
}) {
  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between" style={{ borderColor: "#1E1E1E" }}>
        <div>
          <p className="text-xs uppercase tracking-[0.16em]" style={{ color: "#525252" }}>{copy.profile}</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{artist.nombreArtistico}</h2>
          <p className="mt-1 text-sm" style={{ color: "#737373" }}>{artist.email || artist.username}</p>
        </div>
        <ArtistStatus artist={summary ?? artist} copy={copy} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoSection title={copy.profile}>
          <Info label={copy.email} value={artist.email || copy.noValue} />
          <Info label={copy.country} value={artist.pais} />
          <Info label={copy.genre} value={artist.generoPrincipal} />
          <Info label={copy.primaryLink} value={artist.enlacePrincipal} href={artist.enlacePrincipal} />
          <Info label={copy.instagram} value={artist.instagram || copy.noValue} />
          <Info label={copy.tiktok} value={artist.tiktok || copy.noValue} />
          <Info label={copy.bio} value={artist.bio || copy.noValue} wide />
        </InfoSection>
        <InfoSection title={copy.account}>
          <Info label={copy.accountName} value={artist.username} />
          <Info label={copy.status} value={artist.accountActive ? copy.active : copy.inactive} />
          <Info label={copy.role} value={copy.roles[artist.accountRole]} />
          <Info label={copy.created} value={formatDate(artist.createdAt, language, copy.noValue)} />
        </InfoSection>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{copy.catalog}</h3>
            <p className="mt-1 text-xs" style={{ color: "#525252" }}>{copy.releaseCount(artist.releases.length)}</p>
          </div>
        </div>
        {artist.releases.length === 0 ? (
          <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm" style={{ borderColor: "#2A2A2A", color: "#737373" }}>
            <Music2 className="mx-auto mb-2" size={20} style={{ color: "#F5C518" }} />
            {copy.noReleases}
          </div>
        ) : (
          <div className="space-y-2">
            {artist.releases.map((release) => (
              <div key={release.id} className="grid gap-2 rounded-lg px-3 py-3 sm:grid-cols-[minmax(0,1.4fr)_100px_100px_120px] sm:items-center" style={{ background: "#141414" }}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{release.title}</p>
                  <p className="mt-1 text-xs" style={{ color: "#737373" }}>
                    {copy.releaseTypes[release.type]} · {release.trackCount} {copy.tracks.toLowerCase()}
                  </p>
                </div>
                <span className="text-xs" style={{ color: "#A3A3A3" }}>{copy.releaseStatuses[release.status]}</span>
                <span className="text-xs" style={{ color: "#737373" }}>{formatDate(release.releaseDate, language, copy.noValue)}</span>
                <span className="text-xs sm:text-right" style={{ color: "#525252" }}>{copy.created}: {formatDate(release.createdAt, language, copy.noValue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2" style={{ borderColor: "#1E1E1E", background: "#0D0D0D" }}>
        {children}
      </div>
    </div>
  );
}

function Info({ label, value, href, wide = false }: { label: string; value: string; href?: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-[0.6875rem] uppercase tracking-wider" style={{ color: "#525252" }}>{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-sm text-[#F5C518] hover:underline">
          <span className="truncate">{value}</span><ExternalLink size={12} />
        </a>
      ) : (
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#A3A3A3]">{value}</p>
      )}
    </div>
  );
}