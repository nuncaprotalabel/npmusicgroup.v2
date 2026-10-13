"use client";

import { Globe } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/i18n/useTranslation";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { language, setLanguage } = useTranslation();

  const toggle = () => setLanguage(language === "es" ? "en" : "es");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={language === "es" ? "Switch to English" : "Cambiar a Español"}
      className={cn(
        "flex items-center gap-1.5 min-h-11 px-3 text-xs font-semibold rounded-lg",
        "border border-[#262626] text-[#737373]",
        "hover:text-white hover:border-[#404040] hover:bg-[#141414]",
        "transition-all duration-150",
        className
      )}
    >
      <Globe size={12} aria-hidden="true" />
      <span aria-live="polite">{language.toUpperCase()}</span>
    </button>
  );
}
