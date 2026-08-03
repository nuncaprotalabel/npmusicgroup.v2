"use client";

import { cn } from "@/utils/cn";
import { DashboardPreviewSidebar } from "./DashboardPreviewSidebar";
import { StatsCard } from "./StatsCard";
import { RevenueChart } from "./RevenueChart";
import { ActivityFeed } from "./ActivityFeed";
import { Users, Disc3, DollarSign, Bell, ChevronDown } from "lucide-react";
import Image from "next/image";

interface DashboardPanelProps {
  className?: string;
  /** compact = used inside the Hero as a visual preview */
  compact?: boolean;
}

export function DashboardPanel({ className, compact = false }: DashboardPanelProps) {
  return (
    <div
      className={cn(
        "flex bg-[#060606] border border-[#1E1E1E] rounded-xl overflow-hidden w-full",
        className
      )}
      style={{ minHeight: compact ? 300 : 400 }}
    >
      {/* Sidebar: icon-only on compact, full on regular */}
      <DashboardPreviewSidebar iconOnly={compact} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <div
          className={cn(
            "flex items-center justify-between border-b border-[#1A1A1A] bg-[#070707] shrink-0",
            compact ? "px-2.5 py-2" : "px-4 py-2.5"
          )}
        >
          <p className={cn("font-semibold text-white truncate", compact ? "text-[11px]" : "text-sm")}>
            Central
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              disabled
              className={cn(
                "flex items-center justify-center rounded-lg border border-[#1E1E1E] text-[#737373] cursor-not-allowed",
                compact ? "w-5 h-5" : "w-6 h-6"
              )}
            >
              <Bell size={compact ? 10 : 11} />
            </button>
            <div
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 bg-[#141414] border border-[#1E1E1E] rounded-lg cursor-not-allowed",
                compact ? "text-[9px]" : "text-[10px]"
              )}
            >
              <div className={cn("relative rounded-full bg-[#F5C518] shrink-0 overflow-hidden", compact ? "w-3.5 h-3.5" : "w-4 h-4")}>
                <Image src="/logo.png" alt="NP Admin" fill className="object-cover" />
              </div>
              <span className="text-[#A3A3A3] font-medium hidden sm:block">NP Admin</span>
              <ChevronDown size={8} className="text-[#737373]" />
            </div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className={cn("flex-1 flex flex-col gap-2 overflow-hidden", compact ? "p-2" : "p-3")}>
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <StatsCard label="Artistas" value={null} icon={Users} compact />
            <StatsCard label="Lanzamientos" value={null} icon={Disc3} compact />
            <StatsCard label="Ingresos" value={null} icon={DollarSign} compact />
            <StatsCard label="Solicitudes" value={null} compact />
          </div>

          {/* Chart + Activity */}
          <div className="flex gap-2 flex-1 min-h-0">
            <RevenueChart compact className="flex-1 min-w-0" />
            <ActivityFeed compact className="w-32 shrink-0 hidden sm:flex" />
          </div>
        </div>
      </div>
    </div>
  );
}
