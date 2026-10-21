import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { company } from "@/data/site";
import { PageHeader, SectionHeading, CheckList } from "@/components/ui/Sections";
import { AvailabilityFlow } from "@/components/forms/AvailabilityFlow";
import { PhoneLink } from "@/components/PhoneLink";

export const metadata = pageMetadata({
  title: "Check AT&T Availability at Your Address",
  description: "Start with your ZIP code, then confirm which AT&T Fiber, Internet Air, wireless and AT&T Phone services are available at your address with a specialist.",
  path: "/check-availability",
});

export default function CheckAvailabilityPage() {
  const fiber = getOffer("fiber-300");
  return (
    <>
      <PageHeader
        trail={[{ name: "Check availability", path: "/check-availability" }]}
        eyebrow="Availability"
        title="Check AT&T service at your address"
        intro="AT&T confirms service for each street address, so this page does not display an availability result. Enter your ZIP code to begin, then call or request a call back to confirm the services and prices available to you."
      />
      <section className="section" aria-labelledby="avail-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="How it works" id="avail-title" title="Two simple steps" as="h2" />
            <ol className="mt-6 space-y-5">
              <li className="card p-5">
                <p className="font-bold text-ink">1. Enter your ZIP code</p>
                <p className="mt-1 text-ink-muted">This tells us where to start. No result is shown, because availability is confirmed by street address.</p>
              </li>
              <li className="card p-5">
                <p className="font-bold text-ink">2. Call or request a call back</p>
                <p className="mt-1 text-ink-muted">A specialist confirms the AT&amp;T services, speeds and prices available at your address.</p>
              </li>
            </ol>
            <div className="mt-8 card p-5">
              <p className="font-semibold text-ink">Prefer to call now?</p>
              <PhoneLink placement="availability-aside" offerId={fiber.id} value={fiber.price!.amount} className="btn btn-primary mt-3 w-full" prefix="Call" />
              <p className="mt-2 text-sm text-ink-muted">{company.hoursShort}</p>
            </div>
            <CheckList className="mt-8 text-sm text-ink-muted" items={["No obligation to purchase", "Your details are used only to respond to your enquiry"]} />
          </div>
          <AvailabilityFlow offerId={fiber.id} value={fiber.price!.amount} />
        </div>
      </section>
    </>
  );
}
