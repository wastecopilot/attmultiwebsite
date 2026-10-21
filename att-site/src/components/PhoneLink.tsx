"use client";

import type { ReactNode } from "react";
import { env } from "@/lib/env";
import { track, trackCallConversion } from "@/lib/analytics";

interface PhoneLinkProps {
  /** Offer in context (from src/data/offers.ts), sent with the phone_click event. */
  offerId?: string;
  /** Monthly price of that offer in USD; 0 when no offer is in context. */
  value?: number;
  /** Where on the page the link sits, e.g. "header", "hero", "plan-card". */
  placement: string;
  className?: string;
  /** Text shown before the number, e.g. "Call". The number itself is always rendered as plain text so
   *  Google's website call-conversion script can swap it. */
  prefix?: ReactNode;
  children?: ReactNode;
}

/**
 * The only component that renders the order-line phone number. Every click fires the GA4/GTM
 * `phone_click` event and the Google Ads call conversion.
 */
export function PhoneLink({ offerId, value = 0, placement, className, prefix, children }: PhoneLinkProps) {
  const onClick = () => {
    track("phone_click", { offer_id: offerId, value, placement });
    trackCallConversion({ value });
  };
  return (
    <a href={`tel:${env.phoneTel}`} onClick={onClick} className={className} data-phone-link={placement} data-offer-id={offerId ?? "none"}>
      {children ?? (
        <>
          {prefix ? <>{prefix} </> : null}
          <span className="whitespace-nowrap">{env.phoneDisplay}</span>
        </>
      )}
    </a>
  );
}
