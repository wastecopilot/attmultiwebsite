"use client";

import { usePathname } from "next/navigation";
import { BASE_PATH } from "@/data/site";
import { env } from "@/lib/env";
import { track } from "@/lib/analytics";
import { currentAttribution, decorateHref } from "@/lib/attribution";
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

/** Query string added to every order link: plan=<offer id>&source=<page>. */
function orderParams(offerId: string | undefined, source: string): URLSearchParams {
  const params = new URLSearchParams();
  if (offerId) params.set("plan", offerId);
  params.set("source", source || "/");
  return params;
}

/**
 * "Order Now" link shown next to every Call Now button. Goes to /att/order, or to NEXT_PUBLIC_ORDER_URL when
 * that override is set. A plain link (a full page load, not an in-app navigation): when ATTSPOC_PARTNER_URL is set,
 * the server answers /att/order with a redirect, so the browser goes straight from the current page to AT&T's
 * partner page, with no empty page in between. Click IDs and UTM values ride along (AttributionKeeper
 * for internal links, below for an external URL). Every click fires the `order_click` event (page, offer id,
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
  const href = `${BASE_PATH}/order?${params.toString()}`;
  return (
    <a
      href={href}
      {...common}
      onClick={(e) => {
        onTrack();
        // The click IDs / UTM values go into the address before the browser follows it.
        e.currentTarget.href = decorateHref(href);
      }}
    >
      {label}
    </a>
  );
}
