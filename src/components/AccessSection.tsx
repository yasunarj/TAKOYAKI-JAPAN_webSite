"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { PATTERNS } from "@/app/styles/patterns";

interface AccessSectionProps {
  id: string;
  isActive: boolean;
}

export default function AccessSection({ id, isActive }: AccessSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isActive]);

  const shopInfo = {
    address: "栃木県日光市下鉢石町795-1",
    phone: "07014115588",
    hours: {
      weekdays: "11:00 - 21:00",
      weekends: "10:00 - 22:00",
      holidays: "10:00 - 22:00",
    },
    paymentMethods: ["現金", "クレジットカード", "電子マネー", "QRコード決済"],
    access: {
      train: "JR日光線 日光駅から徒歩10分",
      bus: "日光駅前バス停から5分",
      car: "日光ICから車で10分",
    },
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
            className="text-center mb-6 sm:mb-8 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
              アクセス・店舗情報
            </h2>
            <div className="flex justify-center space-x-2 md:space-x-4 mb-2 sm:mb-3 md:mb-4">
              <div className="w-6 sm:w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
              <div className="w-3 sm:w-4 h-1 md:w-8 bg-japanese-gold border border-japanese-gold"></div>
              <div className="w-6 sm:w-8 h-1 md:w-16 bg-japanese-red border border-japanese-red"></div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-japanese-white max-w-3xl mx-auto leading-relaxed px-4">
              日光の観光地からアクセスしやすい場所にございます。
              <br />
              お気軽にお立ち寄りください。
            </p>
          </motion.div>

          {/* 2カラム：左=画像+基本情報 / 右=Map+アクセス方法 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-8 lg:gap-4 xl:gap-8 md:max-w-[700px] md:mx-auto lg:max-w-none lg:mx-0">
            {/* 左カード：店舗画像 + 基本情報 */}
            <motion.div
              className="bg-japanese-dark-gray border border-japanese-red overflow-hidden flex flex-col"
              initial={{ opacity: 0, x: -50 }}
              animate={
                showContent ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* 画像 */}
              <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-88">
                <Image
                  src="/images/accessStore.jpg"
                  alt="店舗外観"
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>

              {/* 基本情報 */}
              <div
                className="p-4 sm:p-6 md:p-8 border-t border-japanese-red "
                style={PATTERNS.tatewaki}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                  基本情報
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex ml-4">
                    <h4 className="text-white w-28 md:w-40 lg:w-28 xl:w-40 font-semibold mb-1 text-xs sm:text-sm md:text-base">
                      住所
                    </h4>
                    <p className="text-japanese-white text-xs sm:text-sm md:text-base">
                      {shopInfo.address}
                    </p>
                  </div>

                  <div className="flex ml-4">
                    <h4 className="text-white w-28 md:w-40 lg:w-28 xl:w-40 font-semibold mb-1 text-xs sm:text-sm md:text-base">
                      電話番号
                    </h4>
                    <p className="text-japanese-white text-xs sm:text-sm md:text-base">
                      {shopInfo.phone}
                    </p>
                  </div>

                  <div className="flex ml-4">
                    <h4 className="text-white w-28 md:w-40 lg:w-28 xl:w-40 font-semibold mb-1 text-xs sm:text-sm md:text-base">
                      営業時間
                    </h4>
                    <div className="text-japanese-white space-y-1 text-xs sm:text-sm md:text-base">
                      <p>平日: {shopInfo.hours.weekdays}</p>
                      <p>土日祝: {shopInfo.hours.weekends}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 右カード：Google Map + アクセス方法 */}
            <motion.div
              className="bg-japanese-dark-gray border border-japanese-red overflow-hidden flex flex-col"
              initial={{ opacity: 0, x: 50 }}
              animate={
                showContent ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Map プレースホルダー（ここにiframe等を入れ替え可能） */}
              <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-88 bg-gradient-to-br from-japanese-gray to-japanese-dark-gray flex items-center justify-center">
                <iframe
                  title="店舗へのアクセス"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    "栃木県日光市下鉢石町795-1"
                  )}&hl=ja&output=embed`}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              {/* アクセス方法 */}
              <div
                className="flex-1 p-4 sm:p-6 md:p-8 border-t border-japanese-red"
                style={PATTERNS.tatewaki}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                  アクセス方法
                </h3>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start">
                    <div className="flex ml-4">
                      <h4 className="text-white w-28 md:w-40 lg:w-20 xl:w-32 font-semibold mb-1 text-xs sm:text-sm md:text-base">
                        電車
                      </h4>
                      <p className="text-japanese-white text-xs sm:text-sm md:text-base">
                        {shopInfo.access.train}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex ml-4">
                      <h4 className="text-white w-28 md:w-40 lg:w-20 xl:w-32 font-semibold mb-1 text-xs sm:text-sm md:text-base">
                        バス
                      </h4>
                      <p className="text-japanese-white text-xs sm:text-sm md:text-base">
                        {shopInfo.access.bus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex ml-4">
                      <h4 className="text-white w-28 md:w-40 lg:w-20 xl:w-32 font-semibold mb-1 text-xs sm:text-sm md:text-base">
                        車
                      </h4>
                      <p className="text-japanese-white text-xs sm:text-sm md:text-base">
                        {shopInfo.access.car}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* お問い合わせ */}
          <motion.div
            className="mt-4 sm:mt-6 md:mt-8 text-center md:max-w-[700px] md:mx-auto lg:max-w-none lg:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div
              className="bg-japanese-dark-gray p-4 sm:p-6 md:p-8 lg:p-12 border border-japanese-red"
              style={PATTERNS.tatewaki}
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                お気軽にお問い合わせください
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-japanese-white mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                ご予約やお問い合わせは、お電話またはお気軽に店舗までお立ち寄りください。
                スタッフ一同、心よりお待ちしております。
              </p>
              <motion.button
                className="px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-japanese-red text-white font-bold hover:bg-japanese-crimson transition-colors duration-300 text-sm md:text-base border border-japanese-red"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                お電話でお問い合わせ
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
