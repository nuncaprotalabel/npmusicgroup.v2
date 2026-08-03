"use client";

import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="inicio"
      className="relative h-screen min-h-[620px] max-h-[1080px] overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background image with slow Ken Burns zoom ── */}
      <div className="absolute inset-0 animate-hero-zoom">
        <Image
          src="/artist-hero.png"
          alt="NP Music Group — Artista"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* ── Primary gradient overlay — heavy at bottom, light at top ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.20) 30%, rgba(0,0,0,0.60) 65%, rgba(0,0,0,0.92) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Horizontal vignette for depth ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Warm accent glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% 75%, rgba(245,196,0,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Content — bottom on mobile, center on desktop ── */}
      <div className="relative h-full flex flex-col justify-end lg:justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 pb-14 sm:pb-20 lg:pb-0">
          <div className="max-w-[580px]">

            {/* Logo row */}
            <div className="flex items-center gap-3 mb-7 animate-hero-content-1">
              <div
                className="relative w-10 h-10 shrink-0"
                style={{ filter: "drop-shadow(0 2px 14px rgba(245,196,0,0.30))" }}
              >
                <Image src="/logo.png" alt="NP Music Group" fill className="object-contain" />
              </div>
              <span
                className="text-[0.8125rem] font-bold text-white/90 tracking-wide"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
              >
                NP Music Group
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-white mb-5 animate-hero-content-2"
              style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}
            >
              <span className="block">{t.hero.headline1}</span>
              <span className="block">{t.hero.headline2}</span>
              <span
                className="block"
                style={{
                  color: "#F5C400",
                  textShadow: "0 0 50px rgba(245,196,0,0.35), 0 2px 30px rgba(0,0,0,0.6)",
                }}
              >
                {t.hero.headline3}
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-[0.9375rem] sm:text-base leading-[1.68] mb-9 max-w-[420px] animate-hero-content-3"
              style={{
                color: "rgba(255,255,255,0.78)",
                textShadow: "0 1px 10px rgba(0,0,0,0.5)",
              }}
            >
              Distribuye tu música en todas las plataformas digitales y gestiona tu carrera con herramientas profesionales.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 animate-hero-content-4">

              {/* Primary — yellow */}
              <button
                disabled
                className="group flex items-center justify-center gap-2 px-7 py-[14px] rounded-full text-[0.875rem] font-semibold text-black w-full sm:w-auto transition-all duration-200 cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #F5C400 0%, #E6B300 100%)",
                  boxShadow: "0 4px 28px rgba(245,196,0,0.30), 0 1px 0 rgba(255,255,255,0.15) inset",
                }}
                aria-label="Distribuye tu música — próximamente"
              >
                Distribuye tu música
                <ArrowRight size={15} strokeWidth={2.5} />
              </button>

              {/* Secondary — glass outline */}
              <button
                disabled
                className="flex items-center justify-center gap-2 px-7 py-[14px] rounded-full text-[0.875rem] font-semibold text-white w-full sm:w-auto transition-all duration-200 cursor-not-allowed"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.30)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
                aria-label="Conocer más"
              >
                Conocer más
                <ChevronDown size={15} strokeWidth={2.5} />
              </button>

            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 animate-hero-content-4"
          aria-hidden="true"
        >
          <div className="w-px h-7 bg-gradient-to-b from-transparent to-white/40" />
          <ChevronDown size={13} className="text-white/40 animate-bounce" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>
    </section>
  );
}
