import { cn } from "@/utils/cn";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    container: "py-8",
    iconWrapper: "w-10 h-10",
    iconSize: 18,
    title: "text-sm",
    description: "text-xs",
  },
  md: {
    container: "py-12",
    iconWrapper: "w-12 h-12",
    iconSize: 22,
    title: "text-base",
    description: "text-sm",
  },
  lg: {
    container: "py-16",
    iconWrapper: "w-14 h-14",
    iconSize: 26,
    title: "text-lg",
    description: "text-sm",
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        config.container,
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "flex items-center justify-center rounded-xl bg-[#141414] border border-[#1E1E1E] mb-4",
            config.iconWrapper
          )}
        >
          <Icon size={config.iconSize} className="text-[#404040]" />
        </div>
      )}
      <p className={cn("font-semibold text-white mb-1", config.title)}>{title}</p>
      {description && (
        <p className={cn("text-[#737373] max-w-xs", config.description)}>{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
