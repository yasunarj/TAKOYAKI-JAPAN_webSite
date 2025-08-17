// components/HomeClient.tsx
"use client";

import { useState, useEffect, useMemo, ComponentType } from "react";
import SplashScreen from "@/components/SplashScreen";
import Header from "@/components/Header";
import FullScreenContainer from "@/components/FullScreenContainer";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import MenuSection from "@/components/MenuSection";
import AccessSection from "@/components/AccessSection";
import ScrollIndicator from "@/components/ScrollIndicator";
import { useScrollControl } from "@/hooks/useScrollControl";
import { shippori } from "@/app/lib/font";

type SectionComponentProps = { id: string; isActive: boolean };

type SectionDef = {
  id: "hero" | "intro" | "menu" | "access";
  label: string;
  component: ComponentType<SectionComponentProps>;
};

export default function HomeClient() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashCompleted, setSplashCompleted] = useState(false);

  const sections: SectionDef[] = useMemo(
    () => [
      { id: "hero", label: "TOP", component: HeroSection },
      { id: "intro", label: "店舗紹介", component: IntroSection },
      { id: "menu", label: "メニュー", component: MenuSection },
      { id: "access", label: "アクセス", component: AccessSection },
    ],
    []
  );

  const totalSections = sections.length;
  const { currentSection, goToSection, setContainerRef } = useScrollControl(
    totalSections,
    splashCompleted
  );

  const effectiveCurrentSection = splashCompleted ? currentSection : 0;

  // 訪問済みIDの収集
  const [visited, setVisited] = useState<string[]>([]);
  useEffect(() => {
    if (!splashCompleted) return;
    const id = sections[effectiveCurrentSection].id;
    setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, [splashCompleted, effectiveCurrentSection, sections]);

  const handleNavClick = (index: number) => {
    goToSection(index); // 直接セクション番号を切り替え（scrollIntoView は hook 側で実行）
  };

  return (
    <div className={`relative min-h-screen bg-japanese-black overflow-hidden ${shippori.className}`}>
      {/* スプラッシュ */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setSplashCompleted(true);
            setShowSplash(false);
          }}
        />
      )}

      {/* 本体 */}
      {splashCompleted && (
        <div className="flex">
          {/* 左：メイン */}
          <div className="relative h-screen w-full lg:w-4/5">
            {sections.map((section, index) => (
              <FullScreenContainer
                key={section.id}
                ref={setContainerRef(index)}
                isActive={effectiveCurrentSection === index}
                index={index}
              >
                <section.component
                  id={section.id}
                  isActive={effectiveCurrentSection === index}
                />
              </FullScreenContainer>
            ))}
          </div>

          {/* 右：ヘッダー */}
          <Header
            isVisible={splashCompleted}
            sections={sections.map(({ id, label }) => ({ id, label }))}
            completedSections={visited}
            onNavClick={handleNavClick}
          />
        </div>
      )}

      {/* スクロールインジケーター（PC） */}
      {splashCompleted && (
        <ScrollIndicator
          currentSection={effectiveCurrentSection}
          totalSections={totalSections}
          onSectionClick={handleNavClick}
        />
      )}

      {/* スクロールインジケーター（モバイル） */}
      {splashCompleted && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
          <div className="flex space-x-2">
            {Array.from({ length: totalSections }).map((_, index) => (
              <button
                key={index}
                aria-label={`Go to section ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  effectiveCurrentSection === index
                    ? "bg-japanese-red scale-125"
                    : "bg-japanese-white/30"
                }`}
                onClick={() => handleNavClick(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
