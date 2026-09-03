"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, Check, Loader2, Save, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  getMyArtistProfile,
  updateMyArtistProfile,
} from "@/services/artistsService";
import type { ArtistProfile } from "@/types/artists";

type EditableForm = {
  nombreArtistico: string;
  pais: string;
  generoPrincipal: string;
  enlacePrincipal: string;
  instagram: string;
  tiktok: string;
  bio: string;
};

const EMPTY_FORM: EditableForm = {
  nombreArtistico: "",
  pais: "",
  generoPrincipal: "",
  enlacePrincipal: "",
  instagram: "",
  tiktok: "",
  bio: "",
};

function formFromArtist(artist: ArtistProfile): EditableForm {
  return {
    nombreArtistico: artist.nombreArtistico,
    pais: artist.pais,
    generoPrincipal: artist.generoPrincipal,
    enlacePrincipal: artist.enlacePrincipal,
    instagram: artist.instagram ?? "",
    tiktok: artist.tiktok ?? "",
    bio: artist.bio ?? "",
  };
}

export function ArtistProfileView() {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [form, setForm] = useState<EditableForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getMyArtistProfile().then((result) => {
      setLoading(false);
      if (result.error || !result.artist) {
        setError(result.error ?? "No se pudo cargar el perfil.");
        return;
      }
      setArtist(result.artist);
      setForm(formFromArtist(result.artist));
    });
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const field = event.target.name as keyof EditableForm;
    setSaved(false);
    setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    const result = await updateMyArtistProfile(form);
    setSaving(false);
    if (result.error || !result.artist) {
      setError(result.error ?? "No se pudo guardar el perfil.");
      return;
    }
    setArtist(result.artist);
    setForm(formFromArtist(result.artist));
    setSaved(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center text-sm text-[#525252]">
        <Loader2 className="mr-2 animate-spin" size={18} />
        Cargando perfil…
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-500/20 bg-red-500/[0.06] p-5 text-sm text-[#EF4444]" role="alert">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 shrink-0" size={16} />
          <span>{error ?? "Perfil no disponible."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header>
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">
          Mi cuenta
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Perfil del artista</h1>
            <p className="mt-1 text-sm text-[#737373]">
              Mantén actualizada tu identidad artística y la información profesional.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#34D399]/20 bg-[#34D399]/[0.08] px-2.5 py-1 text-[0.6875rem] font-semibold text-[#34D399]">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {artist.status === "ACTIVO" ? "Activo" : "Onboarding pendiente"}
          </span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-xl border border-[#1E1E1E] bg-[#0A0A0A] p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3 border-b border-[#141414] pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5C518]/[0.08]">
              <UserRound size={17} className="text-[#F5C518]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Identidad de la cuenta</h2>
              <p className="mt-0.5 text-xs text-[#525252]">Datos de acceso no editables desde este módulo.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Usuario" value={artist.username} disabled fullWidth />
            <Input label="Email de autenticación" value={artist.email} disabled fullWidth />
          </div>
        </section>

        <section className="rounded-xl border border-[#1E1E1E] bg-[#0A0A0A] p-5 sm:p-6">
          <div className="mb-5 border-b border-[#141414] pb-4">
            <h2 className="text-sm font-semibold text-white">Información artística</h2>
            <p className="mt-0.5 text-xs text-[#525252]">Estos datos pueden actualizarse sin modificar tu contrato ni tu solicitud original.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="nombreArtistico"
              name="nombreArtistico"
              label="Nombre artístico"
              value={form.nombreArtistico}
              onChange={handleChange}
              maxLength={150}
              required
              fullWidth
            />
            <Input
              id="generoPrincipal"
              name="generoPrincipal"
              label="Género principal"
              value={form.generoPrincipal}
              onChange={handleChange}
              maxLength={100}
              required
              fullWidth
            />
            <Input
              id="pais"
              name="pais"
              label="País"
              value={form.pais}
              onChange={handleChange}
              maxLength={100}
              required
              fullWidth
            />
            <Input
              id="enlacePrincipal"
              name="enlacePrincipal"
              label="Enlace principal"
              type="url"
              value={form.enlacePrincipal}
              onChange={handleChange}
              maxLength={2048}
              placeholder="https://"
              required
              fullWidth
            />
            <Input
              id="instagram"
              name="instagram"
              label="Instagram"
              value={form.instagram}
              onChange={handleChange}
              maxLength={255}
              placeholder="@usuario o enlace"
              fullWidth
            />
            <Input
              id="tiktok"
              name="tiktok"
              label="TikTok"
              value={form.tiktok}
              onChange={handleChange}
              maxLength={255}
              placeholder="@usuario o enlace"
              fullWidth
            />
          </div>
          <label htmlFor="bio" className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium text-[#A3A3A3]">Presentación / bio</span>
            <textarea
              id="bio"
              name="bio"
              value={form.bio ?? ""}
              onChange={handleChange}
              maxLength={2000}
              rows={5}
              placeholder="Cuéntanos brevemente sobre tu proyecto artístico."
              className="w-full resize-y rounded-lg border border-[#1E1E1E] bg-[#0A0A0A] px-4 py-3 text-sm text-white placeholder:text-[#404040] outline-none transition-colors focus:border-[#F5C518]/50 focus:ring-1 focus:ring-[#F5C518]/30"
            />
            <span className="mt-1 block text-right text-xs text-[#525252]">{(form.bio ?? "").length}/2000</span>
          </label>
        </section>

        <div className="flex flex-col items-stretch justify-end gap-3 sm:flex-row sm:items-center">
          {saved && (
            <p className="flex items-center justify-center gap-1.5 text-sm text-[#34D399]" role="status">
              <Check size={15} />
              Cambios guardados
            </p>
          )}
          <Button type="submit" variant="primary" loading={saving} icon={!saving ? <Save size={15} /> : undefined}>
            {saving ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
