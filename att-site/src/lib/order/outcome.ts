/**
 * Turns an order-automation result into what the order page may show (server only). Plan names and prices
 * shown to visitors come only from att.com (src/data/offers.ts, research/att-com-verified.md): the portal
 * only says which of those plans are available at the address, which options a plan has, and what the cart
 * holds. A quote is shown only when the portal cart total equals the att.com price for the chosen plan and
 * options, and the cart holds nothing the visitor did not choose. Never sent to the browser: the portal's own
 * card prices, option prices, staff scripts, internal ids or any portal link.
 */
import { offers } from "@/data/offers";
import type { Offer } from "@/data/offer-types";
import { offerIdForPortalName, portalNameForOffer } from "@/data/order-plans";
import type { AutomationResult } from "./service";
import type { OptionAnswers } from "./validation";
import { amount, money } from "./price";

export type AddressReason = "not_found" | "needs_unit" | "ambiguous";

export interface OptionChoice {
  title: string;
  /** "autopay": the AutoPay & paperless discount (amount from att.com); "free": no charge; "decline". */
  kind: "autopay" | "free" | "decline";
  /** Customer-facing explanation from the portal, only when it carries no price and no staff script. */
  details: string;
}

export interface OptionGroup {
  key: string;
  heading: string;
  choices: OptionChoice[];
}

export interface QuoteLine {
  item: string;
  detail: string;
  charge: string;
}

export interface ChosenOption {
  group: string;
  choice: string;
}

export type OrderOutcome =
  /** Offer ids (offers.ts) of the att.com plans the portal offers at the address. */
  | { screen: "plans"; offerIds: string[] }
  | {
      screen: "options";
      groups: OptionGroup[];
      included: string[];
      /** Answers for groups not shown: paid add-ons att.com does not price start (and stay) on Decline. */
      autoAnswers: OptionAnswers;
      hiddenAddOns: string[];
    }
  | { screen: "quote"; total: string; attComPrice: string; lines: QuoteLine[]; included: string[]; chosen: ChosenOption[] }
  | { screen: "address"; reason: AddressReason }
  | { screen: "plan_unavailable" }
  | { screen: "no_service" }
  | { screen: "call"; reason: "unrequested" | "price_mismatch" | "not_online" }
  | { screen: "details"; fields: ("firstName" | "lastName" | "phone" | "email" | "dateOfBirth" | "ssn")[] }
  | { screen: "done"; reference: string }
  | { screen: "failed"; retryable: boolean; reason: string };

/** What the visitor asked for, used to check the portal's answer. */
export interface Expected {
  offerId?: string;
  options?: OptionAnswers;
  /** 5-digit ZIP of the service address, only for the mismatch log line. */
  zip?: string;
}

const failed = (reason: string, retryable = false): OrderOutcome => ({ screen: "failed", retryable, reason });
const call = (reason: "unrequested" | "price_mismatch" | "not_online"): OrderOutcome => ({ screen: "call", reason });

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const record = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const strings = (v: unknown, max: number, count: number) => [...new Set(list(v).map((x) => str(x, max)).filter(Boolean))].slice(0, count);

const isDecline = (title: string) => norm(title).startsWith("decline");
// Option descriptions sometimes carry instructions for sales staff ("Please ask the Customer ..."); never shown.
const STAFF_SCRIPT = /ask the customer|the customer should|customer answers|let me know if you would like|\bagent\b|\brep\b/i;
const TOTAL_RE = /^-?\$\d[\d,]*(\.\d{2})?$/;
const INTERNET_SECTIONS = new Set(["internet"]);

/** The att.com offers a visitor may order online, by id. */
export function onlineOffer(offerId: string | undefined): Offer | undefined {
  const offer = offers.find((o) => o.id === offerId);
  return offer && offer.price && portalNameForOffer(offer.id) ? offer : undefined;
}

function plansOutcome(data: Record<string, unknown>): OrderOutcome {
  const portalNames = list(data.available_plans).map((p) => str(record(p).name, 120));
  // Only plans that att.com lists (offers.ts) are shown; portal-only plans such as "Internet 100" are hidden.
  const offerIds = [...new Set(portalNames.map((n) => offerIdForPortalName(n)).filter((id): id is string => Boolean(id && onlineOffer(id))))];
  return offerIds.length ? { screen: "plans", offerIds } : { screen: "no_service" };
}

function optionsOutcome(data: Record<string, unknown>, offer: Offer | undefined): OrderOutcome {
  if (!offer) return failed("unknown_plan");
  const groups: OptionGroup[] = [];
  const autoAnswers: OptionAnswers = {};
  const hiddenAddOns: string[] = [];
  for (const g of list(data.option_groups).map(record)) {
    const key = str(g.key, 60);
    if (!/^[a-z][a-z0-9_]{1,40}$/.test(key)) continue;
    const heading = str(g.heading, 160);
    const raw = list(g.choices)
      .map(record)
      .map((c) => ({ title: str(c.title, 200), price: amount(str(c.price, 40)), details: str(c.details, 600) }))
      .filter((c) => c.title);
    const choices: OptionChoice[] = [];
    for (const c of raw) {
      const details = c.details && !STAFF_SCRIPT.test(c.details) && !c.details.includes("$") ? c.details : "";
      if (isDecline(c.title)) choices.push({ title: c.title, kind: "decline", details: "" });
      else if (key === "autopay" && offer.autopayDiscount && c.price === -offer.autopayDiscount) choices.push({ title: c.title, kind: "autopay", details: "" });
      else if (c.price === 0) choices.push({ title: c.title, kind: "free", details });
      // Any other paid choice has no att.com price, so it is not offered online.
    }
    if (choices.length === raw.length) {
      groups.push({ key, heading, choices });
      continue;
    }
    const declines = choices.filter((c) => c.kind === "decline");
    if (choices.length === declines.length && declines.length === 1) {
      autoAnswers[key] = declines[0].title; // paid add-on att.com does not price: left on Decline, can be added by phone
      hiddenAddOns.push(heading || key);
    } else if (choices.length) {
      groups.push({ key, heading, choices });
    } else {
      return call("not_online"); // only a paid choice att.com does not price (e.g. a required fee)
    }
  }
  if (!groups.length && !Object.keys(autoAnswers).length) return failed("options_unreadable");
  return { screen: "options", groups, included: strings(data.included_items, 160, 12), autoAnswers, hiddenAddOns };
}

