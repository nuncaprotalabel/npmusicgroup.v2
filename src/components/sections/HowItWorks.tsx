"use client";

import { UserPlus, Upload, Globe, DollarSign } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useInView } from "@/hooks/useInView";

const icons = [UserPlus, Upload, Globe, DollarSign];

export function HowItWorks() {
  const { t } = useTranslation();
  const { ref: headRef, inView: headInView } = useInView();
  const { ref: stepsRef, inView: stepsInView } = useInView({ threshold: 0.05 });

  return (
    <section className="py-24 lg:py-32 border-t border-[#141414]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div
          ref={headRef}
          className={`mb-14 lg:mb-18 reveal${headInView ? " in-view" : ""}`}
        >
          <p className="section-label mb-4">{t.howItWorks.sectionLabel}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
            {t.howItWorks.headline}
          </h2>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="relative">
          {/* Connector line (desktop only) */}
          <div
            className="absolute top-10 left-0 right-0 h-px hidden lg:block pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, #1E1E1E 8%, #F5C518 30%, #F5C518 50%, #1E1E1E 92%, transparent 100%)",
              opacity: 0.25,
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {t.howItWorks.steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <div
                  key={step.title}
                  className={`reveal${stepsInView ? " in-view" : ""} reveal-delay-${i + 1} relative flex flex-col items-start sm:items-start lg:items-center lg:text-center`}
                >
                  {/* Number + Icon */}
                  <div className="relative mb-6 shrink-0 group">
                    {/* Step number badge */}
                    <div
                      className="absolute -top-2.5 -right-2.5 z-10 w-5 h-5 flex items-center justify-center rounded-full bg-[#F5C518] text-black text-[10px] font-bold shadow-[0_0_12px_rgba(245,197,24,0.4)]"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>
                    <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-[#080808] border border-[#1A1A1A] transition-all duration-300 group-hover:border-[#F5C518]/25 group-hover:bg-[#F5C518]/5 group-hover:shadow-[0_0_24px_rgba(245,197,24,0.10)] group-hover:-translate-y-1">
                      <Icon
                        size={26}
                        className="text-[#444] transition-all duration-300 group-hover:text-[#F5C518] group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-[0.9375rem] font-semibold text-white mb-2.5 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed max-w-[240px] lg:max-w-none">
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
