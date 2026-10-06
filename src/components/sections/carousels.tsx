import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DragProgress, DragTrack, useDragCarousel } from "@/components/ui/carousel-drag";
import { Eyebrow, MaskHeading, OutlineWord, RoundArrows, type DotTone } from "@/components/ui/primitives";
import { ProductCard } from "@/components/ui/product-card";
import { pick, money, type Product } from "@/lib/products";

const sigGrad = ["from-fuchsia", "from-cobalt", "from-cobalt", "from-fuchsia"];

export function Signatures() {
  const c = useDragCarousel();
  const items = pick("saffron-linen-suit", "riviera-linen-blazer", "cobalt-silk-holiday-shirt", "petal-boucle-bomber");
  return (
    <section className="relative overflow-hidden py-24" aria-labelledby="sig-h">
      <OutlineWord className="top-10">Signatures</OutlineWord>
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow tone="fuchsia" className="mb-4">The Vivant Signatures</Eyebrow>
            <MaskHeading className="text-5xl md:text-7xl"><span id="sig-h">Cut to Be <em className="text-fuchsia">Remembered</em></span></MaskHeading>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/shop" className="eyebrow flex items-center gap-2 hover:text-fuchsia">Explore the edit <ArrowRight className="h-3.5 w-3.5" /></Link>
            <RoundArrows onPrev={c.prev} onNext={c.next} />
          </div>
        </div>
        <DragTrack c={c} className="gap-8 py-6">
          {items.map((p, i) => (
            <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} draggable={false} data-cursor="drag"
              className="group relative block aspect-[3/4.4] w-[75vw] shrink-0 overflow-hidden rounded-3xl sm:w-[360px]"
              style={{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }}>
              <img src={p.image} alt={p.name} draggable={false} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${sigGrad[i]} to-transparent p-6 pt-28 text-cream`}>
                <p className="eyebrow text-[0.6rem] opacity-90">{p.fabric}</p>
                <h3 className="mt-2 font-serif text-3xl leading-tight">{p.name}</h3>
                <p className="mt-1 text-sm font-semibold">{money(p.price)}</p>
              </div>
            </Link>
          ))}
        </DragTrack>
        <p className="eyebrow mt-6 text-center text-muted-foreground">‹ Drag to explore ›</p>
      </div>
    </section>
  );
}

function ProductRail({ eyebrow, dot, title, link, linkLabel, outline, items, variant }: {
  eyebrow: string; dot: DotTone; title: React.ReactNode; link: string; linkLabel: string; outline: string; items: Product[]; variant?: "best" | undefined;
}) {
  const c = useDragCarousel();
  return (
    <section className="relative overflow-hidden py-20">
      <OutlineWord className="top-4">{outline}</OutlineWord>
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow tone={dot} className="mb-4">{eyebrow}</Eyebrow>
            <MaskHeading className="text-5xl md:text-7xl">{title}</MaskHeading>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/shop" className="eyebrow flex items-center gap-2 hover:text-cobalt">{linkLabel} <ArrowRight className="h-3.5 w-3.5" /></Link>
            <RoundArrows onPrev={c.prev} onNext={c.next} />
          </div>
        </div>
        <DragTrack c={c}>
          {items.map((p, i) => <ProductCard key={p.slug} p={p} variant={variant} tilt={i % 2 ? 1 : -1} />)}
        </DragTrack>
        <DragProgress c={c} />
        <span className="sr-only">{link}</span>
      </div>
    </section>
  );
}

export function BestSellers() {
  return (
    <ProductRail eyebrow="Chosen again and again" dot="cobalt" title={<>Best <em className="text-cobalt">Sellers</em></>} outline="Best Sellers"
      link="/shop" linkLabel="View all best sellers" variant="best"
      items={pick("fuchsia-satin-shirt", "ultramarine-flare-jeans", "cobalt-silk-holiday-shirt", "poppy-poplin-set", "riviera-wide-leg-trouser", "saffron-linen-suit")} />
  );
}
