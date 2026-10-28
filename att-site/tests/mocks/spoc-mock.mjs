/**
 * Local stand-in for order-service + the SPOC order automation, for automated tests only.
 *
 * Implements order-service's API (../../../order-service/server.py) and answers with results shaped exactly
 * like the automation's OrderResult after to_aria(): { status, order_ref, message, retryable, data }.
 * The street line picks the scenario (case-insensitive keywords):
 *
 *   (none)        quote_ready, then handoff_ready          options      options_required until "equip"/"install" are answered
 *   notfound      address_not_found                        needsunit    address_needs_unit (until a unit is given)
 *   ambiguous     address_ambiguous                        nooffers     no_offers
 *   planmissing   plan_not_found                           noproduct    product_not_available
 *   bundle        unexpected_cart_items (DIRECTV pushed)   extender     quote_ready but with the declined $12 extender in the cart
 *   expired       session_expired                          portalerror  portal_error
 *   timeoutstatus timeout (the automation's own status)    notconfigured not_configured
 *   slow          quote takes 3x longer                    hang         never finishes (the page's own limit applies)
 *   down          order-service answers 500
 * Customer email:  rejected@...  invalid_customer_details (email) ;  handofffail@...  portal_error on the handoff
 *
 * GET /__mock/log returns every request body received (tests check nothing sensitive arrived).
 * Env: MOCK_PORT (4010), MOCK_KEY (must equal ATTSPOC_SERVICE_KEY), MOCK_QUOTE_MS (1500), MOCK_HANDOFF_MS (600).
 */
import http from "node:http";
import crypto from "node:crypto";

const PORT = Number(process.env.MOCK_PORT || 4010);
const KEY = process.env.MOCK_KEY || "test-order-service-key-0123456789abcdef";
const QUOTE_MS = Number(process.env.MOCK_QUOTE_MS || 1500);
const HANDOFF_MS = Number(process.env.MOCK_HANDOFF_MS || 600);

// The automation's customer messages (att_order_automation.CUSTOMER_MESSAGES), kept for realistic payloads.
const MESSAGES = {
  quote_ready: "Good news, that plan is available at your address. Your monthly total would be {total}, plus taxes and fees.",
  handoff_ready: "Your order is all set up. I'm connecting you with a specialist who will complete the credit check and payment details with you securely.",
  address_not_found: "I couldn't verify that service address. Could you confirm the street and ZIP code?",
  address_needs_unit: "That address needs an apartment or unit number. What is your unit number?",
  address_ambiguous: "I found more than one matching address. Can you help me pick the right one?",
  no_offers: "Unfortunately there are no AT&T offers available at that address right now.",
  product_not_available: "That service isn't available at your address. Would you like to hear what is available?",
  plan_not_found: "That plan isn't available at your address. Would you like to hear the available options?",
  options_required: "Before I place the order, I have a couple of quick questions about optional features.",
  unexpected_cart_items: "The ordering system added services you didn't ask for, so I stopped before placing anything. A specialist will follow up with you.",
  invalid_customer_details: "Some of your contact details weren't accepted. Could we double-check them?",
  session_expired: "The ordering system timed out. I'll need to try again.",
  portal_error: "The ordering system ran into a problem, so the order was not placed. A specialist will follow up with you.",
  timeout: "The ordering system is taking too long to respond, so the order was not placed. A specialist will follow up with you.",
  not_configured: "I wasn't able to finish setting up this order online. A specialist will follow up with you to finish it.",
};
const RETRYABLE = new Set(["address_not_found", "address_needs_unit", "address_ambiguous", "product_not_available", "plan_not_found",
  "options_required", "invalid_customer_details", "session_expired", "timeout", "portal_error", "invalid_input", "sensitive_data_rejected"]);
const SENSITIVE_KEY_RE = /ssn|social|tax_?id|dob|birth|card|cvv|cvc|expir|account|routing|bank|iban|\bpin\b|password|passcode/i;

const jobs = new Map();
const byRequest = new Map();
const received = [];

const ref = () => "UW-" + Array.from(crypto.randomBytes(8), (b) => "ABCDEFGHJKMNPQRSTVWXYZ23456789"[b % 30]).join("");
const money = (n) => `${n < 0 ? "-" : ""}$${Math.abs(n).toFixed(2)}`;

