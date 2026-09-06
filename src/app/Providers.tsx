"use client";

import { LanguageProvider } from "@/i18n/LanguageContext";
import { ReactNode } from "react";

export function Providers({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: "es" | "en";
}) {
  return <LanguageProvider initialLanguage={initialLanguage}>{children}</LanguageProvider>;
}
