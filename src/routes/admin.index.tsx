import { createFileRoute, Link } from "@tanstack/react-router";
import { money } from "@/lib/products";
import { useAdmin } from "@/store/admin";
import { AdminTitle, Panel, Pill, date } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { products, orders, messages } = useAdmin();
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0);
  const low = products.filter((p) => p.stock <= 5);
  const customers = new Set(orders.map((o) => o.email)).size;
  const stats = [
    ["Revenue", money(revenue)], ["Orders", orders.length], ["Customers", customers], ["Products", products.length],
  ];
  return (
    <>
      <AdminTitle title="Dashboard" sub="Overview of your store" />
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
