"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  Users,
  Disc3,
  Globe,
  DollarSign,
  BarChart2,
  FileText,
  MessageSquare,
  UserPlus,
  Shield,
  Activity,
  Settings,
} from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const moduleIcons = [
  LayoutDashboard,
  Users,
  Disc3,
  Globe,
  DollarSign,
  BarChart2,
  FileText,
  MessageSquare,
  UserPlus,
  Shield,
  Activity,
  Settings,
];

interface DashboardSidebarProps {
  className?: string;
  compact?: boolean;
}

export function DashboardSidebar({ className, compact = false }: DashboardSidebarProps) {
  const { t } = useTranslation();

  const moduleKeys = Object.keys(t.dashboard.modules) as Array<
    keyof typeof t.dashboard.modules
  >;

  return (
    <div
      className={cn(
        "bg-[#060606] border-r border-[#1A1A1A] flex flex-col",
        compact ? "w-[140px]" : "w-[180px]",
        className
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2 border-b border-[#1A1A1A]",
          compact ? "px-3 py-2.5" : "px-4 py-3"
        )}
      >
        <div className={cn("relative shrink-0", compact ? "w-6 h-6" : "w-7 h-7")}>
          <Image src="/logo.png" alt="NP Music Group" fill className="object-contain" />
        </div>
        {!compact && (
          <div>
            <p className="text-[11px] font-bold text-white leading-none">NP Admin</p>
            <p className="text-[9px] text-[#737373] mt-0.5">
              {t.dashboard.modules.central}
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-2" aria-label="Dashboard navigation">
        {moduleKeys.map((key, i) => {
          const Icon = moduleIcons[i];
          const isActive = key === "central";
          return (
            <button
              key={key}
              disabled
              aria-label={t.dashboard.modules[key]}
              className={cn(
                "w-full flex items-center gap-2 transition-colors duration-150 cursor-not-allowed",
                compact ? "px-3 py-1.5 text-[10px]" : "px-3.5 py-2 text-[11px]",
                isActive
                  ? "text-[#F5C518] bg-[#F5C518]/8"
                  : "text-[#737373] hover:text-white hover:bg-white/4"
              )}
            >
              <Icon
                size={compact ? 12 : 13}
                className={cn("shrink-0", isActive ? "text-[#F5C518]" : "text-current")}
                aria-hidden="true"
              />
              <span className="font-medium truncate">{t.dashboard.modules[key]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
