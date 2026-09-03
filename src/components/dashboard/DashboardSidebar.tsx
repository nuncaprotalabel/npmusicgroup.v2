"use client";

/**
 * DashboardSidebar — barra de navegación lateral del dashboard (desktop).
 * Solo visible en pantallas lg+. Mobile gestionado por DashboardMobileSidebar.
 */
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShieldAlert, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/i18n/useTranslation";
import type { UserRole } from "@/types/auth";
import { getNavigationGroups, isNavigationChildActive, isNavigationItemActive } from "./navigation";

interface DashboardSidebarProps {
  role: UserRole;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const navGroups = getNavigationGroups(t);

  return (
    <aside
      className="hidden lg:flex flex-col w-60 shrink-0 h-full"
      style={{ background: "#040404", borderRight: "1px solid #141414" }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 px-4 h-14 shrink-0 border-b"
        style={{ borderColor: "#141414" }}
      >
        <div className="relative w-7 h-7 shrink-0">
          <Image src="/logo-transparent.png" alt="NP Music Group" fill className="object-contain" />
        </div>
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-bold text-white leading-none truncate">
            NP Music Group
          </p>
          <p className="text-[0.65rem] mt-0.5 truncate" style={{ color: "#525252" }}>
            Dashboard
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map(({ group, items }) => (
          <div key={group}>
            <p
              className="px-3 mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider"
              style={{ color: "#333333" }}
            >
              {group}
            </p>
            <div className="space-y-0.5">
              {items.filter(({ roles }) => !roles || roles.includes(role)).map(({ href, label, icon: Icon, children }) => {
                const active = isNavigationItemActive(pathname, href);
                return (
                  <div key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.8125rem] font-medium transition-all duration-150",
                        active
                          ? "text-black"
                          : "text-[#737373] hover:text-white hover:bg-[#141414]"
                      )}
                      style={active ? { background: "#F5C518", color: "#000000" } : undefined}
                    >
                      <Icon
                        size={15}
                        strokeWidth={1.75}
                        style={{ color: active ? "#000000" : "currentColor" }}
                      />
                      <span className="flex-1 truncate">{label}</span>
                      {children && (
                        <ChevronRight
                          size={12}
                          strokeWidth={1.75}
                          style={{ color: active ? "#000000" : "#444444" }}
                        />
                      )}
                    </Link>
                    {/* Sub-items — visible cuando el padre está activo */}
                    {children && pathname.startsWith(href) && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {children.map(({ href: childHref, label: childLabel }) => {
                           const childActive = isNavigationChildActive(pathname, childHref);
                          return (
                            <Link
                              key={childHref}
                              href={childHref}
                              className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.75rem] font-medium transition-all duration-150",
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
        {isSuperAdmin && (
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
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.8125rem] font-medium transition-all duration-150",
                      active
                        ? "text-black"
                        : "text-[#737373] hover:text-white hover:bg-[#141414]"
                    )}
                    style={active ? { background: "#F5C518", color: "#000000" } : undefined}
                  >
                    <ShieldAlert
                      size={15}
                      strokeWidth={1.75}
                      style={{ color: active ? "#000000" : "currentColor" }}
                    />
                    <span className="flex-1 truncate">NP Control</span>
                  </Link>
                );
              })()}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: "#141414" }}>
        <p className="text-[0.65rem]" style={{ color: "#2A2A2A" }}>
          NP Music Group v2
        </p>
      </div>
    </aside>
  );
}
