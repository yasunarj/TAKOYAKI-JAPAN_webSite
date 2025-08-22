export type Locale = "ja" | "en";

export const dict = {
  ja: {
    brand: "TAKOYAKI JAPAN",
    sidebarTitle: "千客万来",
    nav: { hero: "TOP", intro: "店舗紹介", menu: "メニュー", access: "アクセス" },
    cta: { ja: "JA", en: "EN" },
    hero: {
      titleTop: "TAKOYAKI",
      titleBottom: "JAPAN",
      tagline1: "日光の伝統的な味を",
      taglineEm: "心を込めて",
      tagline2: "お届けします",
    },
    // …必要に応じて追加
  },
  en: {
    brand: "TAKOYAKI JAPAN",
    sidebarTitle: "Welcome",
    nav: { hero: "TOP", intro: "About", menu: "Menu", access: "Access" },
    cta: { ja: "JA", en: "EN" },
    hero: {
      titleTop: "TAKOYAKI",
      titleBottom: "JAPAN",
      tagline1: "Traditional flavor of Nikko,",
      taglineEm: "crafted with care,",
      tagline2: "delivered to you.",
    },
  },
} as const;
