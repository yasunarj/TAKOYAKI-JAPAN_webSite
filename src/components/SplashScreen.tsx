'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // フェードアウト後にコールバック実行
    }, 3000); // 3秒に延長

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center  justify-center bg-japanese-black overflow-hidden`}
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src="/images/splashScreen.jpg"
          alt="Splash Screen Background"
          fill
          className="object-cover"
          priority
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-japanese-black/20"></div>
      </div>

      <div className="relative z-10 text-center px-4 mt-24">
        {/* ロゴアニメーション */}
        <motion.div
          className="mb-2 md:mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1, 
            type: "spring", 
            stiffness: 200,
            delay: 0.2 
          }}
        >
          <div className="relative w-32 h-20 md:w-48 md:h-24 mx-auto flex items-center justify-center shadow-lg">
            <Image
              src="/images/TAKOYAKI_JAPAN.png"
              alt="TAKOYAKI_JAPANのロゴ"
              fill
              className=""
            />
          </div>
        </motion.div>

        {/* 店名 */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          TAKOYAKI JAPAN
        </motion.h1>

        {/* サブタイトル */}
        <motion.p
          className={`text-base md:text-lg lg:text-xl text-japanese-white mb-6 md:mb-8 drop-shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          日光の伝統的なたこ焼き店
        </motion.p>

        {/* 装飾的な線 */}
        <motion.div
          className="flex justify-center space-x-1 md:space-x-2 mb-6 md:mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="w-6 h-1 md:w-8 bg-japanese-red shadow-lg"></div>
          <div className="w-3 h-1 md:w-4 bg-japanese-gold shadow-lg"></div>
          <div className="w-6 h-1 md:w-8 bg-japanese-red shadow-lg"></div>
        </motion.div>

        {/* ローディングインジケーター */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 md:w-2 md:h-2 bg-japanese-red rounded-full shadow-lg"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
