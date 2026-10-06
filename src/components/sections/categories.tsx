import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useSwipeRail, railClass } from "@/hooks/use-swipe-rail";
import sportJacket from "@/assets/product-noir-sport-jacket.jpg";
import jeans from "@/assets/product-washed-black-jeans.jpg";
import satinShirt from "@/assets/product-satin-camp-shirt.jpg";
import knitPolo from "@/assets/product-fine-knit-polo.jpg";
import tuxedo from "@/assets/product-black-tie-tuxedo.jpg";
import overshirt from "@/assets/product-charcoal-overshirt.jpg";
import { Dot, Reveal, type DotTone } from "@/components/ui/primitives";
import type { Category } from "@/lib/products";

const tiles: { label: string; dot: DotTone; img: string; cat: Category }[] = [
  { label: "Sunday Tailoring", dot: "tangerine", img: sportJacket, cat: "tailoring" },
  { label: "Denim, Reworked", dot: "cobalt", img: jeans, cat: "separates" },
  { label: "Satin Shirts", dot: "fuchsia", img: satinShirt, cat: "shirts" },
  { label: "Knit Club", dot: "lime", img: knitPolo, cat: "knitwear" },
  { label: "After Dark", dot: "ink", img: tuxedo, cat: "evening" },
  { label: "Light Layers", dot: "butter", img: overshirt, cat: "outerwear" },
];

export function CategoryStrip() {
  const { railRef, barRef } = useSwipeRail<HTMLUListElement>(0.14);

  return (
    <section aria-label="Shop by category" className="mx-auto max-w-[1500px] px-5 pt-4 pb-16 md:px-10">
      <Reveal>
      <ul
        ref={railRef}
        className={`${railClass} -mx-5 gap-4 px-5 pb-1 md:mx-0 md:grid md:grid-cols-6 md:gap-5 md:overflow-x-visible md:px-0`}
      >
        {tiles.map((t) => (
            <li key={t.label} className="w-[60%] min-w-0 shrink-0 snap-start sm:w-[40%] md:w-auto">
              <Link to="/shop" search={{ category: t.cat }} className="group block">
                <div className="arch relative aspect-[3/4.3] overflow-hidden transition-transform duration-500 group-hover:-translate-y-2">
                  <img src={t.img} alt={t.label} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute bottom-3 right-3 grid h-9 w-9 scale-0 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:scale-100">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium"><Dot tone={t.dot} />{t.label}</p>
              </Link>
            </li>
        ))}
      </ul>
      </Reveal>
      <div className="mt-6 flex items-center gap-3 md:hidden" aria-hidden>
        <span className="eyebrow shrink-0">Swipe</span>
        <span className="relative block h-[2px] flex-1 rounded-full bg-ink/15">
          <span ref={barRef} className="absolute inset-0 origin-left rounded-full bg-ink will-change-transform" style={{ transform: "scaleX(0.14)" }} />
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink" />
      </div>
    </section>
  );
}
