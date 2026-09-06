"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Language } from "./translations";

const STORAGE_KEY = "np-language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "es",
  setLanguage: () => {},
});

export function LanguageProvider({
  children,
  initialLanguage = "es",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === "es" || saved === "en") {
      setLanguageState(saved);
      document.cookie = `${STORAGE_KEY}=${saved}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } else {
      const browserLang = navigator.language.toLowerCase();
      const detected = browserLang.startsWith("en") ? "en" : initialLanguage;
      setLanguageState(detected);
      document.cookie = `${STORAGE_KEY}=${detected}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
  }, [initialLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.cookie = `${STORAGE_KEY}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {
      // The UI still updates when browser storage is unavailable.
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