function quoteOutcome(data: Record<string, unknown>, expected: Expected, offer: Offer | undefined): OrderOutcome {
  if (!offer?.price) return failed("unknown_plan");
  const cart = record(data.cart_summary);
  const total = str(cart.monthly_total, 40);
  if (!TOTAL_RE.test(total)) return failed("no_total");

  const sections = list(cart.sections).map((s) => str(s, 40));
  const lines = list(cart.monthly_lines)
    .map(record)
    .map((l) => ({ section: str(l.section, 40), item: str(l.item, 160), detail: str(l.detail, 400), charge: str(l.charge, 40) }));
  if (sections.some((s) => !INTERNET_SECTIONS.has(s)) || lines.some((l) => !INTERNET_SECTIONS.has(l.section))) return call("unrequested");

  // Every option the portal reports as selected must be exactly the visitor's own answer, for every group.
  const answers = expected.options ?? {};
  const selected = list(data.selected_options).map(record);
  const selectedKeys = new Set(selected.map((o) => str(o.group, 60)));
  if (Object.keys(answers).some((k) => !selectedKeys.has(k))) return call("unrequested");
  let autopayTaken = false;
  const chosen: ChosenOption[] = [];
  for (const o of selected) {
    const group = str(o.group, 60);
    const choice = str(o.choice);
    const answer = answers[group];
    if (answer === undefined) return call("unrequested");
    const matches = typeof answer === "string" ? norm(choice) === norm(answer) : answer === !isDecline(choice);
    if (!matches) return call("unrequested");
    const price = amount(str(o.price, 40));
    if (group === "autopay" && !isDecline(choice)) autopayTaken = true;
    else if (price > 0 && !isDecline(choice)) return call("unrequested"); // a paid option att.com does not price
    chosen.push({ group, choice });
  }

  // The cart must hold the chosen plan.
  const planName = norm(portalNameForOffer(offer.id) ?? "");
  if (!planName || !lines.some((l) => norm(l.item).includes(planName) || planName.includes(norm(l.item)))) return call("unrequested");

  // The portal total must equal the att.com price for this plan and these options.
  if (!autopayTaken && !offer.autopayDiscount) return call("price_mismatch");
  const attCom = offer.price.amount + (autopayTaken ? 0 : (offer.autopayDiscount ?? 0));
  if (Math.abs(amount(total) - attCom) > 0.005) {
    // No personal data: plan, ZIP, both amounts.
    console.warn(JSON.stringify({ event: "order_price_mismatch", offer: offer.id, zip: expected.zip ?? "", autopay: autopayTaken, att_com: money(attCom), portal: total }));
    return call("price_mismatch");
  }

  return {
    screen: "quote",
    total,
    attComPrice: money(attCom),
    lines: lines.filter((l) => l.item && l.charge).map(({ item, detail, charge }) => ({ item, detail: detail.includes("$") ? "" : detail, charge })),
    included: strings(data.included_items, 160, 12),
    chosen,
  };
}

const CUSTOMER_FIELDS = { first_name: "firstName", last_name: "lastName", phone: "phone", email: "email", email_confirm: "email", date_of_birth: "dateOfBirth", ssn: "ssn" } as const;

export function toOutcome(result: AutomationResult | undefined, expected: Expected = {}): OrderOutcome {
  if (!result || typeof result.status !== "string") return failed("no_result");
  const data = record(result.data);
  const offer = onlineOffer(expected.offerId);
  switch (result.status) {
    case "plans_ready":
      return plansOutcome(data);
    case "options_required":
      return optionsOutcome(data, offer);
    case "quote_ready":
      return quoteOutcome(data, expected, offer);
    case "address_not_found":
      return { screen: "address", reason: "not_found" };
    case "address_needs_unit":
      return { screen: "address", reason: "needs_unit" };
    case "address_ambiguous":
      return { screen: "address", reason: "ambiguous" };
    case "plan_not_found":
      return { screen: "plan_unavailable" };
    case "product_not_available":
    case "no_offers":
      return { screen: "no_service" };
    case "unexpected_cart_items":
      return call("unrequested");
    case "invalid_customer_details": {
      const fields = [...new Set(list(data.fields).map((f) => CUSTOMER_FIELDS[str(f, 40) as keyof typeof CUSTOMER_FIELDS]).filter(Boolean))];
      return { screen: "details", fields: fields.length ? fields : ["email"] };
    }
    case "handoff_ready": {
      const reference = str(result.order_ref, 40);
      return /^[A-Z]{2}-[A-Z0-9]{6,12}$/.test(reference) ? { screen: "done", reference } : failed("no_reference");
    }
    case "session_expired":
    case "portal_error":
    case "timeout":
    case "duplicate_request":
      return failed(result.status, true);
    default:
      return failed(/^[a-z_]{3,40}$/.test(result.status) ? result.status : "unknown");
  }
}
