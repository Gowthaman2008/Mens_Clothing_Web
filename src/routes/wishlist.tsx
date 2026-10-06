import { createFileRoute, Link } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { bySlug } from "@/lib/products";
import { ProductCard } from "@/components/ui/product-card";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — VIVANT" },
      { name: "description", content: "The VIVANT pieces you've saved for later." },
      { property: "og:title", content: "Your Wishlist — VIVANT" },
      { property: "og:description", content: "Saved pieces from VIVANT's colour-drenched collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const slugs = useShop((s) => s.wishlist);
  const items = slugs.map(bySlug).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <div className="mx-auto min-h-[70vh] max-w-[1500px] px-5 pb-24 pt-32 md:px-10">
      <h1 className="font-serif text-6xl md:text-8xl">Your <em className="text-fuchsia">wishlist</em></h1>
      {items.length === 0 ? (
        <p className="mt-10 text-lg">Nothing saved yet. <Link to="/shop" className="underline underline-offset-4">Start hearting things.</Link></p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.slug} p={p} className="w-full sm:w-full" />)}
        </div>
      )}
    </div>
  );
}
