// app/[locale]/layout.tsx
import type { Metadata } from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {locales, Locale} from '@/i18n/config';
import '@/app/globals.css';

export const dynamic = 'force-static';

// （任意）メタデータをロケール別に出し分け
export async function generateMetadata({
  params
}: {
  params: Promise<{locale: Locale}>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const title = isJa
    ? 'TAKOYAKI JAPAN - 日光の伝統的なたこ焼き店'
    : 'TAKOYAKI JAPAN - Traditional Takoyaki in Nikko';
  const description = isJa
    ? '日光、栃木県にある伝統的なたこ焼き店。赤提灯が並ぶ入口、リラックスできる日本音楽、オープンテラスで新鮮な空気と日光を楽しめます。英語メニュー、多様な決済方法対応。'
    : 'Traditional takoyaki in Nikko, Tochigi. Lantern-lined entrance, relaxing music, open terrace, English menu, and multiple payment methods.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isJa ? 'ja_JP' : 'en_US'
    },
    alternates: {
      languages: Object.fromEntries(locales.map(l => [l, `/${l}`]).concat([['x-default', '/ja']]))
    }
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: Locale}>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      {/* 以前の Hydration mismatch を避けるため、class はここ1箇所に統一 */}
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


