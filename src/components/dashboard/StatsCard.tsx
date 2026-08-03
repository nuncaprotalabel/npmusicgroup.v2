import { cn } from "@/utils/cn";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | null;
  change?: string | null;
  changePositive?: boolean;
  icon?: LucideIcon;
  prefix?: string;
  className?: string;
  compact?: boolean;
}

export function StatsCard({
  label,
  value,
  change,
  changePositive,
  icon: Icon,
  prefix,
  className,
  compact = false,
}: StatsCardProps) {
  const isEmpty = value === null;

  return (
    <div
      className={cn(
        "bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl",
        compact ? "p-3.5" : "p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={cn("text-[#737373] font-medium truncate", compact ? "text-[11px]" : "text-xs")}>
            {label}
          </p>
          {isEmpty ? (
            <p className={cn("font-semibold text-[#404040] mt-1", compact ? "text-base" : "text-xl")}>
              —
            </p>
          ) : (
            <p className={cn("font-bold text-white mt-1 truncate", compact ? "text-base" : "text-xl")}>
              {prefix && <span className="text-[#A3A3A3] font-medium text-sm mr-0.5">{prefix}</span>}
              {value}
            </p>
          )}
          {!isEmpty && change && (
            <div className="flex items-center gap-1 mt-1.5">
              {changePositive ? (
                <TrendingUp size={11} className="text-emerald-400 shrink-0" />
              ) : (
                <TrendingDown size={11} className="text-red-400 shrink-0" />
              )}
              <span
                className={cn(
                  "text-[11px] font-medium",
                  changePositive ? "text-emerald-400" : "text-red-400"
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#141414] border border-[#1E1E1E] shrink-0">
            <Icon size={14} className="text-[#404040]" />
          </div>
        )}
      </div>
    </div>
  );
}
