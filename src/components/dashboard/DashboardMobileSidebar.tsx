"use client";

/**
 * DashboardMobileSidebar — drawer lateral para móvil.
 * Se muestra/oculta según el estado gestionado por DashboardHeaderWrapper.
 */
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  DollarSign,
  MessageSquare,
  UserCog,
  UserRound,
  ShieldCheck,
  Settings,
  Mail,
  Send,
  Inbox,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/i18n/useTranslation";
import type { UserRole } from "@/types/auth";

interface MobileNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  children?: { href: string; label: string }[];
  roles?: UserRole[];
}

const NAV_GROUPS: { group: string; items: MobileNavItem[] }[] = [
  {
    group: "Plataforma",
    items: [
      { href: "/dashboard/central",    label: "Central",              icon: LayoutDashboard },
      { href: "/dashboard/perfil",     label: "Mi perfil",             icon: UserRound, roles: ["ARTIST"] },
    ],
  },
  {
    group: "Gestión",
    items: [
      { href: "/dashboard/artistas",    label: "Artistas",            icon: Users },
      { href: "/admin/solicitudes", label: "Solicitudes",              icon: Inbox },
      { href: "/admin/invitaciones", label: "Invitaciones",             icon: Mail },
      { href: "/admin/contratos", label: "Contratos",                     icon: FileText },
      { href: "/dashboard/lanzamientos",label: "Lanzamientos",        icon: Send,
        children: [
          { href: "/dashboard/lanzamientos/recibidos", label: "Recibidos / Pendientes" },
        ],
      },
    ],
  },
  {
    group: "Finanzas",
    items: [
      { href: "/dashboard/analiticas", label: "Analíticas",   icon: BarChart2 },
      { href: "/dashboard/ingresos",   label: "Ingresos",     icon: DollarSign },
      { href: "/dashboard/mensajes",   label: "Mensajes",     icon: MessageSquare },
    ],
  },
  {
    group: "Sistema",
    items: [
      { href: "/admin/cuentas",            label: "Cuentas",       icon: UserCog },
      { href: "/dashboard/permisos",      label: "Permisos",      icon: ShieldCheck },
      { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

interface Props {
  role: UserRole;
  open: boolean;
  onClose: () => void;
}

export function DashboardMobileSidebar({ role, open, onClose }: Props) {
  const pathname = usePathname();

  if (!open) return null;

  function isActive(href: string) {
    if (href === "/dashboard/central") return pathname === href || pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className="absolute top-0 left-0 bottom-0 w-64 flex flex-col shadow-[20px_0_60px_rgba(0,0,0,0.7)]"
        style={{ background: "#040404", borderRight: "1px solid #141414" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 h-14 shrink-0 border-b"
          style={{ borderColor: "#141414" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 shrink-0">
              <Image src="/logo-transparent.png" alt="NP Music Group" fill className="object-contain" />
            </div>
            <p className="text-[0.8125rem] font-bold text-white">NP Music Group</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "#555555" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
            onMouseLeave={e => (e.currentTarget.style.color = "#555555")}
            aria-label="Cerrar menú"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {NAV_GROUPS.map(({ group, items }) => (
            <div key={group}>
              <p
                className="px-3 mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider"
                style={{ color: "#333333" }}
              >
                {group}
              </p>
              <div className="space-y-0.5">
                {items.filter(({ roles }) => !roles || roles.includes(role)).map(({ href, label, icon: Icon, children }) => {
                  const active = isActive(href);
                  return (
                    <div key={href}>
                      <Link
                        href={href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.875rem] font-medium transition-all duration-150",
                          active ? "text-black" : "text-[#737373] hover:text-white hover:bg-[#141414]"
                        )}
                        style={active ? { background: "#F5C518", color: "#000000" } : undefined}
                      >
                        <Icon size={16} strokeWidth={1.75} style={{ color: active ? "#000000" : "currentColor" }} />
                        <span className="flex-1">{label}</span>
                        {children && (
                          <ChevronRight size={12} strokeWidth={1.75} style={{ color: active ? "#000000" : "#444444" }} />
                        )}
                      </Link>
                      {children && pathname.startsWith(href) && (
                        <div className="ml-4 mt-0.5 space-y-0.5">
                          {children.map(({ href: childHref, label: childLabel }) => {
                            const childActive = pathname === childHref || pathname.startsWith(childHref + "/");
                            return (
                              <Link
                                key={childHref}
                                href={childHref}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] font-medium transition-all duration-150",
                                  childActive
                                    ? "text-white bg-[#1A1A1A]"
                                    : "text-[#555555] hover:text-[#A3A3A3] hover:bg-[#111111]"
                                )}
                              >
                                <span
                                  className="w-1 h-1 rounded-full shrink-0"
                                  style={{ background: childActive ? "#F5C518" : "#333333" }}
                                />
                                {childLabel}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* NP Control — solo SUPER_ADMIN */}
          {role === "SUPER_ADMIN" && (
            <div>
              <p
                className="px-3 mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider"
                style={{ color: "#333333" }}
              >
                Admin
              </p>
              <div className="space-y-0.5">
                {(() => {
                  const active = pathname.startsWith("/np-control");
                  return (
                    <Link
                      href="/np-control"
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.875rem] font-medium transition-all duration-150",
                        active ? "text-black" : "text-[#737373] hover:text-white hover:bg-[#141414]"
                      )}
                      style={active ? { background: "#F5C518", color: "#000000" } : undefined}
                    >
                      <ShieldAlert size={16} strokeWidth={1.75} style={{ color: active ? "#000000" : "currentColor" }} />
                      NP Control
                    </Link>
                  );
                })()}
              </div>
            </div>
          )}
        </nav>

        <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "#141414" }}>
          <p className="text-[0.65rem]" style={{ color: "#2A2A2A" }}>NP Music Group v2</p>
        </div>
      </aside>
    </div>
  );
}
