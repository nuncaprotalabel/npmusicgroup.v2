"use client";

import { ArrowRight, Zap } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useInView } from "@/hooks/useInView";
import { useRipple } from "@/hooks/useRipple";

export function FinalCTA() {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ threshold: 0.15 });
  const { createRipple } = useRipple();

  return (
    <section className="py-12 sm:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div
          ref={ref}
          className={`reveal${inView ? " in-view" : ""}`}
        >
          <div
            className="relative rounded-2xl overflow-hidden px-6 sm:px-10 lg:px-14 py-12 sm:py-14"
            style={{ backgroundColor: "#F5C518" }}
          >
            {/* Texture */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 85% 15%, #000 0%, transparent 55%), radial-gradient(circle at 15% 85%, #000 0%, transparent 45%)",
              }}
              aria-hidden="true"
            />
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
              aria-hidden="true"
            />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              {/* Left */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/12 shrink-0 mt-0.5">
                  <Zap size={20} className="text-black" fill="black" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-black leading-[1.1] tracking-tight mb-2">
                    {t.finalCTA.headline}
                  </h2>
                  <p className="text-sm text-black/65 max-w-md leading-relaxed">
                    {t.finalCTA.description}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="shrink-0 w-full sm:w-auto">
                <button
                  disabled
                  onMouseDown={createRipple}
                  className="ripple-host ripple-dark inline-flex items-center justify-center gap-2.5 h-12 px-7 w-full sm:w-auto bg-black text-white text-[0.9375rem] font-semibold rounded-xl transition-all duration-200 cursor-not-allowed opacity-80 tracking-tight"
                >
                  {t.finalCTA.button}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
