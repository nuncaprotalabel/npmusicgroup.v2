"use client";

/**
 * Página de solicitud — /aplicar
 * Pública. Permite a artistas enviar su solicitud de incorporación a NP Music Group.
 * Diseño conforme a DESIGN_BRIEF.md: negro, amarillo, tipografía limpia, mobile-first.
 */
import { useState, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, CheckCircle, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { submitApplication } from "@/services/applicationService";
import { useTranslation } from "@/i18n/useTranslation";
import type { ApplicationFormData } from "@/types/application";

// ─── Datos estáticos ───────────────────────────────────────────────────────────

const GENRES = [
  "Reggaeton",
  "Trap / Urban",
  "Hip-Hop",
  "R&B / Soul",
  "Pop",
  "Latin Pop",
  "Salsa / Merengue",
  "Bachata",
  "Dembow",
  "Electrónica / EDM",
  "Rock",
  "Indie / Alternativo",
  "Jazz",
  "Gospel / Cristiana",
  "Afrobeats",
  "Cumbia",
  "Vallenato",
  "Corridos / Regional Mexicano",
  "Flamenco",
  "Otro",
] as const;

const COUNTRIES = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica",
  "Cuba", "Ecuador", "El Salvador", "España", "Estados Unidos", "Guatemala",
  "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú",
  "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela",
  "Alemania", "Canada", "Francia", "Italia", "Japón", "Reino Unido",
  "Otro",
] as const;

// ─── Tipos internos ────────────────────────────────────────────────────────────

interface FormFields {
  artisticName: string;
  email:        string;
  country:      string;
  genre:        string;
  mainLink:     string;
  instagram:    string;
  tiktok:       string;
  message:      string;
}

interface FieldErrors {
  artisticName?: string;
  email?:        string;
  country?:      string;
  genre?:        string;
  mainLink?:     string;
  message?:      string;
}

const EMPTY: FormFields = {
  artisticName: "",
  email:        "",
  country:      "",
  genre:        "",
  mainLink:     "",
  instagram:    "",
  tiktok:       "",
  message:      "",
};

const MESSAGE_MAX = 1000;

// ─── Componente ────────────────────────────────────────────────────────────────

