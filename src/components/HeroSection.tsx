"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function HeroSection({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const tHero = useTranslations("hero");
  const [showContent, setShowContent] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
    setShowContent(false);
  }, [isActive]);

  // iOS 等での自動再生トライ＆失敗ならフォールバック
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // 念のためコード側でも確実に
    const tryPlay = async () => {
      try {
        await v.play();
        setVideoOk(true);
      } catch {
        setVideoOk(false); // 失敗→フォールバック
      }
    };
    // ロード後に試す
    const onCanPlay = () => tryPlay();
    v.addEventListener("canplay", onCanPlay);
    // 既に読み込み済みなら即
    if (v.readyState >= 2) tryPlay();
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);

  return (
    <div
      id={id}
      className={`relative w-full h-screen overflow-hidden ${
        videoOk ? "" : "bg-[url('/images/splashScreen.jpg')] bg-cover bg-center"
      }`}
    >
      {/* 🎥 背景動画（ダメなら CSS 背景に切替） */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${
          videoOk ? "opacity-100" : "opacity-0"
        }`}
        poster="/images/splashScreen.jpg"
        preload="metadata"
        autoPlay
        loop
        muted
        playsInline
        onError={() => setVideoOk(false)}
      >
        <source src="/movies/hero-720.mp4" type="video/mp4" />
      </video>

      {/* 薄い黒オーバーレイ */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 📝 メインコンテンツ（あなたの元の内容そのまま） */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto w-full">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white mb-4 md:mb-6 font-brush"
            initial={{ opacity: 0, y: 50 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            TAKOYAKI <span className="block text-red-800">JAPAN</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 md:mb-8 leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {tHero("tagline1")}
            <br />
            <span className="text-japanese-gold font-semibold">
              {tHero("taglineEm")}
            </span>
            {tHero("tagline2")}
          </motion.p>

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
            <div className="w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red" />
            <div className="w-4 h-1 md:w-8 bg-japanese-gold border border-japanese-gold" />
            <div className="w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
