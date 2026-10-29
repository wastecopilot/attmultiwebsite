/**
 * Local stand-in for order-service + the SPOC order automation, for automated tests only (never shown to
 * visitors). It implements order-service's API (../../../order-service/server.py) and answers with results
 * shaped exactly like the automation's after to_aria(): { status, order_ref, message, retryable, data }.
 *
 * Plans, options and cart lines come from portal-fixtures.json: data copied exactly from the live partner
 * portal for the documented test addresses (read-only exploration, research/portal-options.md).
 *   street contains "courtenay"  -> Atlanta GA plans (Internet 5000 / 1000 / 500 / 300)
 *   street contains "lakeforest" -> Dallas TX plans (Internet 100, AT&T Internet Air)
 *   anything else                -> Hicksville NY plans (AT&T Internet Air)
 *
 * Scenario keywords in the street line (case-insensitive):
 *   plans call:  notfound, needsunit (until a unit is given), ambiguous, nooffers, noproduct (no Internet),
 *                expired, portalerror, timeoutstatus, notconfigured, slow (3x slower), hang (never finishes),
 *                down (order-service answers 500)
 *   quote call:  planmissing (plan_not_found), bundle (DIRECTV pushed into the cart), extender (a declined
 *                $12 Extended Wi-Fi line stays in the cart: the "$77" case)
 * Customer email:  rejected@...  invalid_customer_details (email) ;  handofffail@...  portal_error on the handoff
 *                  With the credit check (the website always sends it) the hand-off returns identity_questions
 *                  (invented TEST questions), and /v1/verifications returns credit_check_done (analyst review);
 *                  approved@...  the credit check passes ;  noquestions@...  analyst review without questions ;
 *                  handoffready@...  the older handoff_ready (no credit check run)
 *
 * GET /__mock/log returns every request body received (tests check nothing sensitive arrived).
 * Env: MOCK_PORT (4010), MOCK_KEY (must equal ATTSPOC_SERVICE_KEY), MOCK_PLANS_MS (1200), MOCK_QUOTE_MS (900),
 *      MOCK_HANDOFF_MS (600).
 */
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";

const PORT = Number(process.env.MOCK_PORT || 4010);
const KEY = process.env.MOCK_KEY || "test-order-service-key-0123456789abcdef";
const PLANS_MS = Number(process.env.MOCK_PLANS_MS || 1200);
const QUOTE_MS = Number(process.env.MOCK_QUOTE_MS || 900);
const HANDOFF_MS = Number(process.env.MOCK_HANDOFF_MS || 600);
const FIXTURES = JSON.parse(fs.readFileSync(new URL("./portal-fixtures.json", import.meta.url), "utf8"));

