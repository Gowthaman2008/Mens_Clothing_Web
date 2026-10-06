import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { bySlug, money, toneBg } from "@/lib/products";
import { useAdmin } from "@/store/admin";
import { useShop } from "@/store/shop";


export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, remove } = useShop();
  const FREE = useAdmin((s) => s.content.freeShippingOver);
  const adminProducts = useAdmin((s) => s.products);
  const lines = cart.map((l) => ({ ...l, p: (adminProducts.find((x) => x.slug === l.slug) ?? bySlug(l.slug))! })).filter((l) => l.p);
  const subtotal = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const left = Math.max(0, FREE - subtotal);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside role="dialog" aria-label="Shopping bag" data-lenis-prevent
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col bg-cream"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 32 }}>
            <div className="flex items-center justify-between border-b px-6 py-5">
              <h2 className="font-serif text-3xl">Your <em className="text-fuchsia">bag</em></h2>
              <button aria-label="Close bag" onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/10"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-4">
              <p className="text-xs">{left > 0 ? <>You're <b>{money(left)}</b> away from free shipping</> : <>You've unlocked <b>free shipping</b> ✦</>}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <motion.div className="h-full rounded-full bg-tangerine" animate={{ width: `${Math.min(100, (subtotal / FREE) * 100)}%` }} />
              </div>
            </div>
            <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-2">
              {lines.length === 0 && <li className="py-16 text-center font-serif text-2xl text-muted-foreground">Your bag is empty — <em>for now.</em></li>}
              {lines.map((l, i) => (
                <li key={`${l.slug}-${l.size}-${l.colour}`} className="flex gap-4">
                  <div className={`h-28 w-20 shrink-0 overflow-hidden rounded-xl ${toneBg[l.p.backdrop]}`}><img src={l.p.image} alt={l.p.name} className="h-full w-full object-cover" /></div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2"><p className="text-sm font-semibold">{l.p.name}</p><p className="text-sm font-semibold">{money(l.p.price * l.qty)}</p></div>
                    <p className="text-xs text-muted-foreground">{l.colour} · {l.size}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-ink/20">
                        <button aria-label="Decrease" onClick={() => setQty(i, l.qty - 1)} className="grid h-8 w-8 place-items-center"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-sm">{l.qty}</span>
                        <button aria-label="Increase" onClick={() => setQty(i, l.qty + 1)} className="grid h-8 w-8 place-items-center"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => remove(i)} className="text-xs underline underline-offset-4">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t px-6 py-5">
              <div className="mb-4 flex justify-between text-sm"><span>Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
              <Link to="/checkout" onClick={() => setCartOpen(false)} aria-disabled={!lines.length} className={`block w-full rounded-full bg-ink py-4 text-center text-sm font-semibold tracking-widest text-cream ${lines.length ? "" : "pointer-events-none opacity-40"}`}>CHECKOUT ⟶</Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
