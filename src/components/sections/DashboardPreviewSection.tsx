"use client";

import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function DashboardPreviewSection() {
  const { t } = useTranslation();

  return (
    <section id="plataforma" className="py-24 lg:py-32 border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy — first in DOM = first on mobile */}
          <div>
            <p className="section-label mb-4">{t.dashboardPreview.sectionLabel}</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-5">
              {t.dashboardPreview.headline1}
              <br />
              {t.dashboardPreview.headline2}
              <br />
              <span style={{ color: "#F5C518" }}>{t.dashboardPreview.headline3}</span>
            </h2>
            <p className="text-base text-[#737373] leading-relaxed mb-8 max-w-md">
              {t.dashboardPreview.description}
            </p>

            {/* Highlights */}
            <ul className="space-y-3">
              {t.dashboardPreview.highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={16}
                    className="shrink-0"
                    style={{ color: "#F5C518" }}
                    aria-hidden="true"
                  />
                  <span className="text-sm text-[#A3A3A3]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Dashboard */}
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-2xl opacity-[0.04] blur-[80px] pointer-events-none"
              style={{ background: "#F5C518" }}
              aria-hidden="true"
            />
            <div className="relative">
              <DashboardPanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
