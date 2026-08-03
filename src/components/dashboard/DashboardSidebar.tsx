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
  iconOnly?: boolean;
}

export function DashboardSidebar({ className, iconOnly = false }: DashboardSidebarProps) {
  const { t } = useTranslation();

  const moduleKeys = Object.keys(t.dashboard.modules) as Array<
    keyof typeof t.dashboard.modules
  >;

  return (
    <div
      className={cn(
        "bg-[#060606] border-r border-[#1A1A1A] flex flex-col shrink-0",
        iconOnly ? "w-10" : "w-[160px]",
        className
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2 border-b border-[#1A1A1A]",
          iconOnly ? "px-2 py-2.5 justify-center" : "px-3 py-2.5"
        )}
      >
        <div className="relative shrink-0 w-5 h-5">
          <Image src="/logo.png" alt="NP Music Group" fill className="object-contain" />
        </div>
        {!iconOnly && (
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-white leading-none truncate">NP Admin</p>
            <p className="text-[9px] text-[#737373] mt-0.5 truncate">
              {t.dashboard.modules.central}
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-1.5" aria-label="Dashboard navigation">
        {moduleKeys.map((key, i) => {
          const Icon = moduleIcons[i];
          const isActive = key === "central";
          return (
            <button
              key={key}
              disabled
              aria-label={t.dashboard.modules[key]}
              title={iconOnly ? t.dashboard.modules[key] : undefined}
              className={cn(
                "w-full flex items-center transition-colors duration-150 cursor-not-allowed",
                iconOnly ? "justify-center px-0 py-1.5" : "gap-2 px-3 py-1.5",
                isActive
                  ? "text-[#F5C518] bg-[#F5C518]/8"
                  : "text-[#737373] hover:text-white hover:bg-white/4"
              )}
            >
              <Icon
                size={12}
                className={cn("shrink-0", isActive ? "text-[#F5C518]" : "text-current")}
                aria-hidden="true"
              />
              {!iconOnly && (
                <span className="font-medium truncate text-[10px]">
                  {t.dashboard.modules[key]}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
