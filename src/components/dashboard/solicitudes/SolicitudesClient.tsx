"use client";

/**
 * SolicitudesClient — módulo completo de gestión de solicitudes.
 * Incluye: búsqueda, filtros, tabla, detalle y acciones de aprobación/rechazo.
 */
import { useState, useEffect, useCallback } from "react";
import { Search, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { StatusBadge } from "./StatusBadge";
import { SolicitudDetail } from "./SolicitudDetail";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  getApplications,
  updateApplicationStatus,
} from "@/services/applicationsAdminService";
import type { Application, ApplicationStatus } from "@/types/application";

// ─── Tipos locales ─────────────────────────────────────────────────────────────

type FilterTab = "TODOS" | ApplicationStatus;

interface ConfirmState {
  action:        "APROBADA" | "RECHAZADA";
  applicationId: string;
  artisticName:  string;
}

// ─── Constantes ────────────────────────────────────────────────────────────────

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: "TODOS",     label: "Todos"     },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "APROBADA",  label: "Aprobada"  },
  { value: "RECHAZADA", label: "Rechazada" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function SolicitudesClient() {
  // Datos
  const [applications, setApplications] = useState<Application[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  // Filtros
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("TODOS");

  // UI
  const [selected,       setSelected]       = useState<Application | null>(null);
  const [confirm,        setConfirm]        = useState<ConfirmState | null>(null);
  const [actionLoading,  setActionLoading]  = useState(false);
  const [actionError,    setActionError]    = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getApplications({
      search: search.trim() || undefined,
      status: filter === "TODOS" ? undefined : filter,
      limit:  100,
    });

    if ("error" in result) {
      setError(result.error);
    } else {
      setApplications(result.applications);
      setTotal(result.total);
    }
    setLoading(false);
  }, [search, filter]);

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(fetchApplications, 300);
    return () => clearTimeout(t);
  }, [fetchApplications]);

  // ── Acciones ───────────────────────────────────────────────────────────────

  function handleOpenApprove(id: string, artisticName: string) {
    setActionError(null);
    setConfirm({ action: "APROBADA", applicationId: id, artisticName });
  }

  function handleOpenReject(id: string, artisticName: string) {
    setActionError(null);
    setConfirm({ action: "RECHAZADA", applicationId: id, artisticName });
  }

  async function handleConfirmAction() {
    if (!confirm) return;
    setActionLoading(true);
    setActionError(null);

    const result = await updateApplicationStatus(confirm.applicationId, confirm.action);

    setActionLoading(false);

    if ("error" in result && result.error) {
      setActionError(result.error);
      setConfirm(null);
      return;
    }

    // Actualizar lista y detalle localmente
    setApplications(prev =>
      prev.map(a =>
        a.id === confirm.applicationId ? { ...a, status: confirm.action } : a
      )
    );
    if (selected?.id === confirm.applicationId) {
      setSelected(prev => prev ? { ...prev, status: confirm.action } : null);
    }
    setConfirm(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Encabezado de página */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold text-white leading-tight">
            Solicitudes
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#737373" }}>
            Administra las solicitudes de artistas que desean incorporarse a NP Music Group.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<RefreshCw size={13} />}
          onClick={fetchApplications}
          disabled={loading}
          className="shrink-0"
        >
          Actualizar
        </Button>
      </div>

      {/* Búsqueda + filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscador */}
        <div className="relative flex-1 min-w-0">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#404040" }}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o país…"
            className="w-full h-9 pl-8 pr-3 text-sm rounded-lg outline-none transition-colors"
            style={{
              background:   "#0D0D0D",
              border:       "1px solid #1E1E1E",
              color:        "#FFFFFF",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "#333333")}
            onBlur={e  => (e.currentTarget.style.borderColor = "#1E1E1E")}
          />
        </div>

        {/* Tabs de filtro */}
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-lg shrink-0"
          style={{ background: "#0D0D0D", border: "1px solid #1A1A1A" }}
        >
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className="px-3 h-8 text-xs font-medium rounded-md transition-all duration-150"
              style={
                filter === tab.value
                  ? { background: "#1A1A1A", color: "#FFFFFF" }
                  : { color: "#555555" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error de acción */}
      {actionError && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)", color: "#EF4444" }}
        >
          {actionError}
        </div>
      )}

      {/* Contenido principal */}
      {loading ? (
        <LoadingState message="Cargando solicitudes…" />
      ) : error ? (
        <div
          className="rounded-xl border px-5 py-8 text-center"
          style={{ borderColor: "#1E1E1E", background: "#0A0A0A" }}
        >
          <p className="text-sm font-medium text-white mb-1">Error al cargar</p>
          <p className="text-xs mb-4" style={{ color: "#737373" }}>{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchApplications}>
            Reintentar
          </Button>
        </div>
      ) : applications.length === 0 ? (
        <div
          className="rounded-xl border"
          style={{ borderColor: "#1A1A1A", background: "#0A0A0A" }}
        >
          <EmptyState
            icon={Inbox}
            title={search || filter !== "TODOS" ? "Sin resultados" : "Sin solicitudes"}
            description={
              search || filter !== "TODOS"
                ? "No se encontraron solicitudes con los filtros aplicados."
                : "Aún no hay solicitudes registradas. Aparecerán aquí cuando los artistas completen el formulario de aplicación."
            }
            size="md"
          />
        </div>
      ) : (
        <>
          {/* Contador */}
          <p className="text-xs" style={{ color: "#404040" }}>
            {total} solicitud{total !== 1 ? "es" : ""}
            {(search || filter !== "TODOS") && " · filtradas"}
          </p>

          {/* Tabla — desktop */}
          <div
            className="hidden md:block rounded-xl border overflow-hidden"
            style={{ borderColor: "#1A1A1A" }}
          >
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: "#080808", borderBottom: "1px solid #141414" }}>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                    Nombre artístico
                  </th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                    Correo
                  </th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                    País
                  </th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                    Género
                  </th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                    Estado
                  </th>
                  <th className="text-right px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: "#404040" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <tr
                    key={app.id}
                    onClick={() => setSelected(app)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: i < applications.length - 1 ? "1px solid #0F0F0F" : "none",
                      background: "transparent",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#0A0A0A")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{app.artisticName}</p>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#A3A3A3" }}>
                      {app.email}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#A3A3A3" }}>
                      {app.country}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#A3A3A3" }}>
                      {app.genre}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#737373" }}>
                      {formatDateShort(app.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      {app.status === "PENDIENTE" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleOpenReject(app.id, app.artisticName)}
                          >
                            Rechazar
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenApprove(app.id, app.artisticName)}
                          >
                            Aprobar
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelected(app)}
                        >
                          Ver detalle
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — mobile */}
          <div className="md:hidden space-y-2">
            {applications.map(app => (
              <div
                key={app.id}
                onClick={() => setSelected(app)}
                className="rounded-xl border p-4 cursor-pointer transition-colors active:opacity-80"
                style={{ background: "#0A0A0A", borderColor: "#1A1A1A" }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-[0.9375rem] truncate">
                      {app.artisticName}
                    </p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#737373" }}>
                      {app.email}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "#555555" }}>
                  <span>{app.country}</span>
                  <span>{app.genre}</span>
                  <span>{formatDateShort(app.createdAt)}</span>
                </div>

                {app.status === "PENDIENTE" && (
                  <div
                    className="flex gap-2 mt-3 pt-3 border-t"
                    style={{ borderColor: "#141414" }}
                    onClick={e => e.stopPropagation()}
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      onClick={() => handleOpenReject(app.id, app.artisticName)}
                    >
                      Rechazar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleOpenApprove(app.id, app.artisticName)}
                    >
                      Aprobar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Panel de detalle */}
      {selected && (
        <SolicitudDetail
          application={selected}
          onClose={() => setSelected(null)}
          onApprove={(id) => handleOpenApprove(id, selected.artisticName)}
          onReject={(id)  => handleOpenReject(id, selected.artisticName)}
        />
      )}

      {/* Diálogo de confirmación */}
      {confirm && (
        <ConfirmDialog
          action={confirm.action}
          artisticName={confirm.artisticName}
          loading={actionLoading}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
