"use client";

import { Button } from "@/components/ui/Button";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { ArrowRight, Play } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
    >
      {/* Background glow — clipped inside section */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04] blur-[100px] pointer-events-none"
        style={{ background: "#F5C518" }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">

        {/* ── Desktop: two-column ── */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Copy */}
          <div className="flex flex-col items-start">
            <HeroCopy t={t} />
          </div>

          {/* Dashboard preview */}
          <div className="relative">
            <div
              className="absolute -inset-8 rounded-2xl opacity-[0.05] blur-[60px] pointer-events-none"
              style={{ background: "#F5C518" }}
              aria-hidden="true"
            />
            <div className="relative">
              <DashboardPanel />
              {/* Floating badge */}
              <div
                className="absolute -right-4 -bottom-5 w-36 bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl p-3 shadow-2xl hidden xl:block"
                aria-hidden="true"
              >
                <div className="text-[9px] text-[#737373] font-medium mb-1.5">
                  {t.dashboard.modules.revenue}
                </div>
                <div className="text-sm font-bold text-[#404040] mb-2.5">—</div>
                <div className="text-[9px] text-[#737373] font-medium mb-1.5">
                  {t.dashboard.modules.releases}
                </div>
                <div className="space-y-1.5">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded bg-[#1A1A1A] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-1.5 bg-[#1A1A1A] rounded-full w-3/4 mb-1" />
                        <div className="h-1 bg-[#141414] rounded-full w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: single column ── */}
        <div className="lg:hidden flex flex-col gap-10">
          {/* Copy */}
          <div className="flex flex-col items-start w-full">
            <HeroCopy t={t} />
          </div>

          {/* Dashboard preview — full width, sidebar icon-only to maximize content area */}
          <div className="relative w-full">
            <div
              className="absolute -inset-4 rounded-2xl opacity-[0.05] blur-[50px] pointer-events-none"
              style={{ background: "#F5C518" }}
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
      {/* Label */}
      <div className="flex items-center gap-2 mb-6">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: "#F5C518" }}
          aria-hidden="true"
        />
        <p className="section-label">{t.hero.label}</p>
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-balance mb-5 w-full">
        <span className="text-white block">{t.hero.headline1}</span>
        <span className="text-white block">{t.hero.headline2}</span>
        <span style={{ color: "#F5C518" }} className="block">
          {t.hero.headline3}
        </span>
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-[#737373] leading-relaxed mb-8 lg:max-w-md">
        {t.hero.description}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          variant="primary"
          size="lg"
          disabled
          iconRight={<ArrowRight size={18} />}
          className="w-full sm:w-auto justify-center"
        >
          {t.common.startNow}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          disabled
          icon={
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 shrink-0">
              <Play size={12} fill="white" aria-hidden="true" />
            </span>
          }
          className="w-full sm:w-auto justify-center"
        >
          {t.common.viewPlatform}
        </Button>
      </div>
    </>
  );
}
