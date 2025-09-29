// hooks/useScrollControl.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EDGE_WHEEL_THRESHOLD = 320;
const SWIPE_THRESHOLD = 60;
const COOLDOWN_MS = 700;
const NEAR_BOTTOM_PX = 24; // 下端近傍許容
const FREEZE_MS = 800;

const clamp = (n: number, total: number) => Math.max(0, Math.min(n, total - 1));
type Dir = "up" | "down";

export const useScrollControl = (totalSections: number, enabled = true) => {
  const [currentSection, setCurrentSection] = useState(0);

  // 実際にスクロールする要素
  const containersRef = useRef<(HTMLElement | null)[]>([]);

  // 各 index の ref コールバック（インスタンスを固定）
  const refCallbacksRef = useRef<Array<(el: HTMLElement | null) => void>>([]);

  // 要素ごとのクリーンアップ関数を保持（同じ要素に二重張りしない）
  const boundMapRef = useRef<WeakMap<HTMLElement, () => void>>(new WeakMap());

  // セクションが変わったタイミングで一時的にスクロールを停止（セクションの構築後に移動許可）
const inputLockedUntil = useRef(0);
const inInputLock = () => Date.now() < inputLockedUntil.current;

  // スワイプ等の内部状態
  const touchStartY = useRef<number | null>(null);
  const lastSwitchAt = useRef(0);
  const edgeIntent = useRef<{ index: number | null; dir: Dir | null; acc: number }>({
    index: null,
    dir: null,
    acc: 0,
  });

  const [direction, setDirection] = useState<Dir>("down");
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const currentIndexRef = useRef(0);

  const inCooldown = () => Date.now() - lastSwitchAt.current < COOLDOWN_MS;

  const isAtTop = (el: HTMLElement) => el.scrollTop <= 0;
  const isAtBottom = (el: HTMLElement) =>
    el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

  // リスナーを1要素に張るヘルパー（外側 state に触れない）
  const bindListenersFor = useCallback(
    (index: number, el: HTMLElement) => {
      if (!enabled) return () => {};

      // すでに張っていれば何もしない
      const boundMap = boundMapRef.current;
      const existingDisposer = boundMap.get(el);
      if (existingDisposer) return existingDisposer;

      // ハンドラは index を閉じ込め、動的値は useRef を参照
      const onWheel = (e: WheelEvent) => {
        const target = containersRef.current[index];
        if (!target) return;

        const dy = e.deltaY; //dyは指の移動量 +は上、-は下判定
        const atTop = isAtTop(target); //atTopは上端であるかどうか
        const atBottom = isAtBottom(target); //atBottomは下端であるかどうか

        if ((!atTop && dy < 0) || (!atBottom && dy > 0)) {
          edgeIntent.current = { index: null, dir: null, acc: 0 };
          return;
        } 

        if (dy> 0 && atBottom && index < totalSections - 1) {
          e.preventDefault();
          if (inCooldown()) return;
          const same = edgeIntent.current.index === index && edgeIntent.current.dir === "down";
          edgeIntent.current = { index, dir: "down", acc: same ? edgeIntent.current.acc + dy : dy };
          if (edgeIntent.current.acc >= EDGE_WHEEL_THRESHOLD) {
            edgeIntent.current = { index: null, dir: null, acc: 0 };
            moveSectionRef.current("down");
          }
        } else if (dy < 0 && atTop && index > 0) {
          e.preventDefault();
          if (inCooldown()) return;
          const same = edgeIntent.current.index === index && edgeIntent.current.dir === "up";
          edgeIntent.current = { index, dir: "up", acc: same ? edgeIntent.current.acc + -dy : -dy };
          if (edgeIntent.current.acc >= EDGE_WHEEL_THRESHOLD) {
            edgeIntent.current = { index: null, dir: null, acc: 0 };
            moveSectionRef.current("up");
          }
        }
      };

      const onTouchStart = (e: TouchEvent) => {
        if (inInputLock()) {
          e.preventDefault();
          return;
        }
        touchStartY.current = e.touches[0].clientY;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (inInputLock()) {
          e.preventDefault();
          return;
        }
        const target = containersRef.current[index];
        if (!target || touchStartY.current === null) return;

        const dy = touchStartY.current - e.touches[0].clientY;
        const atTop = isAtTop(target);
        const atBottom = isAtBottom(target);
        const nearBottom =
          atBottom ||
          target.scrollHeight - (target.scrollTop + target.clientHeight) <= NEAR_BOTTOM_PX;

        // 端（上端/下端）に到達しているときのバウンド抑止（iOS対策）
        // 上に引っ張る（dy < 0）かつ上端、または下に引っ張る（dy > 0）かつ下端なら既定のバウンドを防ぐ
        if ((dy < 0 && atTop) || (dy > 0 && atBottom)) {
          e.preventDefault();
        }

        if (inCooldown()) return;

        if (dy > SWIPE_THRESHOLD && (nearBottom || index === 0) && index < totalSections - 1) {
          e.preventDefault();
          touchStartY.current = null;
          moveSectionRef.current("down");
        } else if (dy < -SWIPE_THRESHOLD && atTop && index > 0) {
          e.preventDefault();
          touchStartY.current = null;
          moveSectionRef.current("up");
        }
      };

      const onTouchEnd = () => {
        touchStartY.current = null;
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: false });
      el.addEventListener("touchend", onTouchEnd, { passive: true });

      const disposer = () => {
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
      };

      boundMap.set(el, disposer);
      return disposer;
    },
    [enabled, totalSections]
  );

  // ref コールバック（index ごとに安定化）— setState を絶対に呼ばない
  const setContainerRef = useCallback(
    (index: number) => {
      if (!refCallbacksRef.current[index]) {
        refCallbacksRef.current[index] = (el: HTMLElement | null) => {
          const prev = containersRef.current[index];
          // 変化がなければ何もしない
          if (prev === el) return;

          // 以前の要素をクリーンアップ
          if (prev) {
            const disposer = boundMapRef.current.get(prev);
            disposer?.();
            boundMapRef.current.delete(prev);
          }

          containersRef.current[index] = el;

          // 新しい要素があれば即バインド（state は触らない）
          if (el) {
            bindListenersFor(index, el);
          }
        };
      }
      return refCallbacksRef.current[index];
    },
    [bindListenersFor]
  );

  // moveSection / goToSection を ref 経由にしてリスナーから呼べるように
  const moveSectionRef = useRef<(dir: Dir) => void>(() => {});
  const goToSectionRef = useRef<(i: number) => void>(() => {});

  const goToSection = useCallback(
    (index: number) => {
      const i = clamp(index, totalSections);

      inputLockedUntil.current = Date.now() + FREEZE_MS;
      touchStartY.current = null;
      edgeIntent.current = { index: null, dir: null, acc: 0 }

      setPrevIndex(currentIndexRef.current);

      const el = containersRef.current[i];
      if (el) {
        el.scrollTop = 0;
        el.scrollTo({ top: 0, behavior: "auto" });
      }

      const prev = currentSection;
      if (i > prev) setDirection("down");
      else if (i < prev) setDirection("up");

      setCurrentSection(i);
    },
    [totalSections, currentSection]
  );
  goToSectionRef.current = goToSection;

  const moveSection = useCallback(
    (dir: Dir) => {
      const prev = currentIndexRef.current;
      const next = clamp(prev + (dir === "down" ? 1 : -1), totalSections);

      inputLockedUntil.current = Date.now() + FREEZE_MS;
      touchStartY.current = null;
      edgeIntent.current = { index: null, dir: null, acc: 0 };

      setPrevIndex(prev);

      const target = containersRef.current[next];
      if (target) {
        target.scrollTop = 0;
        target.scrollTo({ top: 0, behavior: "auto" });
      }

      setDirection(dir);
      setCurrentSection(next);
    },
    [totalSections]
  );
  moveSectionRef.current = moveSection;

  useEffect(() => {
    currentIndexRef.current = currentSection;
  }, [currentSection]);

  // 現在セクションへスムーズスクロール（state 更新のみ）
  useEffect(() => {
    if (!enabled) return;
    const el = containersRef.current[currentSection];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    lastSwitchAt.current = Date.now();
  }, [currentSection, enabled]);

  // アンマウント時の全クリーンアップ
  useEffect(() => {
    return () => {
      containersRef.current.forEach((el) => {
        if (!el) return;
        const disposer = boundMapRef.current.get(el);
        disposer?.();
      });
      boundMapRef.current = new WeakMap();
    };
  }, []);

  return { currentSection, direction, goToSection, setContainerRef, prevIndex };
};




