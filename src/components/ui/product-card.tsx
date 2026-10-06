import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { type Product, toneBg, toneVar, money } from "@/lib/products";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import { Stars } from "./primitives";

export function Badge({ badge }: { badge: Product["badge"] }) {
  if (!badge) return null;
  const cls = badge === "NEW" ? "bg-ink text-cream" : badge === "LIMITED" ? "bg-cobalt text-cream" : "bg-butter text-ink";
  return <span className={cn("eyebrow rounded-full px-3 py-1 text-[0.6rem]", cls)}>{badge}</span>;
}

export function WishButton({ slug, className }: { slug: string; className?: string }) {
  const on = useShop((s) => s.wishlist.includes(slug));
  const toggle = useShop((s) => s.toggleWish);
  return (
    <button
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={on}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
      className={cn("grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-transform hover:scale-110", className)}
    >
      <Heart className={cn("h-4 w-4", on && "fill-fuchsia text-fuchsia")} />
    </button>
  );
}

export function Swatches({ p, size = "h-3 w-3" }: { p: Product; size?: string }) {
  return (
    <div className="flex gap-1.5">
      {p.colours.map((c) => (
        <span key={c.name} title={c.name} className={cn("rounded-full ring-1 ring-ink/15", size)} style={{ background: toneVar(c.tone) }} />
      ))}
    </div>
  );
}

export function ProductCard({ p, variant = "default", tilt = 0, className }: { p: Product; variant?: "default" | "best" | undefined; tilt?: number; className?: string }) {
  const add = useShop((s) => s.add);
  return (
    <article className={cn("group w-[78vw] shrink-0 sm:w-[300px]", className)} style={{ rotate: `${tilt}deg` }}>
      <Link to="/product/$slug" params={{ slug: p.slug }} data-cursor="view" draggable={false} className="block">
        <div className={cn("relative aspect-[3/4] overflow-hidden rounded-2xl", toneBg[p.backdrop])}>
          <img src={p.image} alt={`${p.name} — ${p.fabric}`} loading="lazy" draggable={false} width={768} height={1024}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute left-3 top-3"><Badge badge={variant === "best" ? "BESTSELLER" : p.badge} /></div>
          <WishButton slug={p.slug} className="absolute right-3 top-3" />
          <div className="absolute inset-x-3 bottom-3 translate-y-[120%] rounded-xl bg-paper/95 p-3 backdrop-blur transition-transform duration-500 group-hover:translate-y-0 group-focus-within:translate-y-0">
            <p className="eyebrow mb-2 text-[0.6rem]">Quick add</p>
            <div className="flex gap-1.5">
              {p.sizes.map((s) => (
                <button key={s}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); add({ slug: p.slug, size: s, colour: p.colours[0]!.name }); }}
                  className="flex-1 rounded-full border border-ink/20 py-1.5 text-xs font-medium hover:bg-ink hover:text-cream">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-4 space-y-1.5 px-1">
        {variant === "best" && <Stars rating={p.rating} reviews={p.reviews} />}
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold">{p.name}</h3>
          <p className="text-sm font-semibold">{money(p.price)}</p>
        </div>
        <p className="text-xs text-muted-foreground">{p.fabric}</p>
        <Swatches p={p} />
      </div>
    </article>
  );
}

export function MiniCard({ p, selected = "M" }: { p: Product; selected?: string }) {
  const add = useShop((s) => s.add);
  return (
    <article className="flex gap-4 rounded-2xl bg-paper p-3 shadow-sm">
      <Link to="/product/$slug" params={{ slug: p.slug }} data-cursor="view" className={cn("relative h-32 w-24 shrink-0 overflow-hidden rounded-xl", toneBg[p.backdrop])}>
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-paper px-1.5 py-0.5 text-[0.6rem] font-semibold">★ {p.rating}</span>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-sm font-semibold">{p.name}</h3>
        <p className="truncate text-xs text-muted-foreground">{p.fabric}</p>
        <div className="mt-2 flex gap-1">
          {["S", "M", "L"].map((s) => (
            <span key={s} className={cn("grid h-6 w-6 place-items-center rounded-full border text-[0.6rem] font-semibold", s === selected ? "border-ink bg-ink text-cream" : "border-ink/20")}>{s}</span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-sm font-semibold">
            {p.compareAt ? (<><span className="text-fuchsia">{money(p.price)}</span> <s className="ml-1 text-xs font-normal text-muted-foreground">{money(p.compareAt)}</s></>) : money(p.price)}
          </p>
          <button aria-label={`Add ${p.name} to bag`} onClick={() => add({ slug: p.slug, size: selected, colour: p.colours[0]!.name })}
            className="grid h-9 w-9 place-items-center rounded-full bg-butter transition-transform hover:scale-110">
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
