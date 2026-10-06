import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function useDragCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [max, setMax] = useState(0);
  const dragged = useRef(false);

  useEffect(() => {
    const measure = () => {
      const c = containerRef.current, t = trackRef.current;
      if (!c || !t) return;
      setMax(Math.max(0, t.scrollWidth - c.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  const progress = useTransform(x, (v) => (max ? Math.min(1, Math.max(0, -v / max)) : 0));
  const go = useCallback(
    (dir: 1 | -1) => {
      const step = (containerRef.current?.clientWidth ?? 600) * 0.6;
      const target = Math.min(0, Math.max(-max, x.get() - dir * step));
      animate(x, target, { type: "spring", stiffness: 200, damping: 30 });
    },
    [max, x],
  );
  return { containerRef, trackRef, x, max, progress, next: () => go(1), prev: () => go(-1), dragged };
}

type C = ReturnType<typeof useDragCarousel>;

export function DragTrack({ c, children, className }: { c: C; children: ReactNode; className?: string }) {
  return (
    <div ref={c.containerRef} className="overflow-hidden" data-cursor="drag">
      <motion.div
        ref={c.trackRef}
        drag="x"
        dragConstraints={{ left: -c.max, right: 0 }}
        dragElastic={0.08}
        dragTransition={{ power: 0.3, timeConstant: 300 }}
        style={{ x: c.x }}
        onDragStart={() => (c.dragged.current = true)}
        onDragEnd={() => setTimeout(() => (c.dragged.current = false), 50)}
        onClickCapture={(e) => { if (c.dragged.current) { e.preventDefault(); e.stopPropagation(); } }}
        className={cn("flex w-max touch-pan-y gap-6 py-4", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function DragProgress({ c, dark }: { c: C; dark?: boolean }) {
  return (
    <div className={cn("relative mt-8 h-px w-full", dark ? "bg-cream/20" : "bg-ink/15")}>
      <motion.div
        className={cn("absolute inset-y-0 left-0 w-full origin-left", dark ? "bg-cream" : "bg-ink")}
        style={{ scaleX: useTransform(c.progress, (p) => 0.12 + p * 0.88) }}
      />
    </div>
  );
}
