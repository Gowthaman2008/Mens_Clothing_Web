import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/lib/products";
import { PageHero, meta } from "@/components/layout/page";
import hero from "@/assets/campaign-city.jpg";

export const Route = createFileRoute("/collections")({
  head: () => ({ meta: meta("Collections — VIVANT", "Explore VIVANT's SS/26 menswear collections: tailoring, shirts, knitwear, outerwear, evening and separates.") }),
  component: Collections,
});

function Collections() {
  return (
    <>
      <PageHero eyebrow="SS/26 Collections" title={<>Six edits. <em>One wardrobe.</em></>} intro="Every piece cut in Lisbon and made in small ateliers in Portugal & Italy." image={hero} alt="Man in a black overshirt by a brutalist building" />
      <section className="mx-auto grid max-w-[1500px] gap-6 px-5 py-20 sm:grid-cols-2 lg:grid-cols-3 md:px-10">
        {categories.map((c) => {
          const items = products.filter((p) => p.category === c.id);
          const cover = items[0];
          return (
            <Link key={c.id} to="/shop" search={{ category: c.id }} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink text-cream">
              {cover && <img src={cover.image} alt={`${c.label} — ${cover.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div><h2 className="font-serif text-4xl">{c.label}</h2><p className="text-sm opacity-80">{items.length} styles</p></div>
                <span className="rounded-full border border-cream/40 px-4 py-2 text-xs font-semibold tracking-widest">SHOP ⟶</span>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
