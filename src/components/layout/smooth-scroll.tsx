import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { useAdmin } from "@/store/admin";

export function AppEffects() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { useShop.persist.rehydrate(); useAdmin.persist.rehydrate(); }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      (window as unknown as { __lenis: unknown }).__lenis = lenis;
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { cancelled = true; cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [path]);
  return null;
}
