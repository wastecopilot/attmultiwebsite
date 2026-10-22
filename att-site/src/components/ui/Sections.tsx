import Link from "@/components/ui/AppLink";
import type { ReactNode } from "react";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { PhoneLink } from "@/components/PhoneLink";
import { CheckIcon, ClockIcon } from "@/components/ui/Icons";
import { SiteImage, imageSrc } from "@/components/ui/SiteImage";
import type { ImageKey } from "@/data/images";
import { ui, type Locale } from "@/data/i18n";

/** BreadcrumbList structured data for search engines (no visible breadcrumb trail). */
export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  // Spanish trails start at /es (their first entry is the Spanish home page).
  const home = trail[0]?.path.startsWith("/es") ? [] : [{ name: "Home", path: "/" }];
  return <JsonLd data={breadcrumbJsonLd([...home, ...trail])} />;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  center = false,
  as = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  center?: boolean;
  as?: "h2" | "h3";
}) {
  const H = as;
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <H id={id} className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        {title}
      </H>
      {intro ? <div className="mt-4 text-lg leading-relaxed text-ink-muted">{intro}</div> : null}
    </div>
  );
}

export function CheckList({ items, className = "" }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={`check-list space-y-2.5 ${className}`}>
      {items.map((it, i) => (
        <li key={i}>
          <CheckIcon />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Page header for inner pages: H1, intro and optional right-hand content. When the page's image slot has a
 * file, it becomes a full-bleed photo header with a dark overlay and white text (as in the reference design).
 */
export function PageHeader({
  trail,
  eyebrow,
  title,
  intro,
  aside,
  image,
  children,
}: {
  trail: { name: string; path: string }[];
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  image?: ImageKey;
  children?: ReactNode;
}) {
  const photo = image && imageSrc(image) ? image : null;
  return (
    <section className={photo ? "hero-photo" : "hero border-b border-border"}>
      {photo ? (
        <>
          <SiteImage slot={photo} fill preload sizes="100vw" className="hero-photo-img" />
          <div className="hero-photo-overlay" aria-hidden="true" />
        </>
      ) : null}
      <Breadcrumbs trail={trail} />
      <div className="container-x relative py-12 md:py-16 lg:py-20">
        <div className={`grid gap-10 ${aside ? "lg:grid-cols-[1.15fr_1fr] lg:items-center" : ""}`}>
          <div className={photo ? "hero-copy" : undefined}>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">{title}</h1>
            {intro ? <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{intro}</div> : null}
            {children}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}

/** Closing call-to-action used at the bottom of most pages (reference design: light panel with a call button). */
export function CallBand({ title, text, offerId, value = 0, placement, locale = "en" }: { title: string; text: string; offerId?: string; value?: number; placement: string; locale?: Locale }) {
  const t = ui[locale];
  return (
    <section className="section" aria-labelledby={`${placement}-title`}>
      <div className="container-x">
        <div className="call-panel">
          <div className="max-w-2xl">
            <h2 id={`${placement}-title`} className="text-2xl font-bold text-brand-strong md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-lg text-ink-muted">{text}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
              <ClockIcon className="h-4 w-4 shrink-0" /> {t.hours}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <PhoneLink placement={placement} offerId={offerId} value={value} className="btn btn-primary btn-lg" label={t.callNow} />
            <Link href={t.checkAvailabilityHref} className="btn btn-secondary btn-lg">
              {t.checkAvailability}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Light call-to-action panel (reference design: "Want the numbers first?"), used in place of contact forms. */
export function CallPanel({
  id,
  title,
  text,
  offerId,
  value = 0,
  placement,
  headingLevel = "h2",
  locale = "en",
}: {
  id: string;
  title: string;
  text: string;
  offerId?: string;
  value?: number;
  placement: string;
  headingLevel?: "h2" | "h3";
  locale?: Locale;
}) {
  const H = headingLevel;
  return (
    <div className="call-panel" role="region" aria-labelledby={id}>
      <div className="max-w-2xl">
        <H id={id} className="text-2xl font-bold text-brand-strong">
          {title}
        </H>
        <p className="mt-2 text-ink-muted">{text}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
          <ClockIcon className="h-4 w-4 shrink-0" /> {ui[locale].hours}
        </p>
      </div>
      <PhoneLink placement={placement} offerId={offerId} value={value} className="btn btn-primary btn-lg shrink-0" label={ui[locale].callNow} />
    </div>
  );
}

export function FaqList({ items, headingLevel = "h3" }: { items: { q: string; a: ReactNode }[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((it) => (
        <details key={it.q} className="faq-item group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 md:px-6">
            <H className="text-base font-semibold text-ink md:text-lg">{it.q}</H>
            <span aria-hidden="true" className="faq-icon text-2xl leading-none text-brand-strong">
              +
            </span>
          </summary>
          <div className="px-5 pb-5 text-ink-muted md:px-6">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
