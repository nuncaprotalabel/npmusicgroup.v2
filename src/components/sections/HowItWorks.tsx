"use client";

import { UserPlus, Upload, Globe, DollarSign } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const icons = [UserPlus, Upload, Globe, DollarSign];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-24 lg:py-32 border-t border-[#1A1A1A]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-14 lg:mb-16">
          <p className="section-label mb-4">{t.howItWorks.sectionLabel}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            {t.howItWorks.headline}
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div
            className="absolute top-10 left-0 right-0 h-px hidden lg:block pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, #1E1E1E 10%, #1E1E1E 90%, transparent)",
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {t.howItWorks.steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <div
                  key={step.title}
                  className="relative flex flex-col items-start sm:items-start lg:items-center lg:text-center"
                >
                  {/* Number + Icon */}
                  <div className="relative mb-5 shrink-0">
                    <div
                      className="absolute -top-2 -right-2 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-[#F5C518] text-black text-[10px] font-bold"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>
                    <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-[#0A0A0A] border border-[#1E1E1E]">
                      <Icon size={28} className="text-white" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#737373] leading-relaxed max-w-[240px] lg:max-w-none">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
