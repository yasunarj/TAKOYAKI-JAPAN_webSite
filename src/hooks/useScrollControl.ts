'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const SCROLL_DELAY = 800;
const SWIPE_THRESHOLD = 50;
const SCROLL_THRESHOLD = 100; // ← スクロールの積算しきい値

export const useScrollControl = (totalSections: number, enabled: boolean = true) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const currentSectionRef = useRef(currentSection);
  const isScrollingRef = useRef(isScrolling);
  const scrollAccumulator = useRef(0); // ← 累積スクロール量

  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  const moveSection = useCallback((direction: 'up' | 'down') => {
    const nextSection =
      direction === 'down'
        ? Math.min(currentSectionRef.current + 1, totalSections - 1)
        : Math.max(currentSectionRef.current - 1, 0);

    if (nextSection !== currentSectionRef.current) {
      setCurrentSection(nextSection);
    }

    setIsScrolling(true);
    setTimeout(() => {
      setIsScrolling(false);
      scrollAccumulator.current = 0; // ← 累積スクロールリセット
    }, SCROLL_DELAY);
  }, [totalSections]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enabled || isScrollingRef.current) return;

    e.preventDefault();
    scrollAccumulator.current += e.deltaY;

    if (scrollAccumulator.current >= SCROLL_THRESHOLD && currentSectionRef.current < totalSections - 1) {
      moveSection('down');
    } else if (scrollAccumulator.current <= -SCROLL_THRESHOLD && currentSectionRef.current > 0) {
      moveSection('up');
    }
  }, [enabled, moveSection, totalSections]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || isScrollingRef.current) return;

    if (e.key === 'ArrowDown' && currentSectionRef.current < totalSections - 1) {
      e.preventDefault();
      moveSection('down');
    } else if (e.key === 'ArrowUp' && currentSectionRef.current > 0) {
      e.preventDefault();
      moveSection('up');
    }
  }, [enabled, moveSection, totalSections]);

  const handleTouchStart = useCallback((startEvent: TouchEvent) => {
    if (!enabled) return;

    const startY = startEvent.touches[0].clientY;

    const handleTouchEnd = (endEvent: TouchEvent) => {
      if (isScrollingRef.current) return;

      const endY = endEvent.changedTouches[0].clientY;
      const diffY = startY - endY;

      if (Math.abs(diffY) > SWIPE_THRESHOLD) {
        if (diffY > 0 && currentSectionRef.current < totalSections - 1) {
          moveSection('down');
        } else if (diffY < 0 && currentSectionRef.current > 0) {
          moveSection('up');
        }
      }

      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd, { once: true });
  }, [enabled, moveSection, totalSections]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [enabled, handleWheel, handleKeyDown, handleTouchStart]);

  useEffect(() => {
    console.log('Current section changed to:', currentSection);
  }, [currentSection]);

  return { currentSection, isScrolling };
};
