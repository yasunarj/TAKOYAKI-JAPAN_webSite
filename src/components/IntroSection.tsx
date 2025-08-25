"use client";

import { PATTERNS } from "@/app/styles/patterns";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface IntroSectionProps {
  id: string;
  isActive: boolean;
}

export default function IntroSection({ id, isActive }: IntroSectionProps) {
  const ref = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const tIntro = useTranslations('intro');

  useEffect(() => {
    console.log("IntroSection isActive:", isActive); // デバッグログ
    if (isActive) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isActive]);

  const features = [
    {
      title: tIntro('features.lantern.title'),
      description: tIntro('features.lantern.desc')
    },
    {
      title: tIntro('features.music.title'),
      description: tIntro('features.music.desc'),
    },
    {
      title: tIntro('features.terrace.title'),
      description: tIntro('features.terrace.desc'),
    },
    {
      title: tIntro('features.multilingual.title'),
      description: tIntro('features.multilingual.desc'),
    },
    {
      title: tIntro('features.payment.title'),
      description: tIntro('features.payment.desc'),
    },
    {
      title: tIntro('features.craftsmanship.title'),
      description: tIntro('features.craftsmanship.desc'),
    },
  ];

  return (
    <div
      id={id}
      ref={ref}
      className="relative w-full h-full bg-japanese-black overflow-y-auto pt-16 lg:pt-0"
    >
      <div className="min-h-full flex flex-col justify-center py-8 sm:py-12 md:py-16 lg:py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* セクションヘッダー */}
          <motion.div
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-brush">
              {tIntro('heading')}
            </h2>
            <div className="flex justify-center space-x-2 md:space-x-4 mb-4 sm:mb-6 md:mb-8">
              <div className="w-6 sm:w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
              <div className="w-3 sm:w-4 h-1 md:w-8 bg-japanese-gold border border-japanese-gold"></div>
              <div className="w-6 sm:w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-japanese-white max-w-3xl mx-auto leading-relaxed px-4">
              {tIntro('lead_long')}
            </p>
          </motion.div>

          {/* 特徴グリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-japanese-dark-gray p-4 sm:p-6 md:p-8 rounded-lg border border-japanese-red hover:border-japanese-crimson transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={
                  showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                style={PATTERNS.kikko}
              >
                {/* <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4">{feature.icon}</div> */}
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 md:mb-3 ">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-japanese-white leading-relaxed ">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 店舗の雰囲気説明 */}
          <motion.div
            className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div
              className="bg-japanese-dark-gray p-4 sm:p-6 md:p-8 lg:p-12 rounded-lg border border-japanese-red"
              style={PATTERNS.kikko}
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                {tIntro('atmosphere.heading')}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-japanese-white leading-relaxed max-w-4xl mx-auto px-4">
                {tIntro('atmosphere.body')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