export default function AplicarPage() {
  const { t } = useTranslation();
  const at = t.apply;

  const [fields, setFields]       = useState<FormFields>(EMPTY);
  const [errors, setErrors]       = useState<FieldErrors>({});
  const [globalError, setGlobal]  = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Helpers ──
  function set(field: keyof FormFields) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields(prev => ({ ...prev, [field]: e.target.value }));
      // Limpiar error del campo al editar
      if (errors[field as keyof FieldErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
      setGlobal(null);
    };
  }

  // ── Validación client-side ──
  function validate(): boolean {
    const next: FieldErrors = {};

    if (!fields.artisticName.trim()) next.artisticName = at.errors.required;
    if (!fields.email.trim())        next.email        = at.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
                                     next.email        = at.errors.emailInvalid;
    if (!fields.country)             next.country      = at.errors.required;
    if (!fields.genre)               next.genre        = at.errors.required;
    if (!fields.mainLink.trim())     next.mainLink     = at.errors.required;
    if (fields.message.length > MESSAGE_MAX)
                                     next.message      = at.errors.messageTooLong;

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Submit ──
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobal(null);

    const payload: ApplicationFormData = {
      artisticName: fields.artisticName.trim(),
      email:        fields.email.trim().toLowerCase(),
      country:      fields.country,
      genre:        fields.genre,
      mainLink:     fields.mainLink.trim(),
      ...(fields.instagram.trim() && { instagram: fields.instagram.trim() }),
      ...(fields.tiktok.trim()    && { tiktok:    fields.tiktok.trim()    }),
      ...(fields.message.trim()   && { message:   fields.message.trim()   }),
    };

    const result = await submitApplication(payload);

    setLoading(false);

    if (result.error) {
      // Duplicate email → campo email
      if (result.error.includes("correo") || result.error.includes("email")) {
        setErrors(prev => ({ ...prev, email: result.error }));
      } else {
        setGlobal(result.error);
      }
      return;
    }

    setSubmitted(true);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PANTALLA DE ÉXITO
  // ─────────────────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ background: "#000000" }}
      >
        <div
          className="w-full max-w-[440px] rounded-2xl p-8 text-center"
          style={{
            background: "#0A0A0A",
            border:     "1px solid #1E1E1E",
            boxShadow:  "0 8px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Icono */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
            style={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.20)" }}
          >
            <CheckCircle size={26} style={{ color: "#22C55E" }} />
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="relative w-10 h-10">
              <Image
                src="/logo-transparent.png"
                alt="NP Music Group"
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 10px rgba(245,197,24,0.20))" }}
              />
            </div>
          </div>

          <h1
            className="text-[1.25rem] font-bold text-white tracking-tight mb-3"
          >
            {at.success.title}
          </h1>
          <p
            className="text-[0.875rem] leading-[1.7] mb-8"
            style={{ color: "#737373" }}
          >
            {at.success.message}
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-[0.875rem] font-semibold text-black transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #F5C518 0%, #E6B300 100%)",
              boxShadow:  "0 2px 12px rgba(245,197,24,0.25)",
            }}
          >
            <ArrowLeft size={14} />
            {at.success.backToHome}
          </Link>
        </div>

        <p className="mt-6 text-[0.75rem]" style={{ color: "#404040" }}>
          © {new Date().getFullYear()} NP Music Group.
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FORMULARIO
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "#000000" }}
    >
      {/* Volver */}
      <div className="w-full max-w-[560px] mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[0.8125rem] transition-colors duration-150"
          style={{ color: "#525252" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#A3A3A3")}
          onMouseLeave={e => (e.currentTarget.style.color = "#525252")}
        >
          <ArrowLeft size={14} />
          Inicio
        </Link>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-[560px] rounded-2xl p-8"
        style={{
          background: "#0A0A0A",
          border:     "1px solid #1E1E1E",
          boxShadow:  "0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-12 h-12 mb-4">
            <Image
              src="/logo-transparent.png"
              alt="NP Music Group"
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 12px rgba(245,197,24,0.25))" }}
            />
          </div>
          <h1 className="text-[1.125rem] font-bold text-white tracking-tight">
            {at.title}
          </h1>
          <p className="text-[0.8125rem] mt-1 text-center max-w-xs" style={{ color: "#737373" }}>
            {at.subtitle}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ── Nombre artístico ── */}
          <Field
            id="artisticName"
            label={at.fields.artisticName}
            required
            error={errors.artisticName}
          >
            <input
              id="artisticName"
              type="text"
              autoComplete="nickname"
              value={fields.artisticName}
              onChange={set("artisticName")}
              disabled={loading}
              placeholder={at.fields.artisticNamePlaceholder}
              maxLength={150}
              {...inputStyle(!!errors.artisticName)}
            />
          </Field>

          {/* ── Correo ── */}
          <Field
            id="email"
            label={at.fields.email}
            required
            error={errors.email}
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoCapitalize="off"
              value={fields.email}
              onChange={set("email")}
              disabled={loading}
              placeholder={at.fields.emailPlaceholder}
              maxLength={255}
              {...inputStyle(!!errors.email)}
            />
          </Field>

          {/* ── País + Género (2 col en desktop) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              id="country"
              label={at.fields.country}
              required
              error={errors.country}
            >
              <select
                id="country"
                value={fields.country}
                onChange={set("country")}
                disabled={loading}
                {...selectStyle(!!errors.country)}
              >
                <option value="">{at.fields.countryPlaceholder}</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field
              id="genre"
              label={at.fields.genre}
              required
              error={errors.genre}
            >
              <select
                id="genre"
                value={fields.genre}
                onChange={set("genre")}
                disabled={loading}
                {...selectStyle(!!errors.genre)}
              >
                <option value="">{at.fields.genrePlaceholder}</option>
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* ── Enlace principal ── */}
          <Field
            id="mainLink"
            label={at.fields.mainLink}
            required
            error={errors.mainLink}
            hint={at.fields.mainLinkHint}
            icon={<ExternalLink size={14} style={{ color: "#525252" }} />}
          >
            <input
              id="mainLink"
              type="url"
              autoComplete="url"
              value={fields.mainLink}
              onChange={set("mainLink")}
              disabled={loading}
              placeholder={at.fields.mainLinkPlaceholder}
              maxLength={500}
              style={{ paddingLeft: "2.25rem" }}
              {...inputStyle(!!errors.mainLink)}
            />
          </Field>

          {/* ── Instagram + TikTok (opcionales, 2 col) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              id="instagram"
              label={at.fields.instagram}
              optional
              optionalLabel={at.fields.optionalBadge}
            >
              <input
                id="instagram"
                type="text"
                autoCapitalize="off"
                value={fields.instagram}
                onChange={set("instagram")}
                disabled={loading}
                placeholder={at.fields.instagramPlaceholder}
                maxLength={100}
                {...inputStyle(false)}
              />
            </Field>

            <Field
              id="tiktok"
              label={at.fields.tiktok}
              optional
              optionalLabel={at.fields.optionalBadge}
            >
              <input
                id="tiktok"
                type="text"
                autoCapitalize="off"
                value={fields.tiktok}
                onChange={set("tiktok")}
                disabled={loading}
                placeholder={at.fields.tiktokPlaceholder}
                maxLength={100}
                {...inputStyle(false)}
              />
            </Field>
          </div>

          {/* ── Mensaje (opcional) ── */}
          <Field
            id="message"
            label={at.fields.message}
            optional
            optionalLabel={at.fields.optionalBadge}
            error={errors.message}
            hint={`${fields.message.length} / ${MESSAGE_MAX} ${at.fields.messageHint}`}
          >
            <textarea
              id="message"
              value={fields.message}
              onChange={set("message")}
              disabled={loading}
              placeholder={at.fields.messagePlaceholder}
              maxLength={MESSAGE_MAX + 10}
              rows={4}
              className="w-full px-3.5 py-2.5 text-[0.875rem] text-white outline-none transition-all duration-150 disabled:opacity-50 resize-none rounded-lg"
              style={{
                background:  "#141414",
                border:      `1px solid ${errors.message ? "#EF4444" : "#2A2A2A"}`,
                caretColor:  "#F5C518",
              }}
              onFocus={e  => { e.currentTarget.style.borderColor = errors.message ? "#EF4444" : "#F5C518"; e.currentTarget.style.boxShadow = `0 0 0 3px ${errors.message ? "rgba(239,68,68,0.08)" : "rgba(245,197,24,0.08)"}`; }}
              onBlur={e   => { e.currentTarget.style.borderColor = errors.message ? "#EF4444" : "#2A2A2A"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </Field>

          {/* ── Error global ── */}
          {globalError && (
            <div
              className="flex items-center gap-2 rounded-lg px-3.5 py-2.5"
              role="alert"
              style={{
                background: "rgba(239,68,68,0.08)",
                border:     "1px solid rgba(239,68,68,0.20)",
              }}
            >
              <AlertCircle size={14} className="shrink-0" style={{ color: "#EF4444" }} />
              <p className="text-[0.8125rem]" style={{ color: "#EF4444" }}>{globalError}</p>
            </div>
          )}

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-[0.9375rem] font-semibold text-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #F5C518 0%, #E6B300 100%)",
              boxShadow:  loading ? "none" : "0 2px 12px rgba(245,197,24,0.25)",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,197,24,0.40)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(245,197,24,0.25)"; }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? at.submitting : at.submit}
          </button>

        </form>
      </div>

      <p className="mt-6 text-[0.75rem]" style={{ color: "#404040" }}>
        © {new Date().getFullYear()} NP Music Group.
      </p>
    </div>
  );
}

// ─── Helpers de estilo ─────────────────────────────────────────────────────────

function inputStyle(hasError: boolean) {
  return {
    className: "w-full rounded-lg px-3.5 py-2.5 text-[0.875rem] text-white outline-none transition-all duration-150 disabled:opacity-50",
    style: {
      background:  "#141414",
      border:      `1px solid ${hasError ? "#EF4444" : "#2A2A2A"}`,
      caretColor:  "#F5C518",
    } as React.CSSProperties,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = hasError ? "#EF4444" : "#F5C518";
      e.currentTarget.style.boxShadow   = `0 0 0 3px ${hasError ? "rgba(239,68,68,0.08)" : "rgba(245,197,24,0.08)"}`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = hasError ? "#EF4444" : "#2A2A2A";
      e.currentTarget.style.boxShadow   = "none";
    },
  };
}

