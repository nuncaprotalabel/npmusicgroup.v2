"use client";

/**
 * DashboardPreviewSidebar — sidebar decorativo para el preview del landing.
 * NO es el sidebar real del dashboard. Solo uso visual en DashboardPanel.
 */
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  Users,
  Disc3,
  TrendingUp,
  Settings,
} from "lucide-react";

const PREVIEW_ITEMS = [
  { icon: LayoutDashboard, label: "Central",     active: true  },
  { icon: Users,           label: "Artistas",    active: false },
  { icon: Disc3,           label: "Lanzamientos",active: false },
  { icon: TrendingUp,      label: "Ingresos",    active: false },
  { icon: Settings,        label: "Config",      active: false },
];

interface DashboardPreviewSidebarProps {
  iconOnly?: boolean;
}

export function DashboardPreviewSidebar({ iconOnly = false }: DashboardPreviewSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col shrink-0 bg-[#040404] border-r border-[#141414]",
        iconOnly ? "w-8" : "w-28"
      )}
    >
      {/* Brand mark */}
      <div className={cn("flex items-center border-b border-[#141414]", iconOnly ? "p-1.5 h-7" : "px-2.5 py-2 h-8")}>
        {!iconOnly && (
          <span className="text-[9px] font-bold text-white truncate">NP Music</span>
        )}
        {iconOnly && (
          <div className="w-3 h-3 rounded-sm bg-[#F5C518]" />
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-1 py-1.5 space-y-0.5">
        {PREVIEW_ITEMS.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={cn(
              "flex items-center rounded",
              iconOnly ? "justify-center p-1" : "gap-1.5 px-1.5 py-1",
              active ? "bg-[#F5C518]" : ""
            )}
          >
            <Icon
              size={iconOnly ? 8 : 9}
              strokeWidth={2}
              style={{ color: active ? "#000000" : "#555555" }}
            />
            {!iconOnly && (
              <span
                className="text-[8px] font-medium truncate"
                style={{ color: active ? "#000000" : "#666666" }}
              >
                {label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
