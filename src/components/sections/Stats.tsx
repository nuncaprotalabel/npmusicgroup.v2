"use client";

import Image from "next/image";
import { PlatformsBar } from "./PlatformsBar";
import { Globe, Users, DollarSign, Rocket } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useInView } from "@/hooks/useInView";

const icons = [Globe, Users, DollarSign, Rocket];

export function Stats() {
  const { t } = useTranslation();
  const { ref: headRef, inView: headInView } = useInView();
  const { ref: itemsRef, inView: itemsInView } = useInView({ threshold: 0.06 });

  return (
    <section id="distribucion">
      {/* Platforms */}
      <PlatformsBar label={t.platforms.distributionLabel} />

      {/* Capabilities */}
      <div className="bg-[#050505] border-b border-[#141414]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">

          {/* Header */}
          <div
            ref={headRef}
            className={`mb-10 lg:mb-14 reveal${headInView ? " in-view" : ""}`}
          >
            <p className="section-label mb-3">{t.capabilities.sectionLabel}</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight text-white max-w-xl">
              {t.capabilities.headline}
            </h2>
          </div>

          {/* Capability items */}
          <div
            ref={itemsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          >
            {t.capabilities.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <div
                  key={item.title}
                  className={`reveal${itemsInView ? " in-view" : ""} reveal-delay-${i + 1} flex flex-col gap-3`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] shrink-0 transition-all duration-300 hover:border-[#F5C518]/20 hover:bg-[#F5C518]/5 group">
                    <Icon
                      size={17}
                      className="text-[#555] transition-colors duration-300 group-hover:text-[#F5C518]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1.5 leading-snug">{item.title}</p>
                    <p className="text-sm text-[#666] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Brand badge */}
          <div className="mt-12 pt-8 border-t border-[#141414]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 relative shrink-0">
                <Image
                  src="/logo-transparent.png"
                  alt="NP Music Group"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">
                  {t.capabilities.brand}
                </p>
                <p className="text-sm text-[#666] leading-tight">
                  {t.capabilities.brandSub}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
