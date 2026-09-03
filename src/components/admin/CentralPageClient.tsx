"use client";

import Link from "next/link";
import { AlertCircle, BarChart2, DollarSign, FileText, MessageSquare, Send, Users } from "lucide-react";
import type { UserRole } from "@/types/auth";
import { useTranslation } from "@/i18n/useTranslation";

interface CentralPageClientProps {
  username: string;
  role: UserRole;
}

const MODULES = [
  { key: "artists" as const, href: "/admin/artistas", icon: Users },
  { key: "releases" as const, href: "/admin/lanzamientos", icon: Send },
  { key: "contracts" as const, href: "/admin/contratos", icon: FileText },
  { key: "revenue" as const, href: "/admin/ingresos", icon: DollarSign },
  { key: "analytics" as const, href: "/admin/analiticas", icon: BarChart2 },
  { key: "messaging" as const, href: "/admin/mensajes", icon: MessageSquare },
];

const MODULE_DESCRIPTIONS = {
  artists: {
    es: "Gestión de artistas y perfiles",
    en: "Artist and profile management",
  },
  releases: {
    es: "Publicaciones y lanzamientos",
    en: "Releases and publications",
  },
  contracts: {
    es: "Contratos y acuerdos digitales",
    en: "Contracts and digital agreements",
  },
  revenue: {
    es: "Ingresos y distribución de royalties",
    en: "Income and royalty distribution",
  },
  analytics: {
    es: "Estadísticas y métricas",
    en: "Statistics and metrics",
  },
  messaging: {
    es: "Comunicación interna",
    en: "Internal communication",
  },
} as const;

export function CentralPageClient({ username, role }: CentralPageClientProps) {
  const { t, language } = useTranslation();
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {t.dashboard.modules.central}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#737373" }}>
          {language === "es" ? "Vista general de tu plataforma." : "Overview of your platform."}
        </p>
      </div>

      <div className="rounded-xl p-6" style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}>
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(245,197,24,0.08)" }}
          >
            <span className="text-[0.75rem] font-bold" style={{ color: "#F5C518" }}>
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white mb-1">
              {language === "es" ? `Bienvenido, ${username}` : `Welcome, ${username}`}
            </h2>
            <p className="text-sm" style={{ color: "#737373" }}>
              {language === "es" ? "Accediste como " : "You are signed in as "}
              <span className="font-medium" style={{ color: "#A3A3A3" }}>{role}</span>.
              {" "}
              {language === "es"
                ? "Usa el menú lateral para navegar por los módulos disponibles."
                : "Use the sidebar to navigate through the available modules."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}>
        <h2 className="text-sm font-semibold text-white mb-4">
          {language === "es" ? "Módulos disponibles" : "Available modules"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map(({ key, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 rounded-lg border border-transparent transition-all duration-150 hover:border-[#2A2A2A] hover:bg-[#1A1A1A]"
              style={{ background: "#141414" }}
            >
              <Icon size={17} strokeWidth={1.75} style={{ color: "#F5C518" }} />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-white">
                  {t.dashboard.modules[key]}
                </span>
                <span className="block text-xs mt-0.5" style={{ color: "#525252" }}>
                  {MODULE_DESCRIPTIONS[key][language]}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}>
        <h2 className="text-sm font-semibold text-white mb-4">
          {t.dashboard.recentActivity}
        </h2>
        <div className="flex items-center gap-2 py-4" style={{ color: "#525252" }}>
          <AlertCircle size={14} strokeWidth={1.75} />
          <span className="text-sm">{t.dashboard.noActivity}</span>
        </div>
      </div>
    </div>
  );
}