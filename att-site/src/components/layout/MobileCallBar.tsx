import { PhoneLink } from "@/components/PhoneLink";
import { OrderButton } from "@/components/OrderButton";
import { ui, type Locale } from "@/data/i18n";

/** Fixed click-to-call bar on small screens (hidden from 1024px up, where the header shows the number). */
export function MobileCallBar({ locale = "en" }: { locale?: Locale }) {
  const t = ui[locale];
  return (
    <div className="mobile-call-bar" role="region" aria-label={locale === "es" ? "Llamar u ordenar" : "Call or order"}>
      <PhoneLink placement="mobile-call-bar" className="btn btn-primary btn-sm" label={t.callNow} />
      <OrderButton placement="mobile-call-bar" className="btn btn-secondary btn-sm" locale={locale} />
    </div>
  );
}

