"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { env } from "@/lib/env";
import { track } from "@/lib/analytics";
import { PhoneLink } from "@/components/PhoneLink";
import { OrderButton } from "@/components/OrderButton";
import type { Locale } from "@/data/i18n";

const COPY = {
  en: { error: "Enter a 5-digit ZIP code.", form: "Check service by ZIP code", label: "ZIP code", button: "Check Availability", next: (z: string) => `ZIP code ${z}: next step`, text: "AT&T confirms service at the street-address level. Call to confirm the services and pricing available at your address.", call: "Call Now" },
  es: { error: "Ingrese un código postal de 5 dígitos.", form: "Verificar el servicio por código postal", label: "Código postal", button: "Verificar disponibilidad", next: (z: string) => `Código postal ${z}: siguiente paso`, text: "AT&T confirma el servicio para cada dirección. Llame para confirmar los servicios y precios disponibles en su dirección.", call: "Llamar ahora" },
} as const;

interface ZipCheckProps {
  offerId?: string;
  value?: number;
  /** Where the widget sits, sent with zip_check. */
  placement: string;
  /** Called with the ZIP after a valid entry. */
  onChecked?: (zip: string) => void;
  tone?: "light" | "dark";
  locale?: Locale;
  /** Focus the ZIP field on load (visitors arriving from an Order Now button). */
  autoFocus?: boolean;
}

/**
 * ZIP entry that leads to the Call Now button. It never displays an availability result: AT&T confirms
 * service per street address, so the next step is always a call.
 */
export function ZipCheck({ offerId, value = 0, placement, onChecked, tone = "light", locale = "en", autoFocus = false }: ZipCheckProps) {
  const t = COPY[locale];
  // Without NEXT_PUBLIC_ORDER_URL, Order Now leads to the availability page, so it is not repeated there.
  const pathname = usePathname();
  const showOrder = Boolean(env.orderUrl) || !pathname.endsWith("/check-availability");
  const uid = useId();
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [checkedZip, setCheckedZip] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError(t.error);
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
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-start" aria-label={t.form}>
        <div className="flex-1">
          <label htmlFor={`${uid}-zip`} className={dark ? "field-label text-white" : "field-label"}>
            {t.label}
          </label>
          <input
            id={`${uid}-zip`}
            ref={inputRef}
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
          {t.button}
        </button>
      </form>
      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {checkedZip ? (
          <div className={`mt-4 rounded-xl p-4 text-sm ${dark ? "bg-white/10 text-white" : "bg-surface-alt text-ink"}`}>
            <p className="font-semibold">{t.next(checkedZip)}</p>
            <p className={`mt-1 ${dark ? "text-white/90" : "text-ink-muted"}`}>
              {t.text}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <PhoneLink placement={`${placement}-zip-next`} offerId={offerId} value={value} className={`btn ${dark ? "btn-inverse" : "btn-primary"} btn-sm`} label={t.call} />
              {showOrder ? <OrderButton placement={`${placement}-zip-next`} offerId={offerId} value={value} className={`btn ${dark ? "btn-ghost-inverse" : "btn-secondary"} btn-sm`} locale={locale} /> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
