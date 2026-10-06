import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { useAdmin } from "@/store/admin";
import { AdminTitle, Panel, Field, Pill, btn, input } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/team")({ component: Team });

function Team() {
  const { admins, addAdmin, removeAdmin, session } = useAdmin();
  const [msg, setMsg] = useState("");
  return (
    <>
      <AdminTitle title="Admins" sub="People who can sign in to this panel" />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel className="p-0">
          <ul className="divide-y divide-ink/10">
            {admins.map((a) => (
              <li key={a.email} className="flex items-center gap-3 p-4 text-sm">
                <span className="flex-1">{a.email} {a.email === session && <span className="text-muted-foreground">(you)</span>}</span>
                <Pill tone={a.role === "owner" ? "ink" : "muted"}>{a.role}</Pill>
                {a.role !== "owner" && a.email !== session && (
                  <button aria-label="Remove admin" onClick={() => confirm(`Remove ${a.email}?`) && removeAdmin(a.email)} className="p-1 opacity-70 hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                )}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <form className="grid gap-4" onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget; const f = new FormData(form);
            const ok = addAdmin({ email: String(f.get("email")), password: String(f.get("password")), role: "admin" });
            setMsg(ok ? "Admin added." : "That email is already an admin.");
            if (ok) form.reset();
          }}>
            <h2 className="font-semibold">Add an admin</h2>
            <Field label="Email"><input name="email" type="email" required className={input} /></Field>
            <Field label="Password"><input name="password" type="text" minLength={6} required className={input} /></Field>
            <button className={btn + " justify-self-start"}><UserPlus className="h-4 w-4" /> ADD ADMIN</button>
            {msg && <p className="text-sm">{msg}</p>}
          </form>
        </Panel>
      </div>
    </>
  );
}
