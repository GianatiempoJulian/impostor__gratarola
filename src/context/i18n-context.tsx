
"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import translations, { Translations } from '@/i18n';

type Language = 'en' | 'es' | 'fr' | 'it';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations['en'], options?: { [key: string]: string | number }) => string;
  tNoInterpolate: (key: keyof Translations['en'], fallback?: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storedLang, setStoredLang] = useLocalStorage<Language>('language', 'en');
  const [language, setLanguage] = useState<Language>(storedLang);

  useEffect(() => {
    setLanguage(storedLang);
  }, [storedLang]);

  const setLanguageAndStore = (lang: Language) => {
    setLanguage(lang);
    setStoredLang(lang);
  };

  const t = useCallback((key: keyof Translations['en'], options?: { [key: string]: string | number }) => {
    let translation = (translations[language] && translations[language][key]) || translations['en'][key];
    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }
    return translation;
  }, [language]);

  const tNoInterpolate = useCallback((key: keyof Translations['en'], fallback?: string) => {
    return (translations[language] && translations[language][key]) || fallback || (translations['en'] && translations['en'][key]) || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage: setLanguageAndStore, t, tNoInterpolate }}>
      {children}
    </I18nContext.Provider>
  );
};
