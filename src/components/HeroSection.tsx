"use client";


import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  id: string;
  isActive: boolean;
}

export default function HeroSection({ id, isActive }: HeroSectionProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isActive]);

  return (
    <div id={id} className="relative w-full h-screen overflow-hidden">
      {/* 🎥 背景動画 */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-10"
        src="/movies/12293701_3840_2160_30fps.mp4"
        preload="auto"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🔲 オーバーレイ（動画の上に黒を薄く重ねる）※必要なら */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0" />

      {/* 📝 メインコンテンツ */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto w-full">
          {/* 店名 */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 md:mb-6 font-brush"
            initial={{ opacity: 0, y: 50 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            TAKOYAKI
            <span className="block text-red-800">JAPAN</span>
          </motion.h1>

          {/* キャッチフレーズ */}
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 md:mb-8 leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            日光の伝統的な味を
            <br />
            <span className={`text-japanese-gold font-semibold`}>
              心を込めて
            </span>
            お届けします
          </motion.p>

          {/* 装飾的な線 */}
          <motion.div
            className="flex justify-center space-x-2 md:space-x-4"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={
              showContent
                ? { opacity: 1, scaleX: 1 }
                : { opacity: 0, scaleX: 0 }
            }
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <div className="w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
            <div className="w-4 h-1 md:w-8 bg-japanese-gold border border-japanese-gold"></div>
            <div className="w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
