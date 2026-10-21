import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import { PlanCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { AsOf, FinePrint, formatMoney } from "@/components/offers/OfferBits";
import { AirIcon, ShieldIcon, WifiIcon } from "@/components/ui/Icons";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "AT&T Internet Air 5G Home Internet: $55/mo.",
  description: "AT&T Internet Air delivers home internet over the AT&T 5G network for $55/mo. with AutoPay & Paperless bill. Self-setup and no annual contract.",
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
        image="airHero"
        eyebrow="AT&T Internet Air"
        title="AT&T Internet Air 5G Home Internet"
        intro="Home internet delivered over the AT&T 5G network. Service uses the included AT&T All-Fi Hub, requires no technician visit and has no annual contract. Availability depends on AT&T 5G coverage at your address."
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
            <PhoneLink placement="air-header" offerId={air.id} value={air.price!.amount} className="btn btn-primary mt-4 w-full" label="Call Now" />
          </div>
        }
      />

      <section className="section" aria-labelledby="air-plan-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Plan Overview" id="air-plan-title" title="Straightforward Pricing" intro="AT&T offers a single AT&T Internet Air plan for residential service." />
            <ul className="mt-8 grid gap-5">
              {[
                { icon: WifiIcon, t: "Complete Wi-Fi Coverage", d: "The AT&T All-Fi Hub provides Wi-Fi coverage, speed and security throughout the home." },
                { icon: AirIcon, t: "$0 Self-Setup", d: "Plug in the AT&T All-Fi Hub and connect in minutes, with no technician appointment." },
                { icon: ShieldIcon, t: "No Annual Contract", d: "No overage fees and no annual contract. AT&T may temporarily slow data speeds when the network is busy." },
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
            eyebrow="Service Fit"
            id="air-fit-title"
            title="When AT&T Internet Air Is the Right Choice"
            intro="AT&T describes Internet Air as a fixed wireless alternative to traditional wired or cable internet. AT&T states that it offers its best deal on the fastest internet service available at each address."
          />
          <div className="card p-6" data-reveal>
            <CheckList
              className="text-ink"
              items={["Your address is served by AT&T 5G but not by AT&T Fiber", "You prefer a self-installed connection without a technician visit", "You want home internet without an annual contract"]}
            />
            <p className="mt-5 text-sm text-ink-muted">
              For higher speeds, <Link href="/internet/fiber" className="link">compare AT&amp;T Fiber plans</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="air-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="AT&T Internet Air" id="air-faq-title" title="Frequently Asked Questions" />
          <FaqList items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <CallBand placement="air-band" title="Confirm AT&T Internet Air at Your Address" text="Call to confirm whether AT&T Internet Air or AT&T Fiber is available at your address." offerId={air.id} value={air.price!.amount} />
      <JsonLd data={offersJsonLd([air], "/internet/internet-air")} />
    </>
  );
}
