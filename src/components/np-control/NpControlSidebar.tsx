"use client";

/**
 * Sidebar del panel NP Control.
 * Solo visible para SUPER_ADMIN. Separado completamente de la landing.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Activity,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { href: "/np-control",          label: "Central",    icon: LayoutDashboard },
  { href: "/np-control/usuarios", label: "Usuarios",   icon: Users },
  { href: "/np-control/permisos", label: "Permisos",   icon: ShieldCheck },
  { href: "/np-control/auditoria",label: "Auditoría",  icon: Activity },
  { href: "/np-control/config",   label: "Config",     icon: Settings },
] as const;

export function NpControlSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 h-full border-r"
      style={{ background: "#040404", borderColor: "#141414" }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 px-4 py-4 border-b"
        style={{ borderColor: "#141414" }}
      >
        <div className="relative w-7 h-7 shrink-0">
          <Image
            src="/logo-transparent.png"
            alt="NP"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <p className="text-[0.75rem] font-bold text-white leading-none">
            NP Control
          </p>
          <p className="text-[0.65rem] mt-0.5" style={{ color: "#525252" }}>
            Panel administrativo
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/np-control"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.8125rem] font-medium transition-all duration-150",
                isActive
                  ? "text-black"
                  : "text-[#737373] hover:text-white hover:bg-[#141414]"
              )}
              style={
                isActive
                  ? {
                      background: "#F5C518",
                      color:      "#000000",
                    }
                  : undefined
              }
            >
              <Icon
                size={15}
                strokeWidth={1.75}
                style={{ color: isActive ? "#000000" : "currentColor" }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: "#141414" }}
      >
        <p className="text-[0.65rem]" style={{ color: "#333333" }}>
          NP Music Group v2
        </p>
      </div>
    </aside>
  );
}
