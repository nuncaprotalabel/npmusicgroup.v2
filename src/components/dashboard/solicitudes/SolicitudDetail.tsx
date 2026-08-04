"use client";

/**
 * SolicitudDetail — panel deslizante con el detalle completo de una solicitud.
 * Incluye acciones de Aprobar / Rechazar y disparador del ConfirmDialog.
 */
import { useEffect } from "react";
import {
  X, ExternalLink, Mail, Globe, Music, MessageSquare,
  Instagram, Video, CheckCircle, XCircle, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "./StatusBadge";
import type { Application } from "@/types/application";

interface SolicitudDetailProps {
  application: Application;
  onClose:    () => void;
  onApprove:  (id: string) => void;
  onReject:   (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Field({ label, value, icon: Icon }: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
        {label}
      </p>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={13} style={{ color: "#555555" }} />}
        <p className="text-sm text-white break-words">{value}</p>
      </div>
    </div>
  );
}

export function SolicitudDetail({ application, onClose, onApprove, onReject }: SolicitudDetailProps) {
  const isPending = application.status === "PENDIENTE";

  // Cerrar con Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-md shadow-2xl"
        style={{ background: "#060606", borderLeft: "1px solid #1A1A1A" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 h-14 shrink-0 border-b"
          style={{ borderColor: "#141414" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <p className="text-[0.9375rem] font-semibold text-white truncate">
              {application.artisticName}
            </p>
            <StatusBadge status={application.status} />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "#555555" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={e => (e.currentTarget.style.color = "#555555")}
            aria-label="Cerrar detalle"
          >
            <X size={16} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Identidad */}
          <section
            className="rounded-xl border p-4 space-y-4"
            style={{ background: "#0A0A0A", borderColor: "#1A1A1A" }}
          >
            <p className="text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: "#333333" }}>
              Información del artista
            </p>
            <Field label="Nombre artístico" value={application.artisticName} />
            <Field label="Correo electrónico" value={application.email} icon={Mail} />
            <Field label="País" value={application.country} icon={Globe} />
            <Field label="Género musical" value={application.genre} icon={Music} />
          </section>

          {/* Enlace principal */}
          <section
            className="rounded-xl border p-4 space-y-4"
            style={{ background: "#0A0A0A", borderColor: "#1A1A1A" }}
          >
            <p className="text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: "#333333" }}>
              Presencia digital
            </p>
            <div className="space-y-1">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                Enlace principal
              </p>
              <a
                href={application.mainLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: "#F5C518" }}
              >
                <ExternalLink size={13} />
                {application.mainLink.length > 50
                  ? application.mainLink.slice(0, 50) + "…"
                  : application.mainLink}
              </a>
            </div>

            {application.instagram && (
              <div className="space-y-1">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                  Instagram
                </p>
                <a
                  href={application.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
                  style={{ color: "#A3A3A3" }}
                >
                  <Instagram size={13} />
                  {application.instagram}
                </a>
              </div>
            )}

            {application.tiktok && (
              <div className="space-y-1">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                  TikTok
                </p>
                <a
                  href={application.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80"
                  style={{ color: "#A3A3A3" }}
                >
                  <Video size={13} />
                  {application.tiktok}
                </a>
              </div>
            )}
          </section>

          {/* Mensaje */}
          {application.message && (
            <section
              className="rounded-xl border p-4 space-y-3"
              style={{ background: "#0A0A0A", borderColor: "#1A1A1A" }}
            >
              <p className="text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: "#333333" }}>
                Mensaje de presentación
              </p>
              <div className="flex gap-2">
                <MessageSquare size={13} className="shrink-0 mt-0.5" style={{ color: "#555555" }} />
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#A3A3A3" }}>
                  {application.message}
                </p>
              </div>
            </section>
          )}

          {/* Metadatos */}
          <section
            className="rounded-xl border p-4 space-y-3"
            style={{ background: "#0A0A0A", borderColor: "#1A1A1A" }}
          >
            <p className="text-[0.75rem] font-semibold uppercase tracking-wider" style={{ color: "#333333" }}>
              Metadatos
            </p>
            <Field label="Fecha de envío" value={formatDate(application.createdAt)} icon={Clock} />
            <Field label="ID de solicitud" value={<span className="font-mono text-xs">{application.id}</span>} />
            {application.ipAddress && (
              <Field label="IP de origen" value={<span className="font-mono text-xs">{application.ipAddress}</span>} />
            )}
          </section>
        </div>

        {/* Acciones — solo si está PENDIENTE */}
        {isPending && (
          <div
            className="px-5 py-4 border-t shrink-0 flex gap-3"
            style={{ borderColor: "#141414" }}
          >
            <Button
              variant="danger"
              size="sm"
              fullWidth
              icon={<XCircle size={14} />}
              onClick={() => onReject(application.id)}
            >
              Rechazar
            </Button>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              icon={<CheckCircle size={14} />}
              onClick={() => onApprove(application.id)}
            >
              Aprobar
            </Button>
          </div>
        )}

        {/* Mensaje cuando ya no está pendiente */}
        {!isPending && (
          <div
            className="px-5 py-4 border-t shrink-0"
            style={{ borderColor: "#141414" }}
          >
            <p className="text-xs text-center" style={{ color: "#404040" }}>
              Esta solicitud ya fue {application.status === "APROBADA" ? "aprobada" : "rechazada"}.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
