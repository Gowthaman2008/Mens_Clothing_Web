import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine { slug: string; size: string; colour: string; qty: number }

interface ShopState {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (i: number, qty: number) => void;
  remove: (i: number) => void;
  toggleWish: (slug: string) => void;
  setCartOpen: (o: boolean) => void;
}

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      cartOpen: false,
      add: (line, qty = 1) =>
        set((s) => {
          const i = s.cart.findIndex((l) => l.slug === line.slug && l.size === line.size && l.colour === line.colour);
          const cart = [...s.cart];
          if (i >= 0) cart[i] = { ...cart[i]!, qty: cart[i]!.qty + qty };
          else cart.push({ ...line, qty });
          return { cart, cartOpen: true };
        }),
      setQty: (i, qty) => set((s) => ({ cart: s.cart.map((l, j) => (j === i ? { ...l, qty: Math.max(1, qty) } : l)) })),
      remove: (i) => set((s) => ({ cart: s.cart.filter((_, j) => j !== i) })),
      toggleWish: (slug) =>
        set((s) => ({ wishlist: s.wishlist.includes(slug) ? s.wishlist.filter((x) => x !== slug) : [...s.wishlist, slug] })),
      setCartOpen: (cartOpen) => set({ cartOpen }),
    }),
    { name: "vivant-shop", skipHydration: true, partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist }) },
  ),
);
