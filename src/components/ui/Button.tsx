"use client";

import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#F5C518] text-black font-semibold hover:bg-[#E6B800] active:bg-[#D4A900] disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-[#141414] text-white border border-[#262626] hover:bg-[#1E1E1E] hover:border-[#404040] active:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-white hover:bg-white/8 active:bg-white/12 disabled:opacity-50 disabled:cursor-not-allowed",
  outline:
    "bg-transparent text-white border border-[#262626] hover:border-white/40 hover:bg-white/4 active:bg-white/8 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-[#EF4444] text-white font-semibold hover:bg-[#DC2626] active:bg-[#B91C1C] disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-[6px] gap-1.5",
  md: "h-10 px-4 text-sm rounded-[8px] gap-2",
  lg: "h-12 px-6 text-base rounded-[10px] gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 select-none whitespace-nowrap shrink-0",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin shrink-0" size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
