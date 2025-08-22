"use client";
import { useState, useEffect, ReactNode, useMemo, useContext, createContext } from "react";
import { dict, Locale } from "./dictionaries";

type I18nCtx = {
  locale: Locale;
  t: typeof dict["ja" | "en"];
  setLocale: (l: Locale) => void;
};

const Ctx = createContext<I18nCtx | null>(null);

const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("ja");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if(saved) setLocale(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const value = useMemo<I18nCtx>(() => ({ locale, t: dict[locale], setLocale }), [locale]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
};

const useI18n = () => {
  const ctx = useContext(Ctx);
  if(!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export { I18nProvider, useI18n };