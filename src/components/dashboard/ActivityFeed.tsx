"use client";

import { cn } from "@/utils/cn";
import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTranslation } from "@/i18n/useTranslation";

interface ActivityFeedProps {
  className?: string;
  compact?: boolean;
}

export function ActivityFeed({ className, compact = false }: ActivityFeedProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-[#0A0A0A] border border-[#1E1E1E] rounded-xl flex flex-col",
        compact ? "p-3.5" : "p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-white">{t.dashboard.recentActivity}</p>
        <button
          disabled
          className="text-[11px] text-[#737373] hover:text-white transition-colors cursor-not-allowed opacity-60"
        >
          {t.dashboard.viewAll}
        </button>
      </div>

      {/* Empty State */}
      <EmptyState
        icon={Activity}
        title={t.dashboard.noActivity}
        description={t.dashboard.noActivityDesc}
        size="sm"
        className="flex-1 py-6"
      />
    </div>
  );
}
