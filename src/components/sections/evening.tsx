import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import eveningCampaign from "@/assets/campaign-evening.jpg";
import dinnerJacket from "@/assets/product-dinner-jacket.jpg";
import midnightTuxedo from "@/assets/product-midnight-tuxedo-jacket.jpg";
import { Eyebrow, MaskHeading, RoundArrows, Reveal } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/product-card";
import { pick, money } from "@/lib/products";
import { useShop } from "@/store/shop";
import { AddToBagButton } from "@/components/ui/add-to-bag";
import { DragTrack, useDragCarousel } from "@/components/ui/carousel-drag";

const looks = [
  { img: eveningCampaign, alt: "Two men in black tuxedos entering a modern stone venue" },
  { img: dinnerJacket, alt: "Man in a black dinner jacket with satin peak lapels" },
  { img: midnightTuxedo, alt: "Man in a midnight tuxedo jacket beside a mirrored wall" },
];

export function EveningEdit() {
  const [i, setI] = useState(0);
  const add = useShop((s) => s.add);
  const c = useDragCarousel();
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % looks.length), 5000);
    return () => clearInterval(t);
  }, []);
  const items = pick("gilded-lame-dinner-jacket", "emerald-sequin-blazer", "plum-velvet-tuxedo");

  return (
    <section className="silk relative overflow-hidden py-24 text-cream" aria-labelledby="evening-h">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 md:px-10 lg:grid-cols-[420px_1fr]">
        <div className="relative aspect-[3/4.3] overflow-hidden rounded-3xl">
          <AnimatePresence mode="popLayout">
            <motion.img key={i} src={looks[i]!.img} alt={looks[i]!.alt} loading="lazy"
              initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1 }}
              className="absolute inset-0 h-full w-full object-cover" />
          </AnimatePresence>
          <div className="absolute inset-x-4 top-4 flex gap-1.5">
            {looks.map((_, j) => (
              <button key={j} aria-label={`Show look ${j + 1}`} onClick={() => setI(j)} className="h-0.5 flex-1 overflow-hidden rounded bg-cream/30">
                {j === i && <motion.span key={i} className="block h-full bg-cream" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, ease: "linear" }} />}
                {j < i && <span className="block h-full w-full bg-cream" />}
              </button>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-6 pt-24">
            <p className="font-serif text-4xl leading-none">View the <em className="text-butter">collection</em></p>
            <Link to="/shop" search={{ category: "evening" }} aria-label="View the evening collection" className="grid h-12 w-12 place-items-center rounded-lg bg-cream text-ink"><ArrowUpRight className="h-5 w-5" /></Link>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <Eyebrow tone="butter" className="mb-4">After Dark</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <MaskHeading className="text-5xl md:text-7xl"><span id="evening-h">The Evening <em className="text-butter">Edit</em></span></MaskHeading>
            <RoundArrows dark onPrev={c.prev} onNext={c.next} />
          </div>
          <Reveal><p className="mt-5 max-w-lg text-cream/75">Sequins that catch every candle, satin that moves like water — for the nights you'll still be talking about in the morning.</p></Reveal>
          <div className="mt-10">
            <DragTrack c={c} className="gap-5">
              {items.map((p, k) => (
                <article key={p.slug} className="w-[70vw] shrink-0 rounded-2xl bg-paper p-3 text-ink sm:w-[260px]">
                  <Link to="/product/$slug" params={{ slug: p.slug }} draggable={false} data-cursor="view" className="relative block aspect-[3/4] overflow-hidden rounded-xl">
                    <img src={p.image} alt={p.name} draggable={false} loading="lazy" className="h-full w-full object-cover" />
                    <div className="absolute left-2 top-2"><Badge badge={k === 1 ? "BESTSELLER" : "LIMITED"} /></div>
                  </Link>
                  <div className="mt-3 flex justify-between gap-2"><h3 className="text-sm font-semibold">{p.name}</h3><span className="text-sm font-semibold">{money(p.price)}</span></div>
                  <p className="text-xs text-muted-foreground">{p.fabric}</p>
                  <AddToBagButton onClick={() => add({ slug: p.slug, size: "M", colour: p.colours[0]!.name })}
                    className="mt-3 w-full justify-center py-3" />
                </article>
              ))}
            </DragTrack>
          </div>
        </div>
      </div>
    </section>
  );
}
