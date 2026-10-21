import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { AsOf, FinePrint, formatMoney } from "@/components/offers/OfferBits";
import { CallBand, CheckList, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Fiber Internet Plans & Prices | Authorized Retailer",
  description: "AT&T Fiber plans from $50/mo. with AutoPay: Internet 300, 500, 1000 and 5000, with lower pricing when combined with an eligible AT&T wireless plan.",
  path: "/internet/fiber",
});

export default function FiberPage() {
  const tiers = offersBy("fiber");
  const featured = getOffer("fiber-1000");
  const allFiPro = getOffer("all-fi-pro");
  const bundle = getOffer("bundle-fiber-wireless");
  const faqs = faqsFor("fiber");
  return (
    <>
      <PageHeader
        trail={[
          { name: "Internet", path: "/internet" },
          { name: "AT&T Fiber", path: "/internet/fiber" },
        ]}
        image="fiberHero"
        eyebrow="AT&T Fiber"
        title="AT&T Fiber Internet Plans"
        intro="Fiber-optic home internet with equal upload and download speeds, up to 5 GIG where available. Pricing is reduced when combined with an eligible AT&T wireless plan."
        aside={
          <div className="card card-featured p-6">
            <p className="badge">Featured Offer</p>
            <p className="mt-3 text-lg font-bold text-ink">
              {featured.title} · {featured.speed}
            </p>
            <p className="mt-2 text-ink">
              <span className="text-4xl font-extrabold tracking-tight">{formatMoney(featured.price!.amount)}</span>
              <span className="font-semibold text-ink-muted">/mo.</span> <span className="text-sm font-semibold">{featured.price!.qualifier}</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {featured.altPrice!.label}: {formatMoney(featured.altPrice!.price.amount)}/mo. · {formatMoney(featured.price!.thenAmount!)}/mo. after 12 months · Plus taxes &amp; fees
            </p>
            <AsOf offer={featured} />
            <FinePrint offer={featured} />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <PhoneLink placement="fiber-header" offerId={featured.id} value={featured.price!.amount} className="btn btn-primary" label="Call Now" />
              <a href="#plans" className="btn btn-secondary">
                Compare Speeds
              </a>
            </div>
          </div>
        }
      >
        <CheckList
          className="mt-6 text-ink"
          items={["Equal upload and download speeds", "No annual contract and no data caps", "AT&T All-Fi Wi-Fi included with every plan", "Reduced pricing with an eligible AT&T unlimited wireless plan"]}
        />
      </PageHeader>

      <section id="plans" className="section scroll-mt-28" aria-labelledby="plans-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Plans and Pricing"
            id="plans-title"
            title="AT&T Fiber Speed Tiers"
            intro="Prices include the $10/mo. AutoPay & Paperless bill discount. Internet 500, 1000 and 5000 include a 12-month discount for new customers, after which the regular rate applies."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((t) => (
              <PlanCard key={t.id} offer={t} featured={t.id === "fiber-1000"} badge={t.id === "fiber-1000" ? "Featured" : undefined} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="table-title">
        <div className="container-x">
          <SectionHeading eyebrow="Comparison" id="table-title" title="AT&T Fiber Pricing at a Glance" intro="Monthly prices, plus taxes and fees." />
          <div className="mt-8 overflow-x-auto rounded-xl" tabIndex={0} role="region" aria-label="AT&T Fiber price table (scrolls horizontally on small screens)">
            <table className="data-table min-w-[44rem] bg-surface">
              <caption className="sr-only">AT&amp;T Fiber monthly prices by plan</caption>
              <thead>
                <tr>
                  <th scope="col">Plan</th>
                  {tiers.map((t) => (
                    <th key={t.id} scope="col">
                      {t.title.replace("AT&T ", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Speed</th>
                  {tiers.map((t) => (
                    <td key={t.id}>{t.speed}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">With AutoPay &amp; Paperless bill</th>
                  {tiers.map((t) => (
                    <td key={t.id}>
                      {formatMoney(t.price!.amount)}/mo.{t.price!.thenAmount ? " for 12 mos." : ""}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">With an eligible AT&amp;T wireless plan</th>
                  {tiers.map((t) => (
                    <td key={t.id}>
                      {formatMoney(t.altPrice!.price.amount)}/mo.{t.price!.thenAmount ? " for 12 mos." : ""}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">After 12 months</th>
                  {tiers.map((t) => (
                    <td key={t.id}>{t.price!.thenAmount ? `${formatMoney(t.price!.thenAmount)}/mo.` : "No change"}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Price before discounts</th>
                  {tiers.map((t) => (
                    <td key={t.id}>{formatMoney(t.price!.was!)}/mo.</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            Speeds are based on a wired connection; actual speeds may vary. For 5 GIG, the single-device wired speed maximum is 4.7 Gbps. An installation fee of up to $99 may apply. Complete offer
            details appear with each plan above.
          </p>
          <AsOf offer={featured} />
        </div>
      </section>

      <section className="section" aria-labelledby="extras-title">
        <div className="container-x">
          <SectionHeading eyebrow="Add-Ons and Savings" id="extras-title" title="Wi-Fi Upgrades and Bundle Savings" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <PromoCard offer={allFiPro} />
            <PromoCard offer={bundle} />
          </div>
          <p className="mt-6 text-ink-muted">
            Pair AT&amp;T Fiber with a wireless plan: <Link href="/wireless/plans" className="link">compare AT&amp;T unlimited plans</Link>.
          </p>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="fiber-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading eyebrow="AT&T Fiber" id="fiber-faq-title" title="Frequently Asked Questions" />
            <Link href="/faq" className="link mt-6 inline-block font-semibold">
              View All FAQs
            </Link>
          </div>
          <FaqList items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <CallBand placement="fiber-band" title="Confirm AT&T Fiber at Your Address" text="AT&T Fiber availability is confirmed by street address. Call to confirm the speeds, pricing and wireless discount available to you." offerId={featured.id} value={featured.price!.amount} />
      <JsonLd data={offersJsonLd(tiers, "/internet/fiber")} />
    </>
  );
}
