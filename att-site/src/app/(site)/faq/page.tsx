import { pageMetadata } from "@/lib/seo";
import { faqs } from "@/data/faq";
import { CallBand, FaqList, PageHeader } from "@/components/ui/Sections";
import { JsonLd, faqJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Fiber, Internet Air & Wireless FAQ",
  description: "Answers about AT&T Fiber, AT&T Internet Air, AT&T wireless plans and AT&T Phone: pricing, AutoPay, availability, installation, contracts and this retailer.",
  path: "/faq",
});

const sections = [
  { id: "faq-general", title: "About This Website", topics: ["general"] },
  { id: "faq-internet", title: "AT&T Fiber and AT&T Internet Air", topics: ["internet", "fiber", "air"] },
  { id: "faq-wireless", title: "AT&T Wireless", topics: ["wireless"] },
  { id: "faq-phone", title: "AT&T Phone", topics: ["phone"] },
] as const;

export default function FaqPage() {
  const used = new Set<string>();
  const grouped = sections.map((s) => {
    const items = faqs.filter((f) => !used.has(f.q) && f.topics.some((t) => (s.topics as readonly string[]).includes(t)));
    items.forEach((f) => used.add(f.q));
    return { ...s, items };
  });
  return (
    <>
      <PageHeader trail={[{ name: "FAQ", path: "/faq" }]} image="faqHero" eyebrow="Support" title="Frequently Asked Questions" intro="Answers to common questions about AT&T plans, pricing, availability and installation." />
      <div className="container-x py-12 md:py-16">
        <div className="grid gap-14">
          {grouped.map((g) => (
            <section key={g.id} aria-labelledby={g.id}>
              <h2 id={g.id} className="mb-6 text-2xl font-bold text-ink">
                {g.title}
              </h2>
              <FaqList items={g.items.map((f) => ({ q: f.q, a: f.a }))} />
            </section>
          ))}
        </div>
      </div>
      <CallBand placement="faq-band" title="Have Another Question?" text="Call to speak with a specialist about AT&T plans, pricing and availability at your address." />
      <JsonLd data={faqJsonLd(faqs.map((f) => ({ q: f.q, a: f.a })))} />
    </>
  );
}
