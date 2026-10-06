import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin, defaultContent, type SiteContent } from "@/store/admin";
import { AdminTitle, Panel, Field, btn, btnGhost, input } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/content")({ component: Content });

function Content() {
  const { content, setContent, resetAll } = useAdmin();
  const [c, setC] = useState<SiteContent>(content);
  const [saved, setSaved] = useState(false);
  const up = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => { setSaved(false); setC((x) => ({ ...x, [k]: v })); };
  return (
    <form onSubmit={(e) => { e.preventDefault(); setContent(c); setSaved(true); }}>
      <AdminTitle title="Site content" sub="Edit the words and settings shown across the store"
        action={<div className="flex items-center gap-3">{saved && <span className="text-sm">Saved ✓</span>}<button className={btn}>SAVE CHANGES</button></div>} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="grid gap-4">
          <h2 className="font-semibold">Homepage headline</h2>
          <Field label="Small line above headline"><input value={c.heroEyebrow} onChange={(e) => up("heroEyebrow", e.target.value)} className={input} /></Field>
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <Field label="Headline"><input value={c.heroTitle} onChange={(e) => up("heroTitle", e.target.value)} className={input} /></Field>
            <Field label="Highlighted word"><input value={c.heroAccent} onChange={(e) => up("heroAccent", e.target.value)} className={input} /></Field>
          </div>
          <Field label="Intro text"><textarea rows={3} value={c.heroIntro} onChange={(e) => up("heroIntro", e.target.value)} className={input} /></Field>
          <div className="rounded-xl bg-ink p-5 text-cream">
            <p className="eyebrow text-xs opacity-80">{c.heroEyebrow}</p>
            <p className="mt-2 font-serif text-3xl">{c.heroTitle} <em className="text-lime">{c.heroAccent}</em>.</p>
            <p className="mt-2 text-sm opacity-80">{c.heroIntro}</p>
          </div>
        </Panel>
        <Panel className="grid content-start gap-4">
          <h2 className="font-semibold">Contact details</h2>
          <Field label="Email"><input value={c.email} onChange={(e) => up("email", e.target.value)} className={input} /></Field>
          <Field label="Studio location"><input value={c.studio} onChange={(e) => up("studio", e.target.value)} className={input} /></Field>
          <Field label="Opening hours"><input value={c.hours} onChange={(e) => up("hours", e.target.value)} className={input} /></Field>
          <h2 className="mt-4 font-semibold">Shipping</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Shipping fee (₹)"><input type="number" min={0} value={c.shippingFee} onChange={(e) => up("shippingFee", +e.target.value)} className={input} /></Field>
            <Field label="Free shipping over (₹)"><input type="number" min={0} value={c.freeShippingOver} onChange={(e) => up("freeShippingOver", +e.target.value)} className={input} /></Field>
          </div>
          <Field label="Announcement text"><input value={c.announcement} onChange={(e) => up("announcement", e.target.value)} className={input} /></Field>
        </Panel>
        <Panel className="xl:col-span-2">
          <h2 className="font-semibold">Reset</h2>
          <p className="mt-1 text-sm text-muted-foreground">Put products, orders, messages and content back to how they started. Admin accounts are kept.</p>
          <div className="mt-4 flex gap-3">
            <button type="button" className={btnGhost} onClick={() => setC(defaultContent)}>RESTORE DEFAULT TEXT</button>
            <button type="button" className={btnGhost} onClick={() => { if (confirm("Reset the whole store?")) { resetAll(); setC(defaultContent); } }}>RESET EVERYTHING</button>
          </div>
        </Panel>
      </div>
    </form>
  );
}
