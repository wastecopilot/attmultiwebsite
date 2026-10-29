"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import Link from "@/components/ui/AppLink";
import type { Offer } from "@/data/offer-types";
import { AsOf, Conditions, FinePrint, Price } from "@/components/offers/OfferBits";
import { PhoneLink } from "@/components/PhoneLink";
import { track } from "@/lib/analytics";
import type { ChosenOption, Expected, OptionGroup, OrderOutcome, QuoteLine } from "@/lib/order/outcome";
import { amount } from "@/lib/order/price";
import {
  US_STATES,
  validateAddress,
  validateCreditCheck,
  validateCustomer,
  type AddressInput,
  type CreditCheckInput,
  type CustomerInput,
  type FieldErrors,
  type OptionAnswers,
} from "@/lib/order/validation";
import { newRequestId, startJob, waitForJob } from "./order-api";

type Step = "address" | "plans" | "options" | "quote" | "details" | "review" | "working" | "done" | "stop" | "not_online";
type Work = "plans" | "options" | "quote" | "submit";
type Quote = { jobId: string; total: string; attComPrice: string; lines: QuoteLine[]; included: string[]; chosen: ChosenOption[]; orderId: string };
/** Screens that end the online flow: the visitor is asked to call. */
type Stop = { kind: "failed"; retryable: boolean; retry?: Work } | { kind: "unrequested" } | { kind: "mismatch" } | { kind: "no_service" };

interface OrderFlowProps {
  /** Marketing offer named in the link (?plan=), if any. */
  initialOffer: Offer | null;
  /** The att.com plans (offers.ts) that can be ordered online; the portal says which are available at the address. */
  plans: Offer[];
  /** The raw ?plan= value (an offer id, or a portal plan id such as "internet-100"). */
  planParam: string;
  /** False when ?plan= names an offer that cannot be ordered online (wireless, phone, bundles). */
  planOrderableOnline: boolean;
  /** Page the visitor came from (?source=), for analytics only. */
  source: string;
  onlineAvailable: boolean;
  timeouts: { quoteSeconds: number; handoffSeconds: number };
}

const STEPS = ["Address", "Plans", "Options", "Your quote", "Your details", "Review"] as const;
const STEP_INDEX: Partial<Record<Step, number>> = { address: 0, plans: 1, options: 2, quote: 3, details: 4, review: 5 };
const WORK_STEP: Record<Work, number> = { plans: 0, options: 1, quote: 2, submit: 5 };
const EMPTY_ADDRESS: AddressInput = { street: "", unit: "", city: "", state: "", zip: "" };
const EMPTY_CREDIT_CHECK: CreditCheckInput = { dateOfBirth: "", ssn: "", consent: false };
// English is pre-selected for billing, as on the portal's Personal Information page.
const EMPTY_CUSTOMER: CustomerInput = { firstName: "", lastName: "", phone: "", email: "", confirmEmail: "", billingLanguage: "english", contactByPhone: false };

const ADDRESS_NOTICE = {
  not_found: "We could not confirm this service address. Please check the street address and ZIP code.",
  needs_unit: "This address needs an apartment or unit number. Please add it below.",
  ambiguous: "More than one address matched. Please check the street address, apartment or unit number and ZIP code.",
} as const;
const EMAIL_REJECTED = "This email address was not accepted. Please enter a working email address that can receive mail.";

const WORK_TEXT: Record<Work, { title: string; text: string; seconds: number }> = {
  plans: { title: "Checking the Plans at Your Address", text: "This usually takes less than a minute. Please keep this page open.", seconds: 45 },
  options: { title: "Getting the Options for Your Plan", text: "This usually takes less than a minute. Please keep this page open.", seconds: 30 },
  quote: { title: "Preparing Your Quote", text: "This usually takes less than a minute. Please keep this page open.", seconds: 40 },
  submit: { title: "Sending Your Order Request", text: "This usually takes less than a minute. Please keep this page open.", seconds: 25 },
};

/** An option group where AT&T offers a single choice at no charge (e.g. equipment, installation): no question to ask. */
const isFixed = (g: OptionGroup) => g.choices.length === 1 && g.choices[0].kind === "free";

/** att.com's own AutoPay & paperless discount paragraph from the plan's fine print, shown with the AutoPay choice. */
const autopayText = (offer: Offer) => offer.finePrint.split(/\n\n/).find((p) => /^auto ?pay & paperless bill discount/i.test(p.trim())) ?? "";

/** Keeps ?plan= in the address bar equal to the plan highlighted on the page (other parameters untouched). */
function showPlanInUrl(offerId: string) {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("plan", offerId);
    window.history.replaceState(window.history.state, "", url);
  } catch {
    // Older browsers: the page still works, only the address bar is not updated.
  }
}

