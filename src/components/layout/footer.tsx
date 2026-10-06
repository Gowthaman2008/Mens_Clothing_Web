import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import footerImg from "@/assets/campaign-footer.jpg";

const socials = [
  { label: "Instagram", d: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2c-2.7 0-3 0-4.1.1C4.7 2.2 2.2 4.6 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.1 3.3 2.6 5.7 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.3-.1 5.7-2.6 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-3.3-2.6-5.7-5.8-5.8C15 2 14.7 2 12 2Z" },
  { label: "Pinterest", d: "M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.3 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2Z" },
  { label: "TikTok", d: "M16.6 2h-3.3v13.3a2.8 2.8 0 1 1-2-2.7V9.2a6.1 6.1 0 1 0 5.3 6.1V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.7Z" },
  { label: "YouTube", d: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.8 15V9l5.7 3-5.7 3Z" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cream pt-24 md:pt-32">
      <motion.p aria-label="VIVANT"
        initial={{ y: "40%", opacity: 0 }} whileInView={{ y: "0%", opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 -mb-[4vw] text-center font-serif text-[21vw] leading-[0.8] tracking-[0.12em] text-ink">
        VIVANT
      </motion.p>
      <div className="relative h-[70vh] min-h-[420px]">
        <img src={footerImg} alt="Three men in black tailoring walking through a luminous colonnade" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-cream md:flex-row md:px-10">
          <p>© 2026 VIVANT. All rights reserved.</p>
          <div className="flex gap-4">
            {socials.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="grid h-9 w-9 place-items-center rounded-full border border-cream/30 hover:bg-cream hover:text-ink">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
          <div className="flex gap-6"><Link to="/terms" className="hover:underline">Terms &amp; Conditions</Link><Link to="/privacy" className="hover:underline">Privacy</Link><Link to="/contact" className="hover:underline">Contact</Link></div>
        </div>
      </div>
    </footer>
  );
}
