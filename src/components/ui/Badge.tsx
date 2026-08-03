import { cn } from "@/utils/cn";

type BadgeVariant = "default" | "yellow" | "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-white",
  yellow: "bg-[#F5C518]/15 text-[#F5C518]",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  error: "bg-red-500/15 text-red-400",
  neutral: "bg-[#1E1E1E] text-[#A3A3A3]",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-white",
  yellow: "bg-[#F5C518]",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
  neutral: "bg-[#737373]",
};

export function Badge({ variant = "default", children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotStyles[variant])} />
      )}
      {children}
    </span>
  );
}
