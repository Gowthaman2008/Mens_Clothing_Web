import { useEffect, useRef } from "react";

/**
 * Horizontal swipe rail with a progress bar that updates without React re-renders,
 * keeping touch scrolling smooth on phones.
 */
export function useSwipeRail<T extends HTMLElement>(min = 0.15) {
  const railRef = useRef<T>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = railRef.current;
    const bar = barRef.current;
    if (!el || !bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 4 ? el.scrollLeft / max : 1;
      bar.style.transform = `scaleX(${min + p * (1 - min)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [min]);

  return { railRef, barRef };
}

/** Shared classes for the mobile swipe rail container. */
export const railClass =
  "no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-5 [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y]";
