import Link from "@/components/ui/AppLink";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RootDocument, rootViewport } from "@/components/layout/RootDocument";
import { SITE_URL } from "@/data/site";

// Unmatched URLs anywhere in the app (it has one root layout per route group, so there is no shared layout to render a 404 inside).
export const viewport = rootViewport;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { absolute: "Page Not Found | Authorized Internet Retailer" },
  description: "The page you requested could not be found.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <RootDocument>
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <section className="hero">
          <div className="container-x py-20 md:py-28">
            <p className="eyebrow">Error 404</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">Page Not Found</h1>
            <p className="mt-5 max-w-xl text-lg text-ink-muted">The page you requested may have moved, or the address may be incorrect. The following pages may help:</p>
            <ul className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              {[
                ["/", "Home"],
                ["/internet/fiber", "AT&T Fiber plans"],
                ["/internet/internet-air", "AT&T Internet Air"],
                ["/wireless/plans", "AT&T unlimited plans"],
                ["/deals", "Current AT&T deals"],
                ["/check-availability", "Check availability"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="card block p-4 font-semibold text-brand-strong hover:border-brand-strong hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
    </RootDocument>
  );
}
