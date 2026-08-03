"use client";

import { Globe, BarChart2, Users, FileText, UserPlus, Rocket } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useInView } from "@/hooks/useInView";

const icons = [Globe, BarChart2, Users, FileText, UserPlus, Rocket];

export function Services() {
  const { t } = useTranslation();
  const { ref: headRef, inView: headInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView({ threshold: 0.06 });

  return (
    <section id="servicios" className="py-24 lg:py-32">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div
          ref={headRef}
          className={`mb-12 lg:mb-16 reveal${headInView ? " in-view" : ""}`}
        >
          <p className="section-label mb-4">{t.services.sectionLabel}</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight max-w-xl">
            {t.services.headline}
          </h2>
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.services.items.map((service, i) => {
            const Icon = icons[i];
            return (
              <div
                key={service.title}
                className={`reveal${gridInView ? " in-view" : ""} reveal-delay-${Math.min(i + 1, 6)}`}
              >
                <div className="group relative bg-[#080808] border border-[#181818] rounded-xl p-6 cursor-default h-full transition-all duration-300 hover:border-[#F5C518]/18 hover:-translate-y-1"
                  style={{ transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, box-shadow 0.25s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,197,24,0.08), 0 0 30px rgba(245,197,24,0.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
                >
                  {/* Hover accent top line */}
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#F5C518]/0 to-transparent group-hover:via-[#F5C518]/30 transition-all duration-400" />
                  {/* Hover left accent */}
                  <div className="absolute left-0 top-4 bottom-4 w-px bg-[#F5C518]/0 group-hover:bg-[#F5C518]/20 rounded-full transition-all duration-300" />

                  {/* Icon */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#111] border border-[#1E1E1E] mb-5 group-hover:border-[#F5C518]/30 group-hover:bg-[#F5C518]/8 transition-all duration-300 shrink-0 group-hover:shadow-[0_0_16px_rgba(245,197,24,0.10)]">
                    <Icon
                      size={17}
                      className="text-[#555] group-hover:text-[#F5C518] transition-all duration-300 group-hover:scale-110"
                      aria-hidden="true"
                      style={{ transitionProperty: "color, transform" }}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-[0.9375rem] font-semibold text-white mb-2.5 leading-snug group-hover:text-white transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed group-hover:text-[#777] transition-colors duration-200">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
