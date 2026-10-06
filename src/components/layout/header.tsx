import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Home", to: "/" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "Collections", to: "/collections" as const },
  { label: "Lookbook", to: "/lookbook" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
] as { label: string; to: "/" | "/shop" | "/collections" | "/lookbook" | "/about" | "/contact"; search?: unknown; hash?: string }[];

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useShop((s) => s.cart.reduce((a, l) => a + l.qty, 0));
  const wish = useShop((s) => s.wishlist.length);
  const open = useShop((s) => s.setCartOpen);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const overHero = path === "/" && !scrolled;
  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 transition-all duration-500",
      overHero && !menuOpen ? "bg-transparent text-cream" : "bg-cream/80 text-ink shadow-[0_1px_0_var(--border)] backdrop-blur-xl",
    )}>
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10">
        <Link to="/" className="leading-none" aria-label="VIVANT home">
          <span className="block font-serif text-3xl tracking-[0.12em]">VIVANT</span>
          <span className="block text-[0.5rem] tracking-[0.42em] opacity-80">DRESSED IN COLOUR</span>
        </Link>
        <nav aria-label="Main" className="hidden gap-9 text-sm font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.label} to={n.to} search={n.search as never} {...(n.hash ? { hash: n.hash } : {})}
              className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link to="/shop" aria-label="Search" className="hidden h-10 w-10 place-items-center rounded-full hover:bg-ink/10 sm:grid"><Search className="h-[18px] w-[18px]" /></Link>
          <Link to="/wishlist" aria-label={`Wishlist (${wish})`} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-ink/10">
            <Heart className="h-[18px] w-[18px]" />
            {wish > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-fuchsia px-1 text-[0.55rem] font-bold text-cream">{wish}</span>}
          </Link>
          <Link to="/account" aria-label="Account" className="hidden h-10 w-10 place-items-center rounded-full hover:bg-ink/10 sm:grid"><User className="h-[18px] w-[18px]" /></Link>
          <button aria-label={`Open bag (${count})`} onClick={() => open(true)} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-ink/10">
            <ShoppingBag className="h-[18px] w-[18px]" />
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-lime px-1 text-[0.55rem] font-bold text-ink">{count}</span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 bg-cream text-ink hover:bg-cream/90 lg:hidden [&_svg]:size-5"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-ink/10 bg-cream px-5 pb-5 text-ink lg:hidden">
          {[...nav, { label: "Account", to: "/account" as const }].map((item) => (
            <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)}
              aria-current={path === item.to ? "page" : undefined}
              className="block border-b border-ink/10 py-4 text-base font-medium hover:bg-ink/5">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
