import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { PageHeader, SectionHeading, CheckList, CallPanel } from "@/components/ui/Sections";
import { ZipCheck } from "@/components/forms/ZipCheck";

export const metadata = pageMetadata({
  title: "Check AT&T Availability at Your Address",
  description: "Check AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone availability. Enter your ZIP code, then call to confirm service at your address.",
  path: "/check-availability",
});

export default function CheckAvailabilityPage() {
  const fiber = getOffer("fiber-300");
  return (
    <>
      <PageHeader
        trail={[{ name: "Check availability", path: "/check-availability" }]}
        image="availabilityHero"
        eyebrow="Service Availability"
        title="Check AT&T Service at Your Address"
        intro="AT&T confirms service availability by street address. Enter your ZIP code to begin, then call to confirm the services and pricing available at your address."
      />
      <section className="section" aria-labelledby="avail-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="How It Works" id="avail-title" title="Two Simple Steps" />
            <ol className="mt-6 space-y-5">
              <li className="card p-5">
                <p className="font-bold text-ink">1. Enter Your ZIP Code</p>
                <p className="mt-1 text-ink-muted">Your ZIP code identifies the service area for your enquiry.</p>
              </li>
              <li className="card p-5">
                <p className="font-bold text-ink">2. Call to Confirm Your Address</p>
                <p className="mt-1 text-ink-muted">A specialist confirms the AT&amp;T services, speeds and pricing available at your street address.</p>
              </li>
            </ol>
            <CheckList className="mt-8 text-ink-muted" items={["No obligation to purchase", "AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone"]} />
          </div>
          <div className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-ink">Enter Your ZIP Code</h2>
            <div className="mt-4">
              <ZipCheck placement="availability" offerId={fiber.id} value={fiber.price!.amount} />
            </div>
          </div>
        </div>
        <div className="container-x mt-12">
          <CallPanel
            id="availability-call-panel"
            title="Prefer to Confirm by Phone Now?"
            text="Call to confirm the AT&T services and pricing available at your address."
            placement="availability-call-panel"
            offerId={fiber.id}
            value={fiber.price!.amount}
          />
        </div>
      </section>
    </>
  );
}
