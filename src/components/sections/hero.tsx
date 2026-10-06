import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowRight, Scissors, Truck, RotateCcw } from "lucide-react";
import heroImg from "@/assets/hero-formal-3.jpg";
import { useAdmin } from "@/store/admin";

const trust = [
  { icon: Scissors, t: "Made in Portugal & Italy", s: "Small ateliers, fair wages" },
  { icon: Truck, t: "Free shipping", s: "On orders over ₹12,500" },
  { icon: RotateCcw, t: "30-day returns", s: "Easy & free" },
];

const blur = {
  hidden: { opacity: 0, filter: "blur(14px)", y: 24 },
  show: (i: number) => ({ opacity: 1, filter: "blur(0px)", y: 0, transition: { delay: 0.2 + i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] as const } }),
};

export function Hero() {
  const content = useAdmin((s) => s.content);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "18%"]);
  const introO = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.6], reduce ? [0, 0] : [0, -40]);
  const dim = useTransform(scrollYProgress, [0, 1], [0.15, 0.45]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink" aria-label="Introduction">
      <div className="relative h-full overflow-hidden text-cream">
        <motion.div style={{ y: imgY }} className="absolute inset-0 will-change-transform">
          <img src={heroImg} alt="Man in a black tailored formal tuxedo standing in a bright light studio" width={1920} height={1280} fetchPriority="high"
            className="h-full w-full object-cover object-[78%_center]" />
        </motion.div>
        <motion.div className="absolute inset-0 bg-ink" style={{ opacity: dim }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />

        <motion.div style={{ opacity: introO, y: introY }} className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-center px-5 md:px-10">
          <motion.h1 variants={blur} initial="hidden" animate="show" custom={1} className="max-w-3xl font-serif text-5xl leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
            {content.heroTitle} <em className="text-ink">{content.heroAccent}</em>.
          </motion.h1>
          <motion.p variants={blur} initial="hidden" animate="show" custom={2} className="mt-6 max-w-md text-base text-cream/85">
            {content.heroIntro}
          </motion.p>
          <motion.div variants={blur} initial="hidden" animate="show" custom={3} className="mt-8">
            <Link to="/shop" className="group inline-flex items-center gap-3 rounded-full bg-cream px-7 py-4 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]">
              Explore the collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>



        <motion.div style={{ opacity: introO }} className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1500px] items-end justify-between px-5 pb-8 md:px-10">
          <ul className="hidden gap-10 md:flex">
            {trust.map(({ icon: I, t, s }) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-cream/30"><I className="h-4 w-4" /></span>
                <span className="text-xs leading-tight"><b className="block font-semibold">{t}</b><span className="text-cream/70">{s}</span></span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 text-[0.6rem] tracking-[0.35em]">
            SCROLL <span className="relative h-12 w-px overflow-hidden bg-cream/25"><span className="animate-scrolline absolute inset-0 bg-cream" /></span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function SignatureBand() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["18%", "-18%"]);
  return (
    <section ref={ref} aria-label="Wardrobe" className="relative grid h-40 place-items-center overflow-hidden bg-cream md:h-52">
      <motion.span aria-hidden style={{ x }} className="outline-word text-[16vw] md:text-[12vw]">Wardrobe</motion.span>
    </section>
  );
}
