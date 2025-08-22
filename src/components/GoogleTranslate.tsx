// components/GoogleTranslate.tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

type Props = {
  // もともとのページ言語
  pageLanguage?: "ja" | "en";
  // 表示したい言語をカンマ区切りで（例: 英語/中国語/韓国語/タイ語など）
  includedLanguages?: string; // "en,zh-CN,zh-TW,ko,th,de,fr,vi,ru,es"
  className?: string;
};

export default function GoogleTranslate({
  pageLanguage = "ja",
  includedLanguages = "ja,en,zh-CN,zh-TW,ko,th,de,fr,vi,ru,es",
  className,
}: Props) {
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    // グローバル初期化関数（スクリプト読込後に呼ばれる）
    window.googleTranslateElementInit = function () {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage,
          includedLanguages,
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    // スクリプト読み込み
    const s = document.createElement("script");
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);

    return () => {
      // 後始末（任意）
      try {
        document.body.removeChild(s);
      } catch {}
    };
  }, [pageLanguage, includedLanguages]);

  return (
    <div className={className}>
      {/* Googleがここにドロップダウンを描画 */}
      <div id="google_translate_element" />
    </div>
  );
}
