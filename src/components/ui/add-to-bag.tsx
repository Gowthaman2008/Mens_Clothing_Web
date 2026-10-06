import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Noir architectural Add-to-bag CTA shared across the site. */
export function AddToBagButton({ onClick, className, label = "Add to bag" }: {
  onClick?: () => void;
  className?: string;
  label?: string;
}) {
  return (
    <button onClick={onClick}
      className={cn("group relative flex flex-1 items-center justify-between overflow-hidden rounded-full border border-cream/20 bg-ink py-4 pl-7 pr-7 text-cream transition-colors duration-500 hover:border-cream/40", className)}>
      <span className="text-[11px] font-light uppercase tracking-[0.4em] transition-transform duration-500 group-hover:translate-x-1">{label}</span>
      <span className="flex items-center gap-4">
        <span aria-hidden className="h-4 w-px bg-cream/25 transition-colors duration-500 group-hover:bg-cream/50" />
        <ArrowRight className="h-5 w-5 text-cream/60 transition-all duration-500 group-hover:translate-x-1 group-hover:text-cream" />
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cream/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
    </button>
  );
}
