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

  // ヒーローテキストのアニメ
  const [showContent, setShowContent] = useState(false);

  // Intro（千客万来）と動画の状態管理
  const [minElapsed, setMinElapsed] = useState(false); // 最低表示時間を満たしたら true
  const [ready, setReady] = useState(false);           // video が十分読み込めたら true
  const [videoOk, setVideoOk] = useState(false);       // play() 成功で true
  const [hideIntro, setHideIntro] = useState(false);   // 完全にフェードアウト後にアンマウント
  const videoRef = useRef<HTMLVideoElement>(null);

  // ヒーロー上物の出し
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
    setShowContent(false);
  }, [isActive]);

  // Introを1.6秒は見せる（お好みで 1000〜2000ms に調整）
  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 1600);
    return () => clearTimeout(t);
  }, []);

  // 動画の読み込み＆再生（canplaythrough で十分なバッファ）
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;

    const onCanPlayThrough = async () => {
      setReady(true);
      try {
        await v.play();
        setVideoOk(true);
      } catch {
        setVideoOk(false);
      }
    };

    v.addEventListener("canplaythrough", onCanPlayThrough, { once: true });
    if (v.readyState >= 4) onCanPlayThrough();

    return () => v.removeEventListener("canplaythrough", onCanPlayThrough);
  }, []);

  // どのタイミングで動画を見せ始めるか：最低時間クリア かつ 再生OK
  const revealVideo = minElapsed && ready && videoOk;

  return (
    <div id={id} className="relative w-full h-screen overflow-hidden bg-black">
      {/* 🎥 背景動画：revealVideo でフェードイン（クロスフェード） */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700
          ${revealVideo ? "opacity-100" : "opacity-0"}`}
        preload="metadata"
        loop
        muted
        playsInline
      >
        <source media="(max-width: 767px)" src="/movies/hero-720.mp4" type="video/mp4" />
        <source media="(min-width: 768px)" src="/movies/12293701_3840_2160_30fps.mp4" type="video/mp4" />
      </video>

      {/* 📜 千客万来：最初は表示 → revealVideoでゆっくりフェードアウト */}
      {!hideIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: revealVideo ? 0 : 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }} // フェード時間はお好みで
          onAnimationComplete={() => {
            // 完全に 0 までフェードしたらDOMから外す（パフォ＆クリック透過）
            if (revealVideo) setHideIntro(true);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black"
        >
          <div className="text-white font-bold tracking-widest [writing-mode:vertical-rl] [text-orientation:upright] text-[128px] xl:text-[168px] 2xl:text-[200px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] leading-[1.8]">
            千客万来
          </div>
        </motion.div>
      )}

      {/* 薄い黒オーバーレイ（動画/イントロ共通の雰囲気付け） */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 📝 ヒーロー上物 */}
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
            <span className="text-japanese-gold font-semibold">{tHero("taglineEm")}</span>
            {tHero("tagline2")}
          </motion.p>

          <motion.div
            className="flex justify-center space-x-2 md:space-x-4"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={showContent ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
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
