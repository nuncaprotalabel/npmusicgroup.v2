"use client";

import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";

export function useTranslation() {
  const { language, setLanguage } = useLanguage();
  return { t: translations[language], language, setLanguage };
}
