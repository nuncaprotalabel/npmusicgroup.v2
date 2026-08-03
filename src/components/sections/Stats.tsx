"use client";

import Image from "next/image";
import { PlatformsBar } from "./PlatformsBar";
import { Globe, Users, DollarSign, Rocket } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const icons = [Globe, Users, DollarSign, Rocket];

export function Stats() {
  const { t } = useTranslation();

  return (
    <section id="distribucion">
      {/* Platforms */}
      <PlatformsBar label={t.platforms.distributionLabel} />

      {/* Capabilities */}
      <div className="bg-[#050505] border-b border-[#1A1A1A]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          {/* Header */}
          <div className="mb-10 lg:mb-12">
            <p className="section-label mb-3">{t.capabilities.sectionLabel}</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white max-w-xl">
              {t.capabilities.headline}
            </h2>
          </div>

          {/* Capability items: 2-col on mobile, 4-col on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {t.capabilities.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <div key={item.title} className="flex flex-col gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0A0A0A] border border-[#1E1E1E] shrink-0">
                    <Icon size={18} className="text-[#737373]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1.5">{item.title}</p>
                    <p className="text-sm text-[#737373] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Brand badge */}
          <div className="mt-12 pt-8 border-t border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 relative shrink-0">
                <Image
                  src="/logo.png"
                  alt="NP Music Group"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">
                  {t.capabilities.brand}
                </p>
                <p className="text-sm text-[#737373] leading-tight">
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
