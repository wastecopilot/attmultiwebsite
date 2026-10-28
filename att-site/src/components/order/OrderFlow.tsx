"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import Link from "@/components/ui/AppLink";
import type { Offer } from "@/data/offer-types";
import type { OrderablePlan, OrderQuestion } from "@/data/order-plans";
import { Conditions, FinePrint, Price, BroadbandFacts } from "@/components/offers/OfferBits";
import { PhoneLink } from "@/components/PhoneLink";
import { track } from "@/lib/analytics";
import type { OrderOutcome } from "@/lib/order/outcome";
import {
  US_STATES,
  validateAddress,
  validateCustomer,
  type AddressInput,
  type CustomerInput,
  type FieldErrors,
  type OptionAnswers,
} from "@/lib/order/validation";
import { newRequestId, startJob, waitForJob } from "./order-api";

type Step = "plan" | "address" | "quoting" | "options" | "quote" | "details" | "confirm" | "submitting" | "done" | "stop";
type ExtraGroup = Extract<OrderOutcome, { screen: "options" }>["groups"][number];
type Quote = { jobId: string; total: string; lines: { item: string; charge: string }[] };
/** Screens that end the online flow: the visitor is asked to call. */
type Stop =
  | { kind: "failed"; retryable: boolean; retry?: "quote" | "submit" }
  | { kind: "unrequested" }
  | { kind: "plan_unavailable" }
  | { kind: "no_service" };

interface OrderFlowProps {
  /** Offer named in the link (?plan=), orderable online or not; null when none or unknown. */
  initialOffer: Offer | null;
  /** The offers that can be ordered online, with their portal mapping. */
  orderable: { offer: Offer; plan: OrderablePlan }[];
  /** Page the visitor came from (?source=), for analytics only. */
  source: string;
  /** False when the order automation is not configured on the server. */
  onlineAvailable: boolean;
  timeouts: { quoteSeconds: number; handoffSeconds: number };
}

const STEPS = ["Plan", "Address", "Your quote", "Your details", "Confirm"] as const;
const STEP_INDEX: Partial<Record<Step, number>> = { plan: 0, address: 1, quoting: 1, options: 1, quote: 2, details: 3, confirm: 4, submitting: 4 };
const EMPTY_ADDRESS: AddressInput = { street: "", unit: "", city: "", state: "", zip: "" };
const EMPTY_CUSTOMER: CustomerInput = { firstName: "", lastName: "", phone: "", email: "", billingLanguage: "", contactByPhone: "" };

const ADDRESS_NOTICE = {
  not_found: "We could not confirm this service address. Please check the street address and ZIP code.",
  needs_unit: "This address needs an apartment or unit number. Please add it below.",
  ambiguous: "More than one address matched. Please check the street address, apartment or unit number and ZIP code.",
} as const;

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/**
 * The online order flow: Plan → Address → (quote runs) → Your quote → Your details → Confirm → reference.
 * A quote or confirmation is only ever shown when the order automation returned one; every failure ends on
 * an honest "please call" screen. No personal data is kept outside this component's state.
 */