/**
 * The online order flow, mirroring the AT&T partner portal: Address → Plans at that address → Options →
 * Your quote (the portal cart) → Your details → Review → reference. Plans, prices, options and the cart
 * are only ever the portal's own answers; every failure ends on an honest "please call" screen. No
 * personal data is kept outside this component's state.
 */
export function OrderFlow({ initialOffer, plans, planParam, planOrderableOnline, source, onlineAvailable, timeouts }: OrderFlowProps) {
  const [step, setStep] = useState<Step>(planOrderableOnline ? "address" : "not_online");
  const [work, setWork] = useState<Work>("plans");
  const [address, setAddress] = useState<AddressInput>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<FieldErrors<AddressInput>>({});
  const [addressNotice, setAddressNotice] = useState("");
  const [plansJobId, setPlansJobId] = useState("");
  const [available, setAvailable] = useState<string[]>([]);
  const [plansNotice, setPlansNotice] = useState("");
  const [planId, setPlanId] = useState("");
  const [planError, setPlanError] = useState("");
  const [groups, setGroups] = useState<OptionGroup[]>([]);
  const [included, setIncluded] = useState<string[]>([]);
  const [answers, setAnswers] = useState<OptionAnswers>({});
  const [autoAnswers, setAutoAnswers] = useState<OptionAnswers>({});
  const [hiddenAddOns, setHiddenAddOns] = useState<string[]>([]);
  const [optionsError, setOptionsError] = useState("");
  const [optionsNotice, setOptionsNotice] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [customer, setCustomer] = useState<CustomerInput>(EMPTY_CUSTOMER);
  const [customerErrors, setCustomerErrors] = useState<FieldErrors<CustomerInput>>({});
  const [consent, setConsent] = useState(false);
  // Date of birth and SSN live only in this state, are sent once with the order request and are cleared after.
  const [creditCheck, setCreditCheck] = useState<CreditCheckInput>(EMPTY_CREDIT_CHECK);
  const [creditErrors, setCreditErrors] = useState<FieldErrors<CreditCheckInput>>({});
  const [showSsn, setShowSsn] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [reference, setReference] = useState("");
  const [orderId, setOrderId] = useState("");
  const [stop, setStop] = useState<Stop | null>(null);
  const [retried, setRetried] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const begun = useRef(false);

  const plan = plans.find((p) => p.id === planId);
  const offerId = plan?.id ?? initialOffer?.id ?? "none";
  const value = plan?.price?.amount ?? initialOffer?.price?.amount ?? 0;
  const busy = step === "working";

  useEffect(() => {
    if (begun.current) return;
    begun.current = true;
    track("begin_order", { offer_id: initialOffer?.id ?? (planParam || undefined), value: initialOffer?.price?.amount ?? 0, source });
  }, [initialOffer, planParam, source]);

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
    if (next.kind !== "failed" || next.retry !== "submit") setCreditCheck(EMPTY_CREDIT_CHECK);
    track("order_failed", { offer_id: offerId, value, reason });
    setStop(next);
    setStep("stop");
  };

  /** Starts a job and waits for its outcome; null when the page went away or the start already failed. */
  const run = async (kind: Work, body: unknown, expected: Expected, seconds: number): Promise<{ jobId: string; outcome: OrderOutcome } | null> => {
    setWork(kind);
    setStep("working");
    const started = await startJob(kind === "submit" ? "submit" : kind === "plans" ? "plans" : "quote", body);
    if (started.kind !== "started") {
      fail({ kind: "failed", retryable: started.kind === "unavailable", retry: kind }, started.kind === "rejected" ? "rejected" : "unavailable");
      return null;
    }
    abortRef.current = new AbortController();
    const outcome = await waitForJob(started.jobId, expected, seconds, abortRef.current.signal);
    if (outcome === "aborted") return null;
    if (outcome === "timeout") {
      fail({ kind: "failed", retryable: kind !== "submit", retry: kind }, "page_timeout");
      return null;
    }
    return { jobId: started.jobId, outcome };
  };

  const backToAddress = (reason: keyof typeof ADDRESS_NOTICE) => {
    track("order_failed", { offer_id: offerId, value, reason: `address_${reason}` });
    setAddressNotice(ADDRESS_NOTICE[reason]);
    setStep("address");
  };

  // ------------------------------------------------------------------ step 1 → 2: plans at the address
  const submitAddress = (e: FormEvent) => {
    e.preventDefault();
    const { value: clean, errors } = validateAddress(address);
    setAddressErrors(errors);
    if (Object.keys(errors).length) return;
    setAddress(clean);
    setAddressNotice("");
    void findPlansFor(clean);
  };

  const findPlansFor = async (addr: AddressInput) => {
    setAvailable([]);
    setPlanId("");
    setPlansNotice("");
    setQuote(null);
    const res = await run("plans", { requestId: newRequestId(), address: addr }, {}, timeouts.quoteSeconds);
    if (!res) return;
    handlePlans(res.jobId, res.outcome);
  };

  const handlePlans = (jobId: string, outcome: OrderOutcome) => {
    if (outcome.screen === "plans") {
      setPlansJobId(jobId);
      const ids = outcome.offerIds.filter((id) => plans.some((p) => p.id === id));
      if (!ids.length) return fail({ kind: "no_service" }, "no_plans");
      setAvailable(ids);
      const match = ids.includes(planParam) ? plans.find((p) => p.id === planParam) : undefined;
      if (match) {
        setPlanId(match.id);
        showPlanInUrl(match.id);
      } else if (initialOffer && plans.some((p) => p.id === initialOffer.id)) {
        setPlansNotice(`${initialOffer.title} is not available at this address. These plans are available:`);
      }
      track("order_plans_shown", { offer_id: match?.id ?? "none", value: match?.price?.amount ?? 0, plans_count: ids.length });
      setStep("plans");
      return;
    }
    if (outcome.screen === "address") return backToAddress(outcome.reason);
    if (outcome.screen === "no_service") return fail({ kind: "no_service" }, "no_plans");
    if (outcome.screen === "failed") return fail({ kind: "failed", retryable: outcome.retryable, retry: "plans" }, outcome.reason);
    return fail({ kind: "failed", retryable: false }, "unexpected_screen");
  };

  // ------------------------------------------------------------------ step 2 → 3: the plan's real options
  const choosePlan = (id: string) => {
    setPlanId(id);
    setPlanError("");
    showPlanInUrl(id);
  };

  const handleQuoteOutcome = (jobId: string, outcome: OrderOutcome, sentAnswers: OptionAnswers) => {
    switch (outcome.screen) {
      case "options":
        setGroups(outcome.groups);
        setIncluded(outcome.included);
        setAutoAnswers(outcome.autoAnswers);
        setHiddenAddOns(outcome.hiddenAddOns);
        // Single-choice items are taken as they are (there is nothing to choose); earlier answers are kept for
        // groups still offered; nothing else is preselected.
        setAnswers({
          ...Object.fromEntries(Object.entries(sentAnswers).filter(([k, v]) => outcome.groups.some((g) => g.key === k && g.choices.some((c) => c.title === v)))),
          ...Object.fromEntries(outcome.groups.filter(isFixed).map((g) => [g.key, g.choices[0].title])),
        });
        setOptionsNotice(Object.keys(sentAnswers).length ? "The plan asked for one more choice. Please check the options below." : "");
        setStep("options");
        return;
      case "quote":
        setQuote({ jobId, total: outcome.total, attComPrice: outcome.attComPrice, lines: outcome.lines, included: outcome.included, chosen: outcome.chosen, orderId: outcome.orderId });
        track("order_quote_shown", { offer_id: offerId, value: amount(outcome.total) });
        setStep("quote");
        return;
      case "plan_unavailable":
        setPlansNotice("This plan is no longer offered at this address. Please choose another plan.");
        setPlanId("");
        setStep("plans");
        return;
      case "address":
        return backToAddress(outcome.reason);
      case "no_service":
        return fail({ kind: "no_service" }, "no_service");
      case "call":
        if (outcome.reason === "price_mismatch") return fail({ kind: "mismatch" }, "price_mismatch");
        return fail({ kind: "unrequested" }, outcome.reason === "not_online" ? "not_online" : "unrequested_items");
      case "failed":
        return fail({ kind: "failed", retryable: outcome.retryable, retry: Object.keys(sentAnswers).length ? "quote" : "options" }, outcome.reason);
      default:
        return fail({ kind: "failed", retryable: false }, "unexpected_screen");
    }
  };

  const getOptions = async () => {
    if (!plan) return;
    setGroups([]);
    setIncluded([]);
    setAnswers({});
    setAutoAnswers({});
    setHiddenAddOns([]);
    setOptionsNotice("");
    const res = await run("options", { requestId: newRequestId(), plansJobId, offerId: plan.id, options: {} }, { offerId: plan.id, zip: address.zip, options: {} }, timeouts.quoteSeconds);
    if (res) handleQuoteOutcome(res.jobId, res.outcome, {});
  };

  const submitPlan = (e: FormEvent) => {
    e.preventDefault();
    if (!plan) {
      setPlanError("Please choose a plan.");
      return;
    }
    void getOptions();
  };

  // ------------------------------------------------------------------ step 3 → 4: the portal cart
  const getQuote = async (chosen: OptionAnswers) => {
    if (!plan) return;
    setQuote(null);
    track("order_quote_started", { offer_id: offerId, value });
    // Add-ons att.com does not price were not shown and stay on their Decline choice.
    const sent = { ...autoAnswers, ...chosen };
    const res = await run("quote", { requestId: newRequestId(), plansJobId, offerId: plan.id, options: sent }, { offerId: plan.id, zip: address.zip, options: sent }, timeouts.quoteSeconds);
    if (res) handleQuoteOutcome(res.jobId, res.outcome, chosen);
  };

  const submitOptions = (e: FormEvent) => {
    e.preventDefault();
    if (groups.some((g) => answers[g.key] === undefined)) {
      setOptionsError("Please choose an option for each item.");
      return;
    }
    setOptionsError("");
    track("order_options_chosen", { offer_id: offerId, value, options_count: groups.length });
    void getQuote(answers);
  };

  // ------------------------------------------------------------------ steps 5-6: details, review, submit
  const goToDetails = () => {
    track("order_step_details", { offer_id: offerId, value: quote ? amount(quote.total) : value });
    setStep("details");
  };

  const submitDetails = (e: FormEvent) => {
    e.preventDefault();
    const { value: clean, errors } = validateCustomer(customer);
    const { value: cleanCredit, errors: ccErrors } = validateCreditCheck(creditCheck);
    setCustomerErrors(errors);
    setCreditErrors(ccErrors);
    setConsentError(consent ? "" : "Please confirm to continue.");
    if (Object.keys(errors).length || Object.keys(ccErrors).length || !consent) return;
    setCustomer(clean);
    setCreditCheck(cleanCredit);
    setShowSsn(false);
    setStep("review");
  };

  const submitOrder = async () => {
    if (!quote) return;
    track("order_submit", { offer_id: offerId, value: amount(quote.total) });
    const res = await run("submit", { requestId: newRequestId(), quoteJobId: quote.jobId, customer, creditCheck, consent: true }, { offerId: plan?.id, zip: address.zip, options: { ...autoAnswers, ...answers } }, timeouts.handoffSeconds);
    if (!res) return;
    const { outcome } = res;
    switch (outcome.screen) {
      case "done":
        setCreditCheck(EMPTY_CREDIT_CHECK);
        setReference(outcome.reference);
        setOrderId(outcome.orderId || quote?.orderId || "");
        setStep("done");
        return;
      case "details": {
        track("order_failed", { offer_id: offerId, value, reason: "customer_details_rejected" });
        const contact = outcome.fields.filter((f) => f !== "dateOfBirth" && f !== "ssn");
        setCustomerErrors(Object.fromEntries(contact.map((f) => [f, f === "email" ? EMAIL_REJECTED : "Please check this detail and try again."])));
        setCreditErrors({
          ...(outcome.fields.includes("dateOfBirth") ? { dateOfBirth: "The date of birth was not accepted. Please check it." } : {}),
          ...(outcome.fields.includes("ssn") ? { ssn: "The Social Security number was not accepted. Please check it." } : {}),
        });
        // Only an SSN the portal refused has to be typed again; otherwise the customer just fixes the field named.
        if (outcome.fields.includes("ssn")) setCreditCheck((c) => ({ ...c, ssn: "" }));
        setStep("details");
        return;
      }
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
    if (stop.retry === "plans") void findPlansFor(address);
    else if (stop.retry === "options") void getOptions();
    else if (stop.retry === "quote") void getQuote(answers);
    else void submitOrder();
  };

  const currentIndex = step === "working" ? WORK_STEP[work] : STEP_INDEX[step];
  const addressText = `${address.street}${address.unit ? `, ${address.unit}` : ""}, ${address.city}, ${address.state} ${address.zip}`;

  if (!onlineAvailable && step !== "not_online") {
    return (
      <div className="mx-auto max-w-3xl">
        <CallNotice offerId={offerId} value={value} placement="order-offline">
          Online ordering is currently unavailable. Please call <PhoneLink placement="order-offline-text" offerId={offerId} value={value} className="link font-semibold" /> to
          complete your order.
        </CallNotice>
      </div>
    );
  }

  return (
    // Step 5 is wider: like the portal's Personal Information page, it shows the cart beside the form.
    <div className={`mx-auto ${step === "details" && quote ? "max-w-6xl" : "max-w-3xl"}`}>
      {currentIndex !== undefined ? <StepIndicator current={currentIndex} /> : null}

      <div className="card mt-6 p-5 md:p-8">
        {step === "not_online" ? (
          <div>
            <StepHeading ref={headingRef}>{initialOffer ? `${initialOffer.title} Cannot Be Ordered Online` : "Please Call to Order"}</StepHeading>
            <p className="mt-3 text-ink">
              This plan is not available to order online. Please call <PhoneLink placement="order-not-online-text" offerId={offerId} value={value} className="link font-semibold" /> to
              complete your order.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PhoneLink placement="order-not-online" offerId={offerId} value={value} className="btn btn-primary" label="Call Now" />
              {onlineAvailable ? (
                <button type="button" className="btn btn-secondary" onClick={() => setStep("address")}>
                  Order AT&amp;T Internet Online
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === "address" ? (
          <form onSubmit={submitAddress} noValidate>
            <StepHeading ref={headingRef}>Your Service Address</StepHeading>
            <p className="mt-2 text-ink-muted">We check the AT&amp;T Internet plans and prices available at this address.</p>
            {addressNotice ? (
              <p className="mt-4 rounded-xl bg-surface-alt p-4 text-ink" role="alert">
                {addressNotice}
              </p>
            ) : null}
            <div className="mt-5 grid gap-4 sm:grid-cols-6">
              <Field label="Street address" error={addressErrors.street} className="sm:col-span-4">
                {(p) => <input {...p} autoComplete="address-line1" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} maxLength={80} />}
              </Field>
              <Field label="Apartment or unit (optional)" error={addressErrors.unit} className="sm:col-span-2">
                {(p) => <input {...p} autoComplete="address-line2" value={address.unit} onChange={(e) => setAddress({ ...address, unit: e.target.value })} maxLength={20} />}
              </Field>
              <Field label="City" error={addressErrors.city} className="sm:col-span-3">
                {(p) => <input {...p} autoComplete="address-level2" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} maxLength={40} />}
              </Field>
              <Field label="State" error={addressErrors.state} className="sm:col-span-1">
                {(p) => (
                  <select {...p} autoComplete="address-level1" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                    <option value="">Select</option>
                    {Object.keys(US_STATES).map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field label="ZIP code" error={addressErrors.zip} className="sm:col-span-2">
                {(p) => (
                  <input {...p} autoComplete="postal-code" inputMode="numeric" maxLength={5} value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value.replace(/\D/g, "").slice(0, 5) })} />
                )}
              </Field>
            </div>
            <div className="mt-6">
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Show Plans at This Address
              </button>
            </div>
          </form>
        ) : null}

        {step === "working" ? (
          <Progress headingRef={headingRef} title={WORK_TEXT[work].title} seconds={WORK_TEXT[work].seconds}>
            {WORK_TEXT[work].text}
          </Progress>
        ) : null}

        {step === "plans" ? (
          <form onSubmit={submitPlan} noValidate>
            <StepHeading ref={headingRef}>Plans Available at Your Address</StepHeading>
            <p className="mt-2 text-ink-muted">
              {addressText}{" "}
              <button type="button" className="link font-semibold" onClick={() => setStep("address")}>
                Change address
              </button>
            </p>
            {plansNotice ? (
              <p className="mt-4 rounded-xl bg-surface-alt p-4 font-semibold text-ink" role="status" data-plan-unavailable>
                {plansNotice}
              </p>
            ) : null}
            <PlanList plans={available.map((id) => plans.find((p) => p.id === id)!).filter(Boolean)} selected={planId} onChoose={choosePlan} />
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
          </form>
        ) : null}

        {step === "options" && plan ? (
          <form onSubmit={submitOptions} noValidate>
            <StepHeading ref={headingRef}>Choose Your Options</StepHeading>
            <p className="mt-2 text-ink-muted">
              {plan.title}, ${plan.price?.amount}/mo. with AutoPay &amp; paperless bill.{" "}
              <button type="button" className="link font-semibold" onClick={() => setStep("plans")}>
                Change plan
              </button>
            </p>
            {optionsNotice ? (
              <p className="mt-4 rounded-xl bg-surface-alt p-4 text-ink" role="status">
                {optionsNotice}
              </p>
            ) : null}
            <p className="mt-4 text-ink">Choose one option in each section. Paid add-ons are only added if you choose them.</p>
            <div className="mt-2 space-y-2">
              {groups.filter((g) => !isFixed(g)).map((g) => (
                <RadioGroup
                  key={g.key}
                  legend={g.heading || "Please choose an option"}
                  name={`option-${g.key}`}
                  value={typeof answers[g.key] === "string" ? (answers[g.key] as string) : ""}
                  error={optionsError && answers[g.key] === undefined ? "Please choose an option." : undefined}
                  options={g.choices.map((c) => ({
                    value: c.title,
                    label: c.title,
                    price: c.kind === "autopay" && plan.autopayDiscount ? `-$${plan.autopayDiscount}/mo.` : undefined,
                    hint: c.kind === "autopay" ? autopayText(plan) : c.details,
                  }))}
                  onChange={(v) => setAnswers((a) => ({ ...a, [g.key]: v }))}
                />
              ))}
            </div>
            {groups.some(isFixed) ? (
              <div className="mt-6" data-fixed-options>
                <p className="field-label">Included with your plan</p>
                <p className="field-hint mb-2">AT&amp;T offers one option for each of these with this plan.</p>
                <ul className="grid gap-2">
                  {groups.filter(isFixed).map((g) => (
                    <li key={g.key} className="rounded-xl border border-border p-3">
                      <span className="block text-ink">{g.choices[0].title}</span>
                      {g.choices[0].details ? <span className="mt-1 block text-sm text-ink-muted">{g.choices[0].details}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {hiddenAddOns.length ? (
              <p className="mt-6 text-sm text-ink-muted" data-hidden-addons>
                Some paid add-ons can only be added by phone. Please call us if you would like one.
              </p>
            ) : null}
            {included.length ? (
              <div className="mt-6">
                <p className="field-label">Included with this offer</p>
                <ul className="mt-1 list-disc pl-5 text-ink">
                  {included.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {optionsError ? (
              <p className="field-error" role="alert">
                {optionsError}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => setStep("plans")}>
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                See My Quote
              </button>
            </div>
          </form>
        ) : null}

        {step === "quote" && quote && plan ? (
          <div>
            <StepHeading ref={headingRef}>Your Quote</StepHeading>
            <p className="mt-2 text-ink-muted">
              {plan.title} at {addressText}, with the options you chose.
            </p>
            <QuoteTable quote={quote} />
            {quote.included.length ? (
              <div className="mt-5">
                <p className="field-label">Included with this offer</p>
                <ul className="mt-1 list-disc pl-5 text-ink">
                  {quote.included.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button type="button" className="btn btn-ghost" onClick={() => (groups.length ? setStep("options") : setStep("plans"))}>
                Change Options
              </button>
              <button type="button" className="btn btn-primary" onClick={goToDetails}>
                Continue
              </button>
            </div>
          </div>
        ) : null}

        {step === "details" ? (
          <form onSubmit={submitDetails} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0">
              <StepHeading ref={headingRef}>Personal Information</StepHeading>
              <p className="mt-2 text-ink-muted">Entering your information allows us to communicate with you about your order and set up your service.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="First name" error={customerErrors.firstName}>
                  {(p) => <input {...p} autoComplete="given-name" maxLength={40} value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} />}
                </Field>
                <Field label="Last name" error={customerErrors.lastName}>
                  {(p) => <input {...p} autoComplete="family-name" maxLength={40} value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} />}
                </Field>
                <Field label="Phone number" error={customerErrors.phone} className="sm:col-span-2">
                  {(p) => <input {...p} type="tel" autoComplete="tel-national" inputMode="tel" maxLength={20} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />}
                </Field>
                <Field label="Email address" error={customerErrors.email}>
                  {(p) => <input {...p} type="email" autoComplete="email" maxLength={254} value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />}
                </Field>
                <Field label="Confirm email address" error={customerErrors.confirmEmail}>
                  {(p) => (
                    <input
                      {...p}
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      value={customer.confirmEmail}
                      onChange={(e) => setCustomer({ ...customer, confirmEmail: e.target.value })}
                      onPaste={(e) => e.preventDefault()}
                    />
                  )}
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
              <div className="mt-6 flex gap-3">
                <input id="order-contact" type="checkbox" className="field-check mt-0.5" checked={customer.contactByPhone} onChange={(e) => setCustomer({ ...customer, contactByPhone: e.target.checked })} />
                <label htmlFor="order-contact" className="text-sm text-ink">
                  Optional: you may contact me by phone or text with information about my services, such as installation and repair appointments, billing and account
                  information, and customer satisfaction inquiries.
                </label>
              </div>
              <div className="mt-4 flex gap-3">
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
              <fieldset className="mt-6 rounded-xl border-2 border-brand p-4" data-credit-check>
                <legend className="px-1 font-semibold text-ink">Credit check</legend>
                <p className="text-ink">Before we continue with your order, we will need to initiate a credit check. Is that OK?</p>
                <div className="mt-3 flex gap-3">
                  <input
                    id="order-credit-consent"
                    type="checkbox"
                    className="field-check mt-0.5"
                    checked={creditCheck.consent}
                    onChange={(e) => setCreditCheck({ ...creditCheck, consent: e.target.checked })}
                    aria-invalid={Boolean(creditErrors.consent)}
                    aria-describedby={creditErrors.consent ? "order-credit-consent-error" : undefined}
                  />
                  <label htmlFor="order-credit-consent" className="text-sm text-ink">
                    Yes, I agree to a credit check for this order. My date of birth and Social Security number are used only for this credit check.
                  </label>
                </div>
                {creditErrors.consent ? (
                  <p id="order-credit-consent-error" className="field-error" role="alert">
                    {creditErrors.consent}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Date of birth (MM/DD/YYYY)" error={creditErrors.dateOfBirth}>
                    {(p) => (
                      <input
                        {...p}
                        inputMode="numeric"
                        autoComplete="bday"
                        placeholder="mm/dd/yyyy"
                        maxLength={10}
                        value={creditCheck.dateOfBirth}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, "").slice(0, 8);
                          setCreditCheck({ ...creditCheck, dateOfBirth: [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join("/") });
                        }}
                      />
                    )}
                  </Field>
                  <Field label="Social Security number" error={creditErrors.ssn}>
                    {(p) => (
                      <div className="flex gap-2">
                        <input
                          {...p}
                          type={showSsn ? "text" : "password"}
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="###-##-####"
                          maxLength={11}
                          value={creditCheck.ssn}
                          onChange={(e) => {
                            const d = e.target.value.replace(/\D/g, "").slice(0, 9);
                            setCreditCheck({ ...creditCheck, ssn: [d.slice(0, 3), d.slice(3, 5), d.slice(5)].filter(Boolean).join("-") });
                          }}
                        />
                        <button type="button" className="btn btn-ghost shrink-0" onClick={() => setShowSsn((v) => !v)} aria-pressed={showSsn}>
                          {showSsn ? "Hide" : "Show"}
                        </button>
                      </div>
                    )}
                  </Field>
                </div>
                <p className="field-hint mt-3">Sent securely with your order request and not stored on this website. We never ask for card or bank details here.</p>
              </fieldset>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <button type="button" className="btn btn-ghost" onClick={() => setStep("quote")}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Review Order Request
                </button>
              </div>
              <div className="mt-6" data-next-steps>
                <p className="text-sm text-ink-muted">After the credit check, a specialist completes these sections with you:</p>
                <ul className="mt-2 grid gap-2">
                  {["Billing Address", "Terms", "Scheduling", "Account Security", "ABP - AutoPay Option"].map((t) => (
                    <li key={t} className="rounded-lg bg-surface-alt px-4 py-3 text-lg text-brand-strong">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {quote && plan ? (
              <aside className="lg:sticky lg:top-28 lg:self-start" aria-labelledby="order-cart-title" data-order-cart>
                <div className="rounded-xl border border-border p-4">
                  <h3 id="order-cart-title" className="text-lg font-bold text-ink">
                    Shopping Cart
                  </h3>
                  {quote.orderId ? (
                    <p className="mt-1 text-ink" data-order-id>
                      Order ID: <span className="font-bold">{quote.orderId}</span>
                    </p>
                  ) : null}
                  <p className="mt-1 text-sm text-ink-muted">{plan.title}</p>
                  <QuoteTable quote={quote} compact />
                </div>
              </aside>
            ) : null}
          </form>
        ) : null}

        {step === "review" && quote && plan ? (
          <div>
            <StepHeading ref={headingRef}>Review and Submit</StepHeading>
            <dl className="mt-5 divide-y divide-border">
              <Summary label="Service address" onEdit={() => setStep("address")}>
                {addressText}
              </Summary>
              <Summary label="Plan" onEdit={() => setStep("plans")}>
                {plan.title}
              </Summary>
              {quote.chosen.length ? (
                <Summary label="Options" onEdit={groups.length ? () => setStep("options") : undefined}>
                  <ul className="space-y-1">
                    {quote.chosen.map((c) => (
                      <li key={c.group}>{c.choice}</li>
                    ))}
                  </ul>
                </Summary>
              ) : null}
              <Summary label="Monthly total">
                {quote.total} <span className="text-ink-muted">plus taxes and fees</span>
              </Summary>
              <Summary label="Credit check" onEdit={() => setStep("details")}>
                Agreed. Date of birth and Social Security number provided.
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
            <p className="mt-4 text-sm text-ink-muted">A specialist completes the credit check and payment with you before your order is placed.</p>
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

        {step === "done" ? (
          <div role="status">
            <StepHeading ref={headingRef}>Thank You. Your Order Request Has Been Received.</StepHeading>
            <p className="mt-4 text-ink">{orderId ? "Order ID" : "Reference number"}</p>
            <p className="mt-1 text-3xl font-bold tracking-wide text-ink" data-order-reference={reference} data-order-id={orderId || undefined}>
              {orderId || reference}
            </p>
            <p className="mt-4 text-ink">A specialist will contact you to complete the credit check and payment. Please keep your reference number for your records.</p>
            <div className="mt-6">
              <PhoneLink placement="order-done" offerId={offerId} value={value} className="btn btn-primary" label="Call Now" />
            </div>
          </div>
        ) : null}

        {step === "stop" && stop ? (
          <div role="alert">
            {stop.kind === "mismatch" ? (
              <>
                <StepHeading ref={headingRef}>Please Call Us to Complete Your Order</StepHeading>
                <p className="mt-3 text-ink">
                  We could not confirm the price for this plan and these options online. Please call{" "}
                  <PhoneLink placement="order-mismatch-text" offerId={offerId} value={value} className="link font-semibold" /> to complete your order.
                </p>
              </>
            ) : stop.kind === "unrequested" ? (
              <>
                <StepHeading ref={headingRef}>Please Call Us to Complete Your Order</StepHeading>
                <p className="mt-3 text-ink">
                  We could not prepare this order online exactly as you requested. Please call <PhoneLink placement="order-unrequested-text" offerId={offerId} value={value} className="link font-semibold" /> to
                  complete your order.
                </p>
              </>
            ) : stop.kind === "no_service" ? (
              <>
                <StepHeading ref={headingRef}>AT&amp;T Internet Is Not Available at This Address</StepHeading>
                <p className="mt-3 text-ink">
                  AT&amp;T Internet plans are not available at this address. Please check the address, or call{" "}
                  <PhoneLink placement="order-no-service-text" offerId={offerId} value={value} className="link font-semibold" /> to ask about the services available there.
                </p>
              </>
            ) : (
              <>
                <StepHeading ref={headingRef}>We Could Not Complete Your Request Online</StepHeading>
                <p className="mt-3 text-ink">
                  We could not complete your request online. Please call <PhoneLink placement="order-failed-text" offerId={offerId} value={value} className="link font-semibold" /> to
                  complete your order.
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

/** The att.com plans the portal offers at this address, shown with att.com's own name, speed, price and fine print. */
function PlanList({ plans, selected, onChoose }: { plans: Offer[]; selected: string; onChoose: (id: string) => void }) {
  return (
    <fieldset className="mt-3">
      <legend className="sr-only">Choose a plan</legend>
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((p) => {
          const on = p.id === selected;
          return (
            <div key={p.id} data-plan-card={p.id} data-selected={on ? "true" : "false"} className={`flex flex-col rounded-xl border-2 p-4 ${on ? "border-brand bg-brand-tint" : "border-border"}`}>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="radio" className="field-check mt-1" name="order-plan" value={p.id} checked={on} onChange={() => onChoose(p.id)} />
                <span className="min-w-0">
                  <span className="block text-lg font-bold text-ink">{p.title}</span>
                  {p.speed ? <span className="block text-sm text-ink-muted">{p.speed}</span> : null}
                </span>
              </label>
              {p.price ? (
                <div className="mt-2" data-plan-price={p.price.amount}>
                  <Price price={p.price} size="md" />
                </div>
              ) : null}
              <Conditions items={p.conditions} />
              {p.features?.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-auto pt-3">
                <AsOf offer={p} />
                <FinePrint offer={p} />
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
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
  options: { value: string; label: string; price?: string; hint?: string }[];
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
            <input type="radio" className="field-check mt-0.5" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-ink">{o.label}</span>
                {o.price ? <span className="whitespace-nowrap font-semibold text-ink">{o.price}</span> : null}
              </span>
              {o.hint ? <span className="mt-1 block text-sm text-ink-muted">{o.hint}</span> : null}
            </span>
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

/** The portal cart, line for line. */
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
          <tr key={`${l.item}-${i}`} data-quote-line>
            <td>
              {l.item}
              {!compact && l.detail ? <span className="mt-1 block text-xs text-ink-muted">{l.detail}</span> : null}
            </td>
            <td className="whitespace-nowrap text-right align-top">{l.charge}</td>
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
