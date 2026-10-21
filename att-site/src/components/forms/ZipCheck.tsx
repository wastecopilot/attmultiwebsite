"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { PhoneLink } from "@/components/PhoneLink";

interface ZipCheckProps {
  offerId?: string;
  value?: number;
  /** Where the widget sits, sent with zip_check. */
  placement: string;
  /** Called with the ZIP after a valid entry (used by /check-availability to prefill the form). */
  onChecked?: (zip: string) => void;
  /** Show the "request a call back" link (hidden on /check-availability, where the form is on the page). */
  showFormLink?: boolean;
  tone?: "light" | "dark";
}

/**
 * ZIP entry that leads to the call CTA and the lead form. It never displays an availability result:
 * AT&T confirms service per street address, so the next step is always a call or a call-back request.
 */
export function ZipCheck({ offerId, value = 0, placement, onChecked, showFormLink = true, tone = "light" }: ZipCheckProps) {
  const uid = useId();
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [checkedZip, setCheckedZip] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a 5-digit ZIP code.");
      return;
    }
    setError("");
    setCheckedZip(zip);
    // The ZIP itself is not sent to analytics.
    track("zip_check", { offer_id: offerId, value, placement });
    onChecked?.(zip);
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const dark = tone === "dark";
  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-start" aria-label="Check service by ZIP code">
        <div className="flex-1">
          <label htmlFor={`${uid}-zip`} className={dark ? "field-label text-white" : "field-label"}>
            ZIP code
          </label>
          <input
            id={`${uid}-zip`}
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            className="field-input"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/[^\d]/g, "").slice(0, 5));
              if (error) setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${uid}-err` : undefined}
          />
          {error ? (
            <p id={`${uid}-err`} className={dark ? "field-error text-white" : "field-error"} role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <button type="submit" className={`btn ${dark ? "btn-inverse" : "btn-primary"} sm:mt-7`}>
          Check my ZIP
        </button>
      </form>
      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {checkedZip ? (
          <div className={`mt-4 rounded-xl p-4 text-sm ${dark ? "bg-white/10 text-white" : "bg-surface-alt text-ink"}`}>
            <p className="font-semibold">Next step for ZIP code {checkedZip}</p>
            <p className={`mt-1 ${dark ? "text-white/90" : "text-ink-muted"}`}>
              AT&amp;T confirms service for each street address, so a ZIP code alone cannot show which plans are available. A specialist can confirm the services and prices for your address.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <PhoneLink placement={`${placement}-zip-next`} offerId={offerId} value={value} className={`btn ${dark ? "btn-inverse" : "btn-primary"} btn-sm`} prefix="Call" />
              {showFormLink ? (
                <Link href="/check-availability#request" className={`btn ${dark ? "btn-ghost-inverse" : "btn-secondary"} btn-sm`}>
                  Request a call back
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
