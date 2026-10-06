import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { money } from "@/lib/products";
import { useAdmin } from "@/store/admin";
import { AdminTitle, Panel, Pill, date } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/customers")({ component: Customers });

function Customers() {
  const { orders, messages, toggleRead, deleteMessage } = useAdmin();
  const [tab, setTab] = useState<"customers" | "messages">("customers");
  const customers = useMemo(() => {
    const m = new Map<string, { email: string; name: string; orders: number; spent: number; last: string }>();
    for (const o of orders) {
      const c = m.get(o.email) ?? { email: o.email, name: o.name, orders: 0, spent: 0, last: o.createdAt };
      c.orders++; if (o.status !== "cancelled") c.spent += o.total; if (o.createdAt > c.last) c.last = o.createdAt;
      m.set(o.email, c);
    }
    return [...m.values()].sort((a, b) => b.spent - a.spent);
  }, [orders]);
  const tabCls = (t: string) => "rounded-full px-4 py-2 text-xs font-semibold tracking-wider " + (tab === t ? "bg-ink text-cream" : "border border-ink/20");

  return (
    <>
      <AdminTitle title="Customers & messages" />
      <div className="mb-6 flex gap-2">
        <button className={tabCls("customers")} onClick={() => setTab("customers")}>CUSTOMERS ({customers.length})</button>
        <button className={tabCls("messages")} onClick={() => setTab("messages")}>MESSAGES ({messages.filter((m) => !m.read).length} new)</button>
      </div>
      {tab === "customers" ? (
        customers.length === 0 ? <Panel><p className="text-sm text-muted-foreground">Customers appear here after their first order.</p></Panel> : (
          <Panel className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-ink/10 text-left text-[11px] uppercase tracking-widest text-muted-foreground"><tr><th className="p-4">Customer</th><th>Orders</th><th>Spent</th><th>Last order</th></tr></thead>
              <tbody className="divide-y divide-ink/10">
                {customers.map((c) => <tr key={c.email}><td className="p-4"><p className="font-semibold">{c.name}</p><a href={`mailto:${c.email}`} className="text-xs underline">{c.email}</a></td><td>{c.orders}</td><td>{money(c.spent)}</td><td>{date(c.last)}</td></tr>)}
              </tbody>
            </table>
          </Panel>
        )
      ) : messages.length === 0 ? <Panel><p className="text-sm text-muted-foreground">Messages from the Contact page appear here.</p></Panel> : (
        <div className="grid gap-3">
          {messages.map((m) => (
            <Panel key={m.id} className={m.read ? "opacity-70" : ""}>
              <div className="flex flex-wrap items-center gap-3">
                {!m.read && <Pill tone="lime">new</Pill>}
                <p className="flex-1"><b>{m.name}</b> · <a href={`mailto:${m.email}`} className="underline">{m.email}</a> <span className="text-sm text-muted-foreground">· {m.topic} · {date(m.createdAt)}</span></p>
                <button aria-label={m.read ? "Mark unread" : "Mark read"} onClick={() => toggleRead(m.id)} className="p-2">{m.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}</button>
                <button aria-label="Delete message" onClick={() => deleteMessage(m.id)} className="p-2"><Trash2 className="h-4 w-4" /></button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{m.body}</p>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
