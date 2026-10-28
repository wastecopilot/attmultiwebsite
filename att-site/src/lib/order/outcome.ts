/**
 * Turns an order-automation result into what the order page may show. Only fields listed here leave the
 * server: never the automation's `detail`, internal ids, agent scripts (option `details`) or any portal link.
 * A quote is shown only when the automation really returned one, and only if the cart holds nothing the
 * visitor did not ask for.
 */
import type { AutomationResult } from "./service";
import type { OptionAnswers } from "./validation";

export type AddressReason = "not_found" | "needs_unit" | "ambiguous";

export type OrderOutcome =
  | { screen: "quote"; total: string; lines: { item: string; charge: string }[] }
  | { screen: "options"; groups: { key: string; heading: string; choices: { title: string; price: string }[] }[] }
  | { screen: "address"; reason: AddressReason }
  | { screen: "plan_unavailable" }
  | { screen: "no_service" }
  | { screen: "call"; reason: "unrequested" }
  | { screen: "details"; fields: ("firstName" | "lastName" | "phone" | "email")[] }
  | { screen: "done"; reference: string }
  | { screen: "failed"; retryable: boolean; reason: string };

const failed = (reason: string, retryable = false): OrderOutcome => ({ screen: "failed", retryable, reason });

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const record = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** The portal's cart section names that belong to an Internet order (att_order_automation.CART_SECTION_PRODUCT). */
const INTERNET_SECTIONS = new Set(["internet"]);

function quoteOutcome(data: Record<string, unknown>, answers: OptionAnswers): OrderOutcome {
  const cart = record(data.cart_summary);
  const total = str(cart.monthly_total, 40);
  if (!/^-?\$\d[\d,]*(\.\d{2})?$/.test(total)) return failed("no_total");

  const sections = list(cart.sections).map((s) => str(s, 40));
  const lines = list(cart.monthly_lines).map(record);
  if (sections.some((s) => !INTERNET_SECTIONS.has(s)) || lines.some((l) => !INTERNET_SECTIONS.has(str(l.section, 40))))
    return { screen: "call", reason: "unrequested" };

  // Every option the portal reports as selected must be the visitor's own answer.
  for (const o of list(data.selected_options).map(record)) {
    const group = str(o.group, 60);
    const choice = norm(str(o.choice));
    const answer = answers[group];
    if (answer === undefined) return { screen: "call", reason: "unrequested" };
    const declined = choice.startsWith("decline");
    if ((answer === false && !declined) || (answer === true && declined) || (typeof answer === "string" && !choice.includes(norm(answer))))
      return { screen: "call", reason: "unrequested" };
  }
  // The portal pre-selects the paid Extended Wi-Fi add-on: if it was declined, no charge for it may remain.
  if (answers.wifi_extender === false) {
    const extender = lines.find((l) => /extended wi-?fi|extender/i.test(str(l.item)) && /\$\s*[1-9]/.test(str(l.charge, 40)));
    if (extender) return { screen: "call", reason: "unrequested" };
  }

  return {
    screen: "quote",
    total,
    lines: lines.map((l) => ({ item: str(l.item, 120), charge: str(l.charge, 40) })).filter((l) => l.item && l.charge),
  };
}

function optionsOutcome(data: Record<string, unknown>): OrderOutcome {
  const groups = list(data.option_groups)
    .map(record)
    .map((g) => ({
      key: str(g.key, 60),
      heading: str(g.heading, 160),
      // Titles and prices only: the portal's `details` text can hold scripts meant for sales staff.
      choices: list(g.choices)
        .map(record)
        .map((c) => ({ title: str(c.title, 160), price: str(c.price, 40) }))
        .filter((c) => c.title),
    }))
    .filter((g) => /^[a-z][a-z0-9_]{1,40}$/.test(g.key) && g.choices.length > 0);
  return groups.length ? { screen: "options", groups } : failed("options_unreadable");
}

const CUSTOMER_FIELDS = { first_name: "firstName", last_name: "lastName", phone: "phone", email: "email" } as const;

export function toOutcome(result: AutomationResult | undefined, answers: OptionAnswers = {}): OrderOutcome {
  if (!result || typeof result.status !== "string") return failed("no_result");
  const data = record(result.data);
  switch (result.status) {
    case "quote_ready":
      return quoteOutcome(data, answers);
    case "options_required":
      return optionsOutcome(data);
    case "address_not_found":
      return { screen: "address", reason: "not_found" };
    case "address_needs_unit":
      return { screen: "address", reason: "needs_unit" };
    case "address_ambiguous":
      return { screen: "address", reason: "ambiguous" };
    case "plan_not_found":
    case "product_not_available":
      return { screen: "plan_unavailable" };
    case "no_offers":
      return { screen: "no_service" };
    case "unexpected_cart_items":
      return { screen: "call", reason: "unrequested" };
    case "invalid_customer_details": {
      const fields = list(data.fields)
        .map((f) => CUSTOMER_FIELDS[str(f, 40) as keyof typeof CUSTOMER_FIELDS])
        .filter(Boolean);
      return { screen: "details", fields: fields.length ? fields : ["email"] };
    }
    case "handoff_ready": {
      const reference = str(result.order_ref, 40);
      return /^[A-Z]{2}-[A-Z0-9]{6,12}$/.test(reference) ? { screen: "done", reference } : failed("no_reference");
    }
    case "session_expired":
    case "portal_error":
    case "timeout":
      return failed(result.status, true);
    default:
      return failed(/^[a-z_]{3,40}$/.test(result.status) ? result.status : "unknown");
  }
}
