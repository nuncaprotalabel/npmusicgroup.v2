/**
 * InDevelopment — estado compartido para módulos en desarrollo.
 * Muestra un mensaje claro y profesional sin romper la pantalla.
 * Conforme a PROJECT_RULES.md: nunca mostrar una pantalla rota.
 */
"use client";

import { Wrench } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";
import type { DashboardModuleKey } from "./navigation";

export type { DashboardModuleKey };

interface InDevelopmentProps {
  moduleName?: string;
  moduleKey?: DashboardModuleKey;
  /** Descripción adicional opcional */
  description?: string;
}

export function InDevelopment({ moduleName, moduleKey, description }: InDevelopmentProps) {
  const { t } = useTranslation();
  const title = moduleKey ? t.dashboard.modules[moduleKey] : moduleName ?? t.dashboard.inDevelopment.title;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.12)" }}
      >
        <Wrench size={24} strokeWidth={1.5} style={{ color: "#F5C518" }} />
      </div>

      {/* Badge */}
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.6875rem] font-semibold mb-4"
        style={{
          background: "rgba(245,197,24,0.08)",
          border:     "1px solid rgba(245,197,24,0.15)",
          color:      "#F5C518",
        }}
      >
        {t.dashboard.inDevelopment.badge}
      </span>

      <h1 className="text-xl font-bold text-white mb-2 tracking-tight">
        {title}
      </h1>

      <p className="text-sm max-w-sm leading-relaxed" style={{ color: "#737373" }}>
        {description ?? t.dashboard.inDevelopment.description}
      </p>

      <Link
        href="/admin"
        className="mt-6 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#F5C518] hover:text-black"
        style={{ border: "1px solid #2A2A2A", color: "#A3A3A3" }}
      >
        {t.dashboard.modulePage.backToCentral}
      </Link>
    </div>
  );
}
