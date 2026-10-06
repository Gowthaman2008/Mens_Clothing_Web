import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSwipeRail, railClass } from "@/hooks/use-swipe-rail";
import { ArrowRight } from "lucide-react";
import atelier from "@/assets/campaign-atelier.jpg";
import city from "@/assets/campaign-city.jpg";
import evening from "@/assets/campaign-evening.jpg";
import weekend from "@/assets/campaign-weekend.jpg";
import sportJacket from "@/assets/product-noir-sport-jacket.jpg";
import satinShirt from "@/assets/product-satin-camp-shirt.jpg";
import { OutlineWord, Reveal } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const edits = [
  { t: "The Wedding Guest", k: "Black tie, precisely cut", img: evening, off: "md:mt-0" },
  { t: "Off Duty", k: "Denim, jersey & quiet structure", img: weekend, off: "md:mt-20" },
  { t: "The New Suit", k: "Relaxed tailoring in black", img: sportJacket, off: "md:mt-8" },
  { t: "Private Atelier", k: "Made-to-measure, made for you", img: atelier, off: "md:mt-28" },
];

export function Occasions() {
  const { railRef, barRef } = useSwipeRail<HTMLDivElement>(0.18);
  return (
    <section className="relative overflow-hidden py-12 md:py-24" aria-labelledby="occ-h">
      <OutlineWord className="bottom-10">Every Occasion</OutlineWord>
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          <h2 id="occ-h" className="min-w-0 font-display text-5xl uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-8xl">
            Edits for <span className="font-script normal-case tracking-normal text-ink">every occasion</span>
          </h2>
          <Link to="/shop" className="eyebrow flex w-fit min-w-0 shrink-0 items-center gap-2 md:pb-3">View all categories <ArrowRight className="h-3.5 w-3.5 shrink-0" /></Link>
        </div>
        <Reveal className="mt-8 md:mt-14">
          <div
            ref={railRef}
            className={`${railClass} -mx-5 gap-3 px-5 pb-2 sm:gap-6 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-x-visible md:px-0 md:pb-0`}
          >
            {edits.map((e) => (
              <div key={e.t} className={cn("w-[68%] shrink-0 snap-start sm:w-[44%] min-w-0 md:w-auto", e.off)}>
                <Link to="/shop" data-cursor="view" className="group relative block aspect-[3/5] overflow-hidden rounded-2xl sm:aspect-[3/4.6] sm:rounded-3xl">
                  <img src={e.img} alt={e.t} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-cream sm:p-6">
                    <p className="font-serif text-xs italic leading-snug text-cream/80 sm:text-base">{e.k}</p>
                    <h3 className="mt-1 break-words font-serif text-2xl leading-none sm:text-4xl">{e.t}</h3>
                    <p className="mt-3 flex items-center gap-1 text-[0.5625rem] font-semibold uppercase sm:eyebrow sm:mt-4 sm:gap-2">Explore now <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-1 sm:h-3.5 sm:w-3.5" /></p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3 md:hidden" aria-hidden>
            <span className="eyebrow shrink-0">Swipe</span>
            <span className="relative block h-[2px] flex-1 rounded-full bg-ink/15">
              <span ref={barRef} className="absolute inset-0 origin-left rounded-full bg-ink will-change-transform" style={{ transform: "scaleX(0.18)" }} />
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const offers = [
  { t: "The Suit Deal", s: "Jacket + trouser, 20% off the set", img: sportJacket },
  { t: "Wrapped in Ribbon", s: "Free gift boxing on every order", img: evening },
  { t: "Shirt Saturday", s: "Two satin shirts, free pocket square", img: satinShirt },
  { t: "Second Look", s: "15% off your second item", img: city },
  { t: "Weekend Bundle", s: "Off-duty sets from ₹16,500", img: weekend },
  { t: "Free Alterations", s: "On all tailoring, forever", img: atelier },
];

export function Offers() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % offers.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="bg-lavender py-24" aria-labelledby="offers-h">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <h2 id="offers-h" className="mb-10 font-serif text-5xl md:text-7xl">Current <em className="text-cobalt">Offers</em></h2>
        <div className="flex h-[520px] flex-col gap-3 md:flex-row" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {offers.map((o, i) => {
            const on = i === active;
            return (
              <motion.button key={o.t} layout onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                aria-expanded={on} aria-label={o.t}
                animate={{ flexGrow: on ? 6 : 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative min-h-14 basis-0 overflow-hidden rounded-3xl text-left text-cream">
                <img src={o.img} alt="" loading="lazy" className={cn("absolute inset-0 h-full w-full object-cover transition-[filter] duration-700", !on && "grayscale")} />
                <div className={cn("absolute inset-0 transition-colors duration-700", on ? "bg-gradient-to-t from-ink/70 to-transparent" : "bg-ink/30")} />
                <span className="absolute left-5 top-5 font-serif text-2xl">{String(i + 1).padStart(2, "0")}</span>
                {!on && <span className="eyebrow absolute bottom-6 left-1/2 hidden -translate-x-1/2 [writing-mode:vertical-rl] rotate-180 md:block">Current offer</span>}
                {on && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="absolute inset-x-0 bottom-0 p-8">
                    <p className="eyebrow text-lime">Current offer</p>
                    <h3 className="mt-2 font-serif text-5xl leading-none">{o.t}</h3>
                    <p className="mt-2 text-sm text-cream/85">{o.s}</p>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
