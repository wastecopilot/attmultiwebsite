import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { getOffer } from "@/data/offers";
import { PlanCard } from "@/components/offers/OfferCard";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { ZipCheck } from "@/components/forms/ZipCheck";
import { JsonLd, offersJsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Moving? AT&T Internet at Your New Address",
  description: "Moving to a new home? Compare AT&T Fiber and AT&T Internet Air at your new address and speak with a specialist about current AT&T offers.",
  path: "/moving",
});

export default function MovingPage() {
  const fiber = getOffer("fiber-1000");
  const air = getOffer("internet-air");
  return (
    <>
      <PageHeader
        trail={[{ name: "Moving", path: "/moving" }]}
        image="availabilityHero"
        eyebrow="Moving"
        title="AT&T Service for Your New Home"
        intro="Moving to a new address? AT&T Fiber or AT&T Internet Air may be available at your new home. A specialist can confirm the services and current offers for that address before you move."
      >
        <CheckList
          className="mt-6 text-ink"
          items={["Availability confirmed for your new street address", "AT&T Fiber and AT&T Internet Air plans compared side by side", "Current AT&T wireless switching offers reviewed on the same call"]}
        />
      </PageHeader>

      <section className="section" aria-labelledby="moving-steps-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionHeading eyebrow="Planning Your Move" id="moving-steps-title" title="Before You Call" />
            <ol className="mt-6 space-y-5">
              <li className="card p-5">
                <p className="font-bold text-ink">1. Have Your New Street Address Ready</p>
                <p className="mt-1 text-ink-muted">AT&amp;T confirms service by street address, so a ZIP code or city alone cannot confirm what is available.</p>
              </li>
              <li className="card p-5">
                <p className="font-bold text-ink">2. Note Your Move-In Date</p>
                <p className="mt-1 text-ink-muted">Your specialist reviews the AT&amp;T services, speeds and pricing available at the new address.</p>
              </li>
              <li className="card p-5">
                <p className="font-bold text-ink">3. List the Services You Need</p>
                <p className="mt-1 text-ink-muted">
                  Home internet, wireless lines and home phone can be reviewed together. See <Link href="/wireless/switch" className="link">AT&amp;T switching offers</Link> if you are changing wireless
                  carriers.
                </p>
              </li>
            </ol>
            <p className="mt-6 text-sm text-ink-muted">We assist with new AT&amp;T service only and do not have access to existing AT&amp;T accounts, bills or service records.</p>
          </div>
          <div className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-ink">Check Your New Address</h2>
            <p className="mt-2 text-ink-muted">Enter the ZIP code of your new home to begin.</p>
            <div className="mt-5">
              <ZipCheck placement="moving-zip" offerId={fiber.id} value={fiber.price?.amount} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-labelledby="moving-plans-title">
        <div className="container-x">
          <SectionHeading eyebrow="Home Internet" id="moving-plans-title" title="Home Internet for Your New Address" intro="Availability of AT&T Fiber and AT&T Internet Air varies by address." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:max-w-4xl">
            <PlanCard offer={fiber} />
            <PlanCard offer={air} />
          </div>
          <p className="mt-6">
            <Link href="/internet" className="link font-semibold">
              Compare All AT&amp;T Home Internet Plans
            </Link>
          </p>
        </div>
      </section>

      <CallBand placement="moving-band" title="Planning a Move?" text="Call to confirm AT&T service and current offers at your new address." offerId={fiber.id} value={fiber.price?.amount} />
      <JsonLd data={offersJsonLd([fiber, air], "/moving")} />
    </>
  );
}
