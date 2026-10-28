"use client";

import Link from "@/components/ui/AppLink";
import { usePathname, useRouter } from "next/navigation";
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
 * "Order Now" link shown next to every Call Now button. Goes to the online order page (/att/order), or to
 * NEXT_PUBLIC_ORDER_URL when that override is set. Click IDs and UTM values ride along (AttributionKeeper
 * for internal links, below for an external URL). Every click fires the `order_click` event (page, offer id,
 * value), the same way PhoneLink fires `phone_click`; the call conversion is untouched.
 */
export function OrderButton({ offerId, value = 0, placement, className, planName, locale = "en" }: OrderButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
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
  const href = `/order?${params.toString()}`;
  return (
    <Link
      href={href}
      {...common}
      onClick={(e) => {
        onTrack();
        // Navigate with the click IDs / UTM values already in the URL, so the order page never loses them
        // (AttributionKeeper only re-adds them after the navigation, which can race with the router).
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !Object.keys(currentAttribution()).length) return;
        e.preventDefault();
        router.push(decorateHref(href));
      }}
    >
      {label}
    </Link>
  );
}
