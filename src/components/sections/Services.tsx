"use client";

import { Globe, BarChart2, Users, FileText, UserPlus, Rocket } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const icons = [Globe, BarChart2, Users, FileText, UserPlus, Rocket];

export function Services() {
  const { t } = useTranslation();

  return (
    <section id="servicios" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <p className="section-label mb-4">{t.services.sectionLabel}</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight max-w-lg">
              {t.services.headline}
            </h2>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.services.items.map((service, i) => {
            const Icon = icons[i];
            return (
              <div
                key={service.title}
                className="group relative bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 hover:border-[#2A2A2A] hover:bg-[#0D0D0D] transition-all duration-200"
              >
                {/* Icon */}
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#141414] border border-[#1E1E1E] mb-5 group-hover:border-[#F5C518]/20 group-hover:bg-[#F5C518]/6 transition-all duration-200">
                  <Icon
                    size={20}
                    className="text-[#737373] group-hover:text-[#F5C518] transition-colors duration-200"
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-[#737373] leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
