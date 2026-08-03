"use client";

import { Button } from "@/components/ui/Button";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { ArrowRight, Play, Zap } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
    >
      {/* Background: radial gradient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background: "radial-gradient(ellipse at center, #F5C518 0%, transparent 70%)",
          opacity: 0.045,
          filter: "blur(80px)",
        }}
        aria-hidden="true"
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">

        {/* ── Desktop: two-column ── */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-center">
          {/* Copy */}
          <div className="flex flex-col items-start">
            <HeroCopy t={t} />
          </div>

          {/* Dashboard */}
          <div
            className="relative animate-fade-up"
            style={{ animationDelay: "0.3s", animationDuration: "0.7s" }}
          >
            {/* Glow ring border */}
            <div
              className="absolute -inset-px rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(245,197,24,0.1) 0%, transparent 50%, rgba(245,197,24,0.05) 100%)",
              }}
              aria-hidden="true"
            />
            {/* Ambient glow */}
            <div
              className="absolute -inset-10 rounded-2xl pointer-events-none blur-[60px]"
              style={{ background: "#F5C518", opacity: 0.055 }}
              aria-hidden="true"
            />

            <div className="relative animate-float-y" style={{ animationDuration: "6s" }}>
              <DashboardPanel />
            </div>

            {/* Floating badge */}
            <div
              className="absolute -right-5 -bottom-6 w-40 bg-[#080808] border border-[#222] rounded-2xl p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.7)] hidden xl:block"
              aria-hidden="true"
            >
              <div className="text-[9px] text-[#555] font-semibold uppercase tracking-widest mb-1.5">
                {t.dashboard.modules.revenue}
              </div>
              <div className="text-sm font-bold text-[#333] mb-3">—</div>
              <div className="text-[9px] text-[#555] font-semibold uppercase tracking-widest mb-2">
                {t.dashboard.modules.releases}
              </div>
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#141414] border border-[#1E1E1E] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="h-1.5 bg-[#1A1A1A] rounded-full w-3/4 mb-1" />
                      <div className="h-1 bg-[#111] rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: single column ── */}
        <div className="lg:hidden flex flex-col gap-10">
          <div className="flex flex-col items-start w-full">
            <HeroCopy t={t} />
          </div>
          <div
            className="relative w-full animate-fade-up"
            style={{ animationDelay: "0.35s", animationDuration: "0.65s" }}
          >
            <div
              className="absolute -inset-4 rounded-2xl blur-[50px] pointer-events-none"
              style={{ background: "#F5C518", opacity: 0.05 }}
              aria-hidden="true"
            />
            <div className="relative">
              <DashboardPanel compact />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── Shared copy block ── */
function HeroCopy({ t }: { t: ReturnType<typeof useTranslation>["t"] }) {
  return (
    <>
      {/* Status pill */}
      <div
        className="flex items-center gap-2 mb-7 animate-fade-up"
        style={{ animationDuration: "0.5s" }}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#F5C518]/25 bg-[#F5C518]/8 text-[#F5C518] text-[0.6875rem] font-semibold tracking-widest uppercase">
          <Zap size={9} fill="currentColor" aria-hidden="true" />
          {t.hero.label}
        </span>
      </div>

      {/* Headline */}
      <h1
        className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-balance mb-5 w-full animate-fade-up"
        style={{ animationDelay: "0.08s", animationDuration: "0.6s" }}
      >
        <span className="text-white block">{t.hero.headline1}</span>
        <span className="text-white block">{t.hero.headline2}</span>
        <span
          className="block"
          style={{
            color: "#F5C518",
            textShadow: "0 0 60px rgba(245,197,24,0.2)",
          }}
        >
          {t.hero.headline3}
        </span>
      </h1>

      {/* Description */}
      <p
        className="text-[0.9375rem] sm:text-base text-[#666] leading-[1.7] mb-8 lg:max-w-[420px] animate-fade-up"
        style={{ animationDelay: "0.16s", animationDuration: "0.6s" }}
      >
        {t.hero.description}
      </p>

      {/* CTAs */}
      <div
        className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-fade-up"
        style={{ animationDelay: "0.22s", animationDuration: "0.6s" }}
      >
        <Button
          variant="primary"
          size="lg"
          disabled
          iconRight={<ArrowRight size={16} />}
          className="w-full sm:w-auto justify-center font-semibold tracking-tight"
        >
          {t.common.startNow}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          disabled
          icon={
            <span className="w-7 h-7 flex items-center justify-center rounded-full border border-white/12 bg-white/6 shrink-0">
              <Play size={11} fill="white" aria-hidden="true" />
            </span>
          }
          className="w-full sm:w-auto justify-center text-[#888] hover:text-white"
        >
          {t.common.viewPlatform}
        </Button>
      </div>

      {/* Trust indicators */}
      <div
        className="flex items-center gap-5 mt-8 pt-8 border-t border-[#141414] animate-fade-up"
        style={{ animationDelay: "0.3s", animationDuration: "0.6s" }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-white">100+</span>
          <span className="text-[0.6875rem] text-[#555]">Plataformas</span>
        </div>
        <div className="w-px h-8 bg-[#1A1A1A]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-white">SaaS</span>
          <span className="text-[0.6875rem] text-[#555]">Profesional</span>
        </div>
        <div className="w-px h-8 bg-[#1A1A1A]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-white">Global</span>
          <span className="text-[0.6875rem] text-[#555]">Distribución</span>
        </div>
      </div>
    </>
  );
}
