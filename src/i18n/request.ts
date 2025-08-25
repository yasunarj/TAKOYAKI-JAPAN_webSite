// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale: initialLocale }) => {
  // initialLocale を必ず known な string に正規化する
  const isSupported =
    (locales as readonly string[]).includes(initialLocale as string);

  // ここで "string | undefined" を "string" に確定させる
  const locale = (isSupported
    ? (initialLocale as (typeof locales)[number])
    : defaultLocale) as string;

  return {
    locale, // ← 必須。型は string に確定済み
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});
