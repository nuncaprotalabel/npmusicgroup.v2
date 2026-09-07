"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Archive, Check, Disc3, Loader2, Music2, Plus, Save, Trash2, X } from "lucide-react";
import type { CreditRole, Release, ReleaseType, Track, TrackCredit } from "@/types/releases";
import { useTranslation } from "@/i18n/useTranslation";
import type { Translations } from "@/i18n/translations";

type ReleaseForm = {
  title: string;
  type: ReleaseType;
  releaseDate: string;
  coverUrl: string;
  status: "DRAFT" | "READY";
  version: string; genre: string; subgenre: string; language: string; upc: string; catalogNumber: string;
  label: string; copyrightText: string; phonographicCopyrightText: string; explicit: boolean;
};

type TrackForm = {
  title: string;
  trackNumber: string;
  isrc: string; version: string; language: string; explicit: boolean;
};

const EMPTY_RELEASE: ReleaseForm = {
  title: "",
  type: "SINGLE",
  releaseDate: "",
  coverUrl: "",
  status: "DRAFT",
  version: "", genre: "", subgenre: "", language: "", upc: "", catalogNumber: "",
  label: "", copyrightText: "", phonographicCopyrightText: "", explicit: false,
};

const EMPTY_TRACK: TrackForm = { title: "", trackNumber: "1", isrc: "", version: "", language: "", explicit: false };

async function readResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "No se pudo completar la acción.");
  return body as T;
}

type ReleaseCopy = Translations["releases"];

function typeLabel(type: ReleaseType, copy: ReleaseCopy) {
  return type === "SINGLE" ? copy.single : type === "EP" ? copy.ep : copy.album;
}

function statusLabel(status: Release["status"], copy: ReleaseCopy) {
  return status === "DRAFT" ? copy.draft : status === "READY" ? copy.ready : status === "RELEASED" ? copy.released : copy.archived;
}

