"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  RefreshCw,
  ShieldOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getInvitaciones,
  regenerateInvitation,
  revokeInvitation,
} from "@/services/invitacionesService";
import type { Invitation, InvitationStatus } from "@/types/invitations";

const STATUS_CONFIG: Record<InvitationStatus, {
  label: string;
  color: string;
  background: string;
  border: string;
}> = {
  PENDIENTE: { label: "Pendiente", color: "#F5C518", background: "rgba(245,197,24,0.1)", border: "rgba(245,197,24,0.2)" },
  UTILIZADA: { label: "Utilizada", color: "#34D399", background: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  EXPIRADA: { label: "Expirada", color: "#A3A3A3", background: "rgba(163,163,163,0.08)", border: "#2A2A2A" },
  REVOCADA: { label: "Revocada", color: "#EF4444", background: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
};

export function InvitacionesAdminView({ canManage }: { canManage: boolean }) {
  const [invitaciones, setInvitaciones] = useState<Invitation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [link, setLink] = useState<{ url: string; expiresAt: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const result = await getInvitaciones();
    if (result.error) setError(result.error);
    else setInvitaciones(result.invitaciones ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleRevoke(invitation: Invitation) {
    if (!window.confirm(`¿Revocar la invitación de ${invitation.nombreArtistico}?`)) return;
    setBusyId(invitation.id);
    const result = await revokeInvitation(invitation.id);
    setBusyId(null);
    if (result.error) setError(result.error);
    else await load();
  }

  async function handleRegenerate(invitation: Invitation) {
    if (!window.confirm(`¿Generar un nuevo enlace para ${invitation.nombreArtistico}?`)) return;
    setBusyId(invitation.id);
    const result = await regenerateInvitation(invitation.id);
    setBusyId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.invitationUrl && result.expiresAt) {
      setLink({ url: result.invitationUrl, expiresAt: result.expiresAt });
    }
    await load();
  }

  async function copyLink() {
    if (!link) return;
    await navigator.clipboard.writeText(new URL(link.url, window.location.origin).toString());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">
          Administración
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-white">Invitaciones</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Enlaces seguros para solicitudes aprobadas. No se envían emails desde este módulo.
        </p>
      </header>

      {link && (
        <section className="rounded-xl border border-[#F5C518]/25 bg-[#F5C518]/[0.06] p-5" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Link2 size={16} className="text-[#F5C518]" />
                Enlace generado
              </p>
              <p className="mt-1 text-xs text-[#A3A3A3]">
                Cópialo ahora. El token solo vuelve a estar disponible si regeneras otro enlace.
              </p>
            </div>
            <button type="button" onClick={() => setLink(null)} className="text-[#525252] hover:text-white" aria-label="Cerrar enlace">
              <X size={17} />
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <code className="min-w-0 flex-1 break-all rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 text-xs text-[#F5C518]">
              {new URL(link.url, typeof window === "undefined" ? "http://localhost" : window.location.origin).toString()}
            </code>
            <Button type="button" variant="primary" size="sm" icon={copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} onClick={() => void copyLink()}>
              {copied ? "Copiado" : "Copiar enlace"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-[#737373]">Vence el {formatDateTime(link.expiresAt)}.</p>
        </section>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-[#EF4444]" role="alert">
          <AlertCircle className="mt-0.5 shrink-0" size={15} />
          <span className="flex-1">{error}</span>
          <button type="button" className="font-medium underline underline-offset-2" onClick={() => void load()}>
            Reintentar
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]" aria-label="Invitaciones generadas">
        <div className="border-b border-[#141414] px-5 py-4">
          <p className="text-sm font-semibold text-white">
            {invitaciones === null
              ? "Cargando invitaciones…"
              : `${invitaciones.length} invitación${invitaciones.length === 1 ? "" : "es"}`}
          </p>
        </div>

        {invitaciones === null ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-[#525252]">
            <Loader2 className="mb-3 animate-spin" size={22} />
            Consultando PostgreSQL…
          </div>
        ) : invitaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <Link2 className="mb-3 text-[#333333]" size={28} strokeWidth={1.5} />
            <p className="text-sm font-medium text-white">No hay invitaciones generadas</p>
            <p className="mt-1 text-sm text-[#525252]">Genera una desde el detalle de una solicitud aprobada.</p>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.3fr_1.15fr_1fr_130px_120px_170px] gap-4 border-b border-[#141414] px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040] md:grid">
              <span>Solicitud</span>
              <span>Email</span>
              <span>Estado</span>
              <span>Creada</span>
              <span>Vence</span>
              <span>Creada por / Acciones</span>
            </div>
            <div className="divide-y divide-[#141414]">
              {invitaciones.map((invitation) => (
                <InvitationRow
                  key={invitation.id}
                  invitation={invitation}
                  canManage={canManage}
                  busy={busyId === invitation.id}
                  onRevoke={() => void handleRevoke(invitation)}
                  onRegenerate={() => void handleRegenerate(invitation)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function InvitationRow({
  invitation,
  canManage,
  busy,
  onRevoke,
  onRegenerate,
}: {
  invitation: Invitation;
  canManage: boolean;
  busy: boolean;
  onRevoke: () => void;
  onRegenerate: () => void;
}) {
  const expired = invitation.status === "EXPIRADA";
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3 md:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{invitation.nombreArtistico}</p>
          <p className="mt-1 truncate text-xs text-[#737373]">{invitation.email}</p>
          <p className="mt-1 text-xs text-[#525252]">Creada {formatDate(invitation.createdAt)}</p>
        </div>
        <StatusBadge status={invitation.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 md:hidden">
        {canManage && invitation.status === "PENDIENTE" && (
          <Button type="button" variant="outline" size="sm" disabled={busy} icon={<ShieldOff size={13} />} onClick={onRevoke}>
            Revocar
          </Button>
        )}
        {canManage && expired && (
          <Button type="button" variant="secondary" size="sm" disabled={busy} icon={<RefreshCw size={13} />} onClick={onRegenerate}>
            Regenerar
          </Button>
        )}
      </div>
      <div className="hidden grid-cols-[1.3fr_1.15fr_1fr_130px_120px_170px] items-center gap-4 md:grid">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{invitation.nombreArtistico}</p>
          <p className="mt-1 text-xs text-[#525252]">Solicitud aprobada</p>
        </div>
        <span className="truncate text-sm text-[#A3A3A3]">{invitation.email}</span>
        <StatusBadge status={invitation.status} />
        <span className="text-xs text-[#525252]">{formatDate(invitation.createdAt)}</span>
        <span className="text-xs text-[#525252]">{formatDate(invitation.expiresAt)}</span>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="truncate text-xs text-[#525252]">{invitation.createdBy || "Usuario eliminado"}</span>
          <div className="flex shrink-0 items-center gap-1">
            {canManage && invitation.status === "PENDIENTE" && (
              <button type="button" disabled={busy} onClick={onRevoke} className="rounded p-1.5 text-[#525252] hover:bg-white/5 hover:text-[#EF4444]" title="Revocar">
                <ShieldOff size={14} />
              </button>
            )}
            {canManage && expired && (
              <button type="button" disabled={busy} onClick={onRegenerate} className="rounded p-1.5 text-[#525252] hover:bg-white/5 hover:text-[#F5C518]" title="Regenerar">
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: InvitationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[0.6875rem] font-semibold" style={{ color: config.color, background: config.background, borderColor: config.border }}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("es", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}