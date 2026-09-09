"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/useTranslation";
import { translations } from "@/i18n/translations";
import {
  createInvitationForSolicitud,
  getSolicitudes,
  updateSolicitudStatus,
} from "@/services/solicitudService";
import type { InvitationLinkResult } from "@/types/invitations";
import type { Solicitud, SolicitudEstado } from "@/types/solicitud";

type RequestsCopy = typeof translations.es.adminRequests | typeof translations.en.adminRequests;

const STATUS_CONFIG: Record<SolicitudEstado, {
  color: string;
  background: string;
  border: string;
}> = {
  PENDIENTE: { color: "#F5C518", background: "rgba(245,197,24,0.1)", border: "rgba(245,197,24,0.2)" },
  REVISANDO: { color: "#A3A3A3", background: "rgba(163,163,163,0.08)", border: "#2A2A2A" },
  APROBADA: { color: "#34D399", background: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  RECHAZADA: { color: "#EF4444", background: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
};

export function SolicitudesAdminView({ canManage }: { canManage: boolean }) {
  const { t, language } = useTranslation();
  const copy = t.adminRequests;
  const [solicitudes, setSolicitudes] = useState<Solicitud[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [invitationLink, setInvitationLink] = useState<InvitationLinkResult | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const result = await getSolicitudes();
    if (result.error) setError(result.error || copy.errors.load);
    else setSolicitudes(result.solicitudes ?? []);
  }, [copy.errors.load]);

  useEffect(() => {
    void load();
  }, [load]);

  async function processSolicitud(
    solicitud: Solicitud,
    estado: Extract<SolicitudEstado, "REVISANDO" | "APROBADA" | "RECHAZADA">,
  ) {
    const confirmation = estado === "APROBADA"
      ? copy.confirmApprove(solicitud.nombreArtistico)
      : estado === "RECHAZADA"
        ? copy.confirmReject(solicitud.nombreArtistico)
        : copy.confirmReview(solicitud.nombreArtistico);
    if (!window.confirm(confirmation)) return;

    setBusyId(solicitud.id);
    const result = await updateSolicitudStatus(solicitud.id, estado);
    setBusyId(null);
    if (result.error) {
      setError(result.error || copy.errors.update);
      return;
    }
    setSelected(null);
    await load();
  }

  async function createInvitation(solicitud: Solicitud) {
    if (!window.confirm(copy.confirmInvitation(solicitud.nombreArtistico))) return;
    setBusyId(solicitud.id);
    const result = await createInvitationForSolicitud(solicitud.id);
    setBusyId(null);
    if (result.error) {
      setError(result.error || copy.errors.invitation);
      return;
    }
    setInvitationLink(result);
    setCopied(false);
  }

  async function copyInvitationLink() {
    if (!invitationLink?.invitationUrl) return;
    await navigator.clipboard.writeText(
      new URL(invitationLink.invitationUrl, window.location.origin).toString(),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">
           {copy.eyebrow}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-white">{copy.title}</h1>
        <p className="mt-1 text-sm text-[#737373]">
          {copy.subtitle}
        </p>
      </header>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-[#EF4444]" role="alert">
          <AlertCircle className="mt-0.5 shrink-0" size={15} />
          <span className="flex-1">{error}</span>
          <button type="button" className="font-medium underline underline-offset-2" onClick={() => void load()}>
             {copy.retry}
          </button>
        </div>
      )}

       <section className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]" aria-label={copy.title}>
        <div className="border-b border-[#141414] px-5 py-4">
          <p className="text-sm font-semibold text-white">
             {solicitudes === null ? copy.loading : copy.count(solicitudes.length)}
          </p>
        </div>

        {solicitudes === null ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-[#525252]">
            <Loader2 className="mb-3 animate-spin" size={22} />
             {copy.loading}
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <Clock3 className="mb-3 text-[#333333]" size={28} strokeWidth={1.5} />
             <p className="text-sm font-medium text-white">{copy.emptyTitle}</p>
             <p className="mt-1 text-sm text-[#525252]">{copy.emptyDescription}</p>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.25fr_1fr_1fr_1.2fr_120px_100px] gap-4 border-b border-[#141414] px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040] md:grid">
               <span>{copy.columns.artistEmail}</span>
               <span>{copy.columns.country}</span>
               <span>{copy.columns.genre}</span>
               <span>{copy.columns.link}</span>
               <span>{copy.columns.date}</span>
               <span>{copy.columns.status}</span>
            </div>
            <div className="divide-y divide-[#141414]">
              {solicitudes.map((solicitud) => (
                <SolicitudRow
                  key={solicitud.id}
                  solicitud={solicitud}
                  busy={busyId === solicitud.id}
                  onOpen={() => setSelected(solicitud)}
                   statusLabels={copy.status}
                   language={language}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {selected && (
        <SolicitudDetail
          solicitud={selected}
          canManage={canManage}
          busy={busyId === selected.id}
          invitationLink={
            invitationLink?.invitation?.solicitudId === selected.id ? invitationLink : null
          }
          copied={copied}
          onClose={() => setSelected(null)}
          onProcess={(estado) => void processSolicitud(selected, estado)}
          onCreateInvitation={() => void createInvitation(selected)}
          onCopyInvitationLink={() => void copyInvitationLink()}
           copy={copy}
           language={language}
        />
      )}
    </div>
  );
}

function SolicitudRow({
  solicitud,
  busy,
  onOpen,
  statusLabels,
  language,
}: {
  solicitud: Solicitud;
  busy: boolean;
  onOpen: () => void;
  statusLabels: RequestsCopy["status"];
  language: "es" | "en";
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full px-5 py-4 text-left transition-colors hover:bg-[#0D0D0D]"
      disabled={busy}
    >
      <div className="flex items-start justify-between gap-3 md:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{solicitud.nombreArtistico}</p>
          <p className="mt-1 truncate text-xs text-[#737373]">{solicitud.email}</p>
          <p className="mt-1 text-xs text-[#525252]">
            {solicitud.pais} · {solicitud.generoPrincipal}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
           <StatusBadge status={solicitud.estado} label={statusLabels[solicitud.estado]} />
           <span className="text-[0.6875rem] text-[#404040]">{formatDate(solicitud.createdAt, language)}</span>
        </div>
      </div>

      <div className="hidden grid-cols-[1.25fr_1fr_1fr_1.2fr_120px_100px] items-center gap-4 md:grid">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{solicitud.nombreArtistico}</p>
          <p className="mt-1 truncate text-xs text-[#525252]">{solicitud.email}</p>
        </div>
        <span className="truncate text-sm text-[#A3A3A3]">{solicitud.pais}</span>
        <span className="truncate text-sm text-[#A3A3A3]">{solicitud.generoPrincipal}</span>
        <span className="flex min-w-0 items-center gap-1 truncate text-xs text-[#737373]">
          <ExternalLink size={12} className="shrink-0" />
          <span className="truncate">{solicitud.enlacePrincipal}</span>
        </span>
         <span className="text-xs text-[#525252]">{formatDate(solicitud.createdAt, language)}</span>
         <StatusBadge status={solicitud.estado} label={statusLabels[solicitud.estado]} />
      </div>
      <ChevronRight size={15} className="absolute right-3 hidden text-[#333333] group-hover:text-[#737373] md:block" />
    </button>
  );
}

function SolicitudDetail({
  solicitud,
  canManage,
  busy,
  invitationLink,
  copied,
  onClose,
  onProcess,
  onCreateInvitation,
  onCopyInvitationLink,
  copy,
  language,
}: {
  solicitud: Solicitud;
  canManage: boolean;
  busy: boolean;
  invitationLink: InvitationLinkResult | null;
  copied: boolean;
  onClose: () => void;
  onProcess: (estado: Extract<SolicitudEstado, "REVISANDO" | "APROBADA" | "RECHAZADA">) => void;
  onCreateInvitation: () => void;
  onCopyInvitationLink: () => void;
  copy: RequestsCopy;
  language: "es" | "en";
}) {
  const canProcess = solicitud.estado === "PENDIENTE" || solicitud.estado === "REVISANDO";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
       <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label={copy.close} />
      <article className="relative max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-t-2xl border border-[#1E1E1E] bg-[#0A0A0A] shadow-2xl sm:rounded-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#141414] bg-[#0A0A0A] px-6 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <h2 className="truncate text-base font-semibold text-white">{solicitud.nombreArtistico}</h2>
             <StatusBadge status={solicitud.estado} label={copy.status[solicitud.estado]} />
          </div>
           <button type="button" onClick={onClose} className="text-[#525252] transition-colors hover:text-white" aria-label={copy.close}>
            <X size={18} />
          </button>
        </header>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
             <Info label={copy.fields.artistName} value={solicitud.nombreArtistico} />
             <Info label={copy.fields.email} value={solicitud.email} />
             <Info label={copy.fields.country} value={solicitud.pais} />
             <Info label={copy.fields.genre} value={solicitud.generoPrincipal} />
             <Info label={copy.fields.requestedAt} value={formatDateTime(solicitud.createdAt, language)} />
            <div>
               <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">{copy.fields.link}</p>
              <Link
                href={solicitud.enlacePrincipal}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 break-all text-sm text-[#F5C518] hover:underline"
              >
                {solicitud.enlacePrincipal}
                <ArrowUpRight size={13} className="shrink-0" />
              </Link>
            </div>
          </div>

          {(solicitud.instagram || solicitud.tiktok) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               {solicitud.instagram && <Info label={copy.fields.instagram} value={solicitud.instagram} />}
               {solicitud.tiktok && <Info label={copy.fields.tiktok} value={solicitud.tiktok} />}
            </div>
          )}

          {canManage && solicitud.estado === "APROBADA" && (
            <div className="border-t border-[#141414] pt-5">
              <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">
                 {copy.incorporation}
              </p>
              {invitationLink?.invitationUrl ? (
                <div className="rounded-lg border border-[#F5C518]/25 bg-[#F5C518]/[0.06] p-3">
                  <p className="mb-2 flex items-center gap-2 text-xs font-medium text-white">
                    <Link2 size={14} className="text-[#F5C518]" />
                     {copy.invitationGenerated}
                  </p>
                  <code className="block break-all rounded border border-[#2A2A2A] bg-[#0A0A0A] px-2.5 py-2 text-xs text-[#F5C518]">
                    {new URL(
                      invitationLink.invitationUrl,
                      typeof window === "undefined" ? "http://localhost" : window.location.origin,
                    ).toString()}
                  </code>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="mt-2"
                    icon={copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    onClick={onCopyInvitationLink}
                  >
                     {copied ? copy.copied : copy.copyLink}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  disabled={busy}
                  loading={busy}
                  icon={!busy ? <Link2 size={15} /> : undefined}
                  onClick={onCreateInvitation}
                >
                   {copy.createInvitation}
                </Button>
              )}
            </div>
          )}

          <div>
             <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">{copy.fields.presentation}</p>
            <div className="whitespace-pre-wrap rounded-lg border border-[#1E1E1E] bg-[#141414] p-4 text-sm leading-relaxed text-[#A3A3A3]">
               {solicitud.mensaje || copy.noMessage}
            </div>
          </div>

          {canManage && canProcess && (
            <div className="flex flex-col gap-2 border-t border-[#141414] pt-5 sm:flex-row">
              {solicitud.estado === "PENDIENTE" && (
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  disabled={busy}
                  icon={<Clock3 size={15} />}
                  onClick={() => onProcess("REVISANDO")}
                >
                   {copy.review}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                fullWidth
                disabled={busy}
                icon={<XCircle size={15} />}
                onClick={() => onProcess("RECHAZADA")}
              >
                 {copy.reject}
              </Button>
              <Button
                type="button"
                variant="primary"
                fullWidth
                loading={busy}
                icon={!busy ? <CheckCircle2 size={15} /> : undefined}
                onClick={() => onProcess("APROBADA")}
              >
                 {copy.approve}
              </Button>
            </div>
          )}

          {canManage && !canProcess && (
            <p className="border-t border-[#141414] pt-5 text-xs text-[#525252]">
               {copy.processed}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}

function StatusBadge({ status, label }: { status: SolicitudEstado; label: string }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[0.6875rem] font-semibold"
      style={{ color: config.color, background: config.background, borderColor: config.border }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
       {label}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">{label}</p>
      <p className="break-words text-sm text-[#A3A3A3]">{value}</p>
    </div>
  );
}

function formatDate(value: string, language: "es" | "en"): string {
  return new Date(value).toLocaleDateString(language, { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value: string, language: "es" | "en"): string {
  return new Date(value).toLocaleString(language, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}