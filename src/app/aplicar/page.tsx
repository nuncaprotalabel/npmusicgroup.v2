"use client";

/**
 * Página de solicitud — /aplicar
 * Pública. Formulario para artistas que desean unirse a NP Music Group.
 * Diseño conforme a DESIGN_BRIEF.md: negro, amarillo, tipografía limpia.
 * Sprint 3.1 — solo interfaz. Validación client-side + estado de éxito.
 */

import { useState, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

/* ── Field definitions ────────────────────────────────────────── */

type FieldError = Partial<Record<string, string>>;

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  tipoArtista: string;
  generos: string;
  descripcion: string;
}

const INITIAL: FormData = {
  nombre:      "",
  apellido:    "",
  email:       "",
  telefono:    "",
  tipoArtista: "",
  generos:     "",
  descripcion: "",
};

const TIPO_ARTISTA_OPTIONS = [
  { value: "",           label: "Selecciona una opción" },
  { value: "solista",    label: "Artista solista" },
  { value: "banda",      label: "Banda / Grupo" },
  { value: "productor",  label: "Productor musical" },
  { value: "compositor", label: "Compositor / Letrista" },
  { value: "dj",         label: "DJ" },
  { value: "otro",       label: "Otro" },
];

/* ── Validation ───────────────────────────────────────────────── */

function validate(data: FormData): FieldError {
  const errors: FieldError = {};

  if (!data.nombre.trim())
    errors.nombre = "El nombre es obligatorio.";

  if (!data.apellido.trim())
    errors.apellido = "El apellido es obligatorio.";

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim())
    errors.email = "El correo es obligatorio.";
  else if (!emailRe.test(data.email))
    errors.email = "Ingresa un correo electrónico válido.";

  if (!data.tipoArtista)
    errors.tipoArtista = "Selecciona el tipo de artista.";

  if (!data.generos.trim())
    errors.generos = "Indica al menos un género musical.";

  if (!data.descripcion.trim())
    errors.descripcion = "Escribe una breve descripción.";
  else if (data.descripcion.trim().length < 30)
    errors.descripcion = "La descripción debe tener al menos 30 caracteres.";

  return errors;
}

/* ── Shared input style helpers ───────────────────────────────── */

const inputBase =
  "w-full rounded-lg px-3.5 py-2.5 text-[0.875rem] text-white outline-none transition-all duration-150 disabled:opacity-50 placeholder:text-[#3a3a3a]";

const inputStyle = {
  background: "#141414",
  border: "1px solid #2A2A2A",
  caretColor: "#F5C518",
} as const;

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "#F5C518";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(245,197,24,0.08)";
}

function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "#2A2A2A";
  e.currentTarget.style.boxShadow   = "none";
}

function onError(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "rgba(239,68,68,0.6)";
  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(239,68,68,0.06)";
}

/* ── Field wrapper ────────────────────────────────────────────── */

