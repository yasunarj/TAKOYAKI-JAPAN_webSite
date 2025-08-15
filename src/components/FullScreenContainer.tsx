'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FullScreenContainerProps {
  children: ReactNode;
  isActive: boolean;
  index: number;
}

const zIndexMap = ["z-10", "z-20", "z-30", "z-40"];

export default function FullScreenContainer({
  children,
  isActive,
  index,
}: FullScreenContainerProps) {
  return (
    <motion.div
      className={`fixed inset-0 w-full lg:w-4/5 h-screen overflow-hidden ${zIndexMap[index]}`}
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : index > 0 ? -100 : 100,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      transition={{
        duration: 2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}