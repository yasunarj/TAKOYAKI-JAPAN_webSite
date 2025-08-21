// components/FullScreenContainer.tsx
"use client";

import React, { forwardRef, PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface FullScreenContainerProps extends PropsWithChildren {
  isActive: boolean;
  index: number;
  prevIndex: number | null;   // ← 親から受け取る（直前アクティブ）
  className?: string;
}

const FullScreenContainer = forwardRef<HTMLDivElement, FullScreenContainerProps>(
  ({ children, isActive, index, prevIndex, className }, ref) => {
    const isLeaving = prevIndex === index && !isActive;

    // ★ オーバーラップ中は「去る側」を最前面に
    //    そうすると下で「新しいセクション」が浮かび上がるのが透けて見える
    const z = isLeaving ? "z-50" : isActive ? "z-40" : "z-10";

    // クリック等は常に現アクティブにのみ通す
    const pointer = isActive ? "auto" : "none";
    const overflowY = isActive ? "auto" : "hidden";

    // フェード時間＆タイミング
    // 去る側：ゆっくり暗転（重なりを作る）
    // 入る側：少し遅れて立ち上がる（下で浮かび上がるように）
    const duration = isLeaving ? 2 : isActive ? 0.5 : 0.2;
    const delay = isActive ? 0.08 : 0;

    return (
      <motion.section
        ref={ref}
        className={`absolute inset-0 ${z} ${className ?? ""}`}
        style={{ pointerEvents: pointer, overflowY }}
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <div className="min-h-screen">{children}</div>
      </motion.section>
    );
  }
);

FullScreenContainer.displayName = "FullScreenContainer";
export default FullScreenContainer;

