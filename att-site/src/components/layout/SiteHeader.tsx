import Link from "@/components/ui/AppLink";
import { primaryNav } from "@/data/nav";
import { disclosure } from "@/data/site";
import { env } from "@/lib/env";
import { PhoneLink } from "@/components/PhoneLink";
import { PhoneIcon } from "@/components/ui/Icons";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function Wordmark() {
  return (
    <Link href="/" className="wordmark">
      <span className="wordmark-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="32" height="32" focusable="false">
          <rect width="32" height="32" rx="8" fill="currentColor" />
          <path d="M9 21.5 14.2 10h3.6L23 21.5h-3.4l-1-2.4h-5.2l-1 2.4Zm5.3-5h3.4L16 12.3Z" fill="#fff" fillRule="evenodd" />
        </svg>
      </span>
      <span className="wordmark-text">
        <span className="wordmark-name">Authorized Internet Retailer</span>
        <span className="wordmark-sub">Independent retailer of AT&amp;T services</span>
      </span>
    </Link>
  );
}

/** One-line disclosure shown above the header on every page. */
export function DisclosureStrip() {
  return (
    <section className="disclosure-strip" aria-label="Retailer disclosure">
      <div className="container-x flex items-center justify-center gap-2 py-2 text-center">
        <p>
          {disclosure.short}{" "}
          <Link href="/disclaimer" className="underline underline-offset-2">
            Read our disclosure
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Sticky site header with the order-line phone number. `minimal` drops the navigation (landing pages). */
export function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  return (
    <>
      <DisclosureStrip />
      <header className="site-header">
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Wordmark />
          {!minimal ? <NavLinks links={primaryNav} /> : null}
          <div className="flex items-center gap-2">
            <PhoneLink placement="header" className="header-call">
              <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
              <span className="header-call-label">Call</span>
              <PhoneNumberText />
            </PhoneLink>
            {!minimal ? <MobileNav /> : null}
          </div>
        </div>
      </header>
    </>
  );
}

function PhoneNumberText() {
  return <span className="whitespace-nowrap">{env.phoneDisplay}</span>;
}
