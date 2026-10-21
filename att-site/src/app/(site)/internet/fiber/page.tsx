import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { AsOf, FinePrint, formatMoney } from "@/components/offers/OfferBits";
import { CallBand, CheckList, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { CtaLink } from "@/components/ui/CtaLink";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Fiber Internet Plans & Prices | Authorized Retailer",
  description: "AT&T Fiber plans from $50/mo. with AutoPay: Internet 300, 500, 1000 and 5000, with and without an AT&T wireless plan. Prices verified on att.com.",
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
        eyebrow="AT&T Fiber"
        title="AT&T Fiber internet plans"
        intro="Fiber-optic home internet from AT&T with equal upload and download speeds, up to 5 GIG where available. Compare all four speeds and see how an eligible AT&T wireless plan lowers the price."
        aside={
          <div className="card card-featured p-6">
            <p className="badge">AT&amp;T&apos;s featured fiber offer</p>
            <p className="mt-3 text-lg font-bold text-ink">{featured.title} · {featured.speed}</p>
            <p className="mt-2 text-ink">
              <span className="text-4xl font-extrabold tracking-tight">{formatMoney(featured.price!.amount)}</span>
              <span className="font-semibold text-ink-muted">/mo.</span> <span className="text-sm font-semibold">{featured.price!.qualifier}</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {featured.altPrice!.label}: {formatMoney(featured.altPrice!.price.amount)}/mo. · Then {formatMoney(featured.price!.thenAmount!)}/mo. after 12 months · Plus taxes &amp; fees
            </p>
            <AsOf offer={featured} />
            <FinePrint offer={featured} />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <PhoneLink placement="fiber-header" offerId={featured.id} value={featured.price!.amount} className="btn btn-primary" prefix="Call" />
              <a href="#plans" className="btn btn-secondary">
                Compare all speeds
              </a>
            </div>
          </div>
        }
      >
        <CheckList
          className="mt-6 text-ink"
          items={["Equal upload and download speeds", "No annual contract and no data caps, per AT&T", "AT&T All-Fi Wi-Fi included with every fiber plan", "Lower price with an eligible AT&T unlimited wireless plan"]}
        />
      </PageHeader>

      <section id="plans" className="section scroll-mt-28" aria-labelledby="plans-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Speeds and prices"
            id="plans-title"
            title="Choose an AT&T Fiber speed"
            intro="Prices include AT&T's $10/mo. AutoPay & Paperless bill discount. Internet 500, 1000 and 5000 also include AT&T's 12-month new-customer discount; the regular rate applies afterwards."
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
          <SectionHeading eyebrow="At a glance" id="table-title" title="AT&T Fiber prices side by side" intro="Monthly prices published on att.com, plus taxes and fees." />
          <div className="mt-8 overflow-x-auto rounded-xl" tabIndex={0} role="region" aria-labelledby="table-title">
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
                  <th scope="row">Speed (as labelled by AT&amp;T)</th>
                  {tiers.map((t) => (
                    <td key={t.id}>{t.speed}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Price with AutoPay &amp; Paperless bill</th>
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
                  <th scope="row">After the 12-month discount</th>
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
            Speeds are based on a wired connection; actual speeds may vary. For 5 GIG, AT&amp;T states a single-device wired speed maximum of 4.7 Gbps. Up to $99 installation fee may apply. See each
            plan&apos;s offer details above for AT&amp;T&apos;s complete terms.
          </p>
          <AsOf offer={featured} />
        </div>
      </section>

      <section className="section" aria-labelledby="extras-title">
        <div className="container-x">
          <SectionHeading eyebrow="Add-ons and savings" id="extras-title" title="Upgrade your Wi-Fi or bundle with wireless" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <PromoCard offer={allFiPro} />
            <PromoCard offer={bundle} />
          </div>
          <p className="mt-6 text-ink-muted">
            Looking for wireless plans to pair with AT&amp;T Fiber? <Link href="/wireless/plans" className="link">Compare AT&amp;T unlimited plans</Link>.
          </p>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="fiber-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading eyebrow="AT&T Fiber questions" id="fiber-faq-title" title="Frequently asked questions" />
            <CtaLink href="/faq" cta="fiber-faq-all" variant="secondary" className="mt-6">
              All questions
            </CtaLink>
          </div>
          <FaqList items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <section className="section" aria-labelledby="fiber-lead-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <SectionHeading
            eyebrow="Availability"
            id="fiber-lead-title"
            title="Find out whether AT&T Fiber serves your address"
            intro="AT&T confirms fiber availability for each address. Request a call back and a specialist will confirm the speeds and prices available to you."
          />
          <LeadForm offerId={featured.id} value={featured.price!.amount} defaultInterest="AT&T Fiber" headingLevel="h3" />
        </div>
      </section>

      <CallBand placement="fiber-band" title="Questions about AT&T Fiber?" text="A specialist can confirm the AT&T Fiber speeds available at your address and the bundle discount you qualify for." offerId={featured.id} value={featured.price!.amount} />
      <JsonLd data={offersJsonLd(tiers, "/internet/fiber")} />
    </>
  );
}
