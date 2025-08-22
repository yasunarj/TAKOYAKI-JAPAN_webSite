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
import { useI18n } from "@/i18n/I18nProvider";

type SectionComponentProps = { id: string; isActive: boolean };

type SectionDef = {
  id: "hero" | "intro" | "menu" | "access";
  label: string;
  component: ComponentType<SectionComponentProps>;
};

export default function HomeClient() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashCompleted, setSplashCompleted] = useState(false);
  const { t } = useI18n();

  const sections: SectionDef[] = useMemo(
    () => [
      {
        id: "hero",
        label: t.nav.hero,
        component: HeroSection,
        preview: (
          <div className="flex gap-2">
            <Image
              src="/images/topImage.png"
              alt="heroセクションのプレビュー画像"
              width={80}
              height={80}
              className="object-cover"
            />
            <div>
              <div className="text-[12px] font-medium">TOP</div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                店舗背景
                <br />
                キャッチコピー
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "intro",
        label: t.nav.intro,
        component: IntroSection,
        preview: (
          <div className="flex gap-2">
            <Image
              src="/images/accessStore.jpg"
              alt="店舗紹介セクションのプレビュー画像"
              width={80}
              height={80}
              className="object-cover"
            />
            <div>
              <div className="text-[12px] font-medium">店舗紹介</div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                お店の特徴
                <br />
                店舗内の雰囲気紹介
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "menu",
        label: t.nav.menu,
        component: MenuSection,
        preview: (
          <div className="flex gap-2">
            <Image
              src="/images/menu1.jpg"
              alt="メニューセクションのプレビュー画像"
              width={80}
              height={80}
              className="object-cover"
            />
            <div>
              <div className="text-[12px] font-medium">メニュー</div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                日光たこ焼き
              </div>
              <div className="text-[11px] text-white/60 line-clamp-2">¥680</div>
            </div>
          </div>
        ),
      },
      {
        id: "access",
        label: t.nav.access,
        component: AccessSection,
        preview: (
          <div className="flex gap-2">
            <Image
              src="/images/accessMap.png"
              alt="アクセスセクションのプレビュー画像"
              width={72}
              height={60}
              className="object-cover"
            />
            <div>
              <div className="text-[12px] font-medium">アクセス</div>
              <div className="text-[11px] text-white/60 line-clamp-2">
                栃木県日光市下鉢石町795-1
                <br />
                営業時間 10:00-22:00
              </div>
            </div>
          </div>
        ),
      },
    ],
    [t]
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
