import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as seedProducts, type Product } from "@/lib/products";

export type AdminProduct = Product & { stock: number; hidden?: boolean };
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export interface Order {
  id: string; createdAt: string; email: string; name: string; address: string;
  items: { slug: string; name: string; size: string; colour: string; qty: number; price: number }[];
  total: number; status: OrderStatus;
}
export interface Message { id: string; createdAt: string; name: string; email: string; topic: string; body: string; read: boolean }
export interface Admin { email: string; password: string; role: "owner" | "admin" }
export interface Customer { name: string; email: string; password: string }
export interface SiteContent {
  announcement: string; heroEyebrow: string; heroTitle: string; heroAccent: string; heroIntro: string;
  email: string; studio: string; hours: string; shippingFee: number; freeShippingOver: number;
}

export const defaultContent: SiteContent = {
  announcement: "Free shipping over ₹12,500 · Made in Portugal & Italy",
  heroEyebrow: "SS/26 Collection — Cut in Lisbon",
  heroTitle: "Loud Colour, Quiet",
  heroAccent: "Luxury",
  heroIntro: "Saturated tailoring, silk shirts and joyful knits — made in small Portuguese and Italian ateliers for men who refuse to blend in.",
  email: "hello@vivant.example", studio: "Lisbon, Portugal", hours: "Mon–Fri, 10:00–18:00",
  shippingFee: 999, freeShippingOver: 12500,
};

const seed = (): AdminProduct[] => seedProducts.map((p, i) => ({ ...p, stock: 8 + ((i * 7) % 25) }));
const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();

interface AdminState {
  products: AdminProduct[]; orders: Order[]; messages: Message[]; admins: Admin[];
  content: SiteContent; session: string | null;
  accounts: Customer[]; customer: string | null;
  signUp: (c: Customer) => boolean; signIn: (email: string, password: string) => boolean; signOut: () => void;
  login: (email: string, password: string) => boolean; logout: () => void;
  saveProduct: (p: AdminProduct, originalSlug?: string) => void; deleteProduct: (slug: string) => void;
  addOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => void; setOrderStatus: (id: string, s: OrderStatus) => void; deleteOrder: (id: string) => void;
  addMessage: (m: Omit<Message, "id" | "createdAt" | "read">) => void; toggleRead: (id: string) => void; deleteMessage: (id: string) => void;
  addAdmin: (a: Admin) => boolean; removeAdmin: (email: string) => void;
  setContent: (c: SiteContent) => void; resetAll: () => void;
}

export const useAdmin = create<AdminState>()(
  persist(
    (set, get) => ({
      products: seed(), orders: [], messages: [], content: defaultContent, session: null, accounts: [], customer: null,
      signUp: (c) => {
        const email = c.email.toLowerCase();
        if (get().accounts.some((a) => a.email === email)) return false;
        set((s) => ({ accounts: [...s.accounts, { ...c, email }], customer: email }));
        return true;
      },
      signIn: (email, password) => {
        const e = email.toLowerCase();
        const ok = get().accounts.some((a) => a.email === e && a.password === password);
        if (ok) set({ customer: e });
        return ok;
      },
      signOut: () => set({ customer: null }),
      admins: [{ email: "admin@vivant.example", password: "vivant2026", role: "owner" }],
      login: (email, password) => {
        const ok = get().admins.some((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
        if (ok) set({ session: email.toLowerCase() });
        return ok;
      },
      logout: () => set({ session: null }),
      saveProduct: (p, originalSlug) => set((s) => {
        const key = originalSlug ?? p.slug;
        const exists = s.products.some((x) => x.slug === key);
        return { products: exists ? s.products.map((x) => (x.slug === key ? p : x)) : [p, ...s.products] };
      }),
      deleteProduct: (slug) => set((s) => ({ products: s.products.filter((p) => p.slug !== slug) })),
      addOrder: (o) => set((s) => ({
        orders: [{ ...o, id: `VV-${uid()}`, createdAt: new Date().toISOString(), status: "pending" }, ...s.orders],
        products: s.products.map((p) => {
          const q = o.items.filter((i) => i.slug === p.slug).reduce((a, i) => a + i.qty, 0);
          return q ? { ...p, stock: Math.max(0, p.stock - q) } : p;
        }),
      })),
      setOrderStatus: (id, status) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      deleteOrder: (id) => set((s) => ({ orders: s.orders.filter((o) => o.id !== id) })),
      addMessage: (m) => set((s) => ({ messages: [{ ...m, id: uid(), createdAt: new Date().toISOString(), read: false }, ...s.messages] })),
      toggleRead: (id) => set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, read: !m.read } : m)) })),
      deleteMessage: (id) => set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),
      addAdmin: (a) => {
        if (get().admins.some((x) => x.email.toLowerCase() === a.email.toLowerCase())) return false;
        set((s) => ({ admins: [...s.admins, { ...a, email: a.email.toLowerCase() }] }));
        return true;
      },
      removeAdmin: (email) => set((s) => ({ admins: s.admins.filter((a) => a.email !== email || a.role === "owner") })),
      setContent: (content) => set({ content }),
      resetAll: () => set({ products: seed(), orders: [], messages: [], content: defaultContent }),
    }),
    { name: "vivant-admin", skipHydration: true },
  ),
);

/** Live catalogue for the storefront (falls back to static data before hydration). */
export function useCatalogue() {
  const list = useAdmin((s) => s.products);
  return list.filter((p) => !p.hidden);
}
export function useProduct(slug: string): Product | undefined {
  const fromStore = useAdmin((s) => s.products.find((p) => p.slug === slug));
  return fromStore ?? seedProducts.find((p) => p.slug === slug);
}
