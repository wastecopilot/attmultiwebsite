import { guarantee, type GuaranteeKey } from "@/data/guarantee";
import { formatAsOf } from "@/components/offers/OfferBits";
import { SectionHeading } from "@/components/ui/Sections";
import { ShieldIcon } from "@/components/ui/Icons";

/** "Backed by the AT&T Guarantee" section with AT&T's conditions under each benefit. */
export function GuaranteeSection({ id, items, alt = false }: { id: string; items: GuaranteeKey[]; alt?: boolean }) {
  return (
    <section className={`section ${alt ? "section-alt" : ""}`} aria-labelledby={id}>
      <div className="container-x">
        <SectionHeading eyebrow="AT&T Guarantee" id={id} title="Backed by the AT&T Guarantee" intro={guarantee.intro} />
        <ul className={`mt-10 grid gap-6 ${items.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {items.map((key) => {
            const item = guarantee.items[key];
            return (
              <li key={key} className="card p-6" data-reveal>
                <ShieldIcon className="h-8 w-8 text-brand-strong" />
                <h3 className="mt-4 text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-ink-muted">{item.text}</p>
                <p className="mt-3 text-sm text-ink-muted">{item.note}</p>
              </li>
            );
          })}
        </ul>
        <p className="as-of mt-6">
          Terms as of <time dateTime={guarantee.retrievedAt}>{formatAsOf(guarantee.retrievedAt)}</time> ·{" "}
          <a href={guarantee.sourceUrl} target="_blank" rel="noopener" className="link inline-block min-h-6 py-0.5">
            Full AT&amp;T Guarantee terms<span className="sr-only"> (opens att.com in a new tab)</span>
          </a>
        </p>
      </div>
    </section>
  );
}
