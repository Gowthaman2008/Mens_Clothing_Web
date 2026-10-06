import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const input = "w-full rounded-lg border border-ink/15 bg-background px-3 py-2 text-sm outline-none focus:border-ink";
export const btn = "inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold tracking-wider text-cream transition-opacity hover:opacity-85 disabled:opacity-40";
export const btnGhost = "inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold tracking-wider hover:bg-ink/5";

export function AdminTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-ink/10 bg-background p-5", className)}>{children}</div>;
}

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "lime" | "ink" }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
      tone === "lime" && "bg-lime text-ink", tone === "ink" && "bg-ink text-cream", tone === "muted" && "bg-ink/10")}>
      {children}
    </span>
  );
}

export const date = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
