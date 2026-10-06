import { createFileRoute } from "@tanstack/react-router";
import { PageHero, meta } from "@/components/layout/page";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: meta("Terms & Conditions — VIVANT", "The terms that apply when you shop with VIVANT: orders, delivery, returns and payment.") }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <article className="mx-auto max-w-3xl space-y-6 px-5 py-20 text-lg leading-relaxed">
        <p><strong>Orders.</strong> Placing an order is an offer to buy; we confirm by email once it ships.</p>
        <p><strong>Delivery.</strong> Free shipping on orders over ₹12,500. Delivery times are estimates.</p>
        <p><strong>Returns.</strong> Unworn items with tags may be returned within 30 days for a full refund.</p>
        <p><strong>Pricing.</strong> Prices are shown in Indian Rupees (INR) and may change without notice.</p>
      </article>
    </>
  ),
});