function formatDate(value: string | null, language: "es" | "en", copy: ReleaseCopy) {
  if (!value) return copy.noDate;
  return new Intl.DateTimeFormat(language, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function ReleasesView() {
  const { t, language } = useTranslation();
  const copy = t.releases;
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
      setError(cause instanceof Error ? cause.message : copy.loadError);
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
      version: release.version ?? "", genre: release.genre ?? "", subgenre: release.subgenre ?? "", language: release.language ?? "",
      upc: release.upc ?? "", catalogNumber: release.catalogNumber ?? "", label: release.label ?? "",
      copyrightText: release.copyrightText ?? "", phonographicCopyrightText: release.phonographicCopyrightText ?? "", explicit: release.explicit,
    });
    setEditingTrackId(null);
    setError("");
    void fetch(`/api/releases/${release.id}`, { cache: "no-store" }).then((response) => readResponse<{ release: Release }>(response))
      .then(({ release: detailed }) => setReleases((current) => current.map((item) => item.id === detailed.id ? detailed : item)))
      .catch(() => undefined);
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
        version: body.release.version ?? "", genre: body.release.genre ?? "", subgenre: body.release.subgenre ?? "", language: body.release.language ?? "",
        upc: body.release.upc ?? "", catalogNumber: body.release.catalogNumber ?? "", label: body.release.label ?? "",
        copyrightText: body.release.copyrightText ?? "", phonographicCopyrightText: body.release.phonographicCopyrightText ?? "", explicit: body.release.explicit,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.saveError);
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
      setError(cause instanceof Error ? cause.message : copy.archiveError);
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
        body: JSON.stringify({ title: trackForm.title, trackNumber: Number(trackForm.trackNumber), isrc: trackForm.isrc, version: trackForm.version, language: trackForm.language, explicit: trackForm.explicit }),
      }));
      setTrackForm({ ...EMPTY_TRACK, trackNumber: String(selected.tracks.length + 2) });
      await refresh(selected.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.trackAddError);
    } finally {
      setSaving(false);
    }
  }

  function beginTrackEdit(track: Track) {
    setEditingTrackId(track.id);
    setEditingTrack({ title: track.title, trackNumber: String(track.trackNumber), isrc: track.isrc ?? "", version: track.version ?? "", language: track.language ?? "", explicit: track.explicit });
  }

  async function saveTrack(trackId: string) {
    if (!selected || !canEdit) return;
    setSaving(true);
    setError("");
    try {
      await readResponse(await fetch(`/api/releases/${selected.id}/tracks/${trackId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: editingTrack.title, trackNumber: Number(editingTrack.trackNumber), isrc: editingTrack.isrc, version: editingTrack.version, language: editingTrack.language, explicit: editingTrack.explicit }),
      }));
      setEditingTrackId(null);
      await refresh(selected.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.trackUpdateError);
    } finally {
      setSaving(false);
    }
  }

  async function deleteTrack(trackId: string) {
    if (!selected || !canEdit || !window.confirm(copy.deleteConfirmation)) return;
    setSaving(true);
    setError("");
    try {
      await readResponse(await fetch(`/api/releases/${selected.id}/tracks/${trackId}`, { method: "DELETE" }));
      setEditingTrackId(null);
      await refresh(selected.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : copy.trackDeleteError);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-[360px] items-center justify-center text-sm" style={{ color: "#737373" }}><Loader2 className="mr-2 animate-spin" size={16} />{copy.loading}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]" style={{ color: "#F5C518" }}>{copy.eyebrow}</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">{copy.title}</h1>
          <p className="mt-1 text-sm" style={{ color: "#737373" }}>{copy.subtitle}</p>
        </div>
        <button type="button" onClick={startNew} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110" style={{ background: "#F5C518" }}>
          <Plus size={16} /> {copy.newRelease}
        </button>
      </header>

      {error && <div className="rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "rgba(248,113,113,.35)", background: "rgba(127,29,29,.18)", color: "#fca5a5" }}>{error}</div>}

      <div className="grid gap-5 lg:grid-cols-[minmax(240px,0.75fr)_minmax(0,1.5fr)]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
             <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#525252" }}>{copy.releases}</p>
            <span className="text-xs" style={{ color: "#525252" }}>{releases.length}</span>
          </div>
          {releases.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center" style={{ borderColor: "#2A2A2A", background: "#0A0A0A" }}>
              <Music2 className="mx-auto mb-3" size={20} style={{ color: "#F5C518" }} />
               <p className="text-sm font-medium text-white">{copy.emptyTitle}</p>
               <p className="mt-1 text-xs leading-5" style={{ color: "#737373" }}>{copy.emptyDescription}</p>
            </div>
          ) : (
            releases.map((release) => (
              <button type="button" key={release.id} onClick={() => selectRelease(release)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition" style={{ background: selectedId === release.id ? "#171717" : "#0A0A0A", border: `1px solid ${selectedId === release.id ? "#F5C518" : "#1E1E1E"}` }}>
                <Cover url={release.coverUrl} size="small" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">{release.title}</span>
                   <span className="mt-1 block text-xs" style={{ color: "#737373" }}>{typeLabel(release.type, copy)} · {copy.trackCount(release.tracks.length)}</span>
                </span>
                <Status status={release.status} copy={copy} />
              </button>
            ))
          )}
        </section>

        <section className="rounded-xl border p-4 sm:p-6" style={{ background: "#0A0A0A", borderColor: "#1E1E1E" }}>
          {!releaseForm ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <Disc3 size={34} strokeWidth={1.2} style={{ color: "#F5C518" }} />
               <h2 className="mt-4 text-base font-semibold text-white">{copy.selectTitle}</h2>
               <p className="mt-1 max-w-xs text-sm leading-6" style={{ color: "#737373" }}>{copy.selectDescription}</p>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                   <p className="text-xs uppercase tracking-wider" style={{ color: "#525252" }}>{isEditingExisting ? copy.editRelease : copy.newRelease}</p>
                   <h2 className="mt-1 text-lg font-semibold text-white">{releaseForm.title || copy.titleWithoutName}</h2>
                </div>
                {selected && selected.status !== "ARCHIVED" && (
                   <button type="button" onClick={archiveRelease} disabled={saving} className="inline-flex items-center gap-1.5 text-xs" style={{ color: "#737373" }}><Archive size={14} /> {copy.archive}</button>
                )}
              </div>

              <form onSubmit={saveRelease} className="grid gap-4 sm:grid-cols-2">
                 <Field label={copy.titleLabel} className="sm:col-span-2"><input required maxLength={200} value={releaseForm.title} onChange={(event) => setReleaseForm({ ...releaseForm, title: event.target.value })} placeholder={copy.titlePlaceholder} disabled={isEditingExisting && !canEdit} /></Field>
                 <Field label={copy.typeLabel}><select value={releaseForm.type} onChange={(event) => setReleaseForm({ ...releaseForm, type: event.target.value as ReleaseType })} disabled={isEditingExisting && !canEdit}><option value="SINGLE">{copy.single}</option><option value="EP">{copy.ep}</option><option value="ALBUM">{copy.album}</option></select></Field>
                 <Field label={copy.statusLabel}><select value={releaseForm.status} onChange={(event) => setReleaseForm({ ...releaseForm, status: event.target.value as "DRAFT" | "READY" })} disabled={isEditingExisting && !canEdit}><option value="DRAFT">{copy.draft}</option><option value="READY">{copy.ready}</option></select></Field>
                 <Field label={copy.releaseDate}><input type="date" value={releaseForm.releaseDate} onChange={(event) => setReleaseForm({ ...releaseForm, releaseDate: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                 <Field label={copy.coverUrl} className="sm:col-span-2"><input type="url" maxLength={2048} value={releaseForm.coverUrl} onChange={(event) => setReleaseForm({ ...releaseForm, coverUrl: event.target.value })} placeholder="https://…" disabled={isEditingExisting && !canEdit} /></Field>
                  <div className="border-t pt-4 sm:col-span-2" style={{ borderColor: "#1E1E1E" }}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#F5C518" }}>{copy.metadata}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={copy.version}><input maxLength={100} value={releaseForm.version} onChange={(event) => setReleaseForm({ ...releaseForm, version: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <Field label={copy.language}><input maxLength={20} value={releaseForm.language} onChange={(event) => setReleaseForm({ ...releaseForm, language: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <Field label={copy.genre}><input maxLength={100} value={releaseForm.genre} onChange={(event) => setReleaseForm({ ...releaseForm, genre: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <Field label={copy.subgenre}><input maxLength={100} value={releaseForm.subgenre} onChange={(event) => setReleaseForm({ ...releaseForm, subgenre: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <Field label={copy.upc}><input inputMode="numeric" maxLength={20} value={releaseForm.upc} onChange={(event) => setReleaseForm({ ...releaseForm, upc: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <Field label={copy.catalogNumber}><input maxLength={100} value={releaseForm.catalogNumber} onChange={(event) => setReleaseForm({ ...releaseForm, catalogNumber: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <Field label={copy.copyrightText}><input maxLength={1000} value={releaseForm.copyrightText} onChange={(event) => setReleaseForm({ ...releaseForm, copyrightText: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <Field label={copy.phonographicCopyrightText}><input maxLength={1000} value={releaseForm.phonographicCopyrightText} onChange={(event) => setReleaseForm({ ...releaseForm, phonographicCopyrightText: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <Field label={copy.label}><input maxLength={150} value={releaseForm.label} onChange={(event) => setReleaseForm({ ...releaseForm, label: event.target.value })} disabled={isEditingExisting && !canEdit} /></Field>
                      <label className="flex items-center gap-2 self-end text-xs" style={{ color: "#A3A3A3" }}><input type="checkbox" checked={releaseForm.explicit} onChange={(event) => setReleaseForm({ ...releaseForm, explicit: event.target.checked })} disabled={isEditingExisting && !canEdit} />{copy.explicit}</label>
                    </div>
                  </div>
                <div className="flex items-center justify-between gap-3 border-t pt-4 sm:col-span-2" style={{ borderColor: "#1E1E1E" }}>
                   <p className="text-xs" style={{ color: "#525252" }}>{selected ? copy.typeAndDate(typeLabel(selected.type, copy), formatDate(selected.releaseDate, language, copy)) : copy.savedAsDraft}</p>
                   <button type="submit" disabled={saving || (isEditingExisting && !canEdit)} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40" style={{ background: "#F5C518" }}><Save size={15} /> {saving ? copy.saving : copy.save}</button>
                </div>
              </form>

                {selected && <TracksSection release={selected} canEdit={Boolean(canEdit)} trackForm={trackForm} setTrackForm={setTrackForm} onAdd={addTrack} editingTrackId={editingTrackId} editingTrack={editingTrack} setEditingTrack={setEditingTrack} onBeginEdit={beginTrackEdit} onSave={saveTrack} onDelete={deleteTrack} onCancelEdit={() => setEditingTrackId(null)} saving={saving} canAddSingleTrack={canAddSingleTrack} copy={copy} onRefresh={() => refresh(selected.id)} />}
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
  copy: ReleaseCopy;
  onRefresh: () => void;
}) {
  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: "#1E1E1E" }}>
      <div className="mb-4 flex items-end justify-between gap-3">
         <div><p className="text-sm font-semibold text-white">{props.copy.tracks}</p><p className="mt-1 text-xs" style={{ color: "#525252" }}>{props.release.tracks.length} {props.release.tracks.length === 1 ? props.copy.trackSaved : props.copy.tracksSaved}</p></div>
         {!props.canEdit && <span className="text-xs" style={{ color: "#737373" }}>{props.copy.readOnly}</span>}
      </div>
      <div className="space-y-2">
        {props.release.tracks.map((track) => props.editingTrackId === track.id ? (
           <div key={track.id} className="grid gap-2 rounded-lg p-3 sm:grid-cols-[1fr_90px_auto]" style={{ background: "#141414" }}>
             <input value={props.editingTrack.title} onChange={(event) => props.setEditingTrack({ ...props.editingTrack, title: event.target.value })} aria-label={props.copy.trackTitle} />
             <input type="number" min="1" value={props.editingTrack.trackNumber} onChange={(event) => props.setEditingTrack({ ...props.editingTrack, trackNumber: event.target.value })} aria-label={props.copy.trackNumber} />
            <div className="flex gap-2"><button type="button" onClick={() => props.onSave(track.id)} disabled={props.saving} className="rounded-md p-2 text-black" style={{ background: "#F5C518" }}><Check size={15} /></button><button type="button" onClick={props.onCancelEdit} className="rounded-md p-2 text-white" style={{ background: "#252525" }}><X size={15} /></button></div>
              <div className="grid gap-2 sm:col-span-3 sm:grid-cols-3">
                <input value={props.editingTrack.isrc} onChange={(event) => props.setEditingTrack({ ...props.editingTrack, isrc: event.target.value })} placeholder="ISRC" aria-label="ISRC" />
                <input value={props.editingTrack.version} onChange={(event) => props.setEditingTrack({ ...props.editingTrack, version: event.target.value })} placeholder={props.copy.version} aria-label={props.copy.version} />
                <input value={props.editingTrack.language} onChange={(event) => props.setEditingTrack({ ...props.editingTrack, language: event.target.value })} placeholder={props.copy.language} aria-label={props.copy.language} />
                <label className="flex items-center gap-2 text-xs" style={{ color: "#A3A3A3" }}><input type="checkbox" checked={props.editingTrack.explicit} onChange={(event) => props.setEditingTrack({ ...props.editingTrack, explicit: event.target.checked })} />{props.copy.explicit}</label>
              </div>
          </div>
        ) : (
           <div key={track.id} className="rounded-lg px-3 py-2.5" style={{ background: "#141414" }}>
             <div className="flex items-center gap-3">
            <span className="w-6 text-xs tabular-nums" style={{ color: "#525252" }}>{String(track.trackNumber).padStart(2, "0")}</span><span className="flex-1 truncate text-sm text-white">{track.title}</span>
             {props.canEdit && <><button type="button" onClick={() => props.onBeginEdit(track)} className="text-xs" style={{ color: "#737373" }}>{props.copy.edit}</button><button type="button" onClick={() => props.onDelete(track.id)} className="p-1" style={{ color: "#737373" }} aria-label={`${props.copy.delete} ${track.title}`}><Trash2 size={14} /></button></>}
             </div>
             <div className="mt-1 pl-9 text-xs" style={{ color: "#737373" }}>{track.isrc || "ISRC —"} · {track.version || props.copy.version} · {track.language || props.copy.language}{track.explicit ? ` · ${props.copy.explicit}` : ""}</div>
             <CreditsSection releaseId={props.release.id} track={track} canEdit={props.canEdit} copy={props.copy} onRefresh={props.onRefresh} />
          </div>
        ))}
      </div>
      {props.canEdit && props.canAddSingleTrack && (
        <form onSubmit={props.onAdd} className="mt-4 grid gap-2 sm:grid-cols-[1fr_90px_auto]">
            <input required maxLength={200} value={props.trackForm.title} onChange={(event) => props.setTrackForm({ ...props.trackForm, title: event.target.value })} placeholder={props.copy.newTrackTitle} aria-label={props.copy.newTrackTitle} />
           <input required type="number" min="1" value={props.trackForm.trackNumber} onChange={(event) => props.setTrackForm({ ...props.trackForm, trackNumber: event.target.value })} aria-label={props.copy.newTrackNumber} />
           <button type="submit" disabled={props.saving} className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-black disabled:opacity-40" style={{ background: "#F5C518" }}><Plus size={14} /> {props.copy.add}</button>
            <div className="grid gap-2 sm:col-span-3 sm:grid-cols-3"><input value={props.trackForm.isrc} onChange={(event) => props.setTrackForm({ ...props.trackForm, isrc: event.target.value })} placeholder="ISRC" aria-label="ISRC" /><input value={props.trackForm.version} onChange={(event) => props.setTrackForm({ ...props.trackForm, version: event.target.value })} placeholder={props.copy.version} aria-label={props.copy.version} /><input value={props.trackForm.language} onChange={(event) => props.setTrackForm({ ...props.trackForm, language: event.target.value })} placeholder={props.copy.language} aria-label={props.copy.language} /><label className="flex items-center gap-2 text-xs" style={{ color: "#A3A3A3" }}><input type="checkbox" checked={props.trackForm.explicit} onChange={(event) => props.setTrackForm({ ...props.trackForm, explicit: event.target.checked })} />{props.copy.explicit}</label></div>
        </form>
      )}
       {props.canEdit && !props.canAddSingleTrack && <p className="mt-3 text-xs" style={{ color: "#525252" }}>{props.copy.singleLimit}</p>}
    </div>
  );
}

function CreditsSection({ releaseId, track, canEdit, copy, onRefresh }: {
  releaseId: string; track: Track; canEdit: boolean; copy: ReleaseCopy; onRefresh: () => void;
}) {
  const [name, setName] = useState(""); const [role, setRole] = useState<CreditRole>("PERFORMER");
  const [editing, setEditing] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const roleLabel = (value: CreditRole) => ({ COMPOSER: copy.composer, LYRICIST: copy.lyricist, PRODUCER: copy.producer, PERFORMER: copy.performer })[value];
  async function save(creditId?: string) {
    if (!name.trim()) return; setBusy(true);
    try {
      await readResponse(await fetch(`/api/releases/${releaseId}/tracks/${track.id}/credits${creditId ? `/${creditId}` : ""}`, { method: creditId ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, role }) }));
      setName(""); setEditing(null); onRefresh();
    } catch { /* parent release state shows the last confirmed value */ } finally { setBusy(false); }
  }
  async function remove(id: string) {
    if (!window.confirm(copy.deleteConfirmation)) return; setBusy(true);
    try { await readResponse(await fetch(`/api/releases/${releaseId}/tracks/${track.id}/credits/${id}`, { method: "DELETE" })); onRefresh(); } finally { setBusy(false); }
  }
  return <div className="mt-2 border-t pt-2" style={{ borderColor: "#242424" }}>
    <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: "#A3A3A3" }}>{copy.credits}</p>
    {(track.credits ?? []).length === 0 && <p className="text-xs" style={{ color: "#525252" }}>{copy.noCredits}</p>}
    {(track.credits ?? []).map((credit) => editing === credit.id ? <div key={credit.id} className="flex flex-wrap gap-2">
      <input className="min-w-0 flex-1" value={name} onChange={(event) => setName(event.target.value)} aria-label={copy.creditName} />
      <select value={role} onChange={(event) => setRole(event.target.value as CreditRole)}>{(["COMPOSER","LYRICIST","PRODUCER","PERFORMER"] as CreditRole[]).map((item) => <option key={item} value={item}>{roleLabel(item)}</option>)}</select>
      <button type="button" disabled={busy} onClick={() => void save(credit.id)} className="text-xs" style={{ color: "#F5C518" }}>{copy.saveCredit}</button>
      <button type="button" onClick={() => setEditing(null)} className="text-xs" style={{ color: "#737373" }}>×</button>
    </div> : <div key={credit.id} className="flex items-center gap-2 text-xs" style={{ color: "#D4D4D4" }}>
      <span className="flex-1">{credit.name} · {roleLabel(credit.role)}</span>
      {canEdit && <><button type="button" onClick={() => { setEditing(credit.id); setName(credit.name); setRole(credit.role); }} style={{ color: "#737373" }}>{copy.edit}</button><button type="button" disabled={busy} onClick={() => void remove(credit.id)} style={{ color: "#737373" }}>{copy.delete}</button></>}
    </div>)}
    {canEdit && !editing && <div className="mt-2 flex flex-wrap gap-2"><input className="min-w-0 flex-1" maxLength={200} value={name} onChange={(event) => setName(event.target.value)} placeholder={copy.creditName} aria-label={copy.creditName} /><select value={role} onChange={(event) => setRole(event.target.value as CreditRole)}>{(["COMPOSER","LYRICIST","PRODUCER","PERFORMER"] as CreditRole[]).map((item) => <option key={item} value={item}>{roleLabel(item)}</option>)}</select><button type="button" disabled={busy || !name.trim()} onClick={() => void save()} className="text-xs font-semibold" style={{ color: "#F5C518" }}>{copy.addCredit}</button></div>}
  </div>;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block space-y-1.5 ${className}`}><span className="block text-xs font-medium" style={{ color: "#A3A3A3" }}>{label}</span>{children}</label>;
}

function Status({ status, copy }: { status: Release["status"]; copy: ReleaseCopy }) {
  return <span className="shrink-0 rounded-full px-2 py-1 text-[0.625rem] font-semibold" style={{ background: status === "DRAFT" ? "rgba(245,197,24,.1)" : "rgba(255,255,255,.06)", color: status === "DRAFT" ? "#F5C518" : "#A3A3A3" }}>{statusLabel(status, copy)}</span>;
}

function Cover({ url, size }: { url: string | null; size: "small" }) {
  return url ? <div className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} aria-label="Portada del release" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" style={{ background: "#1B1B1B" }}><Disc3 size={20} style={{ color: "#F5C518" }} /></div>;
}