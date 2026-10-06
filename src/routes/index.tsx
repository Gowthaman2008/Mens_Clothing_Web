import { createFileRoute } from "@tanstack/react-router";
import { Hero, SignatureBand } from "@/components/sections/hero";
import { CategoryStrip } from "@/components/sections/categories";
import { Signatures, BestSellers } from "@/components/sections/carousels";
import { EveningEdit } from "@/components/sections/evening";
import { TrendingSummer } from "@/components/sections/lists-forecast";
import { Spotlight } from "@/components/sections/spotlight";
import { Occasions, Offers } from "@/components/sections/occasions-offers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VIVANT — Loud Colour, Quiet Luxury" },
      { name: "description", content: "Shop VIVANT's SS/26 menswear: colour-drenched tailoring, silk shirts and joyful knits made in Portugal & Italy." },
      { property: "og:title", content: "VIVANT — Loud Colour, Quiet Luxury" },
      { property: "og:description", content: "Colour-drenched men's tailoring, silk shirts and knits made in small Portuguese and Italian ateliers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <SignatureBand />
      <CategoryStrip />
      <Signatures />
      <BestSellers />
      <EveningEdit />
      <TrendingSummer />
      <Spotlight />
      <Occasions />
      <Offers />
    </>
  );
}
