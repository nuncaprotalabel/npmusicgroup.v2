"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/i18n/useTranslation";

const periodOptions = ["7D", "30D", "3M", "12M"] as const;
type Period = (typeof periodOptions)[number];

interface RevenueChartProps {
  className?: string;
  compact?: boolean;
}

export function RevenueChart({ className, compact = false }: RevenueChartProps) {
  const [activePeriod, setActivePeriod] = useState<Period>("30D");
  const { t } = useTranslation();

  const width = 480;
  const height = compact ? 80 : 120;
  const baseline = height * 0.75;

  const dotPositions = [0, 60, 120, 180, 240, 300, 360, 420, 480].map((x) => ({
    x,
    y: baseline,
  }));

  return (
    <div
      className={cn(
        "bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl",
        compact ? "p-3.5" : "p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <p className="text-xs text-[#737373] font-medium mb-1">
            {t.dashboard.modules.revenue}
          </p>
          <p className={cn("font-bold text-[#404040]", compact ? "text-lg" : "text-2xl")}>
            —
          </p>
        </div>
        {/* Period selector */}
        <div className="flex items-center bg-[#141414] rounded-lg p-0.5 border border-[#1E1E1E] shrink-0">
          {periodOptions.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-150",
                activePeriod === p
                  ? "bg-[#262626] text-white"
                  : "text-[#737373] hover:text-[#A3A3A3]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ height: compact ? 80 : 120 }}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={0}
              y1={height * ratio}
              x2={width}
              y2={height * ratio}
              stroke="#1A1A1A"
              strokeWidth="1"
            />
          ))}

          {/* Baseline area fill */}
          <path
            d={`M0,${baseline} L${width},${baseline} L${width},${height} L0,${height} Z`}
            fill="url(#emptyGrad)"
          />

          {/* Baseline line */}
          <line
            x1={0}
            y1={baseline}
            x2={width}
            y2={baseline}
            stroke="#262626"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="emptyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#262626" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#262626" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Dots */}
          {dotPositions.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r="2.5"
              fill="#262626"
              stroke="#1A1A1A"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Empty State Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[11px] text-[#404040] font-medium bg-[#0A0A0A]/80 px-3 py-1.5 rounded-full border border-[#1A1A1A]">
            {t.dashboard.revenueEmpty}
          </p>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex items-center justify-between mt-2 px-0.5" aria-hidden="true">
        {t.dashboard.months.map((m) => (
          <span key={m} className="text-[10px] text-[#404040]">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
