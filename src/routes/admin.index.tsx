import { createFileRoute, Link } from "@tanstack/react-router";
import { Store, Link2, Unlink, ArrowRight, Receipt, Plus } from "lucide-react";
import { money } from "@/lib/products";
import { useAdmin } from "@/store/admin";
import { AdminTitle, Panel, Pill, date } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { products, orders, messages, posBills, inventoryLinked } = useAdmin();
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0);
  const posRevenue = posBills.reduce((a, b) => a + b.total, 0);
  const low = products.filter((p) => p.stock <= 5);
  const customers = new Set(orders.map((o) => o.email)).size;
  const stats = [
    ["Online Revenue", money(revenue)], 
    ["Offline POS Sales", money(posRevenue)], 
    ["Online Orders", orders.length], 
    ["Catalogue Items", products.length],
  ];
  return (
    <>
      <AdminTitle 
        title="Dashboard" 
        sub="Overview of your store and retail operations" 
        action={
          <Link
            to="/admin/pos"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-bold tracking-wider text-cream shadow-md transition-all hover:bg-ink/85"
          >
            <Store className="h-4 w-4" />
            <span>OPEN POS TERMINAL</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {/* POS Quick Launcher & Stock Link Status */}
      <div className="mb-6 rounded-2xl border border-ink/10 bg-paper/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-cream">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-ink">Offline Retail Store & POS</h3>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                inventoryLinked ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {inventoryLinked ? <Link2 className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
                {inventoryLinked ? "Stocks Linked" : "Stocks Unlinked"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {posBills.length} POS bills recorded ({money(posRevenue)} total walk-in sales).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to="/admin/pos"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink/15 bg-cream px-4 py-2 text-xs font-semibold text-ink hover:bg-background transition-all"
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>Billing Terminal</span>
          </Link>
          <Link
            to="/admin/pos"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-cream hover:bg-ink/85 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Stock</span>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([k, v]) => (
          <Panel key={k}><p className="text-xs uppercase tracking-widest text-muted-foreground">{k}</p><p className="mt-2 font-serif text-4xl">{v}</p></Panel>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel>
          <div className="mb-4 flex justify-between"><h2 className="font-semibold">Recent orders</h2><Link to="/admin/orders" className="text-xs underline">All orders</Link></div>
          {orders.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet. Orders placed at checkout appear here.</p> : (
            <ul className="divide-y divide-ink/10">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2 text-sm">
                  <span><b>{o.id}</b> · {o.name} <span className="text-muted-foreground">· {date(o.createdAt)}</span></span>
                  <span className="flex items-center gap-2"><Pill>{o.status}</Pill>{money(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel>
          <div className="mb-4 flex justify-between"><h2 className="font-semibold">Low stock</h2><Link to="/admin/products" className="text-xs underline">Manage</Link></div>
          {low.length === 0 ? <p className="text-sm text-muted-foreground">All products are well stocked.</p> : (
            <ul className="divide-y divide-ink/10">
              {low.map((p) => (
                <li key={p.slug} className="flex items-center gap-3 py-2 text-sm">
                  <img src={p.image} alt="" className="h-10 w-8 rounded object-cover" /><span className="flex-1">{p.name}</span>
                  <Pill tone={p.stock === 0 ? "ink" : "muted"}>{p.stock} left</Pill>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel className="xl:col-span-2">
          <div className="mb-4 flex justify-between"><h2 className="font-semibold">Latest messages</h2><Link to="/admin/customers" className="text-xs underline">Inbox</Link></div>
          {messages.length === 0 ? <p className="text-sm text-muted-foreground">No messages yet. Contact form messages appear here.</p> : (
            <ul className="divide-y divide-ink/10">
              {messages.slice(0, 4).map((m) => (
                <li key={m.id} className="py-2 text-sm">{!m.read && <Pill tone="lime">new</Pill>} <b>{m.name}</b> — {m.topic}: <span className="text-muted-foreground">{m.body.slice(0, 90)}</span></li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
