/**
 * Turns an order-automation result into what the order page may show. Only fields listed here leave the
 * server: never the automation's `detail`, internal ids, scripts meant for sales staff, the portal's own
 * pre-selections, or any portal link. Plans, options and quotes are shown only when the automation really
 * returned them, and a quote only if the portal cart holds exactly what the visitor chose.
 */
import type { AutomationResult } from "./service";
import type { OptionAnswers } from "./validation";

export type AddressReason = "not_found" | "needs_unit" | "ambiguous";

export interface PlanCard {
  /** Slug of the portal plan name, e.g. "internet-300-fiber-300". */
  id: string;
  /** Exactly as the portal lists it, e.g. "Internet 300 (Fiber 300)"; sent back to quote this plan. */
  name: string;
  displayName: string;
  speed: string;
  /** As the plan card shows it, e.g. "$50/mo.". */
  price: string;
  priceNote: string;
  features: string[];
  notes: string[];
  offerDetails: string[];
  /** AT&T's Broadband Facts label for this plan (www.att.com/labels/…), or "". */
  broadbandFactsUrl: string;
}

export interface OptionChoice {
  title: string;
  price: string;
  /** Customer-facing explanation, when the portal gives one (never staff scripts). */
  details: string;
  decline: boolean;
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

/** An option the portal applied, as the visitor chose it. `monthly` is false for one-time charges (e.g. "$99"). */
export interface ChosenOption {
  group: string;
  choice: string;
  price: string;
  monthly: boolean;
}

export type OrderOutcome =
  | { screen: "plans"; plans: PlanCard[] }
  | { screen: "options"; groups: OptionGroup[]; included: string[] }
  | { screen: "quote"; total: string; lines: QuoteLine[]; included: string[]; chosen: ChosenOption[] }
  | { screen: "address"; reason: AddressReason }
  | { screen: "plan_unavailable" }
  | { screen: "no_service" }
  | { screen: "call"; reason: "unrequested" }
  | { screen: "details"; fields: ("firstName" | "lastName" | "phone" | "email")[] }
  | { screen: "done"; reference: string }
  | { screen: "failed"; retryable: boolean; reason: string };

/** What the visitor asked for, used to check the portal's answer. */
export interface Expected {
  planName?: string;
  options?: OptionAnswers;
}

const failed = (reason: string, retryable = false): OrderOutcome => ({ screen: "failed", retryable, reason });
const unrequested: OrderOutcome = { screen: "call", reason: "unrequested" };

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const record = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const strings = (v: unknown, max: number, count: number) => [...new Set(list(v).map((x) => str(x, max)).filter(Boolean))].slice(0, count);

/** "$12/mo.", "-$10 /mo.", "$65.00", "Included", "$0" -> dollars (Included and blanks are 0). */
export function amount(charge: string): number {
  const m = /(-)?\$\s*([\d,]+(?:\.\d{1,2})?)/.exec(charge);
  return m ? (m[1] ? -1 : 1) * Number(m[2].replace(/,/g, "")) : 0;
}

const isDecline = (title: string) => norm(title).startsWith("decline");
// Option descriptions sometimes carry instructions for sales staff ("Please ask the Customer ..."); those
// are never shown to visitors.
const STAFF_SCRIPT = /ask the customer|the customer should|customer answers|\bagent\b|\brep\b/i;
const PRICE_RE = /^\$\d[\d,]*(\.\d{2})?\/mo\.$/;
const TOTAL_RE = /^-?\$\d[\d,]*(\.\d{2})?$/;
const FACTS_RE = /^https:\/\/www\.att\.com\/labels\/[^\s"'<>]+$/;
const INTERNET_SECTIONS = new Set(["internet"]);

function plansOutcome(data: Record<string, unknown>): OrderOutcome {
  const plans: PlanCard[] = list(data.available_plans)
    .map(record)
    .map((p) => {
      const name = str(p.name, 120);
      const facts = str(p.broadband_facts_url, 600);
      return {
        id: str(p.plan_id, 120),
        name,
        displayName: str(p.display_name, 140) || name,
        speed: str(p.speed, 120),
        price: str(p.price, 30),
        priceNote: str(p.price_note, 300),
        features: strings(p.features, 200, 12),
        notes: strings(p.notes, 400, 6),
        offerDetails: strings(p.offer_details, 2000, 30).filter((t) => !STAFF_SCRIPT.test(t)),
        broadbandFactsUrl: FACTS_RE.test(facts) ? facts : "",
      };
    })
    // A plan is only shown with its own name and a readable monthly price.
    .filter((p) => /^[a-z0-9-]{3,120}$/.test(p.id) && p.name && PRICE_RE.test(p.price));
  return plans.length ? { screen: "plans", plans } : { screen: "no_service" };
}

function optionsOutcome(data: Record<string, unknown>): OrderOutcome {
  const groups: OptionGroup[] = list(data.option_groups)
    .map(record)
    .map((g) => ({
      key: str(g.key, 60),
      heading: str(g.heading, 160),
      choices: list(g.choices)
        .map(record)
        .map((c) => {
          const title = str(c.title, 200);
          const details = str(c.details, 600);
          return { title, price: str(c.price, 40), details: details && !STAFF_SCRIPT.test(details) ? details : "", decline: isDecline(title) };
        })
        .filter((c) => c.title),
    }))
    .filter((g) => /^[a-z][a-z0-9_]{1,40}$/.test(g.key) && g.choices.length > 0);
  if (!groups.length && !list(data.option_groups).length) return failed("options_unreadable");
  return groups.length ? { screen: "options", groups, included: strings(data.included_items, 160, 12) } : failed("options_unreadable");
}

function quoteOutcome(data: Record<string, unknown>, expected: Expected): OrderOutcome {
  const cart = record(data.cart_summary);
  const total = str(cart.monthly_total, 40);
  if (!TOTAL_RE.test(total)) return failed("no_total");

  const sections = list(cart.sections).map((s) => str(s, 40));
  const lines = list(cart.monthly_lines)
    .map(record)
    .map((l) => ({ section: str(l.section, 40), item: str(l.item, 160), detail: str(l.detail, 400), charge: str(l.charge, 40) }));
  if (sections.some((s) => !INTERNET_SECTIONS.has(s)) || lines.some((l) => !INTERNET_SECTIONS.has(l.section))) return unrequested;

  // Every option the portal reports as selected must be exactly the visitor's own answer, for every group.
  const answers = expected.options ?? {};
  const selected = list(data.selected_options).map(record);
  const selectedKeys = new Set(selected.map((o) => str(o.group, 60)));
  if (Object.keys(answers).some((k) => !selectedKeys.has(k))) return unrequested;
  const paidChoices: number[] = [];
  const chosen: ChosenOption[] = [];
  for (const o of selected) {
    const answer = answers[str(o.group, 60)];
    const choice = str(o.choice);
    if (answer === undefined) return unrequested;
    const matches = typeof answer === "string" ? norm(choice) === norm(answer) : answer === !isDecline(choice);
    if (!matches) return unrequested;
    const priceText = str(o.price, 40);
    const price = amount(priceText);
    const monthly = /\/\s*mo/i.test(priceText);
    if (price > 0 && !isDecline(choice) && monthly) paidChoices.push(price);
    chosen.push({ group: str(o.group, 60), choice, price: priceText, monthly });
  }

  // The cart must hold the chosen plan, and every other paid line must be a paid option the visitor chose.
  const planName = norm(expected.planName ?? "");
  const planIndex = planName ? lines.findIndex((l) => norm(l.item).includes(planName) || planName.includes(norm(l.item))) : 0;
  if (planIndex < 0) return unrequested;
  for (const [i, l] of lines.entries()) {
    const charge = amount(l.charge);
    if (i === planIndex || charge <= 0) continue;
    const match = paidChoices.indexOf(charge);
    if (match < 0) return unrequested;
    paidChoices.splice(match, 1);
  }

  return {
    screen: "quote",
    total,
    lines: lines.filter((l) => l.item && l.charge).map(({ item, detail, charge }) => ({ item, detail, charge })),
    included: strings(data.included_items, 160, 12),
    chosen,
  };
}

const CUSTOMER_FIELDS = { first_name: "firstName", last_name: "lastName", phone: "phone", email: "email", email_confirm: "email" } as const;

export function toOutcome(result: AutomationResult | undefined, expected: Expected = {}): OrderOutcome {
  if (!result || typeof result.status !== "string") return failed("no_result");
  const data = record(result.data);
  switch (result.status) {
    case "plans_ready":
      return plansOutcome(data);
    case "options_required":
      return optionsOutcome(data);
    case "quote_ready":
      return quoteOutcome(data, expected);
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
      return unrequested;
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
