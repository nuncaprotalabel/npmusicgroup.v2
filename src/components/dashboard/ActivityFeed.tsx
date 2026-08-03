import { cn } from "@/utils/cn";
import { Activity } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface ActivityFeedProps {
  className?: string;
  compact?: boolean;
}

export function ActivityFeed({ className, compact = false }: ActivityFeedProps) {
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
        <p className="text-xs font-semibold text-white">Actividad reciente</p>
        <button
          disabled
          className="text-[11px] text-[#737373] hover:text-white transition-colors cursor-not-allowed opacity-60"
        >
          Ver todo
        </button>
      </div>

      {/* Empty State */}
      <EmptyState
        icon={Activity}
        title="Sin actividad aún"
        description="Las acciones del equipo y lanzamientos aparecerán aquí."
        size="sm"
        className="flex-1 py-6"
      />
    </div>
  );
}
