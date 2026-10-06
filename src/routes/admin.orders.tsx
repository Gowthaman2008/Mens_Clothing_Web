import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { money } from "@/lib/products";
import { useAdmin, type OrderStatus } from "@/store/admin";
import { AdminTitle, Panel, Pill, date, input } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/orders")({ component: Orders });
const statuses: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

function Orders() {
  const { orders, setOrderStatus, deleteOrder } = useAdmin();
  const [filter, setFilter] = useState<OrderStatus | "">("");
  const [open, setOpen] = useState<string | null>(null);
  const list = orders.filter((o) => !filter || o.status === filter);
  return (
    <>
      <AdminTitle title="Orders" sub={`${orders.length} orders`}
        action={<select value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | "")} className={input + " w-44 capitalize"}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select>} />
      {list.length === 0 ? <Panel><p className="text-sm text-muted-foreground">No orders yet. Place an order through the store's checkout and it will show up here.</p></Panel> : (
        <div className="grid gap-3">
          {list.map((o) => (
            <Panel key={o.id}>
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex flex-1 items-center gap-3 text-left">
                  <ChevronDown className={"h-4 w-4 transition-transform " + (open === o.id ? "rotate-180" : "")} />
                  <span><b>{o.id}</b> · {o.name} <span className="text-sm text-muted-foreground">· {o.email} · {date(o.createdAt)}</span></span>
                </button>
                <span className="font-semibold">{money(o.total)}</span>
                <select aria-label="Status" value={o.status} onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)} className={input + " w-36 capitalize"}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
                <button aria-label="Delete order" onClick={() => confirm(`Delete order ${o.id}?`) && deleteOrder(o.id)} className="p-2 opacity-70 hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
              </div>
              {open === o.id && (
                <div className="mt-4 border-t border-ink/10 pt-4 text-sm">
                  <p className="mb-3"><Pill>Ship to</Pill> {o.address}</p>
                  <ul className="space-y-1">{o.items.map((i, k) => <li key={k} className="flex justify-between"><span>{i.name} — {i.colour} · {i.size} × {i.qty}</span><span>{money(i.price * i.qty)}</span></li>)}</ul>
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
