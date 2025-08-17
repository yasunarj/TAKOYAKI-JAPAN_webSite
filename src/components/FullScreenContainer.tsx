// components/FullScreenContainer.tsx
"use client";

import React, { forwardRef, PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface FullScreenContainerProps extends PropsWithChildren {
  isActive: boolean;
  index: number;
  className?: string;
}

const zIndexMap = ["z-10", "z-20", "z-30", "z-40"];

const FullScreenContainer = forwardRef<
  HTMLDivElement,
  FullScreenContainerProps
>(({ children, isActive, index, className }, ref) => {
  return (
    <motion.section
      ref={ref}
      className={`absolute inset-0 ${zIndexMap[index]} ${className ?? ""}`}
      style={{
        pointerEvents: isActive ? "auto" : "none",
        overflowY: isActive ? "auto" : "hidden",
      }}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="min-h-screen">{children}</div>
    </motion.section>
  );
});

FullScreenContainer.displayName = "FullScreenContainer";
export default FullScreenContainer;
