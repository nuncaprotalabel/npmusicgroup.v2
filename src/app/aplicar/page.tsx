"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { submitSolicitud } from "@/services/solicitudService";

type FormData = {
  nombreArtistico: string;
  email: string;
  pais: string;
  generoPrincipal: string;
  enlacePrincipal: string;
  instagram: string;
  tiktok: string;
  mensaje: string;
};
type FieldErrors = Partial<Record<keyof FormData, string>>;

const INITIAL: FormData = {
  nombreArtistico: "", email: "", pais: "", generoPrincipal: "",
  enlacePrincipal: "", instagram: "", tiktok: "", mensaje: "",
};
const MAX_MESSAGE_LENGTH = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/.+/i;

function validate(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.nombreArtistico.trim()) errors.nombreArtistico = "El nombre artístico es obligatorio.";
  if (!data.email.trim()) errors.email = "El correo electrónico es obligatorio.";
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = "Ingresa un correo electrónico válido.";
  if (!data.pais.trim()) errors.pais = "El país es obligatorio.";
  if (!data.generoPrincipal.trim()) errors.generoPrincipal = "El género musical principal es obligatorio.";
  if (!data.enlacePrincipal.trim()) errors.enlacePrincipal = "El enlace principal es obligatorio.";
  else if (!URL_RE.test(data.enlacePrincipal.trim())) errors.enlacePrincipal = "Debe comenzar con http:// o https://.";
  if (data.mensaje.trim().length > MAX_MESSAGE_LENGTH) errors.mensaje = `No puede superar ${MAX_MESSAGE_LENGTH} caracteres.`;
  return errors;
}

const inputClass = "w-full rounded-lg px-3.5 py-2.5 text-[0.875rem] text-white outline-none transition-all duration-150 disabled:opacity-50 placeholder:text-[#3a3a3a]";
const inputStyle = { background: "#141414", border: "1px solid #2A2A2A", caretColor: "#F5C518" } as const;

function Field({ label, required, optional, error, children }: {
  label: string; required?: boolean; optional?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[0.8125rem] font-medium mb-1.5" style={{ color: "#A3A3A3" }}>
        {label}
        {required && <span style={{ color: "#F5C518" }}>*</span>}
        {optional && <span className="text-[0.75rem] font-normal" style={{ color: "#555" }}>· opcional</span>}
      </label>
      {children}
      {error && <p className="flex items-center gap-1.5 mt-1.5 text-[0.75rem]" style={{ color: "#EF4444" }}><AlertCircle size={12} />{error}</p>}
    </div>
  );
}

function inputEvents(hasError: boolean) {
  return {
    onFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      event.currentTarget.style.borderColor = hasError ? "rgba(239,68,68,0.7)" : "#F5C518";
      event.currentTarget.style.boxShadow = hasError ? "0 0 0 3px rgba(239,68,68,0.07)" : "0 0 0 3px rgba(245,197,24,0.08)";
    },
    onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      event.currentTarget.style.borderColor = hasError ? "rgba(239,68,68,0.6)" : "#2A2A2A";
      event.currentTarget.style.boxShadow = "none";
    },
  };
}

