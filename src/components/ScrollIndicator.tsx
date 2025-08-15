"use client";

import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  currentSection: number;
  totalSections: number;
  onSectionClick: (index: number) => void;
}

export default function ScrollIndicator({
  currentSection,
  totalSections,
  onSectionClick,
}: ScrollIndicatorProps) {
  return (
    <div
      className="fixed right-[2.2%] -bottom-3 transform -translate-y-1/2 z-50 hidden lg:block 
    [@media(max-height:700px)]:right-[2.2%]
    [@media(max-height:700px)]:bottom-1.5
    [@media(max-height:500px)]:hidden
    "
    >
      <div
        className="flex flex-col space-y-3 [@media(max-height:700px)]:flex-row 
    [@media(max-height:700px)]:space-x-3"
      >
        {Array.from({ length: totalSections }).map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? "bg-japanese-red scale-125"
                : "bg-japanese-white/30 hover:bg-japanese-white/50"
            }`}
            onClick={() => onSectionClick(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}
