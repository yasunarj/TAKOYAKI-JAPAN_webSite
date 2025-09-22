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
  const [minElapsed, setMinElapsed] = useState(false); // 「千客万来」最低表示時間
  const [videoOk, setVideoOk] = useState(false);       // play() 成功
  const [hideIntro, setHideIntro] = useState(false);   // 千客万来をDOMから外す
  const videoRef = useRef<HTMLVideoElement>(null);

  // ヒーロー上物
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
    setShowContent(false);
  }, [isActive]);

  // 最低1.6秒は「千客万来」を見せる
  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), 1600);
    return () => clearTimeout(t);
  }, []);

  // 動画の再生試行（イベント/タイムアウト/ユーザー操作で再試行）
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // 自動再生の安全策：属性だけでなくプロパティでも設定
    v.muted = true;
    v.playsInline = true;

    let played = false;

    const tryPlay = async () => {
      if (!v || played) return;
      try {
        await v.play();
        played = true;
        setVideoOk(true);
      } catch {
        // まだブロック/未ロードなら次のトリガで再挑戦
        setVideoOk(false);
      }
    };

    // 早めに来る可能性のある順でイベントを監視
    const onLoadedData = () => tryPlay();
    const onCanPlay = () => tryPlay();
    const onCanPlayThrough = () => tryPlay();

    v.addEventListener("loadeddata", onLoadedData);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("canplaythrough", onCanPlayThrough);

    // 既に再生可能なら即試行
    if (v.readyState >= 2) tryPlay();

    // タイムアウトで再試行（ネット遅延時の救済）
    const retryTimer = setTimeout(() => tryPlay(), 1500);

    // タブがアクティブになったら再挑戦（iOSで効くことあり）
    const onVis = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      clearTimeout(retryTimer);
      document.removeEventListener("visibilitychange", onVis);
      v.removeEventListener("loadeddata", onLoadedData);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, []);

  // どのタイミングで動画を見せ始めるか：最低時間クリア かつ 再生成功
  const revealVideo = minElapsed && videoOk;

  // ユーザー操作で強制開始（自動再生ブロック対策）
  const handleKickstart = async () => {
    if (videoOk) return;
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = true;
      await v.play();
      setVideoOk(true);
    } catch {
      // まだダメなら何もしない（次のイベント/再試行を待つ）
    }
  };

  return (
    <div
      id={id}
      className="relative w-full h-[100dvh] md:h-screen overflow-hidden bg-black"
      // どこをタップ/クリックしても再生を試みる
      onPointerDown={handleKickstart}
      onTouchStart={handleKickstart}
    >
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
        {/* モバイルは軽量版、PCは元動画（必要なら1080pへ変更可能） */}
        <source media="(max-width: 767px)" src="/movies/hero-720.mp4" type="video/mp4" />
        <source media="(min-width: 768px)" src="/movies/12293701_3840_2160_30fps.mp4" type="video/mp4" />
      </video>

      {/* 📜 千客万来：revealVideo でゆっくりフェードアウト */}
      {!hideIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: revealVideo ? 0 : 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          onAnimationComplete={() => {
            if (revealVideo) setHideIntro(true);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black"
        >
          <div className="text-white font-bold tracking-widest [writing-mode:vertical-rl] [text-orientation:upright] text-[128px] xl:text-[168px] 2xl:text-[200px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] leading-[1.8]">
            千客万来
          </div>
        </motion.div>
      )}

      {/* 薄い黒オーバーレイ（クリック阻害を避けるため pointer-events 無効） */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

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
