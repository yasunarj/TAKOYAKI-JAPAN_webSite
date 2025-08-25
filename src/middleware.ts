// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always' // "/" に来たら "/ja" に誘導
});

export const config = {
  // matcher: ['/', '/(ja|en)/:path*']
  matcher: ['/', '/((?!api|_next|.*\\..*).*)']
};