export function OrderFlow({ initialOffer, orderable, source, onlineAvailable, timeouts }: OrderFlowProps) {
  const [offer, setOffer] = useState<Offer | null>(initialOffer);
  const plan = orderable.find((o) => o.offer.id === offer?.id)?.plan;
  const [choosingPlan, setChoosingPlan] = useState(!initialOffer);
  const [step, setStep] = useState<Step>("plan");
  const [answers, setAnswers] = useState<OptionAnswers>({});
  const [extraGroups, setExtraGroups] = useState<ExtraGroup[]>([]);
  const [planError, setPlanError] = useState("");
  const [address, setAddress] = useState<AddressInput>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<FieldErrors<AddressInput>>({});
  const [addressNotice, setAddressNotice] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [customer, setCustomer] = useState<CustomerInput>(EMPTY_CUSTOMER);
  const [customerErrors, setCustomerErrors] = useState<FieldErrors<CustomerInput>>({});
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [reference, setReference] = useState("");
  const [stop, setStop] = useState<Stop | null>(null);
  const [retried, setRetried] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const begun = useRef(false);

  const offerId = offer?.id ?? "none";
  const value = offer?.price?.amount ?? 0;
  const busy = step === "quoting" || step === "submitting";

  useEffect(() => {
    if (begun.current) return;
    begun.current = true;
    track("begin_order", { offer_id: initialOffer?.id, value: initialOffer?.price?.amount ?? 0, source });
  }, [initialOffer, source]);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along (not on page load).
  const shownStep = useRef(step);
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "nearest" });
  }, [step]);

  // Warn before leaving while a request is running; stop polling when the page goes away.
  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);
  useEffect(() => () => abortRef.current?.abort(), []);

  const fail = (next: Stop, reason: string) => {
    track("order_failed", { offer_id: offerId, value, reason });
    setStop(next);
    setStep("stop");
  };

  const choosePlan = (next: Offer) => {
    setOffer(next);
    setAnswers({});
    setExtraGroups([]);
    setQuote(null);
    setPlanError("");
    setChoosingPlan(false);
  };

  const submitPlan = (e: FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    // Groups the portal asked about later (extraGroups) are answered on their own step.
    if (plan.questions.some((q) => answers[q.key] === undefined)) {
      setPlanError("Please choose an option for each item.");
      return;
    }
    setPlanError("");
    setStep("address");
  };

  const runQuote = async (currentAnswers: OptionAnswers) => {
    if (!plan) return;
    setQuote(null);
    setStep("quoting");
    track("order_quote_started", { offer_id: offerId, value });
    const started = await startJob("quote", { requestId: newRequestId(), plan: plan.offerId, options: currentAnswers, address });
    if (started.kind !== "started") return fail({ kind: "failed", retryable: started.kind === "unavailable", retry: "quote" }, started.kind === "rejected" ? "rejected" : "unavailable");
    abortRef.current = new AbortController();
    const outcome = await waitForJob(started.jobId, currentAnswers, timeouts.quoteSeconds, abortRef.current.signal);
    if (outcome === "aborted") return;
    if (outcome === "timeout") return fail({ kind: "failed", retryable: true, retry: "quote" }, "page_timeout");
    switch (outcome.screen) {
      case "quote":
        setQuote({ jobId: started.jobId, total: outcome.total, lines: outcome.lines });
        track("order_quote_shown", { offer_id: offerId, value });
        setStep("quote");
        return;
      case "options":
        setExtraGroups((prev) => [...prev.filter((g) => !outcome.groups.some((n) => n.key === g.key)), ...outcome.groups]);
        setAnswers((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !outcome.groups.some((g) => g.key === k))));
        setStep("options");
        return;
      case "address":
        track("order_failed", { offer_id: offerId, value, reason: `address_${outcome.reason}` });
        setAddressNotice(ADDRESS_NOTICE[outcome.reason]);
        setStep("address");
        return;
      case "plan_unavailable":
        return fail({ kind: "plan_unavailable" }, "plan_unavailable");
      case "no_service":
        return fail({ kind: "no_service" }, "no_service");
      case "call":
        return fail({ kind: "unrequested" }, "unrequested_items");
      case "failed":
        return fail({ kind: "failed", retryable: outcome.retryable, retry: "quote" }, outcome.reason);
      default:
        return fail({ kind: "failed", retryable: false }, "unexpected_screen");
    }
  };

  const submitAddress = (e: FormEvent) => {
    e.preventDefault();
    const { value: clean, errors } = validateAddress(address);
    setAddressErrors(errors);
    if (Object.keys(errors).length) return;
    setAddress(clean);
    setAddressNotice("");
    void runQuote(answers);
  };

  const submitOptions = (e: FormEvent) => {
    e.preventDefault();
    if (extraGroups.some((g) => answers[g.key] === undefined)) {
      setPlanError("Please choose an option for each item.");
      return;
    }
    setPlanError("");
    void runQuote(answers);
  };

  const goToDetails = () => {
    track("order_step_details", { offer_id: offerId, value });
    setStep("details");
  };

  const submitDetails = (e: FormEvent) => {
    e.preventDefault();
    const { value: clean, errors } = validateCustomer(customer);
    setCustomerErrors(errors);
    setConsentError(consent ? "" : "Please confirm to continue.");
    if (Object.keys(errors).length || !consent) return;
    setCustomer(clean);
    setStep("confirm");
  };

  const submitOrder = async () => {
    if (!quote) return;
    setStep("submitting");
    track("order_submit", { offer_id: offerId, value });
    const started = await startJob("submit", { requestId: newRequestId(), quoteJobId: quote.jobId, customer, consent: true });
    if (started.kind !== "started") return fail({ kind: "failed", retryable: started.kind === "unavailable", retry: "submit" }, started.kind === "rejected" ? "rejected" : "unavailable");
    abortRef.current = new AbortController();
    const outcome = await waitForJob(started.jobId, answers, timeouts.handoffSeconds, abortRef.current.signal);
    if (outcome === "aborted") return;
    if (outcome === "timeout") return fail({ kind: "failed", retryable: false }, "page_timeout");
    switch (outcome.screen) {
      case "done":
        setReference(outcome.reference);
        setStep("done");
        return;
      case "details":
        track("order_failed", { offer_id: offerId, value, reason: "customer_details_rejected" });
        setCustomerErrors(
          Object.fromEntries(
            outcome.fields.map((f) => [f, f === "email" ? "This email address was not accepted. Please check it and try again." : "Please check this detail and try again."]),
          ),
        );
        setStep("details");
        return;
      case "call":
        return fail({ kind: "unrequested" }, "unrequested_items");
      case "failed":
        return fail({ kind: "failed", retryable: outcome.retryable, retry: "submit" }, outcome.reason);
      default:
        return fail({ kind: "failed", retryable: false }, "unexpected_screen");
    }
  };

  const retry = () => {
    if (!stop || stop.kind !== "failed" || !stop.retry) return;
    setRetried(true);
    setStop(null);
    if (stop.retry === "quote") void runQuote(answers);
    else void submitOrder();
  };

  const currentIndex = STEP_INDEX[step];
  return (
    <div className="mx-auto max-w-3xl">
      {currentIndex !== undefined ? <StepIndicator current={currentIndex} /> : null}

      <div className="card mt-6 p-5 md:p-8">
        {step === "plan" ? (
          <form onSubmit={submitPlan} noValidate>
            <StepHeading ref={headingRef}>{choosingPlan ? "Choose Your Plan" : "Your Plan"}</StepHeading>
            {choosingPlan || !offer ? (
              <PlanPicker orderable={orderable} selected={plan ? offer?.id : undefined} onChoose={choosePlan} onCancel={offer ? () => setChoosingPlan(false) : undefined} />
            ) : (
              <>
                <SelectedPlan offer={offer} />
                <button type="button" className="link mt-4 font-semibold" onClick={() => setChoosingPlan(true)}>
                  Change plan
                </button>
                {!plan ? (
                  <CallNotice offerId={offerId} value={value} placement="order-not-online">
                    This plan is not available to order online. Please call <PhoneLink placement="order-not-online-text" offerId={offerId} value={value} className="link font-semibold" /> to complete your order, or choose an internet plan above.
                  </CallNotice>
                ) : !onlineAvailable ? (
                  <CallNotice offerId={offerId} value={value} placement="order-offline">
                    Online ordering is currently unavailable. Please call <PhoneLink placement="order-offline-text" offerId={offerId} value={value} className="link font-semibold" /> to complete your order.
                  </CallNotice>
                ) : (
                  <>
                    <Questions questions={plan.questions} answers={answers} onAnswer={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))} showErrors={Boolean(planError)} />
                    {planError ? (
                      <p className="field-error" role="alert">
                        {planError}
                      </p>
                    ) : null}
                    <div className="mt-6">
                      <button type="submit" className="btn btn-primary w-full sm:w-auto">
                        Continue
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </form>
        ) : null}

        {step === "address" ? (
          <form onSubmit={submitAddress} noValidate>
            <StepHeading ref={headingRef}>Service Address</StepHeading>
            <p className="mt-2 text-ink-muted">Enter the address where you would like service. We then check availability and the monthly price for your address.</p>
            {addressNotice ? (
              <p className="form-error-summary mt-4" role="alert">
                {addressNotice}
              </p>
            ) : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-6">
              <Field className="sm:col-span-4" label="Street address" error={addressErrors.street}>
                {(p) => <input {...p} autoComplete="address-line1" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} maxLength={80} />}
              </Field>
              <Field className="sm:col-span-2" label="Apt or unit (optional)" error={addressErrors.unit}>
                {(p) => <input {...p} autoComplete="address-line2" value={address.unit} onChange={(e) => setAddress({ ...address, unit: e.target.value })} maxLength={20} />}
              </Field>
              <Field className="sm:col-span-3" label="City" error={addressErrors.city}>
                {(p) => <input {...p} autoComplete="address-level2" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} maxLength={40} />}
              </Field>
              <Field className="sm:col-span-2" label="State" error={addressErrors.state}>
                {(p) => (
                  <select {...p} autoComplete="address-level1" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                    <option value="">Select</option>
                    {Object.entries(US_STATES).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field className="sm:col-span-1" label="ZIP code" error={addressErrors.zip}>
                {(p) => (
                  <input {...p} autoComplete="postal-code" inputMode="numeric" maxLength={5} value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value.replace(/\D/g, "").slice(0, 5) })} />
                )}
              </Field>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => setStep("plan")}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Check Availability and Price
              </button>
            </div>
          </form>
        ) : null}

        {step === "quoting" ? (
          <Progress headingRef={headingRef} title="Checking Your Address and Price" seconds={45}>
            This usually takes about 45 seconds. Please keep this page open.
          </Progress>
        ) : null}

        {step === "options" ? (
          <form onSubmit={submitOptions} noValidate>
            <StepHeading ref={headingRef}>A Few More Choices</StepHeading>
            <p className="mt-2 text-ink-muted">Please choose an option for each item below. Nothing has been selected for you.</p>
            <Questions questions={extraGroups} answers={answers} onAnswer={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))} showErrors={Boolean(planError)} />
            {planError ? (
              <p className="field-error" role="alert">
                {planError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => setStep("plan")}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Update My Quote
              </button>
            </div>
          </form>
        ) : null}

        {step === "quote" && quote ? (
          <div>
            <StepHeading ref={headingRef}>Your Quote</StepHeading>
            <p className="mt-2 text-ink-muted">Monthly price for {offer?.title} at your address.</p>
            <QuoteTable quote={quote} />
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => setStep("plan")}>
                Change Plan or Options
              </button>
              <button type="button" className="btn btn-primary" onClick={goToDetails}>
                Continue
              </button>
            </div>
          </div>
        ) : null}

        {step === "details" ? (
          <form onSubmit={submitDetails} noValidate>
            <StepHeading ref={headingRef}>Your Details</StepHeading>
            <p className="mt-2 text-ink-muted">We use these details to contact you about your order request.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="First name" error={customerErrors.firstName}>
                {(p) => <input {...p} autoComplete="given-name" maxLength={40} value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} />}
              </Field>
              <Field label="Last name" error={customerErrors.lastName}>
                {(p) => <input {...p} autoComplete="family-name" maxLength={40} value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} />}
              </Field>
              <Field label="Phone number" error={customerErrors.phone}>
                {(p) => <input {...p} type="tel" autoComplete="tel-national" inputMode="tel" maxLength={20} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />}
              </Field>
              <Field label="Email address" error={customerErrors.email}>
                {(p) => <input {...p} type="email" autoComplete="email" maxLength={254} value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />}
              </Field>
            </div>
            <RadioGroup
              legend="Billing language"
              name="billingLanguage"
              value={customer.billingLanguage}
              error={customerErrors.billingLanguage}
              options={[
                { value: "english", label: "English" },
                { value: "spanish", label: "Spanish" },
              ]}
              onChange={(v) => setCustomer({ ...customer, billingLanguage: v as CustomerInput["billingLanguage"] })}
            />
            <RadioGroup
              legend="Contact preference"
              hint="May we contact you by phone or text with information about your services, such as installation and repair appointments, billing and account information, and customer satisfaction inquiries?"
              name="contactByPhone"
              value={customer.contactByPhone}
              error={customerErrors.contactByPhone}
              options={[
                { value: "yes", label: "Yes, you may contact me by phone or text" },
                { value: "no", label: "No, please do not" },
              ]}
              onChange={(v) => setCustomer({ ...customer, contactByPhone: v as CustomerInput["contactByPhone"] })}
            />
            <div className="mt-6 flex gap-3">
              <input id="order-consent" type="checkbox" className="field-check mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={Boolean(consentError)} aria-describedby={consentError ? "order-consent-error" : undefined} />
              <label htmlFor="order-consent" className="text-sm text-ink">
                I confirm that the details above are correct and agree to be contacted by phone or email about this order request. I have read the{" "}
                <Link href="/privacy" className="link" target="_blank" rel="noopener">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="link" target="_blank" rel="noopener">
                  Terms of Use
                </Link>
                .
              </label>
            </div>
            {consentError ? (
              <p id="order-consent-error" className="field-error" role="alert">
                {consentError}
              </p>
            ) : null}
            <p className="field-hint mt-4">We never ask for your Social Security number, date of birth or payment details online.</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => setStep("quote")}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Review Order Request
              </button>
            </div>
          </form>
        ) : null}

        {step === "confirm" && quote && offer ? (
          <div>
            <StepHeading ref={headingRef}>Confirm Your Order Request</StepHeading>
            <dl className="mt-5 divide-y divide-border">
              <Summary label="Plan" onEdit={() => setStep("plan")}>
                {offer.title}
              </Summary>
              <Summary label="Monthly total">
                {quote.total} <span className="text-ink-muted">plus taxes and fees</span>
              </Summary>
              <Summary label="Service address" onEdit={() => setStep("address")}>
                {address.street}
                {address.unit ? `, ${address.unit}` : ""}, {address.city}, {address.state} {address.zip}
              </Summary>
              <Summary label="Contact details" onEdit={() => setStep("details")}>
                {customer.firstName} {customer.lastName}
                <br />
                {customer.phone}
                <br />
                {customer.email}
              </Summary>
            </dl>
            <QuoteTable quote={quote} compact />
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => setStep("details")}>
                Back
              </button>
              <button type="button" className="btn btn-primary" onClick={() => void submitOrder()}>
                Submit Order Request
              </button>
            </div>
          </div>
        ) : null}

        {step === "submitting" ? (
          <Progress headingRef={headingRef} title="Sending Your Order Request" seconds={20}>
            This usually takes less than a minute. Please keep this page open.
          </Progress>
        ) : null}

        {step === "done" ? (
          <div role="status">
            <StepHeading ref={headingRef}>Thank You. Your Order Request Has Been Received.</StepHeading>
            <p className="mt-4 text-ink">Reference number</p>
            <p className="mt-1 text-3xl font-bold tracking-wide text-ink" data-order-reference>
              {reference}
            </p>
            <p className="mt-4 text-ink">A specialist will contact you to complete the credit check and payment. Please keep your reference number for your records.</p>
            <div className="mt-6">
              <PhoneLink placement="order-done" offerId={offerId} value={value} className="btn btn-primary" label="Call Now" />
            </div>
          </div>
        ) : null}

        {step === "stop" && stop ? (
          <div role="alert">
            {stop.kind === "unrequested" ? (
              <>
                <StepHeading ref={headingRef}>Please Call Us to Complete Your Order</StepHeading>
                <p className="mt-3 text-ink">We could not prepare this order online exactly as you requested. Please call <PhoneLink placement="order-unrequested-text" offerId={offerId} value={value} className="link font-semibold" /> to complete your order.</p>
              </>
            ) : stop.kind === "plan_unavailable" ? (
              <>
                <StepHeading ref={headingRef}>This Plan Is Not Available Online at Your Address</StepHeading>
                <p className="mt-3 text-ink">Please choose another plan, or call <PhoneLink placement="order-plan-unavailable-text" offerId={offerId} value={value} className="link font-semibold" /> to hear the plans available at your address.</p>
              </>
            ) : stop.kind === "no_service" ? (
              <>
                <StepHeading ref={headingRef}>We Could Not Find Online Offers for This Address</StepHeading>
                <p className="mt-3 text-ink">Please check the address, or call <PhoneLink placement="order-no-service-text" offerId={offerId} value={value} className="link font-semibold" /> to confirm the services available at your address.</p>
              </>
            ) : (
              <>
                <StepHeading ref={headingRef}>We Could Not Complete Your Request Online</StepHeading>
                <p className="mt-3 text-ink">
                  We could not complete your request online. Please call <PhoneLink placement="order-failed-text" offerId={offerId} value={value} className="link font-semibold" /> to complete your order.
                </p>
              </>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PhoneLink placement={`order-${stop.kind}`} offerId={offerId} value={value} className="btn btn-primary" label="Call Now" />
              {stop.kind === "failed" && stop.retryable && stop.retry && !retried ? (
                <button type="button" className="btn btn-secondary" onClick={retry}>
                  Try Again
                </button>
              ) : null}
              {stop.kind === "plan_unavailable" ? (
                <button type="button" className="btn btn-secondary" onClick={() => (setChoosingPlan(true), setStop(null), setStep("plan"))}>
                  Choose Another Plan
                </button>
              ) : null}
              {stop.kind === "no_service" ? (
                <button type="button" className="btn btn-secondary" onClick={() => (setStop(null), setStep("address"))}>
                  Check the Address
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Order progress">
      <p className="text-sm font-semibold text-ink-muted sm:hidden">
        Step {current + 1} of {STEPS.length}: {STEPS[current]}
      </p>
      <ol className="hidden gap-2 sm:flex">
        {STEPS.map((label, i) => (
          <li
            key={label}
            aria-current={i === current ? "step" : undefined}
            className={`flex-1 border-t-4 pt-2 text-sm font-semibold ${i <= current ? "border-brand text-ink" : "border-border text-ink-muted"}`}
          >
            <span className="sr-only">Step {i + 1}: </span>
            {label}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepHeading({ ref, children }: { ref: Ref<HTMLHeadingElement>; children: ReactNode }) {
  return (
    <h2 ref={ref} tabIndex={-1} className="scroll-mt-32 text-2xl font-bold text-ink outline-none md:text-3xl">
      {children}
    </h2>
  );
}

function SelectedPlan({ offer }: { offer: Offer }) {
  return (
    <div className="mt-4 rounded-xl border border-border p-5">
      <p className="text-lg font-bold text-ink">{offer.title}</p>
      {offer.speed ? <p className="text-sm text-ink-muted">{offer.speed}</p> : null}
      {offer.price ? (
        <div className="mt-3">
          <Price price={offer.price} size="md" />
        </div>
      ) : null}
      <Conditions items={offer.conditions} />
      <BroadbandFacts offer={offer} />
      <p className="as-of">Offer details as of {formatDate(offer.retrievedAt)}.</p>
      <FinePrint offer={offer} />
    </div>
  );
}

function PlanPicker({ orderable, selected, onChoose, onCancel }: { orderable: { offer: Offer }[]; selected?: string; onChoose: (o: Offer) => void; onCancel?: () => void }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-ink-muted">Select the internet plan you would like to order.</legend>
      <div className="mt-3 grid gap-3">
        {orderable.map(({ offer }) => (
          <button
            key={offer.id}
            type="button"
            onClick={() => onChoose(offer)}
            aria-pressed={selected === offer.id}
            className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-left ${selected === offer.id ? "border-brand bg-brand-tint" : "border-border hover:border-brand"}`}
          >
            <span>
              <span className="block font-bold text-ink">{offer.title}</span>
              {offer.speed ? <span className="block text-sm text-ink-muted">{offer.speed}</span> : null}
            </span>
            {offer.price ? (
              <span className="shrink-0 text-right font-bold text-ink">
                ${offer.price.amount}
                {offer.price.unit}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      {onCancel ? (
        <button type="button" className="link mt-4 font-semibold" onClick={onCancel}>
          Keep my current plan
        </button>
      ) : null}
    </fieldset>
  );
}

function Questions({
  questions,
  answers,
  onAnswer,
  showErrors,
}: {
  questions: (OrderQuestion | ExtraGroup)[];
  answers: OptionAnswers;
  onAnswer: (key: string, value: boolean | string) => void;
  showErrors: boolean;
}) {
  if (!questions.length) return null;
  return (
    <div className="mt-6 space-y-5">
      {questions.map((q) => {
        const isPlanQuestion = "legend" in q;
        const options = isPlanQuestion
          ? q.choices.map((c) => ({ value: c.value, label: c.label }))
          : q.choices.map((c) => ({ value: c.title as boolean | string, label: c.price ? `${c.title} (${c.price})` : c.title }));
        return (
          <RadioGroup
            key={q.key}
            legend={isPlanQuestion ? q.legend : q.heading || "Please choose an option"}
            hint={isPlanQuestion ? q.hint : undefined}
            name={`option-${q.key}`}
            value={answers[q.key] === undefined ? "" : String(answers[q.key])}
            error={showErrors && answers[q.key] === undefined ? "Please choose an option." : undefined}
            options={options.map((o) => ({ value: String(o.value), label: o.label }))}
            onChange={(v) => onAnswer(q.key, options.find((o) => String(o.value) === v)!.value)}
          />
        );
      })}
    </div>
  );
}

function RadioGroup({
  legend,
  hint,
  name,
  value,
  error,
  options,
  onChange,
}: {
  legend: string;
  hint?: string;
  name: string;
  value: string;
  error?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <fieldset className="mt-5" aria-describedby={[hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}>
      <legend className="field-label">{legend}</legend>
      {hint ? (
        <p id={`${id}-hint`} className="field-hint mb-2">
          {hint}
        </p>
      ) : null}
      <div className="grid gap-2">
        {options.map((o) => (
          <label key={o.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${value === o.value ? "border-brand bg-brand-tint" : "border-border"}`}>
            <input type="radio" className="field-check" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="text-ink">{o.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

type FieldProps = { id: string; name: string; className: string; "aria-invalid": boolean; "aria-describedby"?: string };

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: (props: FieldProps) => ReactNode }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children({ id, name: id, className: "field-input", "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined })}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Progress({ headingRef, title, seconds, children }: { headingRef: Ref<HTMLHeadingElement>; title: string; seconds: number; children: ReactNode }) {
  return (
    <div role="status" aria-live="polite">
      <StepHeading ref={headingRef}>{title}</StepHeading>
      <p className="mt-3 text-ink">{children}</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-surface-alt" aria-hidden="true">
        <div className="order-progress-bar h-full rounded-full bg-brand" style={{ animationDuration: `${seconds}s` }} />
      </div>
    </div>
  );
}

function QuoteTable({ quote, compact = false }: { quote: Quote; compact?: boolean }) {
  return (
    <table className={`data-table ${compact ? "mt-6" : "mt-5"}`}>
      <caption className="sr-only">Monthly charges</caption>
      <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col" className="text-right">
            Monthly
          </th>
        </tr>
      </thead>
      <tbody>
        {quote.lines.map((l, i) => (
          <tr key={`${l.item}-${i}`}>
            <td>{l.item}</td>
            <td className="whitespace-nowrap text-right">{l.charge}</td>
          </tr>
        ))}
        <tr>
          <th scope="row" className="text-ink">
            Monthly total
          </th>
          <td className="whitespace-nowrap text-right text-lg font-bold text-ink" data-order-total>
            {quote.total}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2} className="text-sm text-ink-muted">
            Plus taxes and fees.
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function Summary({ label, onEdit, children }: { label: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <dt className="text-sm font-semibold text-ink-muted">{label}</dt>
        <dd className="mt-1 text-ink">{children}</dd>
      </div>
      {onEdit ? (
        <button type="button" className="link self-start text-sm font-semibold" onClick={onEdit}>
          Edit<span className="sr-only"> {label.toLowerCase()}</span>
        </button>
      ) : null}
    </div>
  );
}

function CallNotice({ offerId, value, placement, children }: { offerId: string; value: number; placement: string; children: ReactNode }) {
  return (
    <div className="mt-6 rounded-xl bg-surface-alt p-5" role="status">
      <p className="text-ink">{children}</p>
      <div className="mt-4">
        <PhoneLink placement={placement} offerId={offerId} value={value} className="btn btn-primary" label="Call Now" />
      </div>
    </div>
  );
}
