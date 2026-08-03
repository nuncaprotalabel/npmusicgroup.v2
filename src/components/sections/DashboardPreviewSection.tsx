"use client";

import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useInView } from "@/hooks/useInView";

export function DashboardPreviewSection() {
  const { t } = useTranslation();
  const { ref: copyRef, inView: copyInView } = useInView();
  const { ref: panelRef, inView: panelInView } = useInView({ threshold: 0.08 });

  return (
    <section id="plataforma" className="py-24 lg:py-32 border-t border-[#141414]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:items-center">

          {/* Copy */}
          <div
            ref={copyRef}
            className={`w-full reveal${copyInView ? " in-view" : ""}`}
          >
            <p className="section-label mb-4">{t.dashboardPreview.sectionLabel}</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
              {t.dashboardPreview.headline1}
              <br />
              {t.dashboardPreview.headline2}
              <br />
              <span style={{ color: "#F5C518" }}>{t.dashboardPreview.headline3}</span>
            </h2>
            <p className="text-[0.9375rem] text-[#666] leading-[1.7] mb-8 max-w-md">
              {t.dashboardPreview.description}
            </p>

            {/* Highlights */}
            <ul className="space-y-3">
              {t.dashboardPreview.highlights.map((item, i) => (
                <li
                  key={item}
                  className={`reveal${copyInView ? " in-view" : ""} reveal-delay-${Math.min(i + 1, 6)} flex items-center gap-3`}
                >
                  <CheckCircle2
                    size={15}
                    className="shrink-0"
                    style={{ color: "#F5C518" }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-[#999]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard */}
          <div
            ref={panelRef}
            className={`relative w-full reveal${panelInView ? " in-view" : ""} reveal-delay-2`}
          >
            <div
              className="absolute -inset-6 rounded-2xl pointer-events-none blur-[70px]"
              style={{ background: "#F5C518", opacity: 0.04 }}
              aria-hidden="true"
            />
            <div className="relative w-full">
              <DashboardPanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
