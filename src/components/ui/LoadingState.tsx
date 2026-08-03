import { cn } from "@/utils/cn";

interface LoadingStateProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  inline?: boolean;
}

const sizeConfig = {
  sm: { spinner: "w-4 h-4 border-[1.5px]", text: "text-xs" },
  md: { spinner: "w-6 h-6 border-2", text: "text-sm" },
  lg: { spinner: "w-8 h-8 border-2", text: "text-base" },
};

export function LoadingState({
  size = "md",
  label,
  className,
  inline = false,
}: LoadingStateProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3",
        !inline && "py-12",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full border-[#1E1E1E] border-t-[#F5C518] animate-spin shrink-0",
          config.spinner
        )}
      />
      {label && (
        <p className={cn("text-[#737373] font-medium", config.text)}>{label}</p>
      )}
    </div>
  );
}
