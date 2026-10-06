import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("h-4 w-4 fill-current", className)} style={style}>
      <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
    </svg>
  );
}

const dotTone = {
  tangerine: "bg-tangerine", cobalt: "bg-cobalt", fuchsia: "bg-fuchsia", lime: "bg-lime",
  butter: "bg-butter", ink: "bg-ink", mint: "bg-mint",
} as const;
export type DotTone = keyof typeof dotTone;

export function Eyebrow({ children, tone = "tangerine", className }: { children: ReactNode; tone?: DotTone; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-2", className)}>
      <span className={cn("inline-block h-2 w-2 rounded-full", dotTone[tone])} />
      {children}
    </p>
  );
}
export const Dot = ({ tone, className }: { tone: DotTone; className?: string }) => (
  <span className={cn("inline-block h-2 w-2 rounded-full", dotTone[tone], className)} />
);

/** Giant outlined word that slowly parallaxes behind a section. */
export function OutlineWord({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-18%"]);
  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-x-0 overflow-hidden", className)}>
      <motion.div style={{ x }} className="outline-word text-[18vw] md:text-[14vw]">
        {children}
      </motion.div>
    </div>
  );
}

export function Reveal({ children, delay = 0, className, y = 32 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Heading with mask reveal. */
export function MaskHeading({ children, className, as: Tag = "h2" }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  return (
    <Tag className={cn("overflow-hidden font-serif leading-[0.95] tracking-tight", className)}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

export function RoundArrows({ onPrev, onNext, dark }: { onPrev: () => void; onNext: () => void; dark?: boolean }) {
  const base = cn(
    "grid h-11 w-11 place-items-center rounded-full border transition-colors",
    dark ? "border-cream/40 text-cream hover:bg-cream hover:text-ink" : "border-ink/25 hover:bg-ink hover:text-cream",
  );
  return (
    <div className="flex gap-2">
      <button aria-label="Previous" onClick={onPrev} className={base}><ArrowLeft className="h-4 w-4" /></button>
      <button aria-label="Next" onClick={onNext} className={base}><ArrowRight className="h-4 w-4" /></button>
    </div>
  );
}

export function Stars({ rating, reviews, className }: { rating: number; reviews?: number; className?: string }) {
  return (
    <p className={cn("flex items-center gap-1 text-xs", className)}>
      <span className="tracking-tight text-tangerine" aria-hidden>★★★★★</span>
      <span className="font-semibold">{rating}</span>
      {reviews !== undefined && <span className="text-muted-foreground">({reviews})</span>}
      <span className="sr-only">{rating} out of 5 stars</span>
    </p>
  );
}
