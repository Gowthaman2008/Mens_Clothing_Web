import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Search } from "lucide-react";
import { categories, money, type Badge, type Category } from "@/lib/products";
import { useAdmin, type AdminProduct } from "@/store/admin";
import { AdminTitle, Panel, Field, Pill, btn, btnGhost, input } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/products")({ component: Products });

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];
const blank = (): AdminProduct => ({
  name: "", slug: "", price: 100, fabric: "", colours: [{ name: "Black", tone: "ink" }], sizes: [...ALL_SIZES],
  rating: 5, reviews: 0, category: "tailoring", backdrop: "cream", image: "", description: "", stock: 10,
});
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Products() {
  const { products, saveProduct, deleteProduct } = useAdmin();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "">("");
  const [editing, setEditing] = useState<{ p: AdminProduct; original?: string } | null>(null);
  const list = useMemo(() => products.filter((p) => (!cat || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())), [products, q, cat]);

  return (
    <>
      <AdminTitle title="Products" sub={`${products.length} products in the catalogue`}
        action={<button className={btn} onClick={() => setEditing({ p: blank() })}><Plus className="h-4 w-4" /> ADD PRODUCT</button>} />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className={input + " pl-9"} /></div>
        <select value={cat} onChange={(e) => setCat(e.target.value as Category | "")} className={input + " w-48"}>
          <option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <Panel className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th className="pr-4 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {list.map((p) => (
              <tr key={p.slug}>
                <td className="p-4"><div className="flex items-center gap-3">{p.image ? <img src={p.image} alt="" className="h-12 w-10 rounded object-cover" /> : <div className="h-12 w-10 rounded bg-ink/10" />}<div><p className="font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{p.slug}</p></div></div></td>
                <td className="capitalize">{p.category}</td>
                <td>{money(p.price)}{p.compareAt && <span className="ml-1 text-xs text-muted-foreground line-through">{money(p.compareAt)}</span>}</td>
                <td><Pill tone={p.stock === 0 ? "ink" : "muted"}>{p.stock}</Pill></td>
                <td>{p.hidden ? <Pill>Hidden</Pill> : <Pill tone="lime">Live</Pill>} {p.badge && <Pill>{p.badge}</Pill>}</td>
                <td className="pr-4 text-right whitespace-nowrap">
                  <button aria-label="Toggle visibility" title={p.hidden ? "Show in store" : "Hide from store"} onClick={() => saveProduct({ ...p, hidden: !p.hidden })} className="p-2 opacity-70 hover:opacity-100">{p.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  <button aria-label="Edit" onClick={() => setEditing({ p: { ...p }, original: p.slug })} className="p-2 opacity-70 hover:opacity-100"><Pencil className="h-4 w-4" /></button>
                  <button aria-label="Delete" onClick={() => confirm(`Delete ${p.name}?`) && deleteProduct(p.slug)} className="p-2 opacity-70 hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-sm text-muted-foreground">No products match.</p>}
      </Panel>
      {editing && <Editor initial={editing.p} original={editing.original} onClose={() => setEditing(null)}
        onSave={(p) => { saveProduct(p, editing.original); setEditing(null); }}
        taken={(slug) => slug !== editing.original && products.some((x) => x.slug === slug)} />}
    </>
  );
}

function Editor({ initial, original, onClose, onSave, taken }: { initial: AdminProduct; original?: string | undefined; onClose: () => void; onSave: (p: AdminProduct) => void; taken: (s: string) => boolean }) {
  const [p, setP] = useState(initial);
  const [err, setErr] = useState("");
  const up = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setP((x) => ({ ...x, [k]: v }));
  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => up("image", String(r.result));
    r.readAsDataURL(f);
  };
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/50" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto bg-cream p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const slug = p.slug || slugify(p.name);
          if (!p.name.trim()) return setErr("Name is required.");
          if (taken(slug)) return setErr("Another product already uses this link name.");
          if (!p.image) return setErr("Please add a photo.");
          onSave({ ...p, slug });
        }}>
        <div className="mb-6 flex items-center justify-between"><h2 className="font-serif text-3xl">{original ? "Edit product" : "New product"}</h2><button type="button" aria-label="Close" onClick={onClose}><X /></button></div>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            {p.image ? <img src={p.image} alt="" className="h-28 w-24 rounded-lg object-cover" /> : <div className="grid h-28 w-24 place-items-center rounded-lg bg-ink/10 text-xs">No photo</div>}
            <Field label="Photo" className="flex-1"><input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm" /></Field>
          </div>
          <Field label="Name"><input value={p.name} onChange={(e) => up("name", e.target.value)} className={input} /></Field>
          <Field label="Link name (auto if empty)"><input value={p.slug} onChange={(e) => up("slug", slugify(e.target.value))} placeholder={slugify(p.name)} className={input} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price ($)"><input type="number" min={0} value={p.price} onChange={(e) => up("price", +e.target.value)} className={input} /></Field>
            <Field label="Was price"><input type="number" min={0} value={p.compareAt ?? ""} onChange={(e) => up("compareAt", e.target.value ? +e.target.value : undefined)} className={input} /></Field>
            <Field label="Stock"><input type="number" min={0} value={p.stock} onChange={(e) => up("stock", +e.target.value)} className={input} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><select value={p.category} onChange={(e) => up("category", e.target.value as Category)} className={input}>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></Field>
            <Field label="Badge"><select value={p.badge ?? ""} onChange={(e) => up("badge", (e.target.value || undefined) as Badge | undefined)} className={input}><option value="">None</option><option>NEW</option><option>BESTSELLER</option><option>LIMITED</option></select></Field>
          </div>
          <Field label="Fabric"><input value={p.fabric} onChange={(e) => up("fabric", e.target.value)} className={input} /></Field>
          <Field label="Description"><textarea rows={4} value={p.description} onChange={(e) => up("description", e.target.value)} className={input} /></Field>
          <Field label="Colour names (comma separated)"><input value={p.colours.map((c) => c.name).join(", ")} onChange={(e) => up("colours", e.target.value.split(",").map((n) => n.trim()).filter(Boolean).map((name, i) => ({ name, tone: p.colours[i]?.tone ?? "ink" })))} className={input} /></Field>
          <Field label="Sizes">
            <div className="flex gap-2">{ALL_SIZES.map((s) => (
              <button type="button" key={s} onClick={() => up("sizes", p.sizes.includes(s) ? p.sizes.filter((x) => x !== s) : ALL_SIZES.filter((x) => x === s || p.sizes.includes(x)))}
                className={"h-10 w-12 rounded-lg border text-sm " + (p.sizes.includes(s) ? "border-ink bg-ink text-cream" : "border-ink/20")}>{s}</button>
            ))}</div>
          </Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!p.hidden} onChange={(e) => up("hidden", e.target.checked)} /> Hide from store</label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <div className="flex gap-3 pt-2"><button className={btn}>SAVE PRODUCT</button><button type="button" onClick={onClose} className={btnGhost}>CANCEL</button></div>
        </div>
      </form>
    </div>
  );
}
