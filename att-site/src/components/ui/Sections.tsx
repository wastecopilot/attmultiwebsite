import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { PhoneLink } from "@/components/PhoneLink";
import { CheckIcon } from "@/components/ui/Icons";
import { company } from "@/data/site";

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  const full = [{ name: "Home", path: "/" }, ...trail];
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <ol>
          {full.map((t, i) =>
            i === full.length - 1 ? (
              <li key={t.path} aria-current="page">
                {t.name}
              </li>
            ) : (
              <li key={t.path}>
                <Link href={t.path}>{t.name}</Link>
              </li>
            ),
          )}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(full)} />
    </>
  );
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

/** Page header for inner pages: breadcrumbs, H1, intro and optional right-hand content. */
export function PageHeader({
  trail,
  eyebrow,
  title,
  intro,
  aside,
  children,
}: {
  trail: { name: string; path: string }[];
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="hero border-b border-border">
      <div className="container-x py-10 md:py-14">
        <Breadcrumbs trail={trail} />
        <div className={`mt-6 grid gap-10 ${aside ? "lg:grid-cols-[1.15fr_1fr] lg:items-start" : ""}`}>
          <div>
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

/** Closing call-to-action band used at the bottom of most pages. */
export function CallBand({ title, text, offerId, value = 0, placement }: { title: string; text: string; offerId?: string; value?: number; placement: string }) {
  return (
    <section className="band-brand on-dark" aria-labelledby={`${placement}-title`}>
      <div className="container-x flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
        <div className="max-w-2xl">
          <h2 id={`${placement}-title`} className="text-2xl font-bold text-white md:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-lg text-white/90">{text}</p>
          <p className="mt-2 text-sm text-white/90">Specialists available {company.hoursShort}.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PhoneLink placement={placement} offerId={offerId} value={value} className="btn btn-inverse btn-lg" prefix="Call" />
          <Link href="/check-availability" className="btn btn-ghost-inverse btn-lg">
            Check availability
          </Link>
        </div>
      </div>
    </section>
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
