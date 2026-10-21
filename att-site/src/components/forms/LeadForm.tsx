"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { company } from "@/data/site";
import { env } from "@/lib/env";
import { track } from "@/lib/analytics";
import { submitLead, type LeadResult } from "@/lib/lead-handler";
import { PhoneLink } from "@/components/PhoneLink";

export const SERVICE_OPTIONS = ["AT&T Fiber", "AT&T Internet Air", "AT&T Wireless", "AT&T Phone (home phone)", "Internet and wireless bundle"] as const;

export const CONSENT_TEXT = `By checking this box, I agree that ${company.legalName}, an independent authorized retailer of AT&T services, may contact me at the telephone number provided about AT&T services, including by calls and text messages that may use automated technology or prerecorded voice. Consent is not a condition of any purchase. Message and data rates may apply. I may revoke consent at any time.`;

type Field = "name" | "phone" | "zip" | "interest" | "consent";
type Errors = Partial<Record<Field, string>>;

function validate(v: { name: string; phone: string; zip: string; interest: string; consent: boolean }): Errors {
  const e: Errors = {};
  const name = v.name.trim();
  if (name.length < 2) e.name = "Enter your full name.";
  else if (name.length > 80 || !/^[\p{L}][\p{L}' .-]*$/u.test(name)) e.name = "Use letters, spaces, apostrophes or hyphens only.";
  const digits = v.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) e.phone = "Enter a 10-digit US phone number.";
  if (!/^\d{5}$/.test(v.zip.trim())) e.zip = "Enter a 5-digit ZIP code.";
  if (!v.interest) e.interest = "Select the service you are interested in.";
  if (!v.consent) e.consent = "Please confirm your consent to be contacted.";
  return e;
}

interface LeadFormProps {
  /** Offer in context; sent with the form_submit event. */
  offerId?: string;
  value?: number;
  defaultInterest?: (typeof SERVICE_OPTIONS)[number];
  defaultZip?: string;
  heading?: string;
  headingLevel?: "h2" | "h3";
}

export function LeadForm({ offerId, value = 0, defaultInterest, defaultZip = "", heading = "Request a call back", headingLevel = "h2" }: LeadFormProps) {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const [values, setValues] = useState({ name: "", phone: "", zip: defaultZip, interest: defaultInterest ?? "", consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<LeadResult | null>(null);
  const [busy, setBusy] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const Heading = headingLevel;

  // Keep the ZIP in sync when a parent passes a new default (e.g. after a ZIP check).
  const [lastDefaultZip, setLastDefaultZip] = useState(defaultZip);
  if (defaultZip !== lastDefaultZip) {
    setLastDefaultZip(defaultZip);
    setValues((v) => ({ ...v, zip: defaultZip }));
  }

  const set = (f: Field, val: string | boolean) => {
    setValues((v) => ({ ...v, [f]: val }));
    if (errors[f]) setErrors((e) => ({ ...e, [f]: undefined }));
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setBusy(true);
    track("form_submit", { offer_id: offerId, value, form: "lead", service_interest: values.interest });
    const r = await submitLead({
      name: values.name.trim(),
      phone: values.phone,
      zip: values.zip.trim(),
      interest: values.interest,
      consent: values.consent,
      consentText: CONSENT_TEXT,
      page: window.location.pathname,
      offerId,
    });
    setBusy(false);
    setResult(r);
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  if (result && result.status !== "error") {
    const first = values.name.trim().split(/\s+/)[0];
    const mailBody = encodeURIComponent(
      `Name: ${values.name.trim()}\nPhone: ${values.phone}\nZIP: ${values.zip.trim()}\nService of interest: ${values.interest}\n\nI agree to be contacted about AT&T services as described on the request form.`,
    );
    const mailHref = `mailto:${company.email}?subject=${encodeURIComponent(`Service enquiry: ${values.interest}`)}&body=${mailBody}`;
    return (
      <div ref={resultRef} tabIndex={-1} className="card p-6 md:p-8" role="status" aria-live="polite">
        {result.status === "sent" ? (
          <>
            <Heading className="text-2xl font-bold text-ink">Thank you, {first}.</Heading>
            <p className="mt-3 text-ink-muted">Your request has been received. A specialist will call you during business hours ({company.hoursShort}).</p>
            <p className="mt-3 text-ink-muted">
              To speak with a specialist now, call <PhoneLink placement="lead-form-success" offerId={offerId} value={value} className="link font-semibold" />.
            </p>
          </>
        ) : (
          <>
            <Heading className="text-2xl font-bold text-ink">Thank you, {first}. One more step.</Heading>
            <p className="mt-3 text-ink-muted">
              Online requests are not transmitted automatically at this time. Please choose one of the options below so a specialist can review the services available at your address.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <PhoneLink placement="lead-form-fallback" offerId={offerId} value={value} className="btn btn-primary" prefix="Call" />
              <a href={mailHref} className="btn btn-secondary">
                Email your details
              </a>
            </div>
            <p className="mt-3 text-sm text-ink-muted">Hours: {company.hoursShort}.</p>
          </>
        )}
      </div>
    );
  }

  const errorList = (Object.entries(errors) as [Field, string | undefined][]).filter(([, m]) => m);

  return (
    <form noValidate onSubmit={onSubmit} className="card p-6 md:p-8" aria-labelledby={id("title")}>
      <Heading id={id("title")} className="text-2xl font-bold text-ink">
        {heading}
      </Heading>
      <p className="mt-2 text-sm text-ink-muted">
        All fields are required. A specialist will call during business hours ({company.hoursShort}).
      </p>

      {errorList.length > 0 ? (
        <div ref={summaryRef} tabIndex={-1} className="form-error-summary mt-4" role="alert">
          <p className="font-semibold">Please correct {errorList.length === 1 ? "1 field" : `${errorList.length} fields`}:</p>
          <ul className="mt-1 list-disc pl-5">
            {errorList.map(([f, m]) => (
              <li key={f}>
                <a href={`#${id(f)}`} className="underline">
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {result?.status === "error" ? (
        <div ref={resultRef} tabIndex={-1} className="form-error-summary mt-4" role="alert">
          {result.message} You can also call <PhoneLink placement="lead-form-error" offerId={offerId} value={value} className="underline font-semibold" />.
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={id("name")} className="field-label">
            Full name
          </label>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            className="field-input"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? id("name-err") : undefined}
            maxLength={80}
          />
          {errors.name ? (
            <p id={id("name-err")} className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={id("phone")} className="field-label">
            Phone number
          </label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            className="field-input"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone}
            aria-describedby={`${id("phone-hint")}${errors.phone ? ` ${id("phone-err")}` : ""}`}
            maxLength={20}
          />
          <p id={id("phone-hint")} className="field-hint">
            10 digits, area code first
          </p>
          {errors.phone ? (
            <p id={id("phone-err")} className="field-error">
              {errors.phone}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={id("zip")} className="field-label">
            ZIP code
          </label>
          <input
            id={id("zip")}
            name="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            className="field-input"
            value={values.zip}
            onChange={(e) => set("zip", e.target.value.replace(/[^\d]/g, "").slice(0, 5))}
            aria-invalid={!!errors.zip}
            aria-describedby={errors.zip ? id("zip-err") : undefined}
            maxLength={5}
          />
          {errors.zip ? (
            <p id={id("zip-err")} className="field-error">
              {errors.zip}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={id("interest")} className="field-label">
            Service of interest
          </label>
          <select
            id={id("interest")}
            name="interest"
            className="field-input"
            value={values.interest}
            onChange={(e) => set("interest", e.target.value)}
            aria-invalid={!!errors.interest}
            aria-describedby={errors.interest ? id("interest-err") : undefined}
          >
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.interest ? (
            <p id={id("interest-err")} className="field-error">
              {errors.interest}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              id={id("consent")}
              name="consent"
              type="checkbox"
              className="field-check mt-1"
              checked={values.consent}
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? id("consent-err") : undefined}
            />
            <label htmlFor={id("consent")} className="text-sm text-ink-muted">
              {CONSENT_TEXT} See our{" "}
              <Link href="/privacy" className="link">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="link">
                Terms of Use
              </Link>
              .
            </label>
          </div>
          {errors.consent ? (
            <p id={id("consent-err")} className="field-error">
              {errors.consent}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary" disabled={busy} aria-disabled={busy}>
          {busy ? "Sending…" : "Request a call back"}
        </button>
        {env.phoneDisplay ? (
          <p className="text-sm text-ink-muted">
            Or call <PhoneLink placement="lead-form" offerId={offerId} value={value} className="link font-semibold" />
          </p>
        ) : null}
      </div>
    </form>
  );
}
