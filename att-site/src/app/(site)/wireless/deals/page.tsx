import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { PromoCard } from "@/components/offers/OfferCard";
import { CallBand, PageHeader, SectionHeading } from "@/components/ui/Sections";

export const metadata = pageMetadata({
  title: "AT&T Phone Deals: iPhone & Samsung Trade-In Offers",
  description: "Current AT&T phone deals: up to $1,200 off iPhone 18 Pro, iPhone Duo and Samsung Galaxy Z Flip8 or Fold8 with an eligible trade-in.",
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
        image="phoneDealsHero"
        eyebrow="Smartphone Offers"
        title="AT&T Smartphone Deals and Trade-In Offers"
        intro="Current AT&T smartphone offers for new and existing customers. Device credits are applied over a 0% APR 36-month installment agreement and depend on the selected plan and the value of the trade-in device."
      />

      <section className="section" aria-labelledby="devices-title">
        <div className="container-x">
          <SectionHeading eyebrow="Trade-In Offers" id="devices-title" title="New iPhone and Samsung Galaxy Offers" intro="The maximum credit requires an eligible trade-in and an eligible unlimited plan. Lower credits apply to other plans, as described in each offer's details." />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {devices.map((d) => (
              <PromoCard key={d.id} offer={d} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="more-deals-title">
        <div className="container-x">
          <SectionHeading eyebrow="Line and Switching Offers" id="more-deals-title" title="Savings on New Lines and Switching" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((d) => (
              <PromoCard key={d.id} offer={d} />
            ))}
          </div>
          <p className="mt-8 text-ink-muted">
            <Link href="/deals" className="link">View all current AT&amp;T deals</Link>.
          </p>
        </div>
      </section>

      <CallBand placement="phone-deals-band" title="Confirm Your Smartphone Offer" text="Trade-in credits depend on the selected plan, the trade-in device and whether a line is added or upgraded." offerId={iphone.id} />
    </>
  );
}
