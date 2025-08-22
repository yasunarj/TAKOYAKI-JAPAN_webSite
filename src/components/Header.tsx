"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PATTERNS } from "@/app/styles/patterns";
import { useI18n } from "@/i18n/I18nProvider";
import Image from "next/image";
import dynamic from "next/dynamic";
const GoogleTranslate = dynamic(() => import("./GoogleTranslate"), {
  ssr: false,
});

type HeaderSection = { id: string; label: string };

interface HeaderProps {
  isVisible: boolean; // スプラ完了トリガー
  sections: HeaderSection[]; // [{id,label}]
  completedSections: string[]; // 訪問済みID
  onNavClick?: (index: number) => void; // クリックでスクロール
}

export default function Header({
  isVisible,
  sections,
  completedSections,
  onNavClick,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale } = useI18n();

  // 設計順を保ったまま、visited のみ表示
  const visibleSections = sections.filter((s) =>
    completedSections.includes(s.id)
  );

  return (
    <>
      {/* デスクトップヘッダー */}
      <motion.aside
        aria-hidden
        className="hidden lg:block fixed top-0 right-0 w-1/5 h-screen z-30 bg-japanese-red border-l border-japanese-red pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: isVisible ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 2 }}
      >
        <div className="absolute inset-0 opacity-15" style={PATTERNS.shippo} />
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative z-10 text-white font-bold tracking-widest [writing-mode:vertical-rl] [text-orientation:upright] text-[148px] xl:text-[168px] 2xl:text-[200px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] leading-[1.8]">
            千客万来
          </div>
        </div>
      </motion.aside>

      <motion.header
        className="hidden lg:block fixed top-0 right-0 w-1/5 h-screen bg-japanese-dark-gray border-l border-japanese-red z-40"
        initial={{ x: "100%" }}
        animate={{ x: isVisible ? 0 : "100%" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.5 }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-0"
          style={PATTERNS.shippo}
        />
        <div className="relative p-6 h-full flex flex-col">
          {/* ロゴ */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative lg:w-[90%] xl:w-[80%] h-20 xl:h-24 mx-auto flex items-center justify-center mb-2">
              <Image
                src="/images/TAKOYAKI_JAPAN.png"
                fill
                alt="TAKOYAKI_JAPANのロゴ"
                className=""
              />
            </div>
            <h2 className="text-lg font-bold text-white">TAKOYAKI JAPAN</h2>
          </motion.div>

          {/* ナビゲーション（訪問済みだけ増えていく） */}
          <nav className="flex-1">
            <ul className="space-y-4">
              {visibleSections.map((section, index) => {
                const isCompleted = completedSections.includes(section.id);
                return (
                  <motion.li
                    key={section.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onNavClick?.(
                          sections.findIndex((s) => s.id === section.id)
                        )
                      }
                      className={`w-full text-left block p-3 rounded-lg transition-all duration-300 ${
                        isCompleted
                          ? "bg-japanese-red text-white shadow-lg"
                          : "text-japanese-white hover:bg-japanese-gray hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {section.label}
                        </span>
                        {isCompleted && (
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </div>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* 言語切り替え（そのまま） */}
          <motion.div
            className="mt-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-xs rounded ${
                  locale === "ja"
                    ? "bg-japanese-red text-white"
                    : "text-japanese-white hover:bg-japanese-gray"
                }`}
                onClick={() => setLocale("ja")}
                aria-pressed={locale === "ja"}
              >
                JA
              </button>
              <button
                className={`px-3 py-1 text-xs rounded ${
                  locale === "en"
                    ? "bg-japanese-red text-white"
                    : "text-japanese-white hover:bg-japanese-gray"
                }`}
                onClick={() => setLocale("en")}
                aria-pressed={locale === "en"}
              >
                EN
              </button>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* モバイルヘッダー */}
      <motion.header
        className="lg:hidden fixed top-0 left-0 right-0 bg-japanese-dark-gray border-b border-japanese-red z-40"
        initial={{ y: "-100%" }}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-0"
          style={PATTERNS.shippo}
        />
        <div className="relative flex z-10 items-center justify-between p-4">
          {/* ロゴ */}
          <motion.div
            className="flex items-end"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative w-24 h-12 bg-japanese-red rounded-full flex items-center justify-center mr-3">
              <Image
                src="/images/TAKOYAKI_JAPAN.png"
                alt="TAKOYAKI_JAPANのロゴ"
                fill
                className="absolute"
              />
            </div>
            <h2 className="hidden md:block text-xl font-bold text-white">
              TAKOYAKI JAPAN
            </h2>
          </motion.div>

          {/* ハンバーガー */}
          <motion.button
            className="p-2 text-white hover:bg-japanese-gray rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-1"
                    : "-translate-y-1"
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "-rotate-45 -translate-y-1"
                    : "translate-y-1"
                }`}
              ></span>
            </div>
          </motion.button>
        </div>

        {/* モバイルメニュー（訪問済みだけ） */}
        <motion.div
          className={`relative overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="p-4 border-t border-japanese-gray">
            <ul className="space-y-2">
              {visibleSections.map((section, index) => (
                <motion.li
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : -20,
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <button
                    type="button"
                    className="w-full text-left block p-3 rounded-lg transition-all duration-300 text-japanese-white hover:bg-japanese-gray"
                    onClick={() => {
                      onNavClick?.(
                        sections.findIndex((s) => s.id === section.id)
                      );
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.label}</span>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>

            {/* モバイル言語切り替え */}
            <div className="mt-4 pt-4 border-t border-japanese-gray">
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-japanese-red text-white rounded">
                  JA
                </button>
                <button className="px-3 py-1 text-sm text-japanese-white hover:bg-japanese-gray rounded">
                  EN
                </button>
              </div>
            </div>
          </nav>
        </motion.div>
      </motion.header>
    </>
  );
}
