// components/HomeClient.tsx
"use client";

import { useState, useEffect, useMemo, ComponentType } from "react";
import Image from "next/image";
import SplashScreen from "@/components/SplashScreen";
import Header from "@/components/Header";
import FullScreenContainer from "@/components/FullScreenContainer";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import MenuSection from "@/components/MenuSection";
import AccessSection from "@/components/AccessSection";
import ScrollIndicator from "./ScrollIndicator";
import { useScrollControl } from "@/hooks/useScrollControl";
import { shippori } from "@/app/lib/font";
import { useTranslations } from "next-intl";

type SectionComponentProps = { id: string; isActive: boolean };

type SectionDef = {
  id: "hero" | "intro" | "menu" | "access";
  label: string;
  component: ComponentType<SectionComponentProps>;
};

export default function HomeClient() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashCompleted, setSplashCompleted] = useState(false);
  const tNav = useTranslations("nav");
  const tPrev = useTranslations("preview");

  const sections: SectionDef[] = useMemo(
    () => [
      {
        id: "hero",
        label: tNav("hero"),
        component: HeroSection,
        preview: (
          <div className="flex gap-2">
            <Image
              src="/images/topImage.png"
              alt={tPrev("hero.alt")}
              width={80}
              height={80}
              className="object-cover"
            />
            <div>
              <div className="text-[12px] font-medium">{tNav("hero")}</div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                {tPrev("hero.lines.background")}
                <br />
                {tPrev("hero.lines.catchcopy")}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "intro",
        label: tNav("intro"),
        component: IntroSection,
        preview: (
          <div className="flex gap-2">
            <Image
              src="/images/accessStore.jpg"
              alt={tPrev("intro.alt")}
              width={80}
              height={80}
              className="object-cover"
            />
            <div>
              <div className="text-[12px] font-medium">{tNav("intro")}</div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                {tPrev("intro.lines.features")}
                <br />
                {tPrev("intro.lines.atmosphere")}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "menu",
        label: tNav("menu"),
        component: MenuSection,
        preview: (
          <div className="flex gap-2">
            <Image
              src="/images/menu1.jpg"
              alt={tPrev("menu.alt")}
              width={80}
              height={80}
              className="object-cover"
            />
            <div>
              <div className="text-[12px] font-medium">{tNav("menu")}</div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                {tPrev("menu.item")}
              </div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                {tPrev("menu.price_label", { price: 680 })}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "access",
        label: tNav("access"),
        component: AccessSection,
        preview: (
          <div className="flex gap-2">
            <Image
              src="/images/accessMap.png"
              alt={tPrev("access.alt")}
              width={72}
              height={60}
              className="object-cover"
            />
            <div>
              <div className="text-[12px] font-medium">{tNav("access")}</div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                {tPrev("access.address")}
                <br />
                {tPrev("access.hours_label", { open: "10:00", close: "22:00" })}
              </div>
            </div>
          </div>
        ),
      },
    ],
    [tNav, tPrev]
  );

  const totalSections = sections.length;
  const { currentSection, goToSection, setContainerRef, prevIndex } =
    useScrollControl(totalSections, splashCompleted);

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
    <div
      className={`relative min-h-screen bg-japanese-black overflow-hidden ${shippori.className}`}
    >
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
                prevIndex={prevIndex}
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
          sections={sections}
          visitedIds={visited}
          onSectionClick={handleNavClick}
        />
      )}

      {/* スクロールインジケーター（モバイル） */}
      {splashCompleted && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
          <div className="flex space-x-2">
            {Array.from({ length: totalSections }).map((_, index) => {
              const id = sections[index].id;
              const canNavigate =
                visited.includes(id) || effectiveCurrentSection === index;
              return (
                <button
                  key={index}
                  aria-label={`Go to section ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    effectiveCurrentSection === index
                      ? "bg-japanese-red scale-125"
                      : "bg-japanese-white/30"
                  }`}
                  onClick={() => canNavigate && handleNavClick(index)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
