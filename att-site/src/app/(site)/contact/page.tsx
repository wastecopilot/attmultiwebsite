import { pageMetadata } from "@/lib/seo";
import { company } from "@/data/site";
import { PageHeader, SectionHeading } from "@/components/ui/Sections";
import { LeadForm } from "@/components/forms/LeadForm";
import { PhoneLink } from "@/components/PhoneLink";
import { ClockIcon, DocumentIcon, MapPinIcon, PhoneIcon } from "@/components/ui/Icons";

export const metadata = pageMetadata({
  title: "Contact Us | AT&T Authorized Retailer",
  description: `Call, email or request a call back from ${company.legalName}, an independent authorized retailer of AT&T services. Hours: ${company.hoursShort}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        trail={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact"
        title="Contact us"
        intro="Our specialists handle enquiries about new AT&T service: AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone."
      />
      <section className="section" aria-labelledby="contact-ways">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <SectionHeading id="contact-ways" title="Ways to reach us" />
            <ul className="mt-6 space-y-5">
              <li className="card flex gap-4 p-5">
                <PhoneIcon className="h-6 w-6 shrink-0 text-brand-strong" />
                <div>
                  <p className="font-bold text-ink">Phone</p>
                  <PhoneLink placement="contact" className="link text-lg font-semibold" />
                </div>
              </li>
              <li className="card flex gap-4 p-5">
                <ClockIcon className="h-6 w-6 shrink-0 text-brand-strong" />
                <div>
                  <p className="font-bold text-ink">Hours (Eastern Time)</p>
                  <ul className="text-ink-muted">
                    {company.hours.map((h) => (
                      <li key={h.days}>
                        {h.days}: {h.open} – {h.close} {h.tz}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="card flex gap-4 p-5">
                <DocumentIcon className="h-6 w-6 shrink-0 text-brand-strong" />
                <div>
                  <p className="font-bold text-ink">Email</p>
                  <a href={`mailto:${company.email}`} className="link">
                    {company.email}
                  </a>
                </div>
              </li>
              <li className="card flex gap-4 p-5">
                <MapPinIcon className="h-6 w-6 shrink-0 text-brand-strong" />
                <div>
                  <p className="font-bold text-ink">Address</p>
                  <address className="not-italic text-ink-muted">
                    {company.legalName}
                    <br />
                    {company.streetAddress}
                    <br />
                    {company.locality}, {company.region} {company.postalCode}
                  </address>
                </div>
              </li>
            </ul>
            <p className="mt-6 text-sm text-ink-muted">We have no access to existing AT&amp;T accounts, bills or service records.</p>
          </div>
          <LeadForm headingLevel="h2" />
        </div>
      </section>
    </>
  );
}