export default function AplicarPage() {
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [duplicate, setDuplicate] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
    setSubmitError("");
    setDuplicate(false);
    if (errors[name as keyof FormData]) {
      setErrors(prev => { const next = { ...prev }; delete next[name as keyof FormData]; return next; });
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError("");
    setDuplicate(false);
    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      document.getElementById(Object.keys(fieldErrors)[0])?.focus();
      return;
    }
    setLoading(true);
    const result = await submitSolicitud({
      nombreArtistico: data.nombreArtistico.trim(),
      email: data.email.trim().toLowerCase(),
      pais: data.pais.trim(),
      generoPrincipal: data.generoPrincipal.trim(),
      enlacePrincipal: data.enlacePrincipal.trim(),
      instagram: data.instagram.trim() || undefined,
      tiktok: data.tiktok.trim() || undefined,
      mensaje: data.mensaje.trim() || undefined,
    });
    setLoading(false);
    if (result.error) {
      setSubmitError(result.error);
      setDuplicate(result.duplicate === true);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#000" }}>
        <section className="w-full max-w-[460px] rounded-2xl p-8 sm:p-10 text-center" style={{ background: "#0A0A0A", border: "1px solid #1E1E1E", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(245,197,24,0.10)", border: "1px solid rgba(245,197,24,0.20)" }}>
            <CheckCircle2 size={30} style={{ color: "#F5C518" }} />
          </div>
          <h1 className="text-[1.25rem] font-bold text-white mb-2">Solicitud recibida</h1>
          <p className="text-[0.875rem] leading-relaxed mb-2" style={{ color: "#737373" }}>Tu solicitud fue registrada con éxito.</p>
          <p className="text-[0.875rem] leading-relaxed mb-8" style={{ color: "#555" }}>El equipo de NP Music Group la revisará y se pondrá en contacto contigo en los próximos días hábiles.</p>
          <Link href="/" className="inline-flex items-center gap-2 text-[0.875rem] font-medium hover:opacity-80" style={{ color: "#F5C518" }}><ArrowLeft size={15} />Volver al inicio</Link>
        </section>
        <p className="mt-6 text-[0.75rem]" style={{ color: "#333" }}>© {new Date().getFullYear()} NP Music Group · Proceso de admisión interno</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-12" style={{ background: "#000" }}>
      <section className="w-full max-w-[580px] rounded-2xl p-6 sm:p-8" style={{ background: "#0A0A0A", border: "1px solid #1E1E1E", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
        <header className="flex flex-col items-center mb-8">
          <div className="relative w-11 h-11 mb-4"><Image src="/logo-transparent.png" alt="NP Music Group" fill className="object-contain" priority /></div>
          <h1 className="text-[1.125rem] font-bold text-white tracking-tight">Aplicar a NP Music Group</h1>
          <p className="text-[0.8125rem] mt-1 text-center" style={{ color: "#737373" }}>Completa el formulario y nos pondremos en contacto contigo</p>
        </header>

        {submitError && <div className="flex items-start gap-3 rounded-lg px-4 py-3 mb-5 text-[0.875rem]" style={{ background: duplicate ? "rgba(245,197,24,0.06)" : "rgba(239,68,68,0.07)", border: duplicate ? "1px solid rgba(245,197,24,0.20)" : "1px solid rgba(239,68,68,0.20)", color: duplicate ? "#F5C518" : "#EF4444" }} role="alert"><AlertCircle size={16} className="shrink-0 mt-0.5" /><span>{submitError}</span></div>}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field label="Nombre artístico" required error={errors.nombreArtistico}>
            <input id="nombreArtistico" name="nombreArtistico" type="text" value={data.nombreArtistico} onChange={handleChange} disabled={loading} placeholder="Tu nombre artístico o nombre de banda" className={inputClass} style={{ ...inputStyle, borderColor: errors.nombreArtistico ? "rgba(239,68,68,0.6)" : "#2A2A2A" }} {...inputEvents(!!errors.nombreArtistico)} />
          </Field>
          <Field label="Correo electrónico" required error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" value={data.email} onChange={handleChange} disabled={loading} placeholder="tu@correo.com" className={inputClass} style={{ ...inputStyle, borderColor: errors.email ? "rgba(239,68,68,0.6)" : "#2A2A2A" }} {...inputEvents(!!errors.email)} />
          </Field>
          <Field label="País" required error={errors.pais}>
            <input id="pais" name="pais" type="text" autoComplete="country-name" value={data.pais} onChange={handleChange} disabled={loading} placeholder="Ej: México, Colombia, España…" className={inputClass} style={{ ...inputStyle, borderColor: errors.pais ? "rgba(239,68,68,0.6)" : "#2A2A2A" }} {...inputEvents(!!errors.pais)} />
          </Field>
          <Field label="Género musical principal" required error={errors.generoPrincipal}>
            <input id="generoPrincipal" name="generoPrincipal" type="text" value={data.generoPrincipal} onChange={handleChange} disabled={loading} placeholder="Ej: Reggaeton, Pop, R&B, Urbano…" className={inputClass} style={{ ...inputStyle, borderColor: errors.generoPrincipal ? "rgba(239,68,68,0.6)" : "#2A2A2A" }} {...inputEvents(!!errors.generoPrincipal)} />
          </Field>
          <Field label="Enlace principal" required error={errors.enlacePrincipal}>
            <div className="relative">
              <input id="enlacePrincipal" name="enlacePrincipal" type="url" value={data.enlacePrincipal} onChange={handleChange} disabled={loading} placeholder="https://open.spotify.com/artist/…" className={`${inputClass} pr-9`} style={{ ...inputStyle, borderColor: errors.enlacePrincipal ? "rgba(239,68,68,0.6)" : "#2A2A2A" }} {...inputEvents(!!errors.enlacePrincipal)} />
              <ExternalLink size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#444" }} />
            </div>
            <p className="text-[0.75rem] mt-1" style={{ color: "#555" }}>Spotify, YouTube, SoundCloud, Apple Music u otro perfil principal</p>
          </Field>
          <div className="flex items-center gap-3 pt-1"><div className="flex-1 h-px" style={{ background: "#1E1E1E" }} /><span className="text-[0.75rem]" style={{ color: "#444" }}>Información adicional</span><div className="flex-1 h-px" style={{ background: "#1E1E1E" }} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Instagram" optional><input id="instagram" name="instagram" type="text" value={data.instagram} onChange={handleChange} disabled={loading} placeholder="@tuusuario" className={inputClass} style={inputStyle} {...inputEvents(false)} /></Field>
            <Field label="TikTok" optional><input id="tiktok" name="tiktok" type="text" value={data.tiktok} onChange={handleChange} disabled={loading} placeholder="@tuusuario" className={inputClass} style={inputStyle} {...inputEvents(false)} /></Field>
          </div>
          <Field label="Mensaje de presentación" optional error={errors.mensaje}>
            <textarea id="mensaje" name="mensaje" rows={4} value={data.mensaje} onChange={handleChange} disabled={loading} placeholder="Cuéntanos sobre tu proyecto, trayectoria y objetivos…" className={`${inputClass} resize-none`} style={{ ...inputStyle, borderColor: errors.mensaje ? "rgba(239,68,68,0.6)" : "#2A2A2A" }} {...inputEvents(!!errors.mensaje)} />
            <p className="text-[0.75rem] mt-1 text-right tabular-nums" style={{ color: data.mensaje.length > MAX_MESSAGE_LENGTH ? "#EF4444" : "#404040" }}>{data.mensaje.length} / {MAX_MESSAGE_LENGTH}</p>
          </Field>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-[0.875rem] font-semibold text-black transition-all disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: "linear-gradient(135deg, #F5C518 0%, #E6B300 100%)", boxShadow: loading ? "none" : "0 2px 12px rgba(245,197,24,0.25)" }}>{loading && <Loader2 size={15} className="animate-spin" />}{loading ? "Enviando solicitud…" : "Enviar solicitud"}</button>
          <p className="text-center text-[0.8125rem] pt-1"><Link href="/" className="inline-flex items-center gap-1 hover:text-white" style={{ color: "#555" }}><ArrowLeft size={13} />Volver al inicio</Link></p>
        </form>
      </section>
      <p className="mt-6 text-[0.75rem] text-center" style={{ color: "#333" }}>© {new Date().getFullYear()} NP Music Group · Proceso de admisión interno</p>
    </main>
  );
}