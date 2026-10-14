"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { messages, type Language, type Messages } from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Messages;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function subscribeToLanguage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("luna-language-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("luna-language-change", onChange);
  };
}

function getLanguageSnapshot(): Language {
  const savedLanguage = window.localStorage.getItem("luna-language");
  return savedLanguage === "fr" ? "fr" : "en";
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(nextLanguage: Language) {
    window.localStorage.setItem("luna-language", nextLanguage);
    window.dispatchEvent(new Event("luna-language-change"));
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: messages[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}