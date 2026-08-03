"use client";

import { Button } from "@/components/ui/Button";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.04] blur-[120px] pointer-events-none"
        style={{ background: "#F5C518" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col items-start">
            {/* Label */}
            <div className="flex items-center gap-2 mb-7">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#F5C518" }}
              />
              <p className="section-label">
                Plataforma todo-en-uno para artistas independientes
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-balance mb-6">
              <span className="text-white block">Tu música.</span>
              <span className="text-white block">Tu carrera.</span>
              <span style={{ color: "#F5C518" }} className="block">Tu negocio.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#737373] leading-relaxed max-w-md mb-8">
              Distribuye tu música en todas las plataformas digitales, gestiona tu carrera y genera ingresos reales con herramientas profesionales diseñadas para artistas independientes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                disabled
                iconRight={<ArrowRight size={18} />}
                className="w-full sm:w-auto"
              >
                Comenzar ahora
              </Button>
              <Button
                variant="ghost"
                size="lg"
                disabled
                icon={
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10">
                    <Play size={12} fill="white" />
                  </span>
                }
                className="w-full sm:w-auto"
              >
                Ver plataforma
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8 pt-8 border-t border-[#1A1A1A] w-full">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-black"
                    style={{
                      backgroundColor: i === 0 ? "#F5C518" : i === 1 ? "#A3A3A3" : i === 2 ? "#737373" : "#404040",
                      zIndex: 4 - i,
                    }}
                  >
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">+2.000 artistas activos</p>
                <p className="text-[11px] text-[#737373]">confían en NP Music Group</p>
              </div>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative hidden lg:block">
            {/* Subtle glow behind dashboard */}
            <div
              className="absolute -inset-8 rounded-2xl opacity-[0.06] blur-[60px] pointer-events-none"
              style={{ background: "#F5C518" }}
            />
            <div className="relative">
              <DashboardPanel compact />
              {/* Mobile mockup overlay — right side hint */}
              <div
                className="absolute -right-4 -bottom-6 w-32 bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl p-3 shadow-2xl hidden xl:block"
                style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.8)" }}
              >
                <div className="text-[9px] text-[#737373] font-medium mb-1.5">Ingresos</div>
                <div className="text-sm font-bold text-[#404040] mb-2">—</div>
                <div className="text-[9px] text-[#737373] font-medium mb-1">Lanzamientos recientes</div>
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

        {/* Mobile Dashboard (shown below on small screens) */}
        <div className="lg:hidden mt-10">
          <DashboardPanel compact />
        </div>
      </div>
    </section>
  );
}
