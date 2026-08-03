"use client";

import { ArrowRight, Rocket } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function FinalCTA() {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="relative rounded-2xl overflow-hidden px-6 sm:px-10 lg:px-14 py-12 sm:py-14"
          style={{ backgroundColor: "#F5C518" }}
        >
          {/* Subtle background texture */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, #000 0%, transparent 50%), radial-gradient(circle at 20% 80%, #000 0%, transparent 40%)",
            }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            {/* Left */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-black/10 shrink-0 mt-0.5">
                <Rocket size={20} className="text-black" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black leading-tight tracking-tight mb-2">
                  {t.finalCTA.headline}
                </h2>
                <p className="text-sm text-black/70 max-w-md leading-relaxed">
                  {t.finalCTA.description}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                disabled
                className="inline-flex items-center justify-center gap-2.5 h-12 px-7 w-full sm:w-auto bg-black text-white text-sm font-semibold rounded-xl transition-all duration-150 cursor-not-allowed opacity-80"
              >
                {t.finalCTA.button}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
