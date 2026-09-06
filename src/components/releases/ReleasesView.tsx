"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Archive, Check, Disc3, Loader2, Music2, Plus, Save, Trash2, X } from "lucide-react";
import type { Release, ReleaseType, Track } from "@/types/releases";

type ReleaseForm = {
  title: string;
  type: ReleaseType;
  releaseDate: string;
  coverUrl: string;
  status: "DRAFT" | "READY";
};

type TrackForm = {
  title: string;
  trackNumber: string;
};

const EMPTY_RELEASE: ReleaseForm = {
  title: "",
  type: "SINGLE",
  releaseDate: "",
  coverUrl: "",
  status: "DRAFT",
};

const EMPTY_TRACK: TrackForm = { title: "", trackNumber: "1" };

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "No se pudo completar la acción.");
  return body as T;
}

function typeLabel(type: ReleaseType) {
  return type === "SINGLE" ? "Single" : type === "EP" ? "EP" : "Álbum";
}

function statusLabel(status: Release["status"]) {
  return status === "DRAFT" ? "Borrador" : status === "READY" ? "Listo" : status === "RELEASED" ? "Publicado" : "Archivado";
}

function formatDate(value: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function ReleasesView() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [releaseForm, setReleaseForm] = useState<ReleaseForm | null>(null);
  const [trackForm, setTrackForm] = useState<TrackForm>(EMPTY_TRACK);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [editingTrack, setEditingTrack] = useState<TrackForm>(EMPTY_TRACK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(
    () => releases.find((release) => release.id === selectedId) ?? null,
    [releases, selectedId],
  );
  const isEditingExisting = Boolean(selected && releaseForm);
  const canEdit = selected?.status === "DRAFT";
  const canAddSingleTrack = selected?.type !== "SINGLE" || (selected.tracks.length === 0);

  async function refresh(preferredId?: string | null) {
    setLoading(true);
    try {
      const body = await readResponse<{ releases: Release[] }>(await fetch("/api/releases", { cache: "no-store" }));
      setReleases(body.releases);
      const nextId = preferredId && body.releases.some((release) => release.id === preferredId)
        ? preferredId
        : body.releases[0]?.id ?? null;
      setSelectedId(nextId);
      if (!nextId) setReleaseForm(null);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar tu catálogo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function startNew() {
    setSelectedId(null);
    setReleaseForm(EMPTY_RELEASE);
    setError("");
  }

  function selectRelease(release: Release) {
    setSelectedId(release.id);
    setReleaseForm({
      title: release.title,
      type: release.type,
      releaseDate: release.releaseDate ?? "",
      coverUrl: release.coverUrl ?? "",
      status: release.status === "READY" ? "READY" : "DRAFT",
    });
    setEditingTrackId(null);
    setError("");
  }

  async function saveRelease(event: FormEvent) {
    event.preventDefault();
    if (!releaseForm) return;
    setSaving(true);
    setError("");
    try {
      const isNew = !selectedId;
      const response = await fetch(isNew ? "/api/releases" : `/api/releases/${selectedId}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(releaseForm),
      });
      const body = await readResponse<{ release: Release }>(response);
      await refresh(body.release.id);
      setReleaseForm({
        title: body.release.title,
        type: body.release.type,
        releaseDate: body.release.releaseDate ?? "",
        coverUrl: body.release.coverUrl ?? "",
        status: body.release.status === "READY" ? "READY" : "DRAFT",
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el release.");
    } finally {
      setSaving(false);
    }
  }

  async function archiveRelease() {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      await readResponse(await fetch(`/api/releases/${selected.id}/archive`, { method: "POST" }));
      await refresh();
      setReleaseForm(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo archivar el release.");
    } finally {
      setSaving(false);
    }
  }

  async function addTrack(event: FormEvent) {
    event.preventDefault();
    if (!selected || !canEdit) return;
    setSaving(true);
    setError("");
    try {
      await readResponse(await fetch(`/api/releases/${selected.id}/tracks`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: trackForm.title, trackNumber: Number(trackForm.trackNumber) }),
      }));
      setTrackForm({ ...EMPTY_TRACK, trackNumber: String(selected.tracks.length + 2) });
      await refresh(selected.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo agregar el track.");
    } finally {
      setSaving(false);
    }
  }

  function beginTrackEdit(track: Track) {
    setEditingTrackId(track.id);
    setEditingTrack({ title: track.title, trackNumber: String(track.trackNumber) });
  }

  async function saveTrack(trackId: string) {
    if (!selected || !canEdit) return;
    setSaving(true);
    setError("");
    try {
      await readResponse(await fetch(`/api/releases/${selected.id}/tracks/${trackId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: editingTrack.title, trackNumber: Number(editingTrack.trackNumber) }),
      }));
      setEditingTrackId(null);
      await refresh(selected.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo actualizar el track.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteTrack(trackId: string) {
    if (!selected || !canEdit || !window.confirm("¿Eliminar este track del borrador?")) return;
    setSaving(true);
    setError("");
    try {
      await readResponse(await fetch(`/api/releases/${selected.id}/tracks/${trackId}`, { method: "DELETE" }));
      setEditingTrackId(null);
      await refresh(selected.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo eliminar el track.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-[360px] items-center justify-center text-sm" style={{ color: "#737373" }}><Loader2 className="mr-2 animate-spin" size={16} />Cargando catálogo…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "#F5C518" }}>Music operating system</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">Mi catálogo</h1>
          <p className="mt-1 text-sm" style={{ color: "#737373" }}>Organiza tus lanzamientos y tracks en un solo espacio.</p>
        </div>
        <button type="button" onClick={startNew} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110" style={{ background: "#F5C518" }}>
          <Plus size={16} /> Nuevo release
        </button>
      </header>

      {error && <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "rgba(248,113,113,.35)", background: "rgba(127,29,29,.18)", color: "#fca5a5" }}>{error}</div>}

      <div className="grid gap-5 lg:grid-cols-[minmax(240px,0.75fr)_minmax(0,1.5fr)]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#525252" }}>Lanzamientos</p>
            <span className="text-xs" style={{ color: "#525252" }}>{releases.length}</span>
          </div>
          {releases.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center" style={{ borderColor: "#2A2A2A", background: "#0A0A0A" }}>
              <Music2 className="mx-auto mb-3" size={20} style={{ color: "#F5C518" }} />
              <p className="text-sm font-medium text-white">Tu catálogo empieza aquí</p>
              <p className="mt-1 text-xs leading-5" style={{ color: "#737373" }}>Crea tu primer release para organizar tu música.</p>
            </div>
          ) : (
            releases.map((release) => (
              <button type="button" key={release.id} onClick={() => selectRelease(release)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition" style={{ background: selectedId === release.id ? "#171717" : "#0A0A0A", border: `1px solid ${selectedId === release.id ? "#F5C518" : "#1E1E1E"}` }}>
                <Cover url={release.coverUrl} size="small" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">{release.title}</span>
                  <span className="mt-1 block text-xs" style={{ color: "#737373" }}>{typeLabel(release.type)} · {release.tracks.length} {release.tracks.length === 1 ? "track" : "tracks"}</span>
                </span>
                <Status status={release.status} />
              </button>
            ))
          )}
        </section>

        <section className="rounded-xl border p-4 sm:p-6" style={{ background: "#0A0A0A", borderColor: "#1E1E1E" }}>
          {!releaseForm ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <Disc3 size={34} strokeWidth={1.2} style={{ color: "#F5C518" }} />
              <h2 className="mt-4 text-base font-semibold text-white">Selecciona un release</h2>
              <p className="mt-1 max-w-xs text-sm leading-6" style={{ color: "#737373" }}>Elige un lanzamiento de tu catálogo o crea uno nuevo.</p>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: "#525252" }}>{isEditingExisting ? "Editar release" : "Nuevo release"}</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">{releaseForm.title || "Sin título"}</h2>
                </div>
                {selected && selected.status !== "ARCHIVED" && (
                  <button type="button" onClick={archiveRelease} disabled={saving} className="inline-flex items-center gap-1.5 text-xs" style={{ color: "#737373" }}><Archive size={14} /> Archivar</button>
                )}
              </div>

              <form onSubmit={saveRelease} className="grid gap-4 sm:grid-cols-2">
                <Field label="Título" className="sm:col-span-2"><input required maxLength={200} value={releaseForm.title} onChange={(event) => setReleaseForm({ ...releaseForm, title: event.target.value })} placeholder="Nombre del lanzamiento" disabled={isEditingExisting && !canEdit} /></Field>
                <Field label="Tipo"><select value={releaseForm.type} onChange={(event) => setReleaseForm({ ...releaseForm, type: event.target.value as ReleaseType })} disabled={isEditingExisting && !canEdit}><option value="SINGLE">Single</option><option value="EP">EP</option><option value="ALBUM">Álbum</option></select></Field>
                <Field label="Estado"><select value={releaseForm.status} onChange={(event) => setReleaseForm({ ...releaseForm, status: event.target.value as "DRAFT" | "READY" })} disabled={isEditingExisting && !canEdit}><option value="DRAFT">Borrador</option><option value="READY">Listo</option></select></Field>
                <Field label="Fecha de lanzamiento"><input type="date" value={releaseForm.releaseDate} onChange={(event) => setReleaseForm({ ...releaseForm, releaseDate: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                <Field label="Portada · URL opcional" className="sm:col-span-2"><input type="url" maxLength={2048} value={releaseForm.coverUrl} onChange={(event) => setReleaseForm({ ...releaseForm, coverUrl: event.target.value })} placeholder="https://…" disabled={isEditingExisting && !canEdit} /></Field>
                <div className="flex items-center justify-between gap-3 border-t pt-4 sm:col-span-2" style={{ borderColor: "#1E1E1E" }}>
                  <p className="text-xs" style={{ color: "#525252" }}>{selected ? `${typeLabel(selected.type)} · ${formatDate(selected.releaseDate)}` : "Se guardará como DRAFT"}</p>
                  <button type="submit" disabled={saving || (isEditingExisting && !canEdit)} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40" style={{ background: "#F5C518" }}><Save size={15} /> {saving ? "Guardando…" : "Guardar"}</button>
                </div>
              </form>

              {selected && <TracksSection release={selected} canEdit={Boolean(canEdit)} trackForm={trackForm} setTrackForm={setTrackForm} onAdd={addTrack} editingTrackId={editingTrackId} editingTrack={editingTrack} setEditingTrack={setEditingTrack} onBeginEdit={beginTrackEdit} onSave={saveTrack} onDelete={deleteTrack} onCancelEdit={() => setEditingTrackId(null)} saving={saving} canAddSingleTrack={canAddSingleTrack} />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TracksSection(props: {
  release: Release;
  canEdit: boolean;
  trackForm: TrackForm;
  setTrackForm: (value: TrackForm) => void;
  onAdd: (event: FormEvent) => void;
  editingTrackId: string | null;
  editingTrack: TrackForm;
  setEditingTrack: (value: TrackForm) => void;
  onBeginEdit: (track: Track) => void;
  onSave: (trackId: string) => void;
  onDelete: (trackId: string) => void;
  onCancelEdit: () => void;
  saving: boolean;
  canAddSingleTrack: boolean;
}) {
  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: "#1E1E1E" }}>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div><p className="text-sm font-semibold text-white">Tracks</p><p className="mt-1 text-xs" style={{ color: "#525252" }}>{props.release.tracks.length} {props.release.tracks.length === 1 ? "track guardado" : "tracks guardados"}</p></div>
        {!props.canEdit && <span className="text-xs" style={{ color: "#737373" }}>Solo lectura</span>}
      </div>
      <div className="space-y-2">
        {props.release.tracks.map((track) => props.editingTrackId === track.id ? (
          <div key={track.id} className="grid gap-2 rounded-lg p-3 sm:grid-cols-[1fr_90px_auto]" style={{ background: "#141414" }}>
            <input value={props.editingTrack.title} onChange={(event) => props.setEditingTrack({ ...props.editingTrack, title: event.target.value })} aria-label="Título del track" />
            <input type="number" min="1" value={props.editingTrack.trackNumber} onChange={(event) => props.setEditingTrack({ ...props.editingTrack, trackNumber: event.target.value })} aria-label="Número de track" />
            <div className="flex gap-2"><button type="button" onClick={() => props.onSave(track.id)} disabled={props.saving} className="rounded-md p-2 text-black" style={{ background: "#F5C518" }}><Check size={15} /></button><button type="button" onClick={props.onCancelEdit} className="rounded-md p-2 text-white" style={{ background: "#252525" }}><X size={15} /></button></div>
          </div>
        ) : (
          <div key={track.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: "#141414" }}>
            <span className="w-6 text-xs tabular-nums" style={{ color: "#525252" }}>{String(track.trackNumber).padStart(2, "0")}</span><span className="flex-1 truncate text-sm text-white">{track.title}</span>
            {props.canEdit && <><button type="button" onClick={() => props.onBeginEdit(track)} className="text-xs" style={{ color: "#737373" }}>Editar</button><button type="button" onClick={() => props.onDelete(track.id)} className="p-1" style={{ color: "#737373" }} aria-label={`Eliminar ${track.title}`}><Trash2 size={14} /></button></>}
          </div>
        ))}
      </div>
      {props.canEdit && props.canAddSingleTrack && (
        <form onSubmit={props.onAdd} className="mt-4 grid gap-2 sm:grid-cols-[1fr_90px_auto]">
          <input required maxLength={200} value={props.trackForm.title} onChange={(event) => props.setTrackForm({ ...props.trackForm, title: event.target.value })} placeholder="Título del track" aria-label="Título del nuevo track" />
          <input required type="number" min="1" value={props.trackForm.trackNumber} onChange={(event) => props.setTrackForm({ ...props.trackForm, trackNumber: event.target.value })} aria-label="Número del nuevo track" />
          <button type="submit" disabled={props.saving} className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-black disabled:opacity-40" style={{ background: "#F5C518" }}><Plus size={14} /> Agregar</button>
        </form>
      )}
      {props.canEdit && !props.canAddSingleTrack && <p className="mt-3 text-xs" style={{ color: "#525252" }}>Un Single admite un track. Para agregar más canciones, crea un EP o Álbum.</p>}
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block space-y-1.5 ${className}`}><span className="block text-xs font-medium" style={{ color: "#A3A3A3" }}>{label}</span>{children}</label>;
}

function Status({ status }: { status: Release["status"] }) {
  return <span className="shrink-0 rounded-full px-2 py-1 text-[0.625rem] font-semibold" style={{ background: status === "DRAFT" ? "rgba(245,197,24,.1)" : "rgba(255,255,255,.06)", color: status === "DRAFT" ? "#F5C518" : "#A3A3A3" }}>{statusLabel(status)}</span>;
}

function Cover({ url, size }: { url: string | null; size: "small" }) {
  return url ? <div className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} aria-label="Portada del release" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" style={{ background: "#1B1B1B" }}><Disc3 size={20} style={{ color: "#F5C518" }} /></div>;
}