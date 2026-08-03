import { cn } from "@/utils/cn";
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[#A3A3A3]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none">
              {iconLeft}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={cn(
              "h-10 w-full px-4 text-sm bg-[#0A0A0A] border border-[#1E1E1E] rounded-[8px]",
              "text-white placeholder:text-[#404040]",
              "focus:outline-none focus:ring-1 focus:ring-[#F5C518]/50 focus:border-[#F5C518]/50",
              "transition-colors duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-[#EF4444] focus:ring-[#EF4444]/30 focus:border-[#EF4444]",
              iconLeft && "pl-10",
              iconRight && "pr-10",
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] pointer-events-none">
              {iconRight}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#EF4444]">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#737373]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
