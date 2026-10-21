import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/ui/Sections";

export const metadata = pageMetadata({
  title: "Site Map | Authorized Internet Retailer",
  description: "All pages on this website: AT&T home internet, AT&T Fiber, AT&T Internet Air, wireless plans and deals, AT&T Phone, company information and policies.",
  path: "/sitemap-page",
});

const groups = [
  {
    heading: "Home internet",
    links: [
      ["/internet", "AT&T home internet plans"],
      ["/internet/fiber", "AT&T Fiber internet plans"],
      ["/internet/internet-air", "AT&T Internet Air 5G home internet"],
      ["/check-availability", "Check AT&T service at your address"],
    ],
  },
  {
    heading: "Wireless",
    links: [
      ["/wireless", "AT&T wireless plans and deals"],
      ["/wireless/plans", "AT&T unlimited plans compared"],
      ["/wireless/deals", "AT&T phone deals and trade-in offers"],
      ["/wireless/switch", "Switch to AT&T and keep your number"],
    ],
  },
  {
    heading: "Home phone and deals",
    links: [
      ["/phone", "AT&T Phone home phone service"],
      ["/deals", "All current AT&T deals and promotions"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["/", "Home"],
      ["/about", "About us"],
      ["/faq", "Frequently asked questions"],
      ["/contact", "Contact us"],
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
      <PageHeader trail={[{ name: "Site map", path: "/sitemap-page" }]} title="Site map" intro="Every page on this website." />
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
