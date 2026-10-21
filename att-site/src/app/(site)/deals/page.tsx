import { pageMetadata } from "@/lib/seo";
import { offers, offersVerifiedAt } from "@/data/offers";
import type { OfferCategory } from "@/data/offer-types";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { formatAsOf } from "@/components/offers/OfferBits";
import { CallBand, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Current AT&T Deals & Promotions | Authorized Retailer",
  description: "Every current AT&T promotion and plan price in one place: AT&T Fiber, Internet Air, wireless, switching offers and AT&T Phone, each dated and with full terms.",
  path: "/deals",
});

const groups: { title: string; id: string; categories: OfferCategory[]; intro: string }[] = [
  { title: "AT&T Fiber", id: "deals-fiber", categories: ["fiber"], intro: "Includes AT&T's 12-month discount on Internet 500, 1000 and 5000 and the lower price with an eligible AT&T wireless plan." },
  { title: "Bundles and add-ons", id: "deals-bundle", categories: ["bundle", "add-on"], intro: "Save on AT&T Fiber with an eligible wireless plan, or upgrade the Wi-Fi equipment." },
  { title: "AT&T Internet Air", id: "deals-air", categories: ["internet-air"], intro: "5G home internet with one simple plan." },
  { title: "AT&T wireless plans", id: "deals-wireless-plans", categories: ["wireless-plan"], intro: "Per line with 4 lines, after the AutoPay & paperless bill discount." },
  { title: "AT&T wireless promotions", id: "deals-wireless-promos", categories: ["wireless-promo"], intro: "Switching offers, new-line discounts, phone trade-in offers and group savings." },
  { title: "AT&T Phone", id: "deals-phone", categories: ["phone"], intro: "12-month prices for new residential AT&T Phone customers." },
];

export default function DealsPage() {
  return (
    <>
      <PageHeader
        trail={[{ name: "Deals", path: "/deals" }]}
        eyebrow="Current AT&T deals"
        title="All current AT&T deals and promotions"
        intro={
          <>
            Every AT&amp;T price and promotion shown on this site, grouped by service. Each one is stamped with the date it was verified on att.com and includes AT&amp;T&apos;s complete offer terms. Last
            verified <time dateTime={offersVerifiedAt}>{formatAsOf(offersVerifiedAt)}</time>.
          </>
        }
      >
        <nav aria-label="Deal categories" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="badge hover:underline">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {groups.map((g, i) => {
        const list = offers.filter((o) => g.categories.includes(o.category));
        return (
          <section key={g.id} id={g.id} className={`section scroll-mt-28 ${i % 2 ? "section-alt" : ""}`} aria-labelledby={`${g.id}-title`}>
            <div className="container-x">
              <SectionHeading id={`${g.id}-title`} title={g.title} intro={g.intro} />
              <div className={`mt-10 grid gap-6 md:grid-cols-2 ${list.length >= 4 ? "xl:grid-cols-4" : list.length === 3 ? "lg:grid-cols-3" : ""}`}>
                {list.map((o) => (o.price && o.category !== "add-on" ? <PlanCard key={o.id} offer={o} /> : <PromoCard key={o.id} offer={o} />))}
              </div>
            </div>
          </section>
        );
      })}

      <CallBand placement="deals-band" title="Which AT&T offers apply to you?" text="Eligibility depends on your address, your current services and the plans you choose. A specialist can confirm it with you." />
      <JsonLd data={offersJsonLd(offers, "/deals")} />
    </>
  );
}
