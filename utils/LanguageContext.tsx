import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "parakeet-language";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "Spanish";
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? stored : "Spanish";
  } catch {
    return "Spanish";
  }
}

const LanguageContext = createContext<LanguageContextType>({
  language: "Italian",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>(getInitialLanguage);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage errors on unsupported environments.
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);