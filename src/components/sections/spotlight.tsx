import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Expand, Heart, Minus, Play, Plus, Share2 } from "lucide-react";
import sportJacket from "@/assets/product-noir-sport-jacket.jpg";
import campShirt from "@/assets/product-satin-camp-shirt.jpg";
import bomber from "@/assets/product-leather-bomber.jpg";
import { Stars } from "@/components/ui/primitives";
import { AddToBagButton } from "@/components/ui/add-to-bag";
import { useShop } from "@/store/shop";
import { money, toneBg, toneVar, type Tone } from "@/lib/products";
import { cn } from "@/lib/utils";

interface Look {
  slug: string; title: string; price: number; word: string; bg: Tone; img: string; desc: string;
  colours: { name: string; tone: Tone }[]; rating: number; reviews: number;
}

const looks: Look[] = [
  { slug: "saffron-linen-suit", title: "The Sport Jacket", price: 46500, word: "Noir", bg: "blush", img: sportJacket, rating: 4.9, reviews: 318,
    desc: "A softly structured Italian-wool sport jacket with a clean shoulder and precise drape.",
    colours: [{ name: "Black", tone: "ink" }, { name: "Graphite", tone: "cobalt" }] },
  { slug: "cobalt-silk-holiday-shirt", title: "The Satin Shirt", price: 14100, word: "Satin", bg: "lavender", img: campShirt, rating: 4.8, reviews: 412,
    desc: "Fluid black satin with a relaxed camp collar and understated evening sheen.",
    colours: [{ name: "Black", tone: "ink" }, { name: "Charcoal", tone: "cobalt" }] },
  { slug: "petal-boucle-bomber", title: "The Leather Bomber", price: 31500, word: "Leather", bg: "cream", img: bomber, rating: 4.9, reviews: 97,
    desc: "A streamlined black leather bomber with minimal hardware and a sharp modern profile.",
    colours: [{ name: "Black", tone: "ink" }, { name: "Graphite", tone: "cobalt" }] },
];


export function Spotlight() {
  const [i, setI] = useState(0);
  const [size, setSize] = useState("M");
  const [colour, setColour] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useShop((s) => s.add);
  const toggleWish = useShop((s) => s.toggleWish);
  const l = looks[i]!;

  return (
    <section className={cn("relative overflow-hidden py-24 transition-colors duration-700", toneBg[l.bg])} aria-label="Featured look">
      <AnimatePresence mode="wait">
        <motion.p key={l.word} aria-hidden initial={{ opacity: 0, x: 80 }} animate={{ opacity: 0.12, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.7 }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-serif text-[22vw] italic leading-none text-ink">
          {l.word}
        </motion.p>
      </AnimatePresence>

      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 px-5 md:px-10 lg:grid-cols-[110px_1fr_1fr]">
        <div className="order-2 flex items-center gap-3 lg:order-1 lg:flex-col">
          {looks.map((x, j) => (
            <button key={x.slug} aria-label={`Show ${x.title}`} onClick={() => { setI(j); setColour(0); }}
              className={cn("h-24 w-20 overflow-hidden rounded-xl border-2 transition-all", j === i ? "scale-105 border-ink" : "border-transparent opacity-60 hover:opacity-100")}>
              <img src={x.img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="relative order-1 mx-auto w-full max-w-md lg:order-2">
          <div className="relative aspect-square">
            <div className="absolute inset-0 rounded-full border border-ink/30" />
            <div className="absolute inset-6 overflow-hidden rounded-full">
              <AnimatePresence mode="wait">
                <motion.img key={l.img} src={l.img} alt={l.title} initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05, y: -30 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full object-cover object-top" />
              </AnimatePresence>
            </div>
            <Link to="/product/$slug" params={{ slug: l.slug }} aria-label="Open product" className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-paper/90"><Expand className="h-4 w-4" /></Link>
          </div>
          <div className="mx-auto mt-4 flex w-max items-center gap-3 rounded-full bg-paper px-5 py-3 shadow-lg">
            <Play className="h-3.5 w-3.5 fill-current" /><span className="text-xs font-semibold">Watch lookbook</span>
            <span className="flex gap-1">{l.colours.map((c) => <span key={c.name} className="h-2.5 w-2.5 rounded-full" style={{ background: toneVar(c.tone) }} />)}</span>
          </div>
        </div>

        <div className="order-3">
          <div className="flex items-center justify-between">
            <Stars rating={l.rating} reviews={l.reviews} />
            <Link to="/shop" className="eyebrow flex items-center gap-2">Shop all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={l.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <h2 className="mt-4 font-serif text-5xl uppercase leading-none md:text-6xl">{l.title}</h2>
              <p className="mt-3 text-2xl font-semibold">{money(l.price)}</p>
            </motion.div>
          </AnimatePresence>
          <p className="eyebrow mt-6">Select size</p>
          <div className="mt-2 flex gap-2">
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <button key={s} onClick={() => setSize(s)} aria-pressed={size === s} className={cn("h-11 flex-1 rounded-full border text-sm font-semibold transition-colors", size === s ? "border-ink bg-ink text-cream" : "border-ink/25 hover:border-ink")}>{s}</button>
            ))}
          </div>
          <p className="eyebrow mt-6">Select colour · {l.colours[colour]!.name}</p>
          <div className="mt-2 flex gap-2">
            {l.colours.map((c, j) => (
              <button key={c.name} aria-label={c.name} aria-pressed={j === colour} onClick={() => setColour(j)} className={cn("h-9 w-9 rounded-md ring-offset-2 transition", j === colour ? "ring-2 ring-ink" : "ring-1 ring-ink/20")} style={{ background: toneVar(c.tone) }} />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <div className="flex items-center rounded-full border border-ink/25 bg-paper/40">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-11 place-items-center"><Minus className="h-4 w-4" /></button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="grid h-12 w-11 place-items-center"><Plus className="h-4 w-4" /></button>
            </div>
            <AddToBagButton onClick={() => add({ slug: l.slug, size, colour: l.colours[colour]!.name })} />
          </div>
          <div className="mt-6 flex gap-2">
            <button aria-label="Add to wishlist" onClick={() => toggleWish(l.slug)} className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 hover:bg-ink hover:text-cream"><Heart className="h-4 w-4" /></button>
            <Link to="/product/$slug" params={{ slug: l.slug }} aria-label="View details" className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 hover:bg-ink hover:text-cream"><Expand className="h-4 w-4" /></Link>
            <button aria-label="Share" className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 hover:bg-ink hover:text-cream"><Share2 className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
