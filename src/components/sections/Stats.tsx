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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          {/* Header */}
          <div className="mb-10 lg:mb-12">
            <p className="section-label mb-3">{t.capabilities.sectionLabel}</p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-white max-w-xl">
              {t.capabilities.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-start">
            {/* Capability items */}
            {t.capabilities.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 lg:col-span-1"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0A0A0A] border border-[#1E1E1E]">
                    <Icon size={18} className="text-[#737373]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-[#737373] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Brand badge */}
            <div className="sm:col-span-2 lg:col-span-1 flex flex-col lg:items-end items-start gap-2 lg:mt-0 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative shrink-0">
                  <Image
                    src="/logo.png"
                    alt="NP Music Group"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">
                    {t.capabilities.brand}
                  </p>
                  <p className="text-xs text-[#737373] leading-tight">
                    {t.capabilities.brandSub}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
