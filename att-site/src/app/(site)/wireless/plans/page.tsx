import { pageMetadata } from "@/lib/seo";
import { getOffer, offersBy } from "@/data/offers";
import { PlanCard, PromoCard } from "@/components/offers/OfferCard";
import { AsOf } from "@/components/offers/OfferBits";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { LeadForm } from "@/components/forms/LeadForm";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Unlimited Plans: Elite, Premium, Extra, Value",
  description: "Compare AT&T Elite 2.0, Premium 2.0, Extra 2.0 and Value 2.0: $70, $50, $40 and $30 per line with 4 lines and AutoPay. Full AT&T plan terms included.",
  path: "/wireless/plans",
});

const rows: { label: string; values: string[] }[] = [
  { label: "Price per line, 4 lines", values: ["$70/mo.", "$50/mo.", "$40/mo.", "$30/mo."] },
  { label: "High-speed data", values: ["Can't slow down based on how much you use", "Can't slow down based on how much you use", "100GB, then may slow if the network is busy", "5GB, then may slow if the network is busy"] },
  { label: "Hotspot data per line", values: ["250GB", "100GB", "50GB", "3GB"] },
  { label: "Video streaming", values: ["4K UHD available", "4K UHD available", "Standard definition", "Standard definition"] },
  { label: "Latin America", values: ["Talk, text & high-speed data in 20 countries", "Talk, text & high-speed data in 20 countries", "U.S., Canada & Mexico", "U.S., Canada & Mexico"] },
  { label: "Tablet or watch line", values: ["One tablet and one watch per phone line included", "50% off one tablet or watch per phone line", "Standard rate", "Standard rate"] },
];

export default function WirelessPlansPage() {
  const plans = offersBy("wireless-plan");
  const newLine = getOffer("wireless-new-line-5-off");
  const appreciation = getOffer("wireless-appreciation-savings");
  return (
    <>
      <PageHeader
        trail={[
          { name: "Wireless", path: "/wireless" },
          { name: "Unlimited plans", path: "/wireless/plans" },
        ]}
        eyebrow="AT&T Unlimited Your Way"
        title="AT&T unlimited plans compared"
        intro="AT&T's four Unlimited Your Way plans can be mixed and matched on any line of the same account. Prices below are per line with 4 lines, after the $10/mo. per line AutoPay & paperless bill discount."
      >
        <CheckList
          className="mt-6 text-ink"
          items={[
            "Unlimited talk, text, and data in and between the U.S., Canada, and Mexico",
            "Unlimited texting from the U.S. to 200+ countries",
            "AT&T 5G (compatible plan and device required)",
            "AT&T ActiveArmor mobile security app",
          ]}
        />
      </PageHeader>

      <section className="section" aria-labelledby="plans-grid-title">
        <div className="container-x">
          <SectionHeading eyebrow="Plans" id="plans-grid-title" title="Choose a plan for each line" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((p) => (
              <PlanCard key={p.id} offer={p} featured={p.id === "wireless-elite-2"} badge={p.id === "wireless-elite-2" ? "AT&T's best plan" : undefined} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="plans-table-title">
        <div className="container-x">
          <SectionHeading eyebrow="Side by side" id="plans-table-title" title="What each plan includes" />
          <div className="mt-8 overflow-x-auto rounded-xl" tabIndex={0} role="region" aria-labelledby="plans-table-title">
            <table className="data-table min-w-[52rem] bg-surface">
              <caption className="sr-only">Comparison of AT&amp;T Unlimited Your Way plans</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col">
                      {p.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row">{r.label}</th>
                    {r.values.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            Summary of the plan features listed on att.com. AT&amp;T may temporarily slow data speeds if the network is busy. Taxes and fees extra; monthly AT&amp;T fees apply per line, including an Administrative/Regulatory Cost Recovery Fee of up to $4.99. See each plan&apos;s
            offer details above for AT&amp;T&apos;s complete terms.
          </p>
          <AsOf offer={plans[0]} />
        </div>
      </section>

      <section className="section" aria-labelledby="plans-savings-title">
        <div className="container-x">
          <SectionHeading eyebrow="Ways to save" id="plans-savings-title" title="Current AT&T plan discounts" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <PromoCard offer={newLine} />
            <PromoCard offer={appreciation} />
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="plans-lead-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <SectionHeading eyebrow="Help choosing" id="plans-lead-title" title="Not sure which plan fits each line?" intro="Request a call back and a specialist will compare the plans for your household, including any discounts you may qualify for." />
          <LeadForm offerId={plans[0].id} value={plans[0].price!.amount} defaultInterest="AT&T Wireless" headingLevel="h3" />
        </div>
      </section>

      <CallBand placement="plans-band" title="Talk through AT&T unlimited plans" text="A specialist can price a mix of plans for your lines and explain AT&T's current offers." offerId={plans[0].id} value={plans[0].price!.amount} />
      <JsonLd data={offersJsonLd(plans, "/wireless/plans")} />
    </>
  );
}
