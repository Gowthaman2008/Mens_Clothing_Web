import sportJacket from "@/assets/product-noir-sport-jacket.jpg";
import graphiteBlazer from "@/assets/product-graphite-blazer.jpg";
import satinCampShirt from "@/assets/product-satin-camp-shirt.jpg";
import leatherBomber from "@/assets/product-leather-bomber.jpg";
import midnightCampShirt from "@/assets/product-midnight-camp-shirt.jpg";
import fineKnitPolo from "@/assets/product-fine-knit-polo.jpg";
import washedBlackJeans from "@/assets/product-washed-black-jeans.jpg";
import blackKnitPolo from "@/assets/product-black-knit-polo.jpg";
import essentialTee from "@/assets/product-essential-tee.jpg";
import pleatedTrouser from "@/assets/product-pleated-trouser.jpg";
import charcoalOvershirt from "@/assets/product-charcoal-overshirt.jpg";
import dinnerJacket from "@/assets/product-dinner-jacket.jpg";
import midnightTuxedo from "@/assets/product-midnight-tuxedo-jacket.jpg";
import blackTieTuxedo from "@/assets/product-black-tie-tuxedo.jpg";
import charcoalFormalPant from "@/assets/product-charcoal-formal-pant.jpg";
import blackFormalShirt from "@/assets/product-black-formal-shirt.jpg";
import merinoCrewTee from "@/assets/product-merino-crew-tee.jpg";

export type Tone =
  | "cobalt" | "tangerine" | "fuchsia" | "butter" | "lavender" | "blush"
  | "plum" | "mint" | "peach" | "lime" | "ink" | "cream";

export const toneBg: Record<Tone, string> = {
  cobalt: "bg-cobalt", tangerine: "bg-tangerine", fuchsia: "bg-fuchsia", butter: "bg-butter",
  lavender: "bg-lavender", blush: "bg-blush", plum: "bg-plum", mint: "bg-mint",
  peach: "bg-peach", lime: "bg-lime", ink: "bg-ink", cream: "bg-cream",
};
export const toneVar = (t: Tone) => `var(--${t})`;

export type Category = "separates" | "knitwear" | "shirts" | "tailoring" | "outerwear" | "evening";
export const categories: { id: Category; label: string }[] = [
  { id: "tailoring", label: "Tailoring" },
  { id: "shirts", label: "Shirts" },
  { id: "knitwear", label: "Knitwear" },
  { id: "outerwear", label: "Outerwear" },
  { id: "evening", label: "Evening" },
  { id: "separates", label: "Separates" },
];

export type Badge = "NEW" | "BESTSELLER" | "LIMITED";

export interface Product {
  name: string;
  slug: string;
  price: number;
  compareAt?: number;
  fabric: string;
  colours: { name: string; tone: Tone }[];
  sizes: string[];
  rating: number;
  reviews: number;
  badge?: Badge;
  category: Category;
  backdrop: Tone;
  image: string;
  description: string;
}

const SIZES = ["S", "M", "L", "XL", "XXL"];
const d = (s: string) => s;

