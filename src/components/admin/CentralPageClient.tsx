"use client";

import Link from "next/link";
import { AlertCircle, BarChart2, DollarSign, FileText, MessageSquare, Send, Users } from "lucide-react";
import type { UserRole } from "@/types/auth";
import { useTranslation } from "@/i18n/useTranslation";

interface CentralPageClientProps {
  username: string;
  role: UserRole;
}

const ADMIN_MODULES = [
  { key: "artists" as const, href: "/admin/artistas", icon: Users, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] as UserRole[] },
  { key: "releases" as const, href: "/admin/lanzamientos", icon: Send, roles: ["SUPER_ADMIN", "ADMIN", "DISTRIBUTION_MANAGER", "MANAGER"] as UserRole[] },
  { key: "contracts" as const, href: "/admin/contratos", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN", "MANAGER"] as UserRole[] },
  { key: "revenue" as const, href: "/admin/ingresos", icon: DollarSign, roles: ["SUPER_ADMIN", "ADMIN"] as UserRole[] },
  { key: "analytics" as const, href: "/admin/analiticas", icon: BarChart2, roles: ["SUPER_ADMIN", "ADMIN"] as UserRole[] },
  { key: "messaging" as const, href: "/admin/mensajes", icon: MessageSquare, roles: ["SUPER_ADMIN", "ADMIN"] as UserRole[] },
];

const ARTIST_MODULES = [
  { key: "profile" as const, href: "/dashboard/perfil", icon: Users },
  { key: "releases" as const, href: "/dashboard/releases", icon: Send },
  { key: "analytics" as const, href: "/dashboard/analiticas", icon: BarChart2 },
  { key: "revenue" as const, href: "/dashboard/ingresos", icon: DollarSign },
];

export function CentralPageClient({ username, role }: CentralPageClientProps) {
  const { t, language } = useTranslation();
  const initials = username.slice(0, 2).toUpperCase();
  const modules = role === "ARTIST"
    ? ARTIST_MODULES
    : ADMIN_MODULES.filter((module) => module.roles.includes(role));

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
          {modules.map(({ key, href, icon: Icon }) => (
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
                  {t.dashboard.modulePage.description}
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