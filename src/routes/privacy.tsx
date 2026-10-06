import { createFileRoute } from "@tanstack/react-router";
import { PageHero, meta } from "@/components/layout/page";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: meta("Privacy Policy — VIVANT", "How VIVANT collects, uses and protects your personal information.") }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <article className="mx-auto max-w-3xl space-y-6 px-5 py-20 text-lg leading-relaxed">
        <p><strong>What we collect.</strong> Your contact and delivery details when you order or write to us.</p>
        <p><strong>How we use it.</strong> Only to fulfil orders, answer questions and, if you opt in, send news.</p>
        <p><strong>Your bag & wishlist.</strong> Stored on your device only.</p>
        <p><strong>Your rights.</strong> Email us any time to access or delete your data.</p>
      </article>
    </>
  ),
});