// The automation's customer messages (att_order_automation.CUSTOMER_MESSAGES), kept for realistic payloads.
const MESSAGES = {
  plans_ready: "Here are the plans available at your address.",
  quote_ready: "Good news, that plan is available at your address. Your monthly total would be {total}, plus taxes and fees.",
  handoff_ready: "Your order is all set up. I'm connecting you with a specialist who will complete the credit check and payment details with you securely.",
  identity_questions: "To confirm your identity, AT&T has a few questions from your credit file.",
  credit_check_done: "AT&T has answered the credit check.",
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
const amount = (s) => {
  const m = /(-)?\$\s*([\d,]+(?:\.\d{1,2})?)/.exec(s || "");
  return m ? (m[1] ? -1 : 1) * Number(m[2].replace(/,/g, "")) : 0;
};
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const isDecline = (t) => norm(t).startsWith("decline");

function result(status, orderRef, data = {}) {
  const total = data.cart_summary?.monthly_total ?? "shown by the specialist";
  return { status, order_ref: orderRef, message: MESSAGES[status].replace("{total}", total), retryable: RETRYABLE.has(status), data };
}

const siteFor = (street) => (street.includes("courtenay") ? "atlanta" : street.includes("lakeforest") ? "dallas" : "hicksville");

function plansOutcome(job) {
  const a = job.service_address;
  const street = a.street.toLowerCase();
  const has = (k) => street.includes(k);
  if (has("notfound")) return result("address_not_found", job.order_ref, { field_errors: [] });
  if (has("needsunit") && !a.unit_number) return result("address_needs_unit", job.order_ref);
  if (has("ambiguous")) return result("address_ambiguous", job.order_ref);
  if (has("nooffers")) return result("no_offers", job.order_ref);
  if (has("noproduct")) return result("product_not_available", job.order_ref, { available_products: ["tv"] });
  if (has("expired")) return result("session_expired", job.order_ref);
  if (has("portalerror")) return result("portal_error", job.order_ref);
  if (has("timeoutstatus")) return result("timeout", job.order_ref);
  if (has("notconfigured")) return result("not_configured", job.order_ref);
  const site = FIXTURES.addresses[siteFor(street)];
  return result("plans_ready", job.order_ref, { available_plans: site.plans, available_products: site.products, cart_order_id: "DSIX000000001" });
}

/** The portal cart for a plan and the visitor's answers, built from the real cart lines in the fixtures. */
function cartFor(planName, answers, { sneakExtender = false } = {}) {
  const fx = FIXTURES.plans[planName];
  const lines = [fx.cart.plan];
  const selected = [];
  for (const g of fx.groups) {
    const choice = g.choices.find((c) => c.title === answers[g.key]) ?? (answers[g.key] === true ? g.choices.find((c) => !isDecline(c.title)) : g.choices.find((c) => isDecline(c.title)));
    selected.push({ product_type: "internet", group: g.key, choice: choice.title, price: choice.price });
    const extra = fx.cart.when_chosen[g.key];
    if (extra && (!isDecline(choice.title) || (sneakExtender && g.key === "wifi_extender"))) lines.push(extra);
  }
  lines.push(...fx.cart.always);
  const total = lines.reduce((sum, l) => sum + amount(l.charge), 0);
  return {
    cart_order_id: "DSIX000000001",
    selected_plans: [{ product_type: "internet", name: planName, subtitle: "", price: "" }],
    selected_options: selected,
    included_items: fx.included,
    cart_summary: { sections: ["internet"], monthly_lines: lines, monthly_total: money(total) },
  };
}

function quoteOutcome(job, plansJob) {
  const street = plansJob.service_address.street.toLowerCase();
  const product = job.products[0];
  const fx = FIXTURES.plans[product.plan_name];
  if (street.includes("planmissing") && Object.keys(product.options).length) return result("plan_not_found", job.order_ref, { product_type: "internet" });
  const unanswered = fx.groups.filter((g) => product.options[g.key] === undefined || !g.choices.some((c) => c.title === product.options[g.key] || typeof product.options[g.key] === "boolean"));
  if (unanswered.length)
    return result("options_required", job.order_ref, {
      product_type: "internet",
      option_groups: fx.groups,
      unanswered: unanswered.map((g) => g.key),
      included_items: fx.included,
    });
  if (street.includes("bundle"))
    return result("unexpected_cart_items", job.order_ref, {
      unexpected_sections: ["video"],
      cart_summary: { sections: ["video", "internet"], monthly_lines: [{ section: "video", item: "PREMIER Streaming App", detail: "", charge: "$258.00" }], monthly_total: "$258.98" },
    });
  return result("quote_ready", job.order_ref, cartFor(product.plan_name, product.options, { sneakExtender: street.includes("extender") }));
}

// Invented test wording (the real questions come from the customer's credit file and are never copied here).
const TEST_QUESTIONS = [
  { key: "q1", question: "TEST question one: which of these is the test lender?", choices: ["TEST LENDER A", "TEST LENDER B", "NONE OF THE ABOVE"] },
  { key: "q2", question: "TEST question two: what is the test amount?", choices: ["$100 - $199", "$200 - $299", "NONE OF THE ABOVE"] },
];
const CREDIT = {
  review: { outcome: "analyst_review", reference: "U20260000000000001", hours: "M-F 9am-9pm ET, Sat 9am-8pm ET" },
  approved: { outcome: "approved", reference: "", hours: "" },
};

function handoffOutcome(job, quote) {
  const email = job.email;
  if (email.startsWith("rejected@")) return result("invalid_customer_details", job.order_ref, { fields: ["email"], field_errors: ["We were unable to verify your email, please confirm your entry before continuing."] });
  if (email.startsWith("handofffail@")) return result("portal_error", job.order_ref);
  const cart = cartFor(quote.products[0].plan_name, quote.products[0].options);
  if (!job.creditCheck || email.startsWith("handoffready@")) return result("handoff_ready", job.order_ref, cart);
  if (email.startsWith("noquestions@")) return result("credit_check_done", job.order_ref, { ...cart, credit_check: CREDIT.review });
  return result("identity_questions", job.order_ref, { ...cart, identity_questions: TEST_QUESTIONS });
}

function send(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

// Like order-service: only the hand-off may carry the credit-check fields, at exactly these paths.
const CREDIT_CHECK_PATHS = new Set(["customer.credit_check.date_of_birth", "customer.credit_check.ssn"]);

function sensitive(value, path = "", allowed = new Set()) {
  if (Array.isArray(value)) return value.flatMap((v, i) => sensitive(v, `${path}[${i}]`, allowed));
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([k, v]) =>
    allowed.has(`${path}${k}`) && typeof v === "string" ? [] : SENSITIVE_KEY_RE.test(k) ? [`${path}${k}`] : sensitive(v, `${path}${k}.`, allowed),
  );
}

function addJob(kind, requestId, job, ms, outcome) {
  job.id = crypto.randomBytes(18).toString("base64url");
  job.kind = kind;
  job.readyAt = Date.now() + ms;
  job.result = () => outcome;
  jobs.set(job.id, job);
  byRequest.set(`${kind}:${requestId}`, job);
  return job;
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
    // The log never keeps credit-check values (tests check nothing sensitive is stored anywhere).
    const logged = url.pathname === "/v1/handoffs" && body.customer?.credit_check ? { ...body, customer: { ...body.customer, credit_check: "[received]" } } : body;
    received.push({ path: url.pathname, body: logged });
    if (sensitive(body, "", url.pathname === "/v1/handoffs" ? CREDIT_CHECK_PATHS : new Set()).length) return send(res, 422, { error: "sensitive_data_rejected" });
  }

  const jobMatch = url.pathname.match(/^\/v1\/jobs\/([A-Za-z0-9_-]{16,64})$/);
  if (req.method === "GET" && jobMatch) {
    const job = jobs.get(jobMatch[1]);
    if (!job) return send(res, 404, { error: "not_found" });
    const done = !job.hang && Date.now() >= job.readyAt;
    return send(res, 200, { job_id: job.id, kind: job.kind, state: done ? "done" : "running", ...(done ? { result: job.result() } : {}) });
  }

  if (req.method === "POST" && url.pathname === "/v1/plans") {
    const street = String(body.service_address?.street ?? "").toLowerCase();
    if (street.includes("down")) return send(res, 500, { error: "internal" });
    const existing = byRequest.get(`plans:${body.request_id}`);
    if (existing) return send(res, 202, { job_id: existing.id, kind: "plans", state: "running" });
    const job = { order_ref: ref(), service_address: body.service_address, hang: street.includes("hang") };
    addJob("plans", body.request_id, job, PLANS_MS * (street.includes("slow") ? 3 : 1), plansOutcome(job));
    return send(res, 202, { job_id: job.id, kind: "plans", state: "running" });
  }

  if (req.method === "POST" && url.pathname === "/v1/quotes") {
    const existing = byRequest.get(`quote:${body.request_id}`);
    if (existing) return send(res, 202, { job_id: existing.id, kind: "quote", state: "running" });
    const plansJob = jobs.get(body.plans_job_id);
    if (!plansJob || plansJob.kind !== "plans") return send(res, 404, { error: "plans_not_found" });
    const plans = plansJob.result();
    if (plans.status !== "plans_ready") return send(res, 409, { error: "plans_not_ready" });
    if (!plans.data.available_plans.some((p) => p.name === body.plan_name)) return send(res, 400, { error: "invalid_request", fields: ["plan_name"] });
    const products = [{ product_type: "internet", plan_name: body.plan_name, options: body.options ?? {} }];
    const job = { order_ref: plansJob.order_ref, service_address: plansJob.service_address, products };
    addJob("quote", body.request_id, job, QUOTE_MS, quoteOutcome(job, plansJob));
    return send(res, 202, { job_id: job.id, kind: "quote", state: "running" });
  }

  if (req.method === "POST" && url.pathname === "/v1/handoffs") {
    const existing = byRequest.get(`handoff:${body.request_id}`);
    if (existing) return send(res, 202, { job_id: existing.id, kind: "handoff", state: "running" });
    const quote = jobs.get(body.quote_job_id);
    if (!quote || quote.kind !== "quote") return send(res, 404, { error: "quote_not_found" });
    if (quote.result().status !== "quote_ready") return send(res, 409, { error: "quote_not_ready" });
    // Only what the scenarios need is kept: the email and whether a credit check came with it.
    const job = { order_ref: quote.order_ref, email: String(body.customer?.email ?? "").toLowerCase(), creditCheck: Boolean(body.customer?.credit_check) };
    addJob("handoff", body.request_id, job, HANDOFF_MS, handoffOutcome(job, quote));
    return send(res, 202, { job_id: job.id, kind: "handoff", state: "running" });
  }

  if (req.method === "POST" && url.pathname === "/v1/verifications") {
    const existing = byRequest.get(`verify:${body.request_id}`);
    if (existing) return send(res, 202, { job_id: existing.id, kind: "verify", state: "running" });
    const asked = jobs.get(body.questions_job_id);
    if (!asked || !["handoff", "verify"].includes(asked.kind)) return send(res, 404, { error: "questions_not_found" });
    const r = asked.result();
    if (r.status !== "identity_questions") return send(res, 409, { error: "questions_not_ready" });
    const answers = body.answers ?? {};
    const qs = r.data.identity_questions;
    if (Object.keys(answers).length !== qs.length || qs.some((q) => !q.choices.includes(answers[q.key]))) return send(res, 400, { error: "invalid_request", fields: ["answers"] });
    const job = { order_ref: asked.order_ref, email: asked.email };
    const credit = job.email.startsWith("approved@") ? CREDIT.approved : CREDIT.review;
    addJob("verify", body.request_id, job, HANDOFF_MS, result("credit_check_done", job.order_ref, { cart_order_id: "DSIX000000001", credit_check: credit }));
    return send(res, 202, { job_id: job.id, kind: "verify", state: "running" });
  }
  return send(res, 404, { error: "not_found" });
});

server.listen(PORT, "127.0.0.1", () => console.log(`SPOC mock listening on http://127.0.0.1:${PORT}`));
