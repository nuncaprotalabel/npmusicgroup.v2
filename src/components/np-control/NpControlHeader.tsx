"use client";

/**
 * Header del panel NP Control con logout real.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2, ShieldCheck } from "lucide-react";
import { logout } from "@/services/authService";

interface NpControlHeaderProps {
  username: string;
}

export function NpControlHeader({ username }: NpControlHeaderProps) {
  const router     = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    await logout();
    window.location.href = "/login";
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b shrink-0"
      style={{ background: "#040404", borderColor: "#141414" }}
    >
      {/* Breadcrumb / título */}
      <div className="flex items-center gap-2">
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
    </header>
  );
}
