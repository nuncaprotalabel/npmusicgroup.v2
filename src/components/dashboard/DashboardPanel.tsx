"use client";

import { cn } from "@/utils/cn";
import { DashboardSidebar } from "./DashboardSidebar";
import { StatsCard } from "./StatsCard";
import { RevenueChart } from "./RevenueChart";
import { ActivityFeed } from "./ActivityFeed";
import { Users, Disc3, DollarSign, Bell, ChevronDown } from "lucide-react";
import Image from "next/image";

interface DashboardPanelProps {
  className?: string;
  compact?: boolean;
}

export function DashboardPanel({ className, compact = false }: DashboardPanelProps) {
  return (
    <div
      className={cn(
        "flex bg-[#060606] border border-[#1E1E1E] rounded-xl overflow-hidden",
        compact ? "h-[340px]" : "h-[440px]",
        className
      )}
    >
      {/* Sidebar */}
      <DashboardSidebar compact={compact} className="shrink-0" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div
          className={cn(
            "flex items-center justify-between border-b border-[#1A1A1A] bg-[#070707] shrink-0",
            compact ? "px-3 py-2" : "px-5 py-3"
          )}
        >
          <p className={cn("font-semibold text-white", compact ? "text-xs" : "text-sm")}>
            Central
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className={cn(
                "flex items-center justify-center rounded-lg border border-[#1E1E1E] text-[#737373] hover:text-white hover:bg-[#141414] transition-colors cursor-not-allowed",
                compact ? "w-6 h-6" : "w-7 h-7"
              )}
            >
              <Bell size={compact ? 11 : 13} />
            </button>
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 bg-[#141414] border border-[#1E1E1E] rounded-lg cursor-not-allowed",
                compact ? "text-[10px]" : "text-xs"
              )}
            >
              <div className={cn("relative rounded-full bg-[#F5C518] shrink-0 overflow-hidden", compact ? "w-4 h-4" : "w-5 h-5")}>
                <Image src="/logo.png" alt="NP Admin" fill className="object-cover" />
              </div>
              <span className="text-[#A3A3A3] font-medium hidden sm:block">NP Admin</span>
              <ChevronDown size={10} className="text-[#737373]" />
            </div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-hidden p-3 flex flex-col gap-3">
          {/* Stats Row */}
          <div className={cn("grid gap-2", compact ? "grid-cols-4" : "grid-cols-4")}>
            <StatsCard label="Artistas" value={null} icon={Users} compact={compact} />
            <StatsCard label="Lanzamientos" value={null} icon={Disc3} compact={compact} />
            <StatsCard label="Ingresos" value={null} icon={DollarSign} compact={compact} />
            <StatsCard label="Solicitudes" value={null} compact={compact} />
          </div>

          {/* Chart + Activity */}
          <div className={cn("flex gap-2 flex-1 min-h-0", compact ? "flex-col sm:flex-row" : "flex-row")}>
            <RevenueChart compact={compact} className="flex-1 min-w-0" />
            <ActivityFeed compact={compact} className={compact ? "sm:w-36 shrink-0" : "w-48 shrink-0"} />
          </div>
        </div>
      </div>
    </div>
  );
}
