import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/store/admin";
import { useShop } from "@/store/shop";
import { bySlug, money } from "@/lib/products";
import { meta } from "@/components/layout/page";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: meta("Checkout — VIVANT", "Complete your VIVANT order. Free shipping over ₹12,500.") }),
  component: Checkout,
});

const field = "w-full rounded-xl border border-ink/20 bg-transparent px-4 py-3 outline-none focus:border-ink";

function Checkout() {
  const lines = useShop((s) => s.cart);
  const [done, setDone] = useState(false);
  const addOrder = useAdmin((s) => s.addOrder);
  const content = useAdmin((s) => s.content);
  const clear = () => useShop.setState({ cart: [] });
  const rows = lines.map((l) => ({ l, p: bySlug(l.slug) })).filter((r) => r.p);
  const subtotal = rows.reduce((a, r) => a + r.p!.price * r.l.qty, 0);
  const shipping = subtotal >= content.freeShippingOver || subtotal === 0 ? 0 : content.shippingFee;

  if (done) return (
    <div className="mx-auto max-w-xl px-5 pb-24 pt-40 text-center">
      <h1 className="font-serif text-6xl">Order <em>received.</em></h1>
      <p className="mt-4 text-muted-foreground">This is a preview checkout — no payment was taken.</p>
      <Link to="/shop" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-xs font-semibold tracking-widest text-cream">KEEP SHOPPING</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-24 pt-32 md:px-10">
      <h1 className="font-serif text-6xl md:text-7xl">Checkout</h1>
      {!rows.length ? (
        <p className="mt-10 text-lg">Your bag is empty. <Link to="/shop" className="underline underline-offset-4">Browse the collection.</Link></p>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <form onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const g = (k: string) => String(f.get(k) ?? "");
            addOrder({
              email: g("email"), name: `${g("first")} ${g("last")}`.trim(),
              address: [g("address"), g("city"), g("postcode"), g("country")].filter(Boolean).join(", "),
              items: rows.map(({ l, p }) => ({ slug: l.slug, name: p!.name, size: l.size, colour: l.colour, qty: l.qty, price: p!.price })),
              total: subtotal + shipping,
            });
            clear(); setDone(true);
          }} className="grid gap-4">
            <p className="eyebrow">Contact</p>
            <input required name="email" type="email" placeholder="Email" aria-label="Email" className={field} />
            <p className="eyebrow mt-4">Shipping address</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required name="first" placeholder="First name" aria-label="First name" className={field} />
              <input required name="last" placeholder="Last name" aria-label="Last name" className={field} />
            </div>
            <input required name="address" placeholder="Address" aria-label="Address" className={field} />
            <div className="grid gap-4 sm:grid-cols-3">
              <input required name="city" placeholder="City" aria-label="City" className={field} />
              <input required name="postcode" placeholder="Postcode" aria-label="Postcode" className={field} />
              <input required name="country" placeholder="Country" aria-label="Country" className={field} />
            </div>
            <button className="mt-4 rounded-full bg-ink py-4 text-xs font-semibold tracking-widest text-cream">PLACE ORDER · {money(subtotal + shipping)}</button>
          </form>
          <aside className="h-fit rounded-2xl border border-ink/15 p-6">
            <ul className="space-y-4">
              {rows.map(({ l, p }, i) => (
                <li key={i} className="flex gap-4">
                  <img src={p!.image} alt={p!.name} className="h-20 w-16 rounded-lg object-cover" />
                  <div className="flex-1 text-sm"><p className="font-semibold">{p!.name}</p><p className="text-muted-foreground">{l.colour} · {l.size} · ×{l.qty}</p></div>
                  <p className="text-sm font-semibold">{money(p!.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t border-ink/15 pt-4 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping ? money(shipping) : "Free"}</dd></div>
              <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{money(subtotal + shipping)}</dd></div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
