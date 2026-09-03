"use client";

/**
 * DashboardHeader — barra superior del dashboard.
 * Muestra breadcrumb, perfil de usuario, selector de idioma y botón de logout.
 */
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut, Loader2, Menu } from "lucide-react";
import { logout } from "@/services/authService";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useTranslation } from "@/i18n/useTranslation";
import type { UserRole } from "@/types/auth";

interface DashboardHeaderProps {
  username: string;
  role: UserRole;
  onMenuToggle: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN:          "Super Admin",
  ADMIN:                "Admin",
  DISTRIBUTION_MANAGER: "Distribución",
  MANAGER:              "Manager",
  ARTIST:               "Artista",
  VIEWER:               "Viewer",
};

const MODULE_LABELS: Record<string, string> = {
  "/dashboard/central":                  "Central",
  "/dashboard/artistas":                 "Artistas",
  "/dashboard/solicitudes":              "Solicitudes",
  "/admin/solicitudes":                   "Solicitudes",
  "/dashboard/invitaciones":             "Invitaciones",
  "/admin/invitaciones":                  "Invitaciones",
  "/dashboard/contratos":                "Contratos",
  "/admin/contratos":                     "Contratos",
  "/dashboard/lanzamientos":             "Lanzamientos",
  "/dashboard/lanzamientos/recibidos":   "Recibidos / Pendientes",
  "/dashboard/analiticas":               "Analíticas",
  "/dashboard/ingresos":                 "Ingresos",
  "/dashboard/mensajes":                 "Mensajes",
  "/dashboard/cuentas":                  "Cuentas",
  "/admin/cuentas":                       "Cuentas",
  "/dashboard/permisos":                 "Permisos",
  "/dashboard/configuracion":            "Configuración",
};

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

function getCurrentModule(pathname: string): string {
  // Buscar match exacto primero, luego por prefijo (más específico primero)
  const sorted = Object.entries(MODULE_LABELS).sort((a, b) => b[0].length - a[0].length);
  for (const [path, label] of sorted) {
    if (pathname === path || pathname.startsWith(path + "/")) return label;
  }
  return "Dashboard";
}

export function DashboardHeader({ username, role, onMenuToggle }: DashboardHeaderProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  const moduleName = getCurrentModule(pathname);
  const initials   = getInitials(username);
  const roleLabel  = ROLE_LABELS[role] ?? role;

  async function handleLogout() {
    setBusy(true);
    await logout();
    window.location.href = "/";
  }

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 h-14 shrink-0 border-b"
      style={{ background: "#040404", borderColor: "#141414" }}
    >
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150 shrink-0"
          style={{ color: "#737373" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
          onMouseLeave={e => (e.currentTarget.style.color = "#737373")}
          onClick={onMenuToggle}
          aria-label="Abrir navegación"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[0.8125rem]" style={{ color: "#444444" }}>
            Dashboard
          </span>
          <span className="text-[0.8125rem]" style={{ color: "#2A2A2A" }}>
            /
          </span>
          <span className="text-[0.8125rem] font-semibold text-white truncate">
            {moduleName}
          </span>
        </div>
      </div>

      {/* Right: language + user + logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Language selector */}
        <LanguageSelector />

        {/* User info */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Avatar */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[0.625rem] font-bold text-black shrink-0"
            style={{ background: "#F5C518" }}
            title={username}
          >
            {initials}
          </div>
          {/* Name + role */}
          <div className="hidden md:block">
            <p className="text-[0.8125rem] font-medium text-white leading-none">
              {username}
            </p>
            <p className="text-[0.6875rem] mt-0.5 leading-none" style={{ color: "#525252" }}>
              {roleLabel}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={busy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "#0A0A0A",
            border:     "1px solid #1E1E1E",
            color:      "#737373",
          }}
          onMouseEnter={e => {
            if (!busy) {
              e.currentTarget.style.borderColor = "#EF4444";
              e.currentTarget.style.color       = "#EF4444";
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#1E1E1E";
            e.currentTarget.style.color       = "#737373";
          }}
          aria-label={busy ? t.dashboard.header.loggingOut : t.dashboard.header.logout}
        >
          {busy
            ? <Loader2 size={12} className="animate-spin" />
            : <LogOut  size={12} strokeWidth={1.75} />
          }
          <span className="hidden sm:inline">
            {busy ? t.dashboard.header.loggingOut : t.dashboard.header.logout}
          </span>
        </button>
      </div>
    </header>
  );
}
