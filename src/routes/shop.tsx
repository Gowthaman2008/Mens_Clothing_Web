import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { z } from "zod";
import { useCatalogue } from "@/store/admin";
import { categories, toneVar, type Category, type Tone } from "@/lib/products";
import { ProductCard } from "@/components/ui/product-card";
import { cn } from "@/lib/utils";

const search = z.object({
  category: z.enum(["separates", "knitwear", "shirts", "tailoring", "outerwear", "evening"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Shop — VIVANT" },
      { name: "description", content: "Shop men's tailoring, shirts, knitwear, outerwear and evening pieces in saturated colour." },
      { property: "og:title", content: "Shop the collection — VIVANT" },
      { property: "og:description", content: "Filter VIVANT's colour-drenched pieces by category, colour, size and price." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

const tones: Tone[] = ["cobalt", "tangerine", "fuchsia", "butter", "mint", "lavender", "blush", "plum", "cream"];

function Shop() {
  const products = useCatalogue();
  const { category } = Route.useSearch();
  const [colour, setColour] = useState<Tone | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const active = [colour, size, maxPrice < 50000].filter(Boolean).length;

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setFiltersOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const list = useMemo(() => {
    let l = products.filter((p) => (!category || p.category === category) && (!colour || p.colours.some((c) => c.tone === colour)) && (!size || p.sizes.includes(size)) && p.price <= maxPrice);
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [products, category, colour, size, maxPrice, sort]);

  const title = categories.find((c) => c.id === category)?.label;
  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-24 pt-32 md:px-10">
      <h1 className="font-serif text-6xl md:text-8xl">{title ? <>{title} <em className="text-tangerine">edit</em></> : <>The <em className="text-tangerine">Collection</em></>}</h1>
      <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8" aria-label="Filters">
          <div>
            <p className="eyebrow mb-3">Category</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className={cn(!category && "font-semibold underline underline-offset-4")}>All</Link></li>
              {categories.map((c) => (
                <li key={c.id}><Link to="/shop" search={{ category: c.id as Category }} className={cn(category === c.id && "font-semibold underline underline-offset-4")}>{c.label}</Link></li>
              ))}
            </ul>
          </div>
        </aside>
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">{list.length} styles</p>
              <button onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-ink">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
                {active > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-lime text-[0.6rem] font-bold text-ink">{active}</span>}
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm">Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-ink/25 bg-transparent px-4 py-2">
                <option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3">
            {list.map((p) => <ProductCard key={p.slug} p={p} className="w-full sm:w-full" variant={p.badge === "BESTSELLER" ? "best" : "default"} />)}
          </div>
          {!list.length && <p className="py-20 text-center font-serif text-3xl text-muted-foreground">Nothing in that colour — <em>yet.</em></p>}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} />
            <motion.aside role="dialog" aria-label="Filters" data-lenis-prevent
              className="fixed inset-y-0 left-0 z-[90] flex w-full max-w-sm flex-col bg-cream"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 260, damping: 32 }}>
              <div className="flex items-center justify-between border-b px-6 py-5">
                <h2 className="font-serif text-3xl">Narrow <em className="text-tangerine">it down</em></h2>
                <button aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/10"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
                <div>
                  <p className="eyebrow mb-3">Colour</p>
                  <div className="flex flex-wrap gap-2">
                    {tones.map((t) => (
                      <button key={t} aria-label={t} aria-pressed={colour === t} onClick={() => setColour(colour === t ? null : t)}
                        className={cn("h-8 w-8 rounded-full ring-offset-2", colour === t ? "ring-2 ring-ink" : "ring-1 ring-ink/20")} style={{ background: toneVar(t) }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="eyebrow mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((s) => (
                      <button key={s} onClick={() => setSize(size === s ? null : s)} className={cn("h-9 w-11 rounded-full border text-xs font-semibold", size === s ? "border-ink bg-ink text-cream" : "border-ink/25")}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="eyebrow mb-3">Price · up to ₹{maxPrice.toLocaleString("en-IN")}</p>
                  <input type="range" min={5000} max={50000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-ink" aria-label="Maximum price" />
                </div>
              </div>
              <div className="flex items-center gap-3 border-t px-6 py-5">
                <button onClick={() => { setColour(null); setSize(null); setMaxPrice(50000); }} className="rounded-full border border-ink/25 px-5 py-3 text-xs font-semibold uppercase tracking-widest">Clear</button>
                <button onClick={() => setFiltersOpen(false)} className="flex-1 rounded-full bg-ink py-3 text-center text-xs font-semibold uppercase tracking-widest text-cream">Show {list.length} {list.length === 1 ? "style" : "styles"}</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