export const products: Product[] = [
  { name: "Noir Sport Jacket", slug: "saffron-linen-suit", price: 46500, fabric: "Italian wool · Single-breasted", colours: [{ name: "Black", tone: "ink" }, { name: "Graphite", tone: "cobalt" }], sizes: SIZES, rating: 4.9, reviews: 318, badge: "NEW", category: "tailoring", backdrop: "blush", image: sportJacket, description: d("A softly structured sport jacket cut in Italian wool with a clean shoulder and precise drape.") },
  { name: "Graphite Sport Blazer", slug: "riviera-linen-blazer", price: 28200, fabric: "Wool hopsack · Relaxed fit", colours: [{ name: "Graphite", tone: "cobalt" }, { name: "Black", tone: "ink" }], sizes: SIZES, rating: 4.7, reviews: 158, badge: "NEW", category: "tailoring", backdrop: "lavender", image: graphiteBlazer, description: d("An unlined sport blazer with a relaxed profile, designed for effortless everyday tailoring.") },
  { name: "Black Satin Camp Shirt", slug: "cobalt-silk-holiday-shirt", price: 14100, fabric: "Mulberry satin · Camp collar", colours: [{ name: "Black", tone: "ink" }, { name: "Graphite", tone: "cobalt" }], sizes: SIZES, rating: 4.8, reviews: 412, badge: "BESTSELLER", category: "shirts", backdrop: "lavender", image: satinCampShirt, description: d("A fluid satin shirt with a relaxed camp collar and understated evening sheen.") },
  { name: "Black Leather Bomber", slug: "petal-boucle-bomber", price: 31500, fabric: "Lamb leather · Clean fit", colours: [{ name: "Black", tone: "ink" }, { name: "Graphite", tone: "cobalt" }], sizes: SIZES, rating: 4.9, reviews: 97, badge: "NEW", category: "outerwear", backdrop: "cream", image: leatherBomber, description: d("A streamlined leather bomber with minimal hardware and a sharp modern profile.") },
  { name: "Midnight Camp Shirt", slug: "fuchsia-satin-shirt", price: 12400, fabric: "Heavy satin · Boxy camp collar", colours: [{ name: "Midnight", tone: "ink" }, { name: "Charcoal", tone: "plum" }], sizes: SIZES, rating: 4.8, reviews: 286, badge: "BESTSELLER", category: "shirts", backdrop: "blush", image: midnightCampShirt, description: d("Heavy black satin cut with a boxy fit and open camp collar for polished evenings.") },
  { name: "Fine-Knit Polo", slug: "mint-terry-polo", price: 9100, fabric: "Merino knit · Regular fit", colours: [{ name: "Black", tone: "ink" }, { name: "Charcoal", tone: "cobalt" }], sizes: SIZES, rating: 4.7, reviews: 156, category: "knitwear", backdrop: "cream", image: fineKnitPolo, description: d("A fine-gauge merino polo with a crisp collar and smooth, breathable handle.") },
  { name: "Washed Black Jeans", slug: "ultramarine-flare-jeans", price: 14900, fabric: "Organic denim · Straight leg", colours: [{ name: "Washed Black", tone: "cobalt" }, { name: "Ink", tone: "ink" }], sizes: SIZES, rating: 4.8, reviews: 527, badge: "BESTSELLER", category: "separates", backdrop: "cream", image: washedBlackJeans, description: d("Rigid organic denim with a clean straight leg and softly washed black finish.") },
  { name: "Black Knit Polo", slug: "sorbet-stripe-knit-polo", price: 10000, fabric: "Fine cotton knit · Fitted", colours: [{ name: "Black", tone: "ink" }, { name: "Graphite", tone: "cobalt" }], sizes: SIZES, rating: 4.7, reviews: 203, badge: "NEW", category: "knitwear", backdrop: "lavender", image: blackKnitPolo, description: d("A fitted fine-knit polo that moves easily between tailored and casual dressing.") },
  { name: "Essential Black T-Shirt", slug: "poppy-poplin-set", price: 7500, fabric: "Heavyweight cotton · Relaxed", colours: [{ name: "Black", tone: "ink" }, { name: "Charcoal", tone: "cobalt" }], sizes: SIZES, rating: 4.9, reviews: 301, badge: "BESTSELLER", category: "separates", backdrop: "cream", image: essentialTee, description: d("A substantial jersey T-shirt with a precise neckline and easy, structured drape.") },
  { name: "Pleated Formal Trouser", slug: "riviera-wide-leg-trouser", price: 15800, compareAt: 19900, fabric: "Italian wool · Double pleat", colours: [{ name: "Graphite", tone: "cobalt" }, { name: "Black", tone: "ink" }], sizes: SIZES, rating: 4.8, reviews: 244, badge: "BESTSELLER", category: "tailoring", backdrop: "lavender", image: pleatedTrouser, description: d("A double-pleated formal trouser with a clean waist and elegant full-length drape.") },
  { name: "Charcoal Overshirt", slug: "tangerine-trench", price: 21600, fabric: "Brushed wool · Layering fit", colours: [{ name: "Charcoal", tone: "cobalt" }, { name: "Black", tone: "ink" }], sizes: SIZES, rating: 4.8, reviews: 58, category: "outerwear", backdrop: "cream", image: charcoalOvershirt, description: d("A substantial brushed-wool overshirt designed as a refined alternative to a casual jacket.") },
  { name: "Satin-Lapel Dinner Jacket", slug: "gilded-lame-dinner-jacket", price: 43200, fabric: "Italian wool · Satin lapel", colours: [{ name: "Black", tone: "ink" }], sizes: SIZES, rating: 4.8, reviews: 112, badge: "LIMITED", category: "evening", backdrop: "plum", image: dinnerJacket, description: d("A precise black dinner jacket finished with sculpted satin lapels for formal evenings.") },
  { name: "Midnight Tuxedo Jacket", slug: "emerald-sequin-blazer", price: 39800, fabric: "Barathea wool · Satin lapel", colours: [{ name: "Midnight", tone: "ink" }, { name: "Graphite", tone: "cobalt" }], sizes: SIZES, rating: 4.9, reviews: 64, badge: "LIMITED", category: "evening", backdrop: "plum", image: midnightTuxedo, description: d("A modern tuxedo jacket cut from dense barathea wool with tonal satin detailing.") },
  { name: "Black Tie Tuxedo", slug: "plum-velvet-tuxedo", price: 50600, fabric: "Italian wool · Full suit", colours: [{ name: "Black", tone: "ink" }], sizes: SIZES, rating: 4.9, reviews: 42, badge: "LIMITED", category: "evening", backdrop: "plum", image: blackTieTuxedo, description: d("A complete black tuxedo with a clean one-button jacket and sharply tailored trousers.") },
  { name: "Charcoal Formal Pant", slug: "lemon-pleated-trouser", price: 13300, fabric: "Wool twill · Single pleat", colours: [{ name: "Charcoal", tone: "cobalt" }, { name: "Black", tone: "ink" }], sizes: SIZES, rating: 4.7, reviews: 133, category: "separates", backdrop: "lavender", image: charcoalFormalPant, description: d("A versatile formal pant with a single pleat, pressed crease and measured taper.") },
  { name: "Black Formal Shirt", slug: "lilac-sheer-shirt", price: 14100, fabric: "Cotton poplin · Tailored fit", colours: [{ name: "Black", tone: "ink" }], sizes: SIZES, rating: 4.6, reviews: 88, category: "shirts", backdrop: "cream", image: blackFormalShirt, description: d("A sharply cut black poplin shirt with a clean point collar and smooth tailored line.") },
  { name: "Merino Crew T-Shirt", slug: "butter-cable-cardigan", price: 10800, fabric: "Fine merino · Relaxed crew", colours: [{ name: "Black", tone: "ink" }, { name: "Graphite", tone: "cobalt" }], sizes: SIZES, rating: 4.8, reviews: 91, category: "knitwear", backdrop: "cream", image: merinoCrewTee, description: d("A refined crew-neck T-shirt knitted from breathable fine merino for year-round wear.") },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const pick = (...slugs: string[]) => slugs.map((s) => bySlug(s)!).filter(Boolean);
export const money = (n: number) => `\u20B9${n.toLocaleString("en-IN")}`;
