import Link from "@/components/ui/AppLink";
import { primaryNav } from "@/data/nav";
import { disclosure } from "@/data/site";
import { disclosureEs, primaryNavEs, ui, type Locale } from "@/data/i18n";
import { env } from "@/lib/env";
import { PhoneLink } from "@/components/PhoneLink";
import { OrderButton } from "@/components/OrderButton";
import { PhoneIcon } from "@/components/ui/Icons";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { LanguageSwitch } from "./LanguageSwitch";

export function Wordmark({ locale = "en" }: { locale?: Locale }) {
  return (
    <Link href={locale === "es" ? "/es" : "/"} className="wordmark">
      <span className="wordmark-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="32" height="32" focusable="false">
          <rect width="32" height="32" rx="8" fill="currentColor" />
          <path d="M9 21.5 14.2 10h3.6L23 21.5h-3.4l-1-2.4h-5.2l-1 2.4Zm5.3-5h3.4L16 12.3Z" fill="#fff" fillRule="evenodd" />
        </svg>
      </span>
      <span className="wordmark-text">
        <span className="wordmark-name">Authorized Internet Retailer</span>
        <span className="wordmark-sub">{ui[locale].wordmarkSub}</span>
      </span>
    </Link>
  );
}

/** One-line disclosure shown above the header on every page. */
export function DisclosureStrip({ locale = "en" }: { locale?: Locale }) {
  return (
    <section className="disclosure-strip" aria-label={locale === "es" ? "Aviso del distribuidor" : "Retailer disclosure"}>
      <div className="container-x flex items-center justify-center gap-x-4 gap-y-1 py-2 text-center">
        <p>
          {locale === "es" ? disclosureEs.short : disclosure.short}{" "}
          <Link href="/disclaimer" className="underline underline-offset-2">
            {ui[locale].disclosureLink}
          </Link>
        </p>
        <LanguageSwitch locale={locale} />
      </div>
    </section>
  );
}

/** Sticky site header with the order-line phone number. `minimal` drops the navigation (landing pages). */
export function SiteHeader({ minimal = false, locale = "en" }: { minimal?: boolean; locale?: Locale }) {
  return (
    <>
      <DisclosureStrip locale={locale} />
      <header className="site-header">
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Wordmark locale={locale} />
          {!minimal ? <NavLinks links={locale === "es" ? primaryNavEs : primaryNav} label={locale === "es" ? "Principal" : "Primary"} /> : null}
          <div className="flex items-center gap-2">
            <PhoneLink placement="header" className="header-call">
              <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
              <span className="header-call-label">{ui[locale].callShort}</span>
              <PhoneNumberText />
            </PhoneLink>
            {/* Wrapper carries the breakpoint: .btn sets its own display, which would override a hidden utility. */}
            <span className="hidden shrink-0 lg:inline-flex">
              <OrderButton placement="header" className="btn btn-secondary btn-sm whitespace-nowrap" locale={locale} />
            </span>
            {!minimal ? <MobileNav locale={locale} /> : null}
          </div>
        </div>
      </header>
    </>
  );
}

function PhoneNumberText() {
  return <span className="whitespace-nowrap">{env.phoneDisplay}</span>;
}
