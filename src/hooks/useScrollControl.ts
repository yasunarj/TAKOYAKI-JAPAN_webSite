// hooks/useScrollControl.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EDGE_WHEEL_THRESHOLD = 320;
const SWIPE_THRESHOLD = 120;
const COOLDOWN_MS = 1000;

export const useScrollControl = (totalSections: number, enabled = true) => {
  const [currentSection, setCurrentSection] = useState(0);

  const containersRef = useRef<(HTMLDivElement | null)[]>([]);
  const setContainerRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      containersRef.current[index] = el;
    },
    []
  );

  // 👇 Hookはトップレベルで宣言！
  const touchStartY = useRef<number | null>(null);
  const lastSwitchAt = useRef(0);
  const edgeIntent = useRef<{ index: number | null; dir: "up" | "down" | null; acc: number }>({
    index: null,
    dir: null,
    acc: 0,
  });

  const clamp = (n: number) => Math.max(0, Math.min(n, totalSections - 1));

  const goToSection = useCallback(
    (index: number) => setCurrentSection(clamp(index)),
    [totalSections]
  );

  const moveSection = useCallback(
    (dir: "up" | "down") =>
      setCurrentSection((prev) => clamp(prev + (dir === "down" ? 1 : -1))),
    [totalSections]
  );

  const inCooldown = () => Date.now() - lastSwitchAt.current < COOLDOWN_MS;

  useEffect(() => {
    if (!enabled) return;
    const el = containersRef.current[currentSection];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    lastSwitchAt.current = Date.now();
  }, [currentSection, enabled]);

  const isAtTop = (el: HTMLElement) => el.scrollTop <= 0;
  const isAtBottom = (el: HTMLElement) =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

  useEffect(() => {
    if (!enabled) return;

    const onWheel = (index: number) => (e: WheelEvent) => {
      const el = containersRef.current[index];
      if (!el) return;

      const dy = e.deltaY;
      const atTop = isAtTop(el);
      const atBottom = isAtBottom(el);

      if ((!atTop && dy < 0) || (!atBottom && dy > 0)) {
        edgeIntent.current = { index: null, dir: null, acc: 0 };
        return;
      }

      if (dy > 0 && atBottom && index < totalSections - 1) {
        e.preventDefault();
        if (inCooldown()) return;
        const same =
          edgeIntent.current.index === index && edgeIntent.current.dir === "down";
        edgeIntent.current = {
          index,
          dir: "down",
          acc: same ? edgeIntent.current.acc + dy : dy,
        };
        if (edgeIntent.current.acc >= EDGE_WHEEL_THRESHOLD) {
          edgeIntent.current = { index: null, dir: null, acc: 0 };
          moveSection("down");
        }
      } else if (dy < 0 && atTop && index > 0) {
        e.preventDefault();
        if (inCooldown()) return;
        const same =
          edgeIntent.current.index === index && edgeIntent.current.dir === "up";
        edgeIntent.current = {
          index,
          dir: "up",
          acc: same ? edgeIntent.current.acc + -dy : -dy,
        };
        if (edgeIntent.current.acc >= EDGE_WHEEL_THRESHOLD) {
          edgeIntent.current = { index: null, dir: null, acc: 0 };
          moveSection("up");
        }
      }
    };

    const onTouchStart = (_index: number) => (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (index: number) => (e: TouchEvent) => {
      const el = containersRef.current[index];
      if (!el || touchStartY.current === null) return;

      const dy = touchStartY.current - e.touches[0].clientY;
      const atTop = isAtTop(el);
      const atBottom = isAtBottom(el);

      if (inCooldown()) return;

      if (dy > SWIPE_THRESHOLD && atBottom && index < totalSections - 1) {
        e.preventDefault();
        touchStartY.current = null;
        moveSection("down");
      } else if (dy < -SWIPE_THRESHOLD && atTop && index > 0) {
        e.preventDefault();
        touchStartY.current = null;
        moveSection("up");
      }
    };

    const onTouchEnd = () => {
      touchStartY.current = null;
    };

    const disposers: Array<() => void> = [];
    containersRef.current.forEach((el, index) => {
      if (!el) return;
      const wheel = onWheel(index);
      const ts = onTouchStart(index);
      const tm = onTouchMove(index);
      el.addEventListener("wheel", wheel, { passive: false });
      el.addEventListener("touchstart", ts, { passive: true });
      el.addEventListener("touchmove", tm, { passive: false });
      el.addEventListener("touchend", onTouchEnd, { passive: true });
      disposers.push(() => {
        el.removeEventListener("wheel", wheel);
        el.removeEventListener("touchstart", ts);
        el.removeEventListener("touchmove", tm);
        el.removeEventListener("touchend", onTouchEnd);
      });
    });

    return () => disposers.forEach((d) => d());
  }, [enabled, totalSections, moveSection]);

  return { currentSection, goToSection, setContainerRef };
};