function Field({
  label, error, required = false, children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[0.8125rem] font-medium mb-1.5" style={{ color: "#A3A3A3" }}>
        {label}
        {required && <span className="ml-0.5" style={{ color: "#F5C518" }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 text-[0.75rem]" style={{ color: "#EF4444" }}>
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function AplicarPage() {
  const [data,    setData]    = useState<FormData>(INITIAL);
  const [errors,  setErrors]  = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al modificar
    if (errors[name]) {
      setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(data);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      // Scroll al primer error
      const firstKey = Object.keys(fieldErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setLoading(true);
    // Simular procesamiento — Sprint 3.1 no implementa backend todavía.
    // El botón es funcional: valida, transiciona y confirma al usuario.
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "#000000" }}
      >
        <div
          className="w-full max-w-[440px] rounded-2xl p-8 text-center"
          style={{ background: "#0A0A0A", border: "1px solid #1E1E1E", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(245,197,24,0.10)", border: "1px solid rgba(245,197,24,0.20)" }}
          >
            <CheckCircle2 size={28} style={{ color: "#F5C518" }} />
          </div>
          <h1 className="text-[1.125rem] font-bold text-white mb-2">
            Solicitud recibida
          </h1>
          <p className="text-[0.875rem] leading-relaxed mb-6" style={{ color: "#737373" }}>
            El equipo de NP Music Group revisará tu solicitud y se pondrá en contacto contigo en los próximos días.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.875rem] font-medium transition-colors duration-150"
            style={{ color: "#F5C518" }}
          >
            <ArrowLeft size={15} />
            Volver al inicio
          </Link>
        </div>
        <p className="mt-6 text-[0.75rem]" style={{ color: "#404040" }}>
          © {new Date().getFullYear()} NP Music Group. Todos los derechos reservados.
        </p>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-4 py-12"
      style={{ background: "#000000" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[560px] rounded-2xl p-6 sm:p-8"
        style={{ background: "#0A0A0A", border: "1px solid #1E1E1E", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-7">
          <div className="relative w-11 h-11 mb-4">
            <Image
              src="/logo-transparent.png"
              alt="NP Music Group"
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 12px rgba(245,197,24,0.20))" }}
            />
          </div>
          <h1 className="text-[1.125rem] font-bold text-white tracking-tight text-center">
            Aplicar a NP Music Group
          </h1>
          <p className="text-[0.8125rem] mt-1 text-center" style={{ color: "#737373" }}>
            Completa el formulario y nos pondremos en contacto contigo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* Nombre + Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre" error={errors.nombre} required>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="given-name"
                value={data.nombre}
                onChange={handleChange}
                disabled={loading}
                placeholder="Tu nombre"
                className={inputBase}
                style={{ ...inputStyle, borderColor: errors.nombre ? "rgba(239,68,68,0.6)" : "#2A2A2A" }}
                onFocus={errors.nombre ? onError : onFocus}
                onBlur={errors.nombre ? onError : onBlur}
              />
            </Field>
            <Field label="Apellido" error={errors.apellido} required>
              <input
                id="apellido"
                name="apellido"
                type="text"
                autoComplete="family-name"
                value={data.apellido}
                onChange={handleChange}
                disabled={loading}
                placeholder="Tu apellido"
                className={inputBase}
                style={{ ...inputStyle, borderColor: errors.apellido ? "rgba(239,68,68,0.6)" : "#2A2A2A" }}
                onFocus={errors.apellido ? onError : onFocus}
                onBlur={errors.apellido ? onError : onBlur}
              />
            </Field>
          </div>

          {/* Email */}
          <Field label="Correo electrónico" error={errors.email} required>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="tu@correo.com"
              className={inputBase}
              style={{ ...inputStyle, borderColor: errors.email ? "rgba(239,68,68,0.6)" : "#2A2A2A" }}
              onFocus={errors.email ? onError : onFocus}
              onBlur={errors.email ? onError : onBlur}
            />
          </Field>

          {/* Teléfono */}
          <Field label="Teléfono" error={errors.telefono}>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              autoComplete="tel"
              value={data.telefono}
              onChange={handleChange}
              disabled={loading}
              placeholder="+1 (000) 000-0000"
              className={inputBase}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field>

          {/* Tipo de artista */}
          <Field label="Tipo de artista" error={errors.tipoArtista} required>
            <select
              id="tipoArtista"
              name="tipoArtista"
              value={data.tipoArtista}
              onChange={handleChange}
              disabled={loading}
              className={inputBase}
              style={{
                ...inputStyle,
                borderColor: errors.tipoArtista ? "rgba(239,68,68,0.6)" : "#2A2A2A",
                color: data.tipoArtista ? "#ffffff" : "#3a3a3a",
              }}
              onFocus={errors.tipoArtista ? onError : onFocus}
              onBlur={errors.tipoArtista ? onError : onBlur}
            >
              {TIPO_ARTISTA_OPTIONS.map(opt => (
                <option
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.value === ""}
                  style={{ background: "#141414", color: opt.value ? "#fff" : "#555" }}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          {/* Géneros */}
          <Field label="Géneros musicales" error={errors.generos} required>
            <input
              id="generos"
              name="generos"
              type="text"
              value={data.generos}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ej: Reggaeton, Pop, R&B"
              className={inputBase}
              style={{ ...inputStyle, borderColor: errors.generos ? "rgba(239,68,68,0.6)" : "#2A2A2A" }}
              onFocus={errors.generos ? onError : onFocus}
              onBlur={errors.generos ? onError : onBlur}
            />
          </Field>

          {/* Descripción */}
          <Field label="Descripción breve" error={errors.descripcion} required>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={4}
              value={data.descripcion}
              onChange={handleChange}
              disabled={loading}
              placeholder="Cuéntanos sobre tu proyecto, trayectoria y objetivos…"
              className={`${inputBase} resize-none`}
              style={{ ...inputStyle, borderColor: errors.descripcion ? "rgba(239,68,68,0.6)" : "#2A2A2A" }}
              onFocus={errors.descripcion ? onError : onFocus}
              onBlur={errors.descripcion ? onError : onBlur}
            />
            <p className="text-[0.75rem] mt-1 text-right" style={{ color: "#404040" }}>
              {data.descripcion.trim().length} / mín. 30 caracteres
            </p>
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 mt-2 text-[0.875rem] font-semibold text-black transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #F5C518 0%, #E6B300 100%)",
              boxShadow: loading ? "none" : "0 2px 12px rgba(245,197,24,0.25)",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,197,24,0.40)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(245,197,24,0.25)"; }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Enviando solicitud…" : "Enviar solicitud"}
          </button>

          {/* Back link */}
          <p className="text-center text-[0.8125rem] pt-1" style={{ color: "#404040" }}>
            <Link
              href="/"
              className="transition-colors duration-150 hover:text-white"
              style={{ color: "#737373" }}
            >
              <ArrowLeft size={13} className="inline mr-1" />
              Volver al inicio
            </Link>
          </p>

        </form>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-[0.75rem] text-center" style={{ color: "#404040" }}>
        © {new Date().getFullYear()} NP Music Group · Proceso de admisión interno
      </p>
    </div>
  );
}
