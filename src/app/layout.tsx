import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAKOYAKI JAPAN - 日光の伝統的なたこ焼き店",
  description:
    "日光、栃木県にある伝統的なたこ焼き店。赤提灯が並ぶ入口、リラックスできる日本音楽、オープンテラスで新鮮な空気と日光を楽しめます。英語メニュー、多様な決済方法対応。",
  keywords: "たこ焼き, 日光, 栃木, 日本料理, 観光, レストラン",
  authors: [{ name: "TAKOYAKI JAPAN" }],
  openGraph: {
    title: "TAKOYAKI JAPAN - 日光の伝統的なたこ焼き店",
    description:
      "日光、栃木県にある伝統的なたこ焼き店。赤提灯が並ぶ入口、リラックスできる日本音楽、オープンテラスで新鮮な空気と日光を楽しめます。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