function selectStyle(hasError: boolean) {
  return {
    className: "w-full rounded-lg px-3.5 py-2.5 text-[0.875rem] text-white outline-none transition-all duration-150 disabled:opacity-50 cursor-pointer",
    style: {
      background:  "#141414",
      border:      `1px solid ${hasError ? "#EF4444" : "#2A2A2A"}`,
      appearance:  "none" as const,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23525252' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat:   "no-repeat",
      backgroundPosition: "right 0.75rem center",
      paddingRight:       "2.5rem",
    } as React.CSSProperties,
    onFocus: (e: React.FocusEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = hasError ? "#EF4444" : "#F5C518";
      e.currentTarget.style.boxShadow   = `0 0 0 3px ${hasError ? "rgba(239,68,68,0.08)" : "rgba(245,197,24,0.08)"}`;
    },
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = hasError ? "#EF4444" : "#2A2A2A";
      e.currentTarget.style.boxShadow   = "none";
    },
  };
}

// ─── Componente Field ──────────────────────────────────────────────────────────

interface FieldProps {
  id:           string;
  label:        string;
  required?:    boolean;
  optional?:    boolean;
  optionalLabel?: string;
  error?:       string;
  hint?:        string;
  icon?:        React.ReactNode;
  children:     React.ReactNode;
}

function Field({ id, label, required, optional, optionalLabel, error, hint, icon, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="text-[0.8125rem] font-medium" style={{ color: "#A3A3A3" }}>
          {label}
          {required && <span className="ml-0.5" style={{ color: "#F5C518" }}>*</span>}
        </label>
        {optional && optionalLabel && (
          <span
            className="text-[0.6875rem] font-medium px-1.5 py-0.5 rounded"
            style={{ background: "#1E1E1E", color: "#525252" }}
          >
            {optionalLabel}
          </span>
        )}
      </div>

      {/* Input wrapper */}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </span>
        )}
        {children}
      </div>

      {/* Error */}
      {error && (
        <p className="text-[0.75rem] flex items-center gap-1" style={{ color: "#EF4444" }}>
          <AlertCircle size={11} className="shrink-0" />
          {error}
        </p>
      )}

      {/* Hint (solo si no hay error) */}
      {hint && !error && (
        <p className="text-[0.75rem]" style={{ color: "#525252" }}>{hint}</p>
      )}
    </div>
  );
}

// Necesario para React en el scope del archivo
import React from "react";
