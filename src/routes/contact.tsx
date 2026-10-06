import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdmin } from "@/store/admin";
import { PageHero, meta } from "@/components/layout/page";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: meta("Contact — VIVANT", "Get in touch with VIVANT for sizing help, orders, returns and tailoring appointments.") }),
  component: Contact,
});

const field = "w-full rounded-xl border border-ink/20 bg-transparent px-4 py-3 outline-none focus:border-ink";

function Contact() {
  const [sent, setSent] = useState(false);
  const addMessage = useAdmin((s) => s.addMessage);
  const content = useAdmin((s) => s.content);
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let's <em>talk.</em></>} intro="Sizing, orders, returns or a fitting appointment — we reply within one working day." />
      <section className="mx-auto grid max-w-[1500px] gap-16 px-5 py-20 md:grid-cols-[1fr_1.4fr] md:px-10">
        <div className="space-y-8">
          <div><p className="eyebrow mb-2">Email</p><p className="text-lg">{content.email}</p></div>
          <div><p className="eyebrow mb-2">Studio</p><p className="text-lg">{content.studio}</p></div>
          <div><p className="eyebrow mb-2">Hours</p><p className="text-lg">{content.hours}</p></div>
        </div>
        {sent ? (
          <p className="font-serif text-4xl">Thank you — we'll be in touch soon.</p>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            addMessage({ name: String(f.get("name")), email: String(f.get("email")), topic: String(f.get("topic")), body: String(f.get("body")) });
            setSent(true);
          }} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required name="name" placeholder="Name" aria-label="Name" className={field} />
              <input required name="email" type="email" placeholder="Email" aria-label="Email" className={field} />
            </div>
            <select name="topic" aria-label="Topic" className={field}><option>Sizing help</option><option>Order & delivery</option><option>Returns</option><option>Fitting appointment</option></select>
            <textarea required name="body" rows={6} placeholder="Message" aria-label="Message" className={field} />
            <button className="justify-self-start rounded-full bg-ink px-8 py-4 text-xs font-semibold tracking-widest text-cream">SEND MESSAGE ⟶</button>
          </form>
        )}
      </section>
    </>
  );
}
