import { pageMetadata } from "@/lib/seo";
import { company } from "@/data/site";
import { CallPanel, PageHeader, SectionHeading } from "@/components/ui/Sections";
import { PhoneLink } from "@/components/PhoneLink";
import { ClockIcon, DocumentIcon, MapPinIcon, PhoneIcon } from "@/components/ui/Icons";

export const metadata = pageMetadata({
  title: "Contact Us | AT&T Authorized Retailer",
  description: `Contact ${company.legalName}, an independent authorized retailer of AT&T services, by phone or email. Sales specialists available seven days a week.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        trail={[{ name: "Contact", path: "/contact" }]}
        image="contactHero"
        eyebrow="Contact"
        title="Contact Us"
        intro="Our specialists assist with new AT&T service: AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone."
      />
      <section className="section" aria-labelledby="contact-ways">
        <div className="container-x">
          <SectionHeading id="contact-ways" eyebrow="Contact Details" title="How to Reach Us" />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                      {h.days}: {h.open} – {h.close}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="card flex gap-4 p-5">
              <DocumentIcon className="h-6 w-6 shrink-0 text-brand-strong" />
              <div className="min-w-0">
                <p className="font-bold text-ink">Email</p>
                <a href={`mailto:${company.email}`} className="link break-all">
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
          <p className="mt-6 text-sm text-ink-muted">We assist with new AT&amp;T service only and do not have access to existing AT&amp;T accounts, bills or service records.</p>
        </div>
        <div className="container-x mt-12">
          <CallPanel
            id="contact-call-panel"
            title="Speak With a Specialist Today"
            text="Call for availability, pricing and current promotions for your address. There is no obligation to purchase."
            placement="contact-call-panel"
          />
        </div>
      </section>
    </>
  );
}
