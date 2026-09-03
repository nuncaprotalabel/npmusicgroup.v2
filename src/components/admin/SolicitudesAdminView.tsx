"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSolicitudes, updateSolicitudStatus } from "@/services/solicitudService";
import type { Solicitud, SolicitudEstado } from "@/types/solicitud";

const STATUS_CONFIG: Record<SolicitudEstado, {
  label: string;
  color: string;
  background: string;
  border: string;
}> = {
  PENDIENTE: { label: "Pendiente", color: "#F5C518", background: "rgba(245,197,24,0.1)", border: "rgba(245,197,24,0.2)" },
  REVISANDO: { label: "En revisión", color: "#A3A3A3", background: "rgba(163,163,163,0.08)", border: "#2A2A2A" },
  APROBADA: { label: "Aprobada", color: "#34D399", background: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  RECHAZADA: { label: "Rechazada", color: "#EF4444", background: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
};

export function SolicitudesAdminView({ canManage }: { canManage: boolean }) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Solicitud | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const result = await getSolicitudes();
    if (result.error) setError(result.error);
    else setSolicitudes(result.solicitudes ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function processSolicitud(
    solicitud: Solicitud,
    estado: Extract<SolicitudEstado, "APROBADA" | "RECHAZADA">,
  ) {
    const action = estado === "APROBADA" ? "aprobar" : "rechazar";
    if (!window.confirm(`¿Confirmas ${action} la solicitud de ${solicitud.nombreArtistico}?`)) return;

    setBusyId(solicitud.id);
    const result = await updateSolicitudStatus(solicitud.id, estado);
    setBusyId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSelected(null);
    await load();
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">
          Administración
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-white">Solicitudes</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Revisa las solicitudes reales recibidas desde el formulario de aplicación.
        </p>
      </header>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-[#EF4444]" role="alert">
          <AlertCircle className="mt-0.5 shrink-0" size={15} />
          <span className="flex-1">{error}</span>
          <button type="button" className="font-medium underline underline-offset-2" onClick={() => void load()}>
            Reintentar
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]" aria-label="Solicitudes recibidas">
        <div className="border-b border-[#141414] px-5 py-4">
          <p className="text-sm font-semibold text-white">
            {solicitudes === null
              ? "Cargando solicitudes…"
              : `${solicitudes.length} solicitud${solicitudes.length === 1 ? "" : "es"}`}
          </p>
        </div>

        {solicitudes === null ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-[#525252]">
            <Loader2 className="mb-3 animate-spin" size={22} />
            Consultando PostgreSQL…
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <Clock3 className="mb-3 text-[#333333]" size={28} strokeWidth={1.5} />
            <p className="text-sm font-medium text-white">No hay solicitudes recibidas</p>
            <p className="mt-1 text-sm text-[#525252]">Las nuevas aplicaciones aparecerán aquí.</p>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.25fr_1fr_1fr_1.2fr_120px_100px] gap-4 border-b border-[#141414] px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040] md:grid">
              <span>Artista / Email</span>
              <span>País</span>
              <span>Género</span>
              <span>Link principal</span>
              <span>Fecha</span>
              <span>Estado</span>
            </div>
            <div className="divide-y divide-[#141414]">
              {solicitudes.map((solicitud) => (
                <SolicitudRow
                  key={solicitud.id}
                  solicitud={solicitud}
                  busy={busyId === solicitud.id}
                  onOpen={() => setSelected(solicitud)}
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
          onClose={() => setSelected(null)}
          onProcess={(estado) => void processSolicitud(selected, estado)}
        />
      )}
    </div>
  );
}

function SolicitudRow({
  solicitud,
  busy,
  onOpen,
}: {
  solicitud: Solicitud;
  busy: boolean;
  onOpen: () => void;
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
          <StatusBadge status={solicitud.estado} />
          <span className="text-[0.6875rem] text-[#404040]">{formatDate(solicitud.createdAt)}</span>
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
        <span className="text-xs text-[#525252]">{formatDate(solicitud.createdAt)}</span>
        <StatusBadge status={solicitud.estado} />
      </div>
      <ChevronRight size={15} className="absolute right-3 hidden text-[#333333] group-hover:text-[#737373] md:block" />
    </button>
  );
}

function SolicitudDetail({
  solicitud,
  canManage,
  busy,
  onClose,
  onProcess,
}: {
  solicitud: Solicitud;
  canManage: boolean;
  busy: boolean;
  onClose: () => void;
  onProcess: (estado: Extract<SolicitudEstado, "APROBADA" | "RECHAZADA">) => void;
}) {
  const isPending = solicitud.estado === "PENDIENTE";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Cerrar detalle" />
      <article className="relative max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-t-2xl border border-[#1E1E1E] bg-[#0A0A0A] shadow-2xl sm:rounded-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#141414] bg-[#0A0A0A] px-6 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <h2 className="truncate text-base font-semibold text-white">{solicitud.nombreArtistico}</h2>
            <StatusBadge status={solicitud.estado} />
          </div>
          <button type="button" onClick={onClose} className="text-[#525252] transition-colors hover:text-white" aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info label="Nombre artístico" value={solicitud.nombreArtistico} />
            <Info label="Email" value={solicitud.email} />
            <Info label="País" value={solicitud.pais} />
            <Info label="Género principal" value={solicitud.generoPrincipal} />
            <Info label="Fecha de solicitud" value={formatDateTime(solicitud.createdAt)} />
            <div>
              <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">Link principal</p>
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
              {solicitud.instagram && <Info label="Instagram" value={solicitud.instagram} />}
              {solicitud.tiktok && <Info label="TikTok" value={solicitud.tiktok} />}
            </div>
          )}

          <div>
            <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">Mensaje de presentación</p>
            <div className="whitespace-pre-wrap rounded-lg border border-[#1E1E1E] bg-[#141414] p-4 text-sm leading-relaxed text-[#A3A3A3]">
              {solicitud.mensaje || "Sin mensaje de presentación."}
            </div>
          </div>

          {canManage && isPending && (
            <div className="flex flex-col gap-2 border-t border-[#141414] pt-5 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                fullWidth
                disabled={busy}
                icon={<XCircle size={15} />}
                onClick={() => onProcess("RECHAZADA")}
              >
                Rechazar
              </Button>
              <Button
                type="button"
                variant="primary"
                fullWidth
                loading={busy}
                icon={!busy ? <CheckCircle2 size={15} /> : undefined}
                onClick={() => onProcess("APROBADA")}
              >
                Aprobar
              </Button>
            </div>
          )}

          {canManage && !isPending && (
            <p className="border-t border-[#141414] pt-5 text-xs text-[#525252]">
              Esta solicitud ya fue procesada y no admite nuevas transiciones.
            </p>
          )}
        </div>
      </article>
    </div>
  );
}

function StatusBadge({ status }: { status: SolicitudEstado }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[0.6875rem] font-semibold"
      style={{ color: config.color, background: config.background, borderColor: config.border }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
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

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}