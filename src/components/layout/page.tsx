import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, intro, image, alt }: { eyebrow: string; title: ReactNode; intro?: string; image?: string; alt?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-cream">
      {image && <img src={image} alt={alt ?? ""} className="absolute inset-0 h-full w-full object-cover opacity-50" />}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="relative mx-auto max-w-[1500px] px-5 pb-16 pt-40 md:px-10 md:pb-24 md:pt-48">
        <p className="eyebrow mb-4 opacity-80">{eyebrow}</p>
        <h1 className="max-w-4xl font-serif text-5xl leading-[0.95] md:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-xl text-base opacity-80 md:text-lg">{intro}</p>}
      </div>
    </section>
  );
}

export const meta = (title: string, description: string) => [
  { title },
  { name: "description", content: description },
  { property: "og:title", content: title },
  { property: "og:description", content: description },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary_large_image" },
];
