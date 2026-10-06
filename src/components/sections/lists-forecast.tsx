import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import atelier from "@/assets/campaign-atelier.jpg";
import city from "@/assets/campaign-city.jpg";
import evening from "@/assets/campaign-evening.jpg";
import { Eyebrow, MaskHeading, Reveal } from "@/components/ui/primitives";
import { MiniCard } from "@/components/ui/product-card";
import { pick } from "@/lib/products";

function ListBlock({ title, bar, link, slugs }: { title: string; bar: string; link: string; slugs: string[] }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-4 font-serif text-4xl md:text-5xl"><span className={`h-10 w-1.5 rounded-full ${bar}`} />{title}</h2>
        <Link to="/shop" className="eyebrow flex items-center gap-2">{link} <ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {pick(...slugs).map((p, i) => <Reveal key={p.slug} delay={i * 0.08}><MiniCard p={p} selected={i === 1 ? "S" : "M"} /></Reveal>)}
      </div>
    </div>
  );
}

export function TrendingSummer() {
  return (
    <section className="mx-auto max-w-[1500px] space-y-16 px-5 py-24 md:px-10">
      <ListBlock title="Trending Today" bar="bg-tangerine" link="Shop trending" slugs={["lemon-pleated-trouser", "ultramarine-flare-jeans", "lilac-sheer-shirt"]} />
      <ListBlock title="Summer Specials" bar="bg-mint" link="Shop summer" slugs={["mint-terry-polo", "poppy-poplin-set", "riviera-wide-leg-trouser"]} />
    </section>
  );
}

const moods = [
  { n: "01", t: "The Atelier", img: atelier, alt: "A tailor fitting a black jacket on a male model" },
  { n: "02", t: "City Structure", img: city, alt: "Man in black layers beside brutalist architecture" },
  { n: "03", t: "After Dark", img: evening, alt: "Two men in black tuxedos arriving for an evening event" },
];

export function Forecast() {
  return (
    <section className="bg-blush py-24" aria-labelledby="forecast-h">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <Eyebrow className="mb-4">Season Forecast</Eyebrow>
            <MaskHeading className="text-6xl md:text-[8rem]"><span id="forecast-h">Spring–Summer <em className="text-tangerine">2026</em></span></MaskHeading>
          </div>
          <div className="space-y-6">
            <p className="max-w-sm text-lg">Three moods for the season ahead — pulled from the atelier floor, not a mood board.</p>
            <Link to="/shop" className="eyebrow inline-block rounded-full border border-ink px-7 py-4 transition-colors hover:bg-ink hover:text-cream">Explore the forecast</Link>
          </div>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {moods.map((m, i) => (
            <Reveal key={m.n} delay={i * 0.12} className={i === 1 ? "md:mt-16" : ""}>
              <div className="arch aspect-[3/4] overflow-hidden"><img src={m.img} alt={m.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105" /></div>
              <div className="mt-5 flex items-baseline gap-4 overflow-hidden">
                <motion.span initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} className="font-serif text-xl italic text-tangerine">{m.n}</motion.span>
                <motion.h3 initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} className="font-serif text-4xl">{m.t}</motion.h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
