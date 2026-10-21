import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PlanCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { LeadForm } from "@/components/forms/LeadForm";
import { AsOf, FinePrint, formatMoney } from "@/components/offers/OfferBits";
import { AirIcon, ShieldIcon, WifiIcon } from "@/components/ui/Icons";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Internet Air 5G Home Internet: $55/mo.",
  description: "AT&T Internet Air delivers home internet over AT&T's 5G network for $55/mo. with AutoPay & Paperless bill. No annual contract. See AT&T's full offer terms.",
  path: "/internet/internet-air",
});

export default function InternetAirPage() {
  const air = getOffer("internet-air");
  const faqs = faqsFor("air");
  return (
    <>
      <PageHeader
        trail={[
          { name: "Internet", path: "/internet" },
          { name: "AT&T Internet Air", path: "/internet/internet-air" },
        ]}
        eyebrow="AT&T Internet Air"
        title="AT&T Internet Air 5G home internet"
        intro="Home internet delivered over AT&T's 5G wireless network. It uses the included AT&T All-Fi Hub, needs no technician and has no annual contract. Availability depends on AT&T 5G coverage at your address."
        aside={
          <div className="card card-featured p-6">
            <p className="text-lg font-bold text-ink">{air.title}</p>
            <p className="mt-2 text-ink">
              <span className="text-4xl font-extrabold tracking-tight">{formatMoney(air.price!.amount)}</span>
              <span className="font-semibold text-ink-muted">/mo.</span> <span className="text-sm font-semibold">{air.price!.qualifier}</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">{air.conditions.join(" · ")}</p>
            <AsOf offer={air} />
            <FinePrint offer={air} />
            <PhoneLink placement="air-header" offerId={air.id} value={air.price!.amount} className="btn btn-primary mt-4 w-full" prefix="Call" />
          </div>
        }
      />

      <section className="section" aria-labelledby="air-plan-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="One plan" id="air-plan-title" title="Straightforward pricing" intro="AT&T offers one AT&T Internet Air plan for home use." />
            <ul className="mt-8 grid gap-5">
              {[
                { icon: WifiIcon, t: "Complete Wi-Fi", d: "Complete Wi-Fi for enhanced coverage, speed, and security, using the AT&T All-Fi Hub." },
                { icon: AirIcon, t: "$0 self-setup", d: "Plug in your AT&T All-Fi Hub and connect in minutes. No technician appointment." },
                { icon: ShieldIcon, t: "No annual contract", d: "No overage fees and no annual contract. AT&T may temporarily slow data speeds if the network is busy." },
              ].map((f) => (
                <li key={f.t} className="flex gap-4" data-reveal>
                  <f.icon className="h-8 w-8 shrink-0 text-brand-strong" />
                  <div>
                    <h3 className="font-bold text-ink">{f.t}</h3>
                    <p className="text-ink-muted">{f.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <PlanCard offer={air} featured />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="air-fit-title">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Is it right for you?"
            id="air-fit-title"
            title="When AT&T Internet Air makes sense"
            intro="AT&T describes Internet Air as a fixed wireless alternative to traditional wired or cable internet, and states that it will always offer its best deal on the fastest internet service available at your address."
          />
          <div className="card p-6" data-reveal>
            <CheckList
              className="text-ink"
              items={[
                "Your address is served by AT&T 5G but not by AT&T Fiber",
                "You prefer a self-installed connection without a technician visit",
                "You want home internet without an annual contract",
              ]}
            />
            <p className="mt-5 text-sm text-ink-muted">
              Need faster speeds? <Link href="/internet/fiber" className="link">Compare AT&amp;T Fiber plans</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="air-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="Questions" id="air-faq-title" title="AT&T Internet Air FAQ" />
          <FaqList items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="air-lead-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <SectionHeading eyebrow="Availability" id="air-lead-title" title="Check AT&T Internet Air at your address" intro="A specialist will confirm whether AT&T Internet Air or AT&T Fiber is available where you live." />
          <LeadForm offerId={air.id} value={air.price!.amount} defaultInterest="AT&T Internet Air" headingLevel="h3" />
        </div>
      </section>

      <CallBand placement="air-band" title="Questions about AT&T Internet Air?" text="Speak with a specialist about AT&T Internet Air and the other AT&T services available at your address." offerId={air.id} value={air.price!.amount} />
      <JsonLd data={offersJsonLd([air], "/internet/internet-air")} />
    </>
  );
}
