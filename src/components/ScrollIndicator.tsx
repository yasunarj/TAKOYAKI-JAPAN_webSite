// components/ScrollIndicator.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, ReactNode } from "react";

type SectionMeta = { id: string; label: string; preview?: ReactNode };

interface Props {
  currentSection: number;
  sections: SectionMeta[];
  visitedIds: string[];
  onSectionClick: (index: number) => void;
}

export default function ScrollIndicator({
  currentSection,
  sections,
  visitedIds,
  onSectionClick,
}: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const total = sections.length;
  const progress = (currentSection + 1) / total; // 0..1

  return (
    <motion.div
      className="fixed right-[2.2%] -bottom-3 transform -translate-y-1/2 z-50 hidden lg:block
    [@media(max-height:700px)]:right-[2.2%]
    [@media(max-height:700px)]:bottom-1.5
    [@media(max-height:500px)]:hidden
    "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <div className="relative flex flex-col items-center gap-4 select-none">
        {/* 縦の進捗バー（背景） */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-white/10 rounded-full pointer-events-none" />

        {/* 縦の進捗バー（到達分） */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 bg-japanese-red rounded-full pointer-events-none"
          style={{ height: `${progress * 100}%` }}
          layout
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
        />

        {/* ドット群 */}
        {sections.map((s, i) => {
          const isActive = i === currentSection;
          const isHovered = hoverIndex === i;
          const canNavigate = visitedIds.includes(s.id) || isActive;

          return (
            <motion.div
              key={s.id}
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2 + i * 0.2 }}
            >
              {/* ドット本体（ボタンでアクセシビリティ対応） */}
              <button
                type="button"
                aria-label={`セクション ${i + 1}: ${s.label}`}
                className={`group relative block ${
                  !canNavigate ? "cursor-not-allowed" : ""
                }`}
                onClick={() => canNavigate && onSectionClick(i)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex(null)}
              >
                {/* 外側のリング（アクティブ時の発光） */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 -m-1 rounded-full bg-japanese-red/25"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.35 }}
                    />
                  )}
                </AnimatePresence>

                {/* ドット */}
                <motion.span
                  className={`relative z-[1] block h-3 w-3 rounded-full ${
                    isActive
                      ? "bg-japanese-red"
                      : canNavigate
                      ? "bg-white/40 group-hover:bg-white/70"
                      : "bg-white/20"
                  }`}
                  animate={
                    isActive
                      ? { scale: 1.15, backgroundColor: "#940421" }
                      : { scale: 1, backgroundColor: "rgba(255,255,255,0.4)" }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                />
              </button>

              {/* ツールチップ（ラベル＋プレビュー） */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute right-6 top-1/2 -translate-y-1/2 origin-right
                              whitespace-pre-line rounded-lg border border-white/10 bg-black/80
                              text-white shadow-xl backdrop-blur px-3 py-2 w-[220px] pointer-events-none"
                    initial={{ opacity: 0, x: 6, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    {canNavigate ? (
                      s.preview ? (
                        <div className="text-xs text-white/80 leading-relaxed line-clamp-3">
                          {s.preview}
                        </div>
                      ) : (
                        <div className="text-xs text-white/60 leading-relaxed">
                          s.preview ?? (
                          <span className="text-white/60">クリックで移動</span>)
                        </div>
                      )
                    ) : (
                      <div className="text-[12px] text-white/60">まだ移動できません</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
