import { pageMetadata } from "@/lib/seo";
import { offers } from "@/data/offers";
import type { OfferCategory } from "@/data/offer-types";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { CallBand, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Current AT&T Deals & Promotions | Authorized Retailer",
  description: "Current AT&T promotions and plan pricing for AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone, with offer details and eligibility requirements.",
  path: "/deals",
});

const groups: { title: string; id: string; categories: OfferCategory[]; intro: string }[] = [
  { title: "AT&T Fiber", id: "deals-fiber", categories: ["fiber"], intro: "Includes AT&T's 12-month discount on Internet 500, 1000 and 5000 and the lower price with an eligible AT&T wireless plan." },
  { title: "Bundles and Add-Ons", id: "deals-bundle", categories: ["bundle", "add-on"], intro: "Save on AT&T Fiber with an eligible wireless plan, or upgrade the Wi-Fi equipment." },
  { title: "AT&T Internet Air", id: "deals-air", categories: ["internet-air"], intro: "5G home internet with one simple plan." },
  { title: "AT&T Wireless Plans", id: "deals-wireless-plans", categories: ["wireless-plan"], intro: "Per line with 4 lines, after the AutoPay & paperless bill discount." },
  { title: "AT&T Wireless Promotions", id: "deals-wireless-promos", categories: ["wireless-promo"], intro: "Switching offers, new-line discounts, phone trade-in offers and group savings." },
  { title: "AT&T Phone", id: "deals-phone", categories: ["phone"], intro: "12-month prices for new residential AT&T Phone customers." },
];

export default function DealsPage() {
  return (
    <>
      <PageHeader
        trail={[{ name: "Deals", path: "/deals" }]}
        image="dealsHero"
        eyebrow="Current Offers"
        title="Current AT&T Deals and Promotions"
        intro="AT&T promotions on home internet, wireless and home phone service. Offer details and eligibility requirements appear with each promotion."
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

      <CallBand placement="deals-band" title="Confirm Your Eligibility" text="Eligibility depends on your address, current services and selected plans. Call to confirm the offers available to you." />
      <JsonLd data={offersJsonLd(offers, "/deals")} />
    </>
  );
}
