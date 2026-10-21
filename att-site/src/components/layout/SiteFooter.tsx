import Link from "@/components/ui/AppLink";
import { footerNav, legalNav } from "@/data/nav";
import { company, disclosure } from "@/data/site";
import { PhoneLink } from "@/components/PhoneLink";
import { CookieSettingsLink } from "@/components/consent/CookieBanner";
import { Wordmark } from "./SiteHeader";

const COPYRIGHT_YEAR = 2026;

/** Site footer: disclosure + trademark notice, navigation, company details and policy links on every page. */
export function SiteFooter({ minimal = false }: { minimal?: boolean }) {
  return (
    <footer className="site-footer band-dark on-dark mt-auto">
      <div className="container-x py-12 md:py-16">
        <div className="rounded-2xl border border-white/20 p-5 md:p-6">
          <p className="font-semibold text-white">{disclosure.full}</p>
          <p className="mt-2 text-sm text-night-muted">{disclosure.trademark}</p>
          <p className="mt-2 text-sm text-night-muted">
            Prices and offers are set by AT&amp;T, exclude taxes and fees unless otherwise stated, and are subject to change without notice. Service availability
            varies by address.
          </p>
        </div>

        {!minimal ? (
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="footer-wordmark">
                <Wordmark />
              </div>
              <address className="mt-5 not-italic text-sm leading-6 text-night-muted">
                <span className="block font-semibold text-white">{company.legalName}</span>
                {company.streetAddress}, {company.locality}, {company.region} {company.postalCode}
                <br />
                <PhoneLink placement="footer" className="link-inverse font-semibold underline underline-offset-2" />
                <span aria-hidden="true"> · </span>
                <span>{company.hoursShort}</span>
                <br />
                <a href={`mailto:${company.email}`} className="link-inverse underline underline-offset-2">
                  {company.email}
                </a>
              </address>
            </div>
            {footerNav.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h2 className="text-sm font-bold tracking-wide text-white uppercase">{col.heading}</h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-night-muted hover:text-white hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-night-muted">
            {company.legalName} · {company.streetAddress}, {company.locality}, {company.region} {company.postalCode} ·{" "}
            <PhoneLink placement="footer" className="link-inverse font-semibold underline underline-offset-2" /> · {company.hoursShort}
          </p>
        )}

        <nav aria-label="Legal" className="mt-10 border-t border-white/20 pt-6">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-night-muted underline-offset-2 hover:text-white hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="text-night-muted underline-offset-2 hover:text-white hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <CookieSettingsLink className="inline-block min-h-6 py-0.5 text-night-muted underline underline-offset-2 hover:text-white" />
            </li>
          </ul>
          <p className="mt-5 text-xs text-night-muted">
            © {COPYRIGHT_YEAR} {company.legalName}. All rights reserved.
          </p>
        </nav>
      </div>
    </footer>
  );
}
