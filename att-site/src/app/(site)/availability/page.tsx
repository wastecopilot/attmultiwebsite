import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { fiberStates } from "@/data/states";
import { CallBand, PageHeader, SectionHeading } from "@/components/ui/Sections";

export const metadata = pageMetadata({
  title: "AT&T Fiber Availability by State",
  description: "States where AT&T publishes AT&T Fiber service areas, with the cities AT&T lists in each. Call to confirm AT&T Fiber at your street address.",
  path: "/availability",
});

export default function AvailabilityIndexPage() {
  return (
    <>
      <PageHeader
        trail={[{ name: "Availability by state", path: "/availability" }]}
        image="availabilityHero"
        eyebrow="AT&T Fiber"
        title="AT&T Fiber Availability by State"
        intro="AT&T publishes AT&T Fiber service areas for the states below. Availability is limited to select areas within each state and is confirmed for each street address."
      />
      <section className="section" aria-labelledby="states-title">
        <div className="container-x">
          <SectionHeading eyebrow="Select Your State" id="states-title" title="States With AT&T Fiber Service Areas" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fiberStates.map((s) => (
              <li key={s.slug}>
                <Link href={`/availability/${s.slug}`} className="card block p-4 font-semibold text-brand-strong hover:border-brand-strong hover:underline">
                  AT&amp;T Fiber in {s.state}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-muted">
            AT&amp;T Internet Air is available in other areas over the AT&amp;T 5G network. <Link href="/check-availability" className="link">Check availability</Link> for any address.
          </p>
        </div>
      </section>
      <CallBand placement="states-band" title="Confirm Service at Your Address" text="Call to confirm the AT&T services and pricing available at your street address." offerId="fiber-1000" value={70} />
    </>
  );
}
