import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { company, disclosure } from "@/data/site";
import { CallBand, CheckList, PageHeader, SectionHeading } from "@/components/ui/Sections";

export const metadata = pageMetadata({
  title: "About Us | Independent AT&T Authorized Retailer",
  description: `${company.legalName} is an independent authorized retailer of AT&T services based in Melville, New York, assisting customers with AT&T home internet and wireless.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        trail={[{ name: "About", path: "/about" }]}
        image="aboutHero"
        eyebrow="About Us"
        title={`About ${company.legalName}`}
        intro={`${company.legalName} is an independent authorized retailer of AT&T services, located in ${company.locality}, ${company.region}. We help households compare AT&T home internet, wireless and home phone plans.`}
      />
      <section className="section" aria-labelledby="about-approach">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our Approach" id="about-approach" title="Clear Pricing and Complete Offer Terms" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-muted">
              <p>
                We present AT&amp;T plans and promotions together with the conditions that apply, so customers can compare options with confidence before making a decision.
              </p>
              <p>
                Because AT&amp;T confirms service for each street address, our specialists confirm the AT&amp;T services and prices available at your address before you make any decision.
              </p>
            </div>
          </div>
          <div className="card p-6 md:p-8" data-reveal>
            <h2 className="text-xl font-bold text-ink">How We Can Help</h2>
            <CheckList
              className="mt-4 text-ink"
              items={[
                "Comparing AT&T Fiber and AT&T Internet Air for your address",
                "Choosing AT&T Unlimited Your Way plans for each line",
                "Explaining AT&T's current promotions and their terms",
                "AT&T Phone home phone service",
                "Combining AT&T Fiber with AT&T wireless",
              ]}
            />
            <p className="mt-6 text-sm text-ink-muted">We assist with new AT&amp;T service only and do not have access to existing AT&amp;T accounts or bills.</p>
          </div>
        </div>
      </section>
      <section className="section section-alt" aria-labelledby="about-disclosure">
        <div className="container-x max-w-4xl">
          <SectionHeading eyebrow="Disclosure" id="about-disclosure" title="Our Relationship With AT&T" />
          <p className="mt-6 text-lg leading-relaxed text-ink">{disclosure.full}</p>
          <p className="mt-4 text-ink-muted">{disclosure.trademark}</p>
          <p className="mt-6">
            <Link href="/disclaimer" className="link font-semibold">
              Read the Full Disclaimer
            </Link>
          </p>
        </div>
      </section>
      <section className="section" aria-labelledby="about-details">
        <div className="container-x">
          <SectionHeading eyebrow="Company Details" id="about-details" title="Company Information" />
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="card p-5">
              <dt className="text-sm font-semibold text-ink-muted">Registered name</dt>
              <dd className="mt-1 font-bold text-ink">{company.legalName}</dd>
            </div>
            <div className="card p-5">
              <dt className="text-sm font-semibold text-ink-muted">Address</dt>
              <dd className="mt-1 font-bold text-ink">
                {company.streetAddress}, {company.locality}, {company.region} {company.postalCode}
              </dd>
            </div>
            <div className="card p-5">
              <dt className="text-sm font-semibold text-ink-muted">Hours (Eastern Time)</dt>
              <dd className="mt-1 font-bold text-ink">{company.hoursShort}</dd>
            </div>
          </dl>
        </div>
      </section>
      <CallBand placement="about-band" title="Speak With a Specialist" text="Call to compare AT&T plans and confirm the services available at your address." />
    </>
  );
}
