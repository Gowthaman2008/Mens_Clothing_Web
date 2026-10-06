import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import hero from "@/assets/campaign-hero.jpg";
import atelier from "@/assets/campaign-atelier.jpg";
import city from "@/assets/campaign-city.jpg";
import evening from "@/assets/campaign-evening.jpg";
import weekend from "@/assets/campaign-weekend.jpg";
import footerImg from "@/assets/campaign-footer.jpg";
import tuxedo from "@/assets/product-black-tie-tuxedo.jpg";

const scenes = [
  { t: "Monument", img: hero, tags: ["Black tailoring", "Concrete", "High Noon"] },
  { t: "The Fitting", img: atelier, tags: ["Private atelier", "Italian wool", "Craft"] },
  { t: "City Study", img: city, tags: ["Layered black", "Brutalist lines", "Daylight"] },
  { t: "Off Duty", img: weekend, tags: ["Heavy jersey", "Washed denim", "Weekend"] },
  { t: "After Hours", img: evening, tags: ["Black tie", "Satin lapels", "Midnight"] },
  { t: "The Tuxedo", img: tuxedo, tags: ["One button", "Peak lapel", "Formal"] },
  { t: "Final Walk", img: footerImg, tags: ["Vivant men", "New black", "SS/26"] },
];

export function Lookbook() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.min(scenes.length - 1, Math.floor(v * scenes.length));
    setI((p) => (p === n ? p : n));
  });

  const goTo = (n: number) => {
    const el = ref.current; if (!el) return;
    const k = Math.max(0, Math.min(scenes.length - 1, n));
    const top = el.getBoundingClientRect().top + window.scrollY + ((el.offsetHeight - window.innerHeight) * (k + 0.5)) / scenes.length;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(top); else window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r || r.top > 10 || r.bottom < window.innerHeight - 10) return;
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(i + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(i - 1); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const s = scenes[i]!;
  return (
    <section id="lookbook" ref={ref} style={{ height: `${scenes.length * 70 + 30}vh` }} className="relative bg-ink" aria-label="Lookbook SS/26">
      <motion.div className="sticky top-0 h-screen overflow-hidden text-cream" data-cursor="drag"
        onPanEnd={(_, info) => { if (Math.abs(info.offset.x) > 60) goTo(i + (info.offset.x < 0 ? 1 : -1)); }}>
        <AnimatePresence>
          <motion.img key={s.img} src={s.img} alt={`${s.t} — lookbook scene`} loading="lazy"
            initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40" />

        <p className="eyebrow absolute inset-x-0 top-24 text-center">VIVANT — Lookbook SS / 26</p>

        <div className="absolute bottom-24 left-5 md:bottom-28 md:left-10">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h2 key={s.t} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif text-7xl leading-none md:text-[10rem]">{s.t}</motion.h2>
            </AnimatePresence>
          </div>
          <p className="eyebrow mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[0.62rem]">
            {s.tags.map((t, j) => <span key={t} className={j === 0 ? "text-lime" : ""}>{t} ·</span>)}
            <span className="text-lime">{String(i + 1).padStart(2, "0")}</span>
          </p>
          <Link to="/shop" className="eyebrow mt-6 inline-flex items-center gap-2 rounded-full border border-cream/60 px-6 py-3 hover:bg-cream hover:text-ink">
            <ShoppingBag className="h-4 w-4" /> Shop the look
          </Link>
        </div>

        <div className="absolute bottom-24 right-5 hidden items-end gap-2 md:right-10 md:flex">
          {scenes.map((x, j) => (
            <button key={x.t} aria-label={`Go to ${x.t}`} onClick={() => goTo(j)}
              className={`overflow-hidden rounded-md transition-all duration-500 ${j === i ? "h-28 w-20 border-2 border-cream" : "h-16 w-12 opacity-60 hover:opacity-100"}`}>
              <img src={x.img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="absolute inset-x-5 bottom-8 flex flex-col gap-3 md:inset-x-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-4 text-xs font-semibold">
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span className="relative h-px max-w-xs flex-1 bg-cream/25"><motion.span className="absolute inset-y-0 left-0 bg-lime" animate={{ width: `${((i + 1) / scenes.length) * 100}%` }} /></span>
            <span>07</span>
          </div>
          <p className="eyebrow text-[0.58rem] text-cream/70">Drag, scroll, or use the arrow keys to explore</p>
        </div>
      </motion.div>
    </section>
  );
}
