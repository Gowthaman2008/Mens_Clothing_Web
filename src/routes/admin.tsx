import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Shirt, ShoppingBag, FileText, Users, ShieldCheck, LogOut, ExternalLink } from "lucide-react";
import { useAdmin } from "@/store/admin";
import { btn, input, Field } from "@/components/admin/ui";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — VIVANT" },
      { name: "description", content: "VIVANT store administration." },
      { property: "og:title", content: "Admin — VIVANT" },
      { property: "og:description", content: "VIVANT store administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Shirt },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/content", label: "Site content", icon: FileText },
  { to: "/admin/customers", label: "Customers & messages", icon: Users },
  { to: "/admin/team", label: "Admins", icon: ShieldCheck },
] as const;

function useAdminHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    const unsub = useAdmin.persist.onFinishHydration(() => setH(true));
    if (useAdmin.persist.hasHydrated()) setH(true);
    else void useAdmin.persist.rehydrate();
    // Safety net: never leave the panel blank
    const t = setTimeout(() => setH(true), 800);
    return () => { unsub(); clearTimeout(t); };
  }, []);
  return h;
}

function AdminLayout() {
  const hydrated = useAdminHydrated();
  const session = useAdmin((s) => s.session);
  const logout = useAdmin((s) => s.logout);
  const unread = useAdmin((s) => s.messages.filter((m) => !m.read).length);
  const pending = useAdmin((s) => s.orders.filter((o) => o.status === "pending").length);

  if (!hydrated) return <div className="min-h-screen bg-cream" />;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-cream text-ink md:grid md:grid-cols-[250px_1fr]">
      <aside className="flex flex-col gap-1 bg-ink p-5 text-cream md:sticky md:top-0 md:h-screen">
        <Link to="/admin" className="mb-6 font-display text-2xl tracking-wider">VIVANT<span className="text-lime">.</span> <span className="text-xs opacity-60">ADMIN</span></Link>
        {nav.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: "exact" in n }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm opacity-75 hover:bg-cream/10 hover:opacity-100"
            activeProps={{ className: "!bg-lime !text-ink !opacity-100 font-semibold" }}>
            <n.icon className="h-4 w-4" /> <span className="flex-1">{n.label}</span>
            {n.to === "/admin/orders" && pending > 0 && <span className="rounded-full bg-cream px-2 text-[10px] text-ink">{pending}</span>}
            {n.to === "/admin/customers" && unread > 0 && <span className="rounded-full bg-cream px-2 text-[10px] text-ink">{unread}</span>}
          </Link>
        ))}
        <div className="mt-auto space-y-1 pt-6 text-sm">
          <p className="truncate px-3 text-xs opacity-60">{session}</p>
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-75 hover:bg-cream/10"><ExternalLink className="h-4 w-4" /> View store</Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 opacity-75 hover:bg-cream/10"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-10"><Outlet /></main>
    </div>
  );
}

function Login() {
  const login = useAdmin((s) => s.login);
  const [err, setErr] = useState("");
  return (
    <div className="grid min-h-screen place-items-center bg-ink px-5 text-cream">
      <form className="w-full max-w-sm rounded-2xl bg-cream p-8 text-ink"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          if (!login(String(f.get("email")), String(f.get("password")))) setErr("Wrong email or password.");
        }}>
        <p className="font-display text-3xl tracking-wider">VIVANT<span className="text-lime">.</span></p>
        <h1 className="mt-2 font-serif text-3xl">Admin sign in</h1>
        <div className="mt-6 grid gap-4">
          <Field label="Email"><input name="email" type="email" required className={input} /></Field>
          <Field label="Password"><input name="password" type="password" required className={input} /></Field>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button className={btn + " justify-center py-3"}>SIGN IN</button>
          <p className="text-xs text-muted-foreground">Demo mode: changes are saved in this browser only.</p>
        </div>
      </form>
    </div>
  );
}
