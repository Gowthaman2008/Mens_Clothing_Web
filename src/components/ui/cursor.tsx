import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "default" | "drag" | "view";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const m = (el?.dataset["cursor"] as Mode) ?? "default";
      setMode((p) => (p === m ? p : m));
    };
    window.addEventListener("pointermove", move);
    return () => { window.removeEventListener("pointermove", move); document.body.classList.remove("has-cursor"); };
  }, [x, y]);

  if (!enabled) return null;
  const big = mode !== "default";
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{ width: big ? 84 : 10, height: big ? 84 : 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full",
          big ? "bg-lime text-ink" : "bg-ink mix-blend-difference",
        )}
      >
        {big && <span className="eyebrow text-[0.62rem]">{mode === "drag" ? "Drag" : "View"}</span>}
      </motion.div>
    </motion.div>
  );
}
