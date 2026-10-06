import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, meta } from "@/components/layout/page";
import hero from "@/assets/campaign-atelier.jpg";
import side from "@/assets/campaign-weekend.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: meta("About VIVANT — Menswear made in Portugal & Italy", "The story behind VIVANT: menswear cut in Lisbon and made in small Portuguese and Italian ateliers.") }),
  component: About,
});

const values = [
  { n: "01", t: "Cut in Lisbon", d: "Every pattern is drafted and fitted in our Lisbon studio." },
  { n: "02", t: "Made in small ateliers", d: "Family workshops in Portugal & Italy, fewer than 40 hands each." },
  { n: "03", t: "Built to last", d: "Natural fibres, half-canvas construction, repairs for life." },
];

function About() {
  return (
    <>
      <PageHero eyebrow="Our story" title={<>Quiet luxury, <em>loudly made.</em></>} intro="VIVANT began with one jacket and a simple idea: men deserve clothes made with care." image={hero} alt="Tailor fitting a black jacket" />
      <section className="mx-auto grid max-w-[1500px] items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-10">
        <div>
          <h2 className="font-serif text-5xl">From one jacket to a full wardrobe.</h2>
          <p className="mt-6 text-lg text-muted-foreground">We design tailoring, shirts, knitwear and evening wear for men who want fewer, better things. Each SS/26 piece is produced in small runs, so nothing is made to sit in a warehouse.</p>
          <Link to="/collections" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-xs font-semibold tracking-widest text-cream">EXPLORE COLLECTIONS ⟶</Link>
        </div>
        <img src={side} alt="Man in black tee and jeans on concrete steps" loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
      </section>
      <section className="bg-ink text-cream">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-20 md:grid-cols-3 md:px-10">
          {values.map((v) => (
            <div key={v.n}><p className="font-serif text-5xl text-lime">{v.n}</p><h3 className="mt-4 text-xl font-semibold">{v.t}</h3><p className="mt-2 opacity-75">{v.d}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
