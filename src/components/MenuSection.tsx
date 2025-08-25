"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { PATTERNS } from "@/app/styles/patterns";
import { useTranslations } from "next-intl";

interface MenuSectionProps {
  id: string;
  isActive: boolean;
}

export default function MenuSection({ id, isActive }: MenuSectionProps) {
  const ref = useRef(null);
  const [showContent, setShowContent] = useState(false);
  const tMenu = useTranslations("menu");

  useEffect(() => {
    console.log("MenuSection isActive:", isActive); // デバッグログ
    if (isActive) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isActive]);

  const featuredItem = {
    name: tMenu("featured.name"),
    description: tMenu("featured.description"),
    price: tMenu("featured.price_label", { price: 680 }),
    image: "/images/manu1.jpg", // メニュー画像
    ingredients: [
      tMenu("featured.ingredients.i1"),
      tMenu("featured.ingredients.i2"),
      tMenu("featured.ingredients.i3"),
      tMenu("featured.ingredients.i4"),
    ],
    features: [
      tMenu("featured.features.f1"),
      tMenu("featured.features.f2"),
      tMenu("featured.features.f3"),
      tMenu("featured.features.f4"),
    ],
  };

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
              {tMenu("heading")}
            </h2>
            <div className="flex justify-center space-x-2 md:space-x-4 mb-4 sm:mb-6 md:mb-8">
              <div className="w-6 sm:w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
              <div className="w-3 sm:w-4 h-1 md:w-8 bg-japanese-gold border border-japanese-gold"></div>
              <div className="w-6 sm:w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-japanese-white max-w-3xl mx-auto leading-relaxed px-4 font-maru">
              {tMenu("lead_long")}
            </p>
          </motion.div>

          {/* メインメニューアイテム */}
          <motion.div
            className="bg-japanese-dark-gray rounded-lg overflow-hidden shadow-2xl border border-japanese-red"
            initial={{ opacity: 0, y: 50 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* 画像エリア */}
              <motion.div
                className="relative h-48 sm:h-56 md:h-64 lg:h-full bg-gradient-to-br from-japanese-red to-japanese-crimson border-r border-japanese-red"
                initial={{ opacity: 0, x: -50 }}
                animate={
                  showContent ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
                }
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* メニュー画像 */}
                <div className="absolute inset-0">
                  <Image
                    src="/images/menu1.jpg"
                    alt={tMenu("featured.image_alt")}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* オーバーレイ */}
                  <div className="absolute inset-0 bg-japanese-black/20"></div>
                </div>

                {/* 装飾的な要素 */}
                <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-japanese-gold text-japanese-black px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold border border-japanese-gold">
                  {tMenu("featured.badge_popular")}
                </div>
              </motion.div>

              {/* コンテンツエリア */}
              <div
                className="relative p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12"
                style={PATTERNS.karakusa}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
                    {featuredItem.name}
                  </h3>

                  <div className="flex items-center mb-3 sm:mb-4 md:mb-6">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-japanese-red mr-3 md:mr-4">
                      {featuredItem.price}
                    </span>
                    <div className="flex text-japanese-gold">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="text-base sm:text-lg md:text-xl"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm md:text-base text-japanese-white leading-relaxed mb-3 sm:mb-4 md:mb-6">
                    {featuredItem.description}
                  </p>

                  {/* 特徴リスト */}
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
                      {tMenu("featured.features_heading")}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {featuredItem.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center text-xs sm:text-xs md:text-sm text-japanese-white"
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            showContent
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -20 }
                          }
                          transition={{
                            duration: 0.4,
                            delay: 0.8 + index * 0.1,
                          }}
                        >
                          <div className="w-2 h-2 bg-japanese-red rounded-full mr-2"></div>
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* 材料リスト */}
                  <div className="mb-4 sm:mb-6 md:mb-8">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
                      {tMenu("featured.ingredients_heading")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {featuredItem.ingredients.map((ingredient, index) => (
                        <motion.span
                          key={index}
                          className="px-2 md:px-3 py-1 bg-japanese-gray text-japanese-white rounded-full text-xs md:text-sm border border-japanese-red"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={
                            showContent
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0, scale: 0.8 }
                          }
                          transition={{
                            duration: 0.4,
                            delay: 1.2 + index * 0.1,
                          }}
                        >
                          {ingredient}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* CTAボタン */}
                  <motion.button
                    className="w-full bg-japanese-red text-white font-bold py-3 md:py-4 rounded-lg hover:bg-japanese-crimson transition-colors duration-300 text-sm md:text-base border border-japanese-red"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.6, delay: 1.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tMenu("featured.order_cta")}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* その他のメニュー案内 */}
          <motion.div
            className="mt-8 sm:mt-12 md:mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <p className="text-sm sm:text-base md:text-lg text-japanese-white mb-4 md:mb-6 px-4 ">
              {tMenu("more.lead")}
            </p>
            <motion.button
              className="px-4 sm:px-6 md:px-8 py-3 md:py-3 border-2 border-japanese-red text-japanese-red font-bold rounded-lg hover:bg-japanese-red hover:text-white transition-all duration-300 text-sm md:text-base font-brush"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tMenu("more.all_menu_cta")}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
