"use client";

import Link from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { env } from "@/lib/env";
import { track } from "@/lib/analytics";
import { currentAttribution } from "@/lib/attribution";
import type { Locale } from "@/data/i18n";

interface OrderButtonProps {
  /** Offer in context (src/data/offers.ts); sent as `plan` so the order lands on that plan. */
  offerId?: string;
  /** Monthly price of that offer in USD; 0 when no offer is in context. */
  value?: number;
  /** Where on the page the button sits, e.g. "header", "hero", "plan-card". */
  placement: string;
  className?: string;
  /** Plan name for the accessible name, e.g. "AT&T Internet 1000" → "Order Now: AT&T Internet 1000". */
  planName?: string;
  locale?: Locale;
}

/** Query string added to every order link: intent=order&plan=<offer id>&source=<page>. */
function orderParams(offerId: string | undefined, source: string): URLSearchParams {
  const params = new URLSearchParams({ intent: "order" });
  if (offerId) params.set("plan", offerId);
  params.set("source", source || "/");
  return params;
}

/**
 * "Order Now" link shown next to every Call Now button. Goes to NEXT_PUBLIC_ORDER_URL when it is set,
 * otherwise to the check-availability page. Every click fires the `order_click` event (page, offer id,
 * value), the same way PhoneLink fires `phone_click`; the call conversion is untouched.
 */
export function OrderButton({ offerId, value = 0, placement, className, planName, locale = "en" }: OrderButtonProps) {
  const pathname = usePathname();
  const label = locale === "es" ? "Ordenar ahora" : "Order Now";
  const params = orderParams(offerId, pathname);
  const common = {
    className,
    "aria-label": planName ? `${label}: ${planName}` : undefined,
    "data-order-link": placement,
    "data-offer-id": offerId ?? "none",
  };
  const onTrack = () => track("order_click", { offer_id: offerId, value, placement });

  if (env.orderUrl) {
    // External destination: add the plan and the preserved click IDs / UTM values (internal links get
    // these from AttributionKeeper; cross-origin links do not).
    const url = new URL(env.orderUrl);
    params.forEach((v, k) => url.searchParams.set(k, v));
    return (
      <a
        href={url.toString()}
        {...common}
        onClick={(e) => {
          onTrack();
          for (const [k, v] of Object.entries(currentAttribution())) if (v && !url.searchParams.has(k)) url.searchParams.set(k, v);
          e.currentTarget.href = url.toString();
        }}
      >
        {label}
      </a>
    );
  }
  const base = locale === "es" ? "/es/check-availability" : "/check-availability";
  return (
    <Link href={`${base}?${params.toString()}`} {...common} onClick={onTrack}>
      {label}
    </Link>
  );
}