function result(status, orderRef, data = {}) {
  const total = data.cart_summary?.monthly_total ?? "shown by the specialist";
  return { status, order_ref: orderRef, message: MESSAGES[status].replace("{total}", total), retryable: RETRYABLE.has(status), data };
}

/** Cart, plan and option data the way the automation reports them (portal wording from the saved pages). */
function priced(product, { sneakExtender = false } = {}) {
  const o = product.options;
  const air = product.plan_name === "AT&T Internet Air";
  const base = air ? 65 : { "Internet 300 (Fiber 300)": 60, "Internet 500 (Fiber 500)": 65, "Internet 1000 (Fiber 1 GIG)": 80, "Internet 5000 (Fiber 5 GIG)": 125 }[product.plan_name] ?? 70;
  const lines = [{ section: "internet", item: product.plan_name, charge: money(base) }];
  const selected = [];
  let total = base;
  if (!air) {
    lines.push({ section: "internet", item: "$15 off for 12 months", charge: money(-15) });
    total -= 15;
  }
  if (o.autopay === true) {
    lines.push({ section: "internet", item: "AutoPay/Paperless Billing Discount", charge: money(-10) });
    total -= 10;
  }
  selected.push({ product_type: "internet", group: "autopay", choice: o.autopay === true ? "AutoPay/Paperless Billing Discount" : "Decline AutoPay/Paperless Billing", price: o.autopay === true ? "-$10/mo." : "$0" });
  if (air) {
    const extender = o.wifi_extender === true || sneakExtender;
    if (extender) {
      lines.push({ section: "internet", item: "AT&T Extended Wi-Fi", charge: money(12) });
      total += 12;
    }
    selected.push({ product_type: "internet", group: "wifi_extender", choice: extender ? "Next-generation Wi-Fi experience, delivers more coverage to more corners of your home" : "Decline Extended Wi-Fi Coverage Service", price: extender ? "$12/mo." : "$0" });
    lines.push({ section: "internet", item: "AT&T All-Fi Hub", charge: "Included" });
  } else {
    for (const [group, choice] of [["equip", "AT&T Internet Equipment Fee"], ["install", "AT&T Professional Install"]]) {
      if (o[group] !== undefined) selected.push({ product_type: "internet", group, choice, price: "$0" });
    }
    lines.push({ section: "internet", item: "AT&T Internet Equipment Fee", charge: "Included" });
  }
  return {
    cart_order_id: "DSIX000000001",
    selected_plans: [{ product_type: "internet", name: product.plan_name, subtitle: "", price: `$${base}/mo.`, disclosure: "" }],
    selected_options: selected,
    cart_summary: { sections: ["internet"], monthly_lines: lines, monthly_total: money(total) },
  };
}

function quoteOutcome(job) {
  const a = job.service_address;
  const street = a.street.toLowerCase();
  const product = job.products[0];
  const has = (k) => street.includes(k);
  if (has("notfound")) return result("address_not_found", job.order_ref, { field_errors: [] });
  if (has("needsunit") && !a.unit_number) return result("address_needs_unit", job.order_ref);
  if (has("ambiguous")) return result("address_ambiguous", job.order_ref, { address_options: ["1 AMBIGUOUS WAY APT A, ANYTOWN, NY 11801", "1 AMBIGUOUS WAY APT B, ANYTOWN, NY 11801"] });
  if (has("nooffers")) return result("no_offers", job.order_ref);
  if (has("planmissing")) return result("plan_not_found", job.order_ref, { product_type: "internet", available_plans: [{ name: "AT&T Internet Air", subtitle: "", price: "$65/mo.", disclosure: "" }] });
  if (has("noproduct")) return result("product_not_available", job.order_ref, { available_products: ["tv"] });
  if (has("bundle"))
    return result("unexpected_cart_items", job.order_ref, {
      unexpected_sections: ["video"],
      cart_summary: { sections: ["video", "internet"], monthly_lines: [{ section: "video", item: "PREMIER Streaming App", charge: "$258.00" }], monthly_total: "$258.99" },
    });
  if (has("expired")) return result("session_expired", job.order_ref);
  if (has("portalerror")) return result("portal_error", job.order_ref);
  if (has("timeoutstatus")) return result("timeout", job.order_ref);
  if (has("notconfigured")) return result("not_configured", job.order_ref);
  if (has("options") && (product.options.equip === undefined || product.options.install === undefined)) {
    return result("options_required", job.order_ref, {
      product_type: "internet",
      option_groups: [
        { key: "equip", heading: "Select your Internet equipment.", choices: [{ title: "AT&T Internet Equipment Fee", price: "$0", selected: true, details: "Agent script: ask the customer ..." }] },
        { key: "install", heading: "How do you want your internet installed?", choices: [{ title: "AT&T Professional Install", price: "$0", selected: true, details: "Agent script: read the disclosure ..." }] },
      ].filter((g) => product.options[g.key] === undefined),
    });
  }
  return result("quote_ready", job.order_ref, priced(product, { sneakExtender: has("extender") }));
}

