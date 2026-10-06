import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, meta } from "@/components/layout/page";
import hero from "@/assets/campaign-hero.jpg";
import atelier from "@/assets/campaign-atelier.jpg";
import city from "@/assets/campaign-city.jpg";
import evening from "@/assets/campaign-evening.jpg";
import weekend from "@/assets/campaign-weekend.jpg";

export const Route = createFileRoute("/lookbook")({
  head: () => ({ meta: meta("Lookbook SS/26 — VIVANT", "The VIVANT SS/26 menswear lookbook: tailoring, evening and weekend looks shot in black.") }),
  component: Lookbook,
});

const looks = [
  { img: atelier, title: "The Atelier", text: "Fittings in Lisbon. Half-canvas jackets, chalk and pins.", alt: "Tailor fitting a black jacket" },
  { img: city, title: "The City", text: "Overshirts and pleated trousers for concrete days.", alt: "Man in black overshirt in the city" },
  { img: evening, title: "After Dark", text: "Peak lapels, satin facings, midnight wool.", alt: "Two men in tuxedos entering a stone venue" },
  { img: weekend, title: "The Weekend", text: "Heavyweight tees and washed black denim.", alt: "Man in tee and jeans on concrete steps" },
];

function Lookbook() {
  return (
    <>
      <PageHero eyebrow="Lookbook · SS/26" title={<>Dressed in <em>black.</em></>} intro="Four chapters from the new season." image={hero} alt="Three men in black tailoring" />
      <section className="mx-auto max-w-[1500px] space-y-24 px-5 py-24 md:px-10">
        {looks.map((l, i) => (
          <article key={l.title} className={`grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>img]:order-2" : ""}`}>
            <img src={l.img} alt={l.alt} loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
            <div>
              <p className="eyebrow mb-3">Chapter 0{i + 1}</p>
              <h2 className="font-serif text-5xl md:text-6xl">{l.title}</h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">{l.text}</p>
              <Link to="/shop" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-xs font-semibold tracking-widest text-cream">SHOP THE LOOK ⟶</Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
