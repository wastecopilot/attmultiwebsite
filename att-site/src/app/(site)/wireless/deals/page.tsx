import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { PromoCard } from "@/components/offers/OfferCard";
import { CallBand, PageHeader, SectionHeading } from "@/components/ui/Sections";

export const metadata = pageMetadata({
  title: "AT&T Phone Deals: iPhone & Samsung Trade-In Offers",
  description: "Current AT&T phone deals: up to $1,200 off iPhone 18 Pro, iPhone Duo and Samsung Galaxy Z Flip8 or Fold8 with an eligible trade-in. Full AT&T terms.",
  path: "/wireless/deals",
});

export default function PhoneDealsPage() {
  const devices = [getOffer("wireless-trade-in-iphone-18"), getOffer("wireless-trade-in-samsung-z8")];
  const more = [getOffer("wireless-new-line-5-off"), getOffer("wireless-switch-reward-800"), getOffer("wireless-byod-credit-360")];
  const iphone = devices[0];
  return (
    <>
      <PageHeader
        trail={[
          { name: "Wireless", path: "/wireless" },
          { name: "Phone deals", path: "/wireless/deals" },
        ]}
        eyebrow="AT&T phone deals"
        title="AT&T phone deals and trade-in offers"
        intro="AT&T's current smartphone offers for new and existing customers. Device credits are applied over a 0% APR 36-month installment agreement and depend on the plan and the value of the phone you trade in."
      />

      <section className="section" aria-labelledby="devices-title">
        <div className="container-x">
          <SectionHeading eyebrow="Trade-in offers" id="devices-title" title="New iPhone and Samsung Galaxy offers" intro="The maximum credit requires an eligible trade-in and an eligible unlimited plan. Lower credits apply on other plans; the full tiers are in each offer's details." />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {devices.map((d) => (
              <PromoCard key={d.id} offer={d} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="more-deals-title">
        <div className="container-x">
          <SectionHeading eyebrow="Line and switching offers" id="more-deals-title" title="Savings on new lines and switching" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((d) => (
              <PromoCard key={d.id} offer={d} />
            ))}
          </div>
          <p className="mt-8 text-ink-muted">
            See every current offer on one page: <Link href="/deals" className="link">all AT&amp;T deals</Link>.
          </p>
        </div>
      </section>

      <CallBand placement="phone-deals-band" title="Ask which phone offers you qualify for" text="Trade-in credits depend on your plan, your current phone and whether you add a line or upgrade." offerId={iphone.id} />
    </>
  );
}
