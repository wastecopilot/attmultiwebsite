import Link from "@/components/ui/AppLink";
import { PhoneLink } from "@/components/PhoneLink";
import { ui, type Locale } from "@/data/i18n";

/** Fixed click-to-call bar on small screens (hidden from 1024px up, where the header shows the number). */
export function MobileCallBar({ locale = "en" }: { locale?: Locale }) {
  const t = ui[locale];
  return (
    <div className="mobile-call-bar" role="region" aria-label={t.callBarLabel}>
      <PhoneLink placement="mobile-call-bar" className="btn btn-primary btn-sm" label={t.callNow} />
      <Link href={t.checkAvailabilityHref} className="btn btn-secondary btn-sm">
        {t.checkAvailability}
      </Link>
    </div>
  );
}

