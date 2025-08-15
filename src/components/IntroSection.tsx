'use client';

import { PATTERNS } from '@/app/styles/patterns';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface IntroSectionProps {
  id: string;
  isActive: boolean;
}

export default function IntroSection({ id, isActive }: IntroSectionProps) {
  const ref = useRef(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    console.log('IntroSection isActive:', isActive); // デバッグログ
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
      icon: '🏮',
      title: '伝統的な赤提灯',
      description: '入口に並ぶ赤提灯が、日本の伝統的な雰囲気を演出します。夜になると美しく灯り、訪れる人々を温かく迎え入れます。'
    },
    {
      icon: '🎵',
      title: 'リラックスできる音楽',
      description: '店内では日本の伝統音楽が流れ、落ち着いた雰囲気の中で食事を楽しむことができます。'
    },
    {
      icon: '🌿',
      title: 'オープンテラス',
      description: '新鮮な空気と日光を楽しめるオープンテラスで、四季折々の日光の美しさを感じながら食事ができます。'
    },
    {
      icon: '🌍',
      title: '多言語対応',
      description: '英語メニューを完備し、海外からの観光客にも安心してご利用いただけます。'
    },
    {
      icon: '💳',
      title: '多様な決済方法',
      description: '現金、クレジットカード、電子マネーなど、お客様の利便性に合わせた決済方法をご用意しています。'
    },
    {
      icon: '👨‍🍳',
      title: '職人の技',
      description: '長年培ってきた職人の技で、一つひとつ丁寧に焼き上げる本格的なたこ焼きをお楽しみください。'
    }
  ];

  return (
    <div id={id} ref={ref} className="relative w-full h-full bg-japanese-black overflow-y-auto pt-16 lg:pt-0">
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
              店舗紹介
            </h2>
            <div className="flex justify-center space-x-2 md:space-x-4 mb-4 sm:mb-6 md:mb-8">
              <div className="w-6 sm:w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
              <div className="w-3 sm:w-4 h-1 md:w-8 bg-japanese-gold border border-japanese-gold"></div>
              <div className="w-6 sm:w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-japanese-white max-w-3xl mx-auto leading-relaxed px-4">
              日光の美しい自然に囲まれた中で、伝統的な日本の味と現代的なサービスを融合させた
              特別なたこ焼き体験をお届けします。
            </p>
          </motion.div>

          {/* 特徴グリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-japanese-dark-gray p-4 sm:p-6 md:p-8 rounded-lg border border-japanese-red hover:border-japanese-crimson transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
            <div className="bg-japanese-dark-gray p-4 sm:p-6 md:p-8 lg:p-12 rounded-lg border border-japanese-red" style={PATTERNS.kikko}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                日光の伝統と現代の融合
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-japanese-white leading-relaxed max-w-4xl mx-auto px-4">
                日光は世界遺産に登録された歴史的な街として知られています。
                私たちの店舗では、その伝統的な雰囲気を大切にしながら、
                現代のお客様のニーズに応えるサービスを提供しています。
                観光で疲れた体を癒し、心からリラックスできる空間で、
                本格的なたこ焼きをお楽しみください。
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
