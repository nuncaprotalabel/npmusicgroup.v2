"use client";

/**
 * Header del panel NP Control con logout real.
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Loader2, Menu, ShieldCheck, X } from "lucide-react";
import { logout } from "@/services/authService";
import { NAV_ITEMS } from "./NpControlSidebar";

interface NpControlHeaderProps {
  username: string;
}

export function NpControlHeader({ username }: NpControlHeaderProps) {
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  async function handleLogout() {
    setBusy(true);
    await logout();
    window.location.href = "/login";
  }

  return (
    <header
      className="relative flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0"
      style={{ background: "#040404", borderColor: "#141414" }}
    >
      {/* Breadcrumb / título */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#737373] transition-colors hover:bg-[#141414] hover:text-white lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <ShieldCheck size={14} strokeWidth={1.75} style={{ color: "#F5C518" }} />
        <span className="text-[0.8125rem] font-semibold text-white">
          NP Control
        </span>
        <span style={{ color: "#333333" }} className="text-[0.8125rem]">
          /
        </span>
        <span className="text-[0.8125rem]" style={{ color: "#737373" }}>
          SUPER_ADMIN
        </span>
      </div>

      {/* Usuario + logout */}
      <div className="flex items-center gap-3">
        <span
          className="text-[0.8125rem] font-medium"
          style={{ color: "#A3A3A3" }}
        >
          {username}
        </span>
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
            e.currentTarget.style.borderColor = "#EF4444";
            e.currentTarget.style.color       = "#EF4444";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#1E1E1E";
            e.currentTarget.style.color       = "#737373";
          }}
        >
          {busy
            ? <Loader2 size={12} className="animate-spin" />
            : <LogOut  size={12} strokeWidth={1.75} />
          }
          {busy ? "Saliendo…" : "Cerrar sesión"}
        </button>
      </div>

      {menuOpen && (
        <nav
          className="absolute left-0 right-0 top-full z-50 border-b border-[#1E1E1E] bg-[#080808] p-2 shadow-2xl lg:hidden"
          aria-label="Navegación NP Control"
        >
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === "/np-control"
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium"
                style={{
                  background: active ? "#F5C518" : "transparent",
                  color: active ? "#000000" : "#A3A3A3",
                }}
              >
                <Icon size={15} strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
