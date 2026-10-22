import Link from "@/components/ui/AppLink";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/Sections";

export const metadata = pageMetadata({
  title: "Site Map | Authorized Internet Retailer",
  description: "All pages on this website: AT&T home internet, AT&T Fiber, AT&T Internet Air, wireless plans and deals, AT&T Phone, company information and policies.",
  path: "/sitemap-page",
});

const groups = [
  {
    heading: "Home Internet",
    links: [
      ["/internet", "AT&T Home Internet Plans"],
      ["/internet/fiber", "AT&T Fiber Internet Plans"],
      ["/internet/internet-air", "AT&T Internet Air 5G Home Internet"],
      ["/check-availability", "Check AT&T Service Availability"],
      ["/moving", "AT&T Service for Your New Home"],
    ],
  },
  {
    heading: "Wireless",
    links: [
      ["/wireless", "AT&T Wireless Plans and Offers"],
      ["/wireless/plans", "AT&T Unlimited Plans"],
      ["/wireless/deals", "AT&T Smartphone Deals"],
      ["/wireless/switch", "Switch to AT&T"],
    ],
  },
  {
    heading: "Home Phone and Deals",
    links: [
      ["/phone", "AT&T Home Phone Service"],
      ["/deals", "Current AT&T Deals and Promotions"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["/", "Home"],
      ["/about", "About Us"],
      ["/faq", "Frequently Asked Questions"],
      ["/contact", "Contact Us"],
    ],
  },
  {
    heading: "Policies",
    links: [
      ["/privacy", "Privacy Policy"],
      ["/terms", "Terms of Use"],
      ["/cookie-policy", "Cookie Policy"],
      ["/do-not-sell-or-share", "Do Not Sell or Share My Personal Information"],
      ["/accessibility", "Accessibility Statement"],
      ["/disclaimer", "Disclaimer"],
    ],
  },
] as const;

export default function SitemapPage() {
  return (
    <>
      <PageHeader trail={[{ name: "Site map", path: "/sitemap-page" }]} title="Site Map" intro="A complete list of pages on this website." />
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-3">
        {groups.map((g) => (
          <section key={g.heading} aria-labelledby={`sm-${g.heading.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
            <h2 id={`sm-${g.heading.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="text-xl font-bold text-ink">
              {g.heading}
            </h2>
            <ul className="mt-4 space-y-2">
              {g.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