function handoffOutcome(job, quote) {
  const email = job.customer.email.toLowerCase();
  if (email.startsWith("rejected@")) return result("invalid_customer_details", job.order_ref, { fields: ["email"], field_errors: ["Email is invalid. Please fix."] });
  if (email.startsWith("handofffail@")) return result("portal_error", job.order_ref);
  return result("handoff_ready", job.order_ref, priced(quote.products[0]));
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function sensitive(value, path = "") {
  if (Array.isArray(value)) return value.flatMap((v, i) => sensitive(v, `${path}[${i}]`));
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([k, v]) => (SENSITIVE_KEY_RE.test(k) ? [`${path}${k}`] : sensitive(v, `${path}${k}.`)));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://mock");
  if (url.pathname === "/healthz") return send(res, 200, { ok: true });
  if (url.pathname === "/__mock/log") return send(res, 200, { received });
  if (req.headers.authorization !== `Bearer ${KEY}`) return send(res, 401, { error: "unauthorised" });

  let body = {};
  if (req.method === "POST") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return send(res, 400, { error: "invalid_request" });
    }
    received.push({ path: url.pathname, body });
    if (sensitive(body).length) return send(res, 422, { error: "sensitive_data_rejected" });
  }

  const jobMatch = url.pathname.match(/^\/v1\/jobs\/([A-Za-z0-9_-]{16,64})$/);
  if (req.method === "GET" && jobMatch) {
    const job = jobs.get(jobMatch[1]);
    if (!job) return send(res, 404, { error: "not_found" });
    const done = !job.hang && Date.now() >= job.readyAt;
    return send(res, 200, { job_id: job.id, kind: job.kind, state: done ? "done" : "running", ...(done ? { result: job.result() } : {}) });
  }

  if (req.method === "POST" && url.pathname === "/v1/quotes") {
    const street = String(body.service_address?.street ?? "").toLowerCase();
    if (street.includes("down")) return send(res, 500, { error: "internal" });
    const existing = byRequest.get(`quote:${body.request_id}`);
    if (existing) return send(res, 202, { job_id: existing.id, kind: "quote", state: "running" });
    const job = { id: crypto.randomBytes(18).toString("base64url"), kind: "quote", order_ref: ref(), service_address: body.service_address, products: body.products };
    job.readyAt = Date.now() + QUOTE_MS * (street.includes("slow") ? 3 : 1);
    job.hang = street.includes("hang");
    const outcome = quoteOutcome(job);
    job.result = () => outcome;
    jobs.set(job.id, job);
    byRequest.set(`quote:${body.request_id}`, job);
    return send(res, 202, { job_id: job.id, kind: "quote", state: "running" });
  }

  if (req.method === "POST" && url.pathname === "/v1/handoffs") {
    const existing = byRequest.get(`handoff:${body.request_id}`);
    if (existing) return send(res, 202, { job_id: existing.id, kind: "handoff", state: "running" });
    const quote = jobs.get(body.quote_job_id);
    if (!quote || quote.kind !== "quote") return send(res, 404, { error: "quote_not_found" });
    if (quote.result().status !== "quote_ready") return send(res, 409, { error: "quote_not_ready" });
    const job = { id: crypto.randomBytes(18).toString("base64url"), kind: "handoff", order_ref: quote.order_ref, customer: body.customer, readyAt: Date.now() + HANDOFF_MS };
    const outcome = handoffOutcome(job, quote);
    job.result = () => outcome;
    jobs.set(job.id, job);
    byRequest.set(`handoff:${body.request_id}`, job);
    return send(res, 202, { job_id: job.id, kind: "handoff", state: "running" });
  }
  return send(res, 404, { error: "not_found" });
});

server.listen(PORT, "127.0.0.1", () => console.log(`SPOC mock listening on http://127.0.0.1:${PORT}`));
