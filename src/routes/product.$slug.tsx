import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronDown, Leaf, Minus, Plus, Scissors, Sparkles, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { bySlug, toneBg, toneVar, money, type Product } from "@/lib/products";
import { useCatalogue, useProduct } from "@/store/admin";
import { useShop } from "@/store/shop";
import { Stars, Eyebrow, RoundArrows } from "@/components/ui/primitives";
import { Badge, ProductCard, WishButton } from "@/components/ui/product-card";
import { DragProgress, DragTrack, useDragCarousel } from "@/components/ui/carousel-drag";
import { cn } from "@/lib/utils";
import { AddToBagButton } from "@/components/ui/add-to-bag";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? bySlug(loaderData.slug) : undefined;
    if (!p) return { meta: [{ title: "Product — VIVANT" }, { name: "description", content: "Menswear from the VIVANT SS/26 collection." }] };
    return {
      meta: [
        { title: `${p.name} — VIVANT` },
        { name: "description", content: `${p.name}: ${p.fabric}. ${p.description}` },
        { property: "og:title", content: `${p.name} — VIVANT` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-[70vh] place-items-center pt-24 text-center">
      <div><h1 className="font-serif text-6xl">Sold out of <em className="text-fuchsia">existence</em></h1><Link to="/shop" className="eyebrow mt-6 inline-block underline">Back to shop</Link></div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const found = useProduct(slug);
  const all = useCatalogue();
  if (!found) return <div className="grid min-h-[70vh] place-items-center pt-24 text-center"><div><h1 className="font-serif text-6xl">Product not found</h1><Link to="/shop" className="eyebrow mt-6 inline-block underline">Back to shop</Link></div></div>;
  return <ProductView p={found} all={all} slug={slug} />;
}

function ProductView({ p, all: products, slug }: { p: Product; all: Product[]; slug: string }) {
  const [size, setSize] = useState("M");
  const [colour, setColour] = useState(0);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const add = useShop((s) => s.add);
  const c = useDragCarousel();
  const related = products.filter((x) => x.slug !== p.slug && (x.category === p.category || x.backdrop === p.backdrop)).concat(products.filter((x) => x.slug !== p.slug)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 8);
  const gallery = [p.image, ...related.slice(0, 2).map((r) => r.image)];

  return (
    <div key={slug}>
      <section className={cn("pb-20 pt-32 transition-colors", toneBg[p.backdrop === "plum" || p.backdrop === "cobalt" || p.backdrop === "fuchsia" || p.backdrop === "tangerine" ? "blush" : p.backdrop])}>
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-[90px_1fr_1fr]">
          <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
            {gallery.map((g, i) => (
              <button key={i} aria-label={`Image ${i + 1}`} onClick={() => setImg(i)} className={cn("h-24 w-20 overflow-hidden rounded-xl border-2", i === img ? "border-ink" : "border-transparent opacity-60")}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className={cn("relative order-1 aspect-[3/4] overflow-hidden rounded-3xl lg:order-2", toneBg[p.backdrop])}>
            <motion.img key={img} src={gallery[img]} alt={p.name} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} className="h-full w-full object-cover" />
            <div className="absolute left-4 top-4"><Badge badge={p.badge} /></div>
            <WishButton slug={p.slug} className="absolute right-4 top-4" />
          </div>
          <div className="order-3">
            <Stars rating={p.rating} reviews={p.reviews} />
            <h1 className="mt-4 font-serif text-5xl uppercase leading-none md:text-6xl">{p.name}</h1>
            <p className="mt-3 text-2xl font-semibold">{money(p.price)} {p.compareAt && <s className="ml-2 text-base font-normal text-muted-foreground">{money(p.compareAt)}</s>}</p>
            <p className="mt-2 text-sm text-muted-foreground">{p.fabric}</p>
            <p className="mt-4 max-w-md text-sm">{p.description}</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[[Leaf, "Natural fibres"], [Scissors, "Atelier made"], [Sparkles, "Free alterations"], [Truck, "Free over ₹12,500"]].map(([I, t]) => {
                const Icon = I as typeof Leaf;
                return <li key={t as string} className="flex flex-col items-center gap-2 rounded-xl bg-paper/50 p-3 text-center text-[0.65rem] font-semibold"><Icon className="h-4 w-4" />{t as string}</li>;
              })}
            </ul>
            <div className="mt-6 flex justify-between"><p className="eyebrow">Select size</p><button className="eyebrow underline underline-offset-4">Size guide</button></div>
            <div className="mt-2 flex gap-2">
              {p.sizes.map((s) => <button key={s} aria-pressed={s === size} onClick={() => setSize(s)} className={cn("h-11 flex-1 rounded-full border text-sm font-semibold", s === size ? "border-ink bg-ink text-cream" : "border-ink/25")}>{s}</button>)}
            </div>
            <p className="eyebrow mt-6">Select colour · {p.colours[colour]!.name}</p>
            <div className="mt-2 flex gap-2">
              {p.colours.map((col, j) => <button key={col.name} aria-label={col.name} aria-pressed={j === colour} onClick={() => setColour(j)} className={cn("h-9 w-9 rounded-md ring-offset-2", j === colour ? "ring-2 ring-ink" : "ring-1 ring-ink/20")} style={{ background: toneVar(col.tone) }} />)}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <div className="flex items-center rounded-full border border-ink/25">
                <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-11 place-items-center"><Minus className="h-4 w-4" /></button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="grid h-12 w-11 place-items-center"><Plus className="h-4 w-4" /></button>
              </div>
              <AddToBagButton onClick={() => add({ slug: p.slug, size, colour: p.colours[colour]!.name }, qty)} />
            </div>
            <div className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
              {[["Fabric & care", `${p.fabric}. Cool hand wash or dry clean. Steam, don't press. Woven in Italy, cut and sewn in Portugal.`],
                ["Shipping & returns", "Free shipping on orders over ₹12,500. Free 30-day returns and exchanges — no questions, just a prepaid label."]].map(([t, b]) => (
                <details key={t} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-2xl">{t}<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" /></summary>
                  <p className="mt-3 text-sm text-ink/75">{b}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1500px] px-5 py-20 md:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div><Eyebrow className="mb-3">Complete the look</Eyebrow><h2 className="font-serif text-5xl">You may also <em className="text-fuchsia">like</em></h2></div>
          <RoundArrows onPrev={c.prev} onNext={c.next} />
        </div>
        <DragTrack c={c}>{related.map((r, i) => <ProductCard key={r.slug} p={r} tilt={i % 2 ? 1 : -1} />)}</DragTrack>
        <DragProgress c={c} />
      </section>
    </div>
  );
}
