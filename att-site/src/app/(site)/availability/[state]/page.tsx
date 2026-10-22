import Link from "@/components/ui/AppLink";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { offersBy } from "@/data/offers";
import { fiberStates, getFiberState } from "@/data/states";
import { PlanCard } from "@/components/offers/OfferCard";
import { formatAsOf } from "@/components/offers/OfferBits";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { ZipCheck } from "@/components/forms/ZipCheck";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

/** One page per state where att.com publishes an AT&T Fiber state page (src/data/states.ts). */
export const dynamicParams = false;

export function generateStaticParams() {
  return fiberStates.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const s = getFiberState((await params).state);
  if (!s) return {};
  return pageMetadata({
    title: `AT&T Fiber in ${s.state}: Plans & Availability`,
    description: `AT&T lists AT&T Fiber service areas in ${s.state}, including ${s.cities.slice(0, 3).join(", ")}. Compare AT&T Fiber plans and call to confirm service at your address.`.slice(0, 159),
    path: `/availability/${s.slug}`,
  });
}

export default async function FiberStatePage({ params }: { params: Promise<{ state: string }> }) {
  const s = getFiberState((await params).state);
  if (!s) notFound();
  const tiers = offersBy("fiber");
  const path = `/availability/${s.slug}`;
  return (
    <>
      <PageHeader
        trail={[
          { name: "Availability by state", path: "/availability" },
          { name: s.state, path },
        ]}
        image="availabilityHero"
        eyebrow={`AT&T Fiber · ${s.state}`}
        title={`AT&T Fiber in ${s.state}`}
        intro={`AT&T publishes AT&T Fiber service areas in ${s.state}. Availability is limited to select areas and is confirmed for each street address, so call to check the speeds and pricing at yours.`}
      >
        <CheckList className="mt-6 text-ink" items={["Speeds up to 5 GIG where available", "Equal upload and download speeds", "Reduced pricing with an eligible AT&T unlimited wireless plan"]} />
      </PageHeader>

      <section className="section" aria-labelledby="state-cities-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Service Areas" id="state-cities-title" title={`${s.state} Cities Listed by AT&T`} />
            <p className="mt-4 text-ink-muted">
              These cities appear in AT&amp;T&rsquo;s {s.state} AT&amp;T Fiber directory. Availability varies within each city and is limited to select areas.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-ink sm:grid-cols-3">
              {s.cities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="as-of mt-6">
              Source:{" "}
              <a href={s.sourceUrl} target="_blank" rel="noopener" className="link inline-block min-h-6 py-0.5">
                AT&amp;T Fiber in {s.state} on att.com
              </a>
              , retrieved <time dateTime={s.retrievedAt}>{formatAsOf(s.retrievedAt)}</time>
            </p>
          </div>
          <div className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-ink">Check Your Address</h2>
            <p className="mt-2 text-ink-muted">Enter your ZIP code to begin.</p>
            <div className="mt-5">
              <ZipCheck placement={`state-${s.slug}-zip`} offerId="fiber-1000" value={70} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="state-plans-title">
        <div className="container-x">
          <SectionHeading eyebrow="Plans and Pricing" id="state-plans-title" title="AT&T Fiber Plans" intro="AT&T's published prices; the plans offered at your address are confirmed when you call." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tiers.map((t) => (
              <PlanCard key={t.id} offer={t} featured={t.id === "fiber-1000"} badge={t.id === "fiber-1000" ? "Featured" : undefined} />
            ))}
          </div>
          <p className="mt-6">
            <Link href="/availability" className="link font-semibold">
              AT&amp;T Fiber in Other States
            </Link>
          </p>
        </div>
      </section>

      <CallBand placement={`state-${s.slug}-band`} title={`Confirm AT&T Fiber in ${s.state}`} text="AT&T Fiber availability is confirmed by street address. Call to confirm the services and pricing available at your address." offerId="fiber-1000" value={70} />
      <JsonLd data={offersJsonLd(tiers, path)} />
    </>
  );
}
