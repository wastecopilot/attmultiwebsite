import Link from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { offersBy } from "@/data/offers";
import { faqsFor } from "@/data/faq";
import type { Offer } from "@/data/offer-types";
import { PlanCard } from "@/components/offers/OfferCard";
import { formatMoney } from "@/components/offers/OfferBits";
import { CallBand, CheckList, FaqList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { GuaranteeSection } from "@/components/ui/GuaranteeSection";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

/** One page per AT&T Fiber tier, e.g. /internet/fiber/internet-1000, built from the fiber offers in offers.ts. */
export const dynamicParams = false;

const tierSlug = (o: Offer) => o.id.replace(/^fiber-/, "internet-");
const findTier = (slug: string) => offersBy("fiber").find((o) => tierSlug(o) === slug);

export function generateStaticParams() {
  return offersBy("fiber").map((o) => ({ tier: tierSlug(o) }));
}

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }) {
  const offer = findTier((await params).tier);
  if (!offer?.price) return {};
  return pageMetadata({
    title: `${offer.title}: ${offer.speed} | AT&T Fiber`,
    description: `${offer.title} (${offer.speed}) is ${formatMoney(offer.price.amount)}/mo. ${offer.price.qualifier}, plus taxes and fees. See conditions, features and AT&T's offer details.`.slice(0, 159),
    path: `/internet/fiber/${tierSlug(offer)}`,
  });
}

export default async function FiberTierPage({ params }: { params: Promise<{ tier: string }> }) {
  const offer = findTier((await params).tier);
  if (!offer?.price) notFound();
  const price = offer.price;
  const others = offersBy("fiber").filter((o) => o.id !== offer.id);
  const path = `/internet/fiber/${tierSlug(offer)}`;
  return (
    <>
      <PageHeader
        trail={[
          { name: "Internet", path: "/internet" },
          { name: "AT&T Fiber", path: "/internet/fiber" },
          { name: offer.title, path },
        ]}
        image="fiberHero"
        eyebrow={`AT&T Fiber · ${offer.speed}`}
        title={offer.title}
        intro={`${offer.title} (${offer.speed ?? "AT&T Fiber"}) is ${formatMoney(price.amount)}/mo. ${price.qualifier}${
          price.thenAmount ? `, then ${formatMoney(price.thenAmount)}/mo.` : ""
        }. Plus taxes and fees.`}
        aside={<PlanCard offer={offer} featured headingLevel="h2" />}
      >
        <CheckList className="mt-6 text-ink" items={["Equal upload and download speeds", "No annual contract and no data caps", "AT&T All-Fi Wi-Fi included with every plan"]} />
      </PageHeader>

      {offer.features?.length ? (
        <section className="section" aria-labelledby="tier-features-title">
          <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-start">
            <SectionHeading eyebrow="Plan Features" id="tier-features-title" title={`What ${offer.title} Includes`} />
            <CheckList className="text-ink" items={offer.features} />
          </div>
        </section>
      ) : null}

      <section className="section section-alt" aria-labelledby="tier-compare-title">
        <div className="container-x">
          <SectionHeading eyebrow="Compare" id="tier-compare-title" title="Other AT&T Fiber Speeds" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.id}>
                <Link href={`/internet/fiber/${tierSlug(o)}`} className="card block p-5 hover:border-brand-strong">
                  <span className="block text-sm font-semibold tracking-wide text-ink-muted uppercase">{o.speed}</span>
                  <span className="mt-1 block text-lg font-bold text-ink">{o.title}</span>
                  {o.price ? (
                    <span className="mt-1 block text-ink-muted">
                      {formatMoney(o.price.amount)}/mo. {o.price.qualifier}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/internet/fiber" className="link font-semibold">
              Compare All AT&amp;T Fiber Plans
            </Link>
          </p>
        </div>
      </section>

      <GuaranteeSection id="tier-guarantee-title" items={["internet", "backup"]} />

      <section className="section section-alt" aria-labelledby="tier-faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="AT&T Fiber" id="tier-faq-title" title="Frequently Asked Questions" />
          <FaqList items={faqsFor("fiber").map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </section>

      <CallBand placement="fiber-tier-band" title={`Confirm ${offer.title} at Your Address`} text="AT&T Fiber availability is confirmed by street address. Call to confirm the speeds and pricing available at your address." offerId={offer.id} value={price.amount} />
      <JsonLd data={offersJsonLd([offer], path)} />
    </>
  );
}
