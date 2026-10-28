/**
 * Online order flow tests: run with `npm run build:audit && npm run test:order` (both 1440 px and 390 px).
 *
 * The site runs from the local audit build and talks to tests/mocks/spoc-mock.mjs, which answers exactly
 * like order-service + the SPOC automation. Covered:
 *   1. Every Order Now button on every page lands on /att/order with the right plan, source page and click IDs.
 *   2. The full flow for success and for every automation status, slow and hanging responses, and an
 *      unreachable service: an honest "please call" screen, never a fake quote or confirmation.
 *   3. SSN / date of birth / card / bank fields cannot be sent; no personal data in URLs, analytics or logs.
 *   4. The order events fire in order, with plan id and value only.
 */
import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const MOCK = `http://127.0.0.1:${process.env.MOCK_PORT || 4010}`;
const SERVER_LOG = path.resolve(__dirname, "../test-results/order-server.log");
const GCLID = "TESTGCLID123";
const ORDER_EVENTS = ["order_click", "begin_order", "order_quote_started", "order_quote_shown", "order_step_details", "order_submit", "order_failed"];
const PERSON = { first: "Flowtester", last: "Ordercheck", phone: "(214) 555-0147", email: "flow.tester@example.com" };
const PII_MARKERS = [PERSON.first, PERSON.last, "2145550147", "555-0147", PERSON.email, "flow.tester", "Plainview"];

// Every page in the build, plus the dynamic order page.
const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../.next-audit/prerender-manifest.json"), "utf8")) as { routes: Record<string, unknown> };
const PAGES = [
  ...Object.keys(manifest.routes).filter((r) => !r.startsWith("/_") && !/opengraph-image|twitter-image|icon|\.(xml|txt|svg|png)$/.test(r)),
  "/order",
].sort();

const isMobile = (info: TestInfo) => info.project.name === "390";
const url = (p: string, query = `gclid=${GCLID}&utm_source=ordertest`) => `/att${p === "/" ? "" : p}${query ? `?${query}` : ""}`;

/** Stored consent (no banner over the buttons) and no calls to Google from the tests. */
async function prepare(page: Page) {
  await page.context().addCookies([
    { name: "att_consent", value: encodeURIComponent(JSON.stringify({ v: 1, analytics: true, ads: true, ts: new Date().toISOString() })), url: "http://localhost" },
  ]);
  await page.route(/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "" }));
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  return { errors, requests };
}

const dataLayerEvents = (page: Page) =>
  page.evaluate(() => (window.dataLayer || []).filter((e): e is Record<string, unknown> => !!e && typeof e === "object" && !Array.isArray(e) && "event" in e));

// ---------------------------------------------------------------------------------------------------------
// 1. Every Order Now button
// ---------------------------------------------------------------------------------------------------------

const CHUNK = 14;
for (let i = 0; i < PAGES.length; i += CHUNK) {
  const chunk = PAGES.slice(i, i + CHUNK);
  test(`Order Now buttons: ${chunk[0]} … ${chunk.at(-1)} (${chunk.length} pages)`, async ({ page }, info) => {
    test.setTimeout(600_000);
    const { errors } = await prepare(page);
    let clicked = 0;
    for (const pagePath of chunk) {
      await page.goto(url(pagePath));
      const total = await page.locator("a[data-order-link]").count();
      expect(total, `${pagePath} has Order Now buttons`).toBeGreaterThan(0);
      for (let n = 0; n < total; n++) {
        if (n > 0) await page.goto(url(pagePath));
        const link = page.locator("a[data-order-link]").nth(n);
        if (!(await link.isVisible())) {
          const inMenu = await link.evaluate((el) => !!el.closest("#mobile-menu"));
          if (!(isMobile(info) && inMenu)) continue; // shown only at the other width; clicked in that project
          await page.locator('button[aria-controls="mobile-menu"]').click();
          await expect(link).toBeVisible();
        }
        const plan = await link.getAttribute("data-offer-id");
        await expect(link).toHaveText(/^(Order Now|Ordenar ahora)$/);
        await link.click();
        // Wait for the new URL (on /order itself the page is already on /att/order before the click).
        await page.waitForURL((u) => u.pathname === "/att/order" && u.searchParams.get("source") === pagePath && u.searchParams.get("gclid") === GCLID, { timeout: 15_000 });
        const landed = new URL(page.url());
        expect(landed.searchParams.get("plan"), `${pagePath} button ${n}`).toBe(plan === "none" ? null : plan);
        expect(landed.searchParams.get("source")).toBe(pagePath);
        expect(landed.searchParams.get("utm_source")).toBe("ordertest");
        expect(landed.searchParams.has("intent")).toBe(false);
        await expect(page.locator("h1")).toContainText("Order AT&T Internet");
        clicked++;
      }
    }
    expect(errors, "console errors").toEqual([]);
    info.annotations.push({ type: "clicked", description: String(clicked) });
  });
}

// ---------------------------------------------------------------------------------------------------------
// 2. Flow helpers
// ---------------------------------------------------------------------------------------------------------

/** Arrive the way a visitor does: click the plan's Order Now button on a page. */
async function arrive(page: Page, fromPath: string, planId: string) {
  await page.goto(url(fromPath));
  await page.locator(`a[data-order-link][data-offer-id="${planId}"]`).filter({ visible: true }).first().click();
  await page.waitForURL((u) => u.pathname === "/att/order" && u.searchParams.get("plan") === planId);
  await expect(page.getByRole("heading", { name: "Your Plan" })).toBeVisible();
}

async function answer(page: Page, labels: string[]) {
  for (const label of labels) await page.getByLabel(label, { exact: true }).check();
  await page.getByRole("button", { name: "Continue" }).click();
}

async function address(page: Page, street: string, extra: { unit?: string } = {}) {
  await expect(page.getByRole("heading", { name: "Service Address" })).toBeVisible();
  await page.getByLabel("Street address").fill(street);
  await page.getByLabel("Apt or unit (optional)").fill(extra.unit ?? "");
  await page.getByLabel("City").fill("Hicksville");
  await page.getByLabel("State").selectOption("NY");
  await page.getByLabel("ZIP code").fill("11801");
  await page.getByRole("button", { name: "Check Availability and Price" }).click();
}

async function expectQuote(page: Page, total: string) {
  await expect(page.getByRole("heading", { name: "Your Quote" })).toBeVisible({ timeout: 20_000 });
  await expect(page.locator("[data-order-total]")).toHaveText(total);
}

async function details(page: Page, email = PERSON.email) {
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Your Details" })).toBeVisible();
  await page.getByLabel("First name").fill(PERSON.first);
  await page.getByLabel("Last name").fill(PERSON.last);
  await page.getByLabel("Phone number").fill(PERSON.phone);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("English", { exact: true }).check();
  await page.getByLabel("No, please do not").check();
  await page.locator("#order-consent").check();
  await page.getByRole("button", { name: "Review Order Request" }).click();
  await expect(page.getByRole("heading", { name: "Confirm Your Order Request" })).toBeVisible();
}

async function submit(page: Page) {
  await page.getByRole("button", { name: "Submit Order Request" }).click();
}

/** An honest stop screen: Call Now present, no reference number, no total. */
async function expectStop(page: Page, heading: RegExp) {
  await expect(page.getByRole("heading", { name: heading })).toBeVisible({ timeout: 25_000 });
  await expect(page.locator('main a[data-phone-link^="order-"][href^="tel:"]').filter({ hasText: "Call Now" })).toBeVisible();
  await expect(page.locator("[data-order-reference]")).toHaveCount(0);
  await expect(page.locator("[data-order-total]")).toHaveCount(0);
  await expect(page.getByText("Reference number")).toHaveCount(0);
}

const FAILED = /We Could Not Complete Your Request Online/;
const AIR = ["Yes, apply the AutoPay and paperless billing discount", "No, do not add Extended Wi-Fi"];

// ---------------------------------------------------------------------------------------------------------
// 3. Full flows
// ---------------------------------------------------------------------------------------------------------

test("Success: Internet Air, quote → details → reference; events in order; no personal data leaks", async ({ page }) => {
  const { errors, requests } = await prepare(page);
  await arrive(page, "/internet/internet-air", "internet-air");
  // Nothing is preselected and Continue without answers is refused.
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Please choose an option for each item.")).toBeVisible();
  await answer(page, AIR);
  await address(page, "300 Plainview Road");
  await expect(page.getByRole("heading", { name: "Checking Your Address and Price" })).toBeVisible();
  await expectQuote(page, "$55.00");
  await expect(page.getByRole("cell", { name: "AT&T Internet Air" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "AutoPay/Paperless Billing Discount" })).toBeVisible();
  await expect(page.getByText("AT&T Extended Wi-Fi")).toHaveCount(0);
  await details(page);
  await submit(page);
  await expect(page.getByRole("heading", { name: /Thank You/ })).toBeVisible({ timeout: 20_000 });
  await expect(page.locator("[data-order-reference]")).toHaveText(/^UW-[A-Z0-9]{8}$/);
  await expect(page.getByText("A specialist will contact you to complete the credit check and payment.")).toBeVisible();
  await expect(page.locator('a[data-phone-link="order-done"]')).toBeVisible();

  const events = await dataLayerEvents(page);
  const order = events.map((e) => String(e.event)).filter((e) => ORDER_EVENTS.includes(e));
  expect(order).toEqual(["order_click", "begin_order", "order_quote_started", "order_quote_shown", "order_step_details", "order_submit"]);
  for (const e of events.filter((e) => ORDER_EVENTS.includes(String(e.event)))) {
    expect(e.offer_id).toBe("internet-air");
    expect(e.value).toBe(55);
  }
  const analytics = JSON.stringify(events);
  const urls = requests.join("\n");
  for (const marker of PII_MARKERS) {
    expect(analytics, `analytics contains ${marker}`).not.toContain(marker);
    expect(urls, `a URL contains ${marker}`).not.toContain(marker);
    expect(urls).not.toContain(encodeURIComponent(marker));
  }
  expect(page.url()).not.toMatch(/Plainview|flow\.tester|2145550147/);
  expect(errors).toEqual([]);
});

test("Success: Internet 300 with equipment and installation choices", async ({ page }) => {
  await prepare(page);
  await arrive(page, "/internet/fiber", "fiber-300");
  await answer(page, ["Yes, apply the AutoPay and paperless billing discount", "AT&T Internet Equipment Fee ($0)", "AT&T Professional Install ($0)"]);
  await address(page, "915 Plainview Road");
  await expectQuote(page, "$35.00");
  await details(page);
  await submit(page);
  await expect(page.locator("[data-order-reference]")).toHaveText(/^UW-/, { timeout: 20_000 });
});

test("Options required: extra choices asked with nothing preselected, then the quote", async ({ page }) => {
  await prepare(page);
  await arrive(page, "/internet/fiber", "fiber-500");
  await answer(page, ["No, decline the discount"]);
  await address(page, "12 Options Lane");
  await expect(page.getByRole("heading", { name: "A Few More Choices" })).toBeVisible({ timeout: 20_000 });
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);
  await expect(page.getByText(/Agent script/)).toHaveCount(0);
  await page.getByLabel("AT&T Internet Equipment Fee ($0)").check();
  await page.getByLabel("AT&T Professional Install ($0)").check();
  await page.getByRole("button", { name: "Update My Quote" }).click();
  await expectQuote(page, "$50.00");
});

test("Address needs a unit: asked on the same step, then the quote", async ({ page }) => {
  await prepare(page);
  await arrive(page, "/internet/internet-air", "internet-air");
  await answer(page, AIR);
  await address(page, "40 Needsunit Court");
  await expect(page.getByText("This address needs an apartment or unit number.")).toBeVisible({ timeout: 20_000 });
  await address(page, "40 Needsunit Court", { unit: "4B" });
  await expectQuote(page, "$55.00");
});

for (const [street, message] of [
  ["5 Notfound Street", "We could not confirm this service address."],
  ["6 Ambiguous Way", "More than one address matched."],
] as const) {
  test(`Address problem (${street.split(" ")[1].toLowerCase()}): back to the address step with a clear message`, async ({ page }) => {
    await prepare(page);
    await arrive(page, "/internet/internet-air", "internet-air");
    await answer(page, AIR);
    await address(page, street);
    await expect(page.getByText(message)).toBeVisible({ timeout: 20_000 });
    await expect(page.locator("[data-order-total]")).toHaveCount(0);
    const failedEvent = (await dataLayerEvents(page)).find((e) => e.event === "order_failed");
    expect(failedEvent?.reason).toMatch(/^address_/);
  });
}

const STOPS: [string, string, RegExp, boolean][] = [
  ["unrequested bundle (DIRECTV)", "7 Bundle Road", /Please Call Us to Complete Your Order/, false],
  ["declined extender still in the cart", "8 Extender Road", /Please Call Us to Complete Your Order/, false],
  ["no offers at the address", "9 Nooffers Road", /We Could Not Find Online Offers/, false],
  ["plan not found", "10 Planmissing Road", /This Plan Is Not Available Online/, false],
  ["product not available", "11 Noproduct Road", /This Plan Is Not Available Online/, false],
  ["session expired", "12 Expired Road", FAILED, true],
  ["portal error", "13 Portalerror Road", FAILED, true],
  ["automation timeout", "14 Timeoutstatus Road", FAILED, true],
  ["automation not configured", "15 Notconfigured Road", FAILED, false],
  ["service unreachable", "16 Down Road", FAILED, true],
  ["no answer within the page limit", "17 Hang Road", FAILED, true],
];
for (const [name, street, heading, retryable] of STOPS) {
  test(`Stops honestly: ${name}`, async ({ page }) => {
    await prepare(page);
    await arrive(page, "/internet/internet-air", "internet-air");
    await answer(page, AIR);
    await address(page, street);
    await expectStop(page, heading);
    await expect(page.getByRole("button", { name: "Try Again" })).toHaveCount(retryable ? 1 : 0);
    if (retryable) {
      // One retry is offered; after it fails again only Call Now remains.
      await page.getByRole("button", { name: "Try Again" }).click();
      await expectStop(page, heading);
      await expect(page.getByRole("button", { name: "Try Again" })).toHaveCount(0);
    }
    const names = (await dataLayerEvents(page)).map((e) => e.event);
    expect(names).toContain("order_failed");
    expect(names).not.toContain("order_quote_shown");
  });
}

test("Slow quote: progress screen stays until the real quote arrives", async ({ page }) => {
  await prepare(page);
  await arrive(page, "/internet/internet-air", "internet-air");
  await answer(page, AIR);
  await address(page, "18 Slow Road");
  await expect(page.getByRole("heading", { name: "Checking Your Address and Price" })).toBeVisible();
  await expect(page.getByText("This usually takes about 45 seconds. Please keep this page open.")).toBeVisible();
  await expectQuote(page, "$55.00");
});

test("Invalid email from the automation: corrected on the same screen, then the reference", async ({ page }) => {
  await prepare(page);
  await arrive(page, "/internet/internet-air", "internet-air");
  await answer(page, AIR);
  await address(page, "300 Plainview Road");
  await expectQuote(page, "$55.00");
  await details(page, "rejected@example.com");
  await submit(page);
  await expect(page.getByRole("heading", { name: "Your Details" })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("This email address was not accepted. Please check it and try again.")).toBeVisible();
  await expect(page.locator("[data-order-reference]")).toHaveCount(0);
  await page.getByLabel("Email address").fill(PERSON.email);
  await page.getByRole("button", { name: "Review Order Request" }).click();
  await submit(page);
  await expect(page.locator("[data-order-reference]")).toHaveText(/^UW-/, { timeout: 20_000 });
});

test("Submission failure: honest message, no confirmation", async ({ page }) => {
  await prepare(page);
  await arrive(page, "/internet/internet-air", "internet-air");
  await answer(page, AIR);
  await address(page, "300 Plainview Road");
  await expectQuote(page, "$55.00");
  await details(page, "handofffail@example.com");
  await submit(page);
  await expectStop(page, FAILED);
});

test("Plans that cannot be ordered online show the call message", async ({ page }) => {
  await prepare(page);
  await arrive(page, "/wireless", "wireless-value-2");
  await expect(page.getByText("This plan is not available to order online.")).toBeVisible();
  await expect(page.getByLabel("Street address")).toHaveCount(0);
  await page.getByRole("button", { name: "Change plan" }).click();
  await page.getByRole("button", { name: /AT&T Internet Air/ }).click();
  await expect(page.getByText("AutoPay and paperless billing discount", { exact: true })).toBeVisible();
});

// ---------------------------------------------------------------------------------------------------------
// 4. Security and privacy
// ---------------------------------------------------------------------------------------------------------

test("API refuses SSN, date of birth, card and bank data, and none reaches the automation", async ({ request }, info) => {
  test.skip(isMobile(info), "API check runs once");
  const address = { street: "300 Plainview Road", unit: "", city: "Hicksville", state: "NY", zip: "11801" };
  const quote = { requestId: "sec-check-0000000000001", plan: "internet-air", options: { autopay: true, wifi_extender: false }, address };
  const customer = { firstName: "Testa", lastName: "Testb", phone: "2145550147", email: "sec@example.com", billingLanguage: "english", contactByPhone: "no" };
  const submitBody = { requestId: "sec-check-0000000000002", quoteJobId: "a".repeat(24), customer, consent: true };
  const cases: [string, unknown][] = [
    ["quote", { ...quote, ssn: "123-45-6789" }],
    ["quote", { ...quote, address: { ...address, street: "123-45-6789" } }],
    ["quote", { ...quote, address: { ...address, street: "4111 1111 1111 1111" } }],
    ["quote", { ...quote, address: { ...address, city: "01/02/1990" } }],
    ["submit", { ...submitBody, customer: { ...customer, dateOfBirth: "1990-01-02" } }],
    ["submit", { ...submitBody, customer: { ...customer, cardNumber: "4111111111111111" } }],
    ["submit", { ...submitBody, bankAccount: "000123456789" }],
    ["submit", { ...submitBody, customer: { ...customer, routingNumber: "021000021" } }],
    ["submit", { ...submitBody, customer: { ...customer, firstName: "123456789" } }],
  ];
  for (const [route, data] of cases) {
    const res = await request.post(`/att/api/order/${route}`, { data });
    expect(res.status(), JSON.stringify(data).slice(0, 80)).toBe(422);
    const text = await res.text();
    for (const secret of ["123-45-6789", "4111", "1990", "000123456789", "021000021"]) expect(text).not.toContain(secret);
    expect(res.headers()["cache-control"]).toContain("no-store");
  }
  // Unknown fields are refused too.
  expect((await request.post("/att/api/order/quote", { data: { ...quote, extra: "x" } })).status()).toBe(400);
  const log = JSON.stringify(await (await request.get(`${MOCK}/__mock/log`)).json());
  for (const secret of ["123-45-6789", "4111", "01/02/1990", "dateOfBirth", "cardNumber", "bankAccount", "routingNumber", "sec-check-"]) expect(log).not.toContain(secret);
});

test("The order form never asks for SSN, date of birth, card or bank details", async ({ page }) => {
  await prepare(page);
  const forbidden = /ssn|social security|birth|\bdob\b|card|cvv|cvc|expir|bank|routing|account number|iban|\bpin\b/i;
  const scan = async () => {
    const fields = await page.locator("main input, main select, main textarea").evaluateAll((els) =>
      els.map((el) => {
        const e = el as HTMLInputElement;
        const label = e.labels?.[0]?.textContent ?? "";
        return [e.name, e.id, e.autocomplete, e.getAttribute("aria-label") ?? "", label, e.type].join(" | ");
      }),
    );
    for (const f of fields) expect(f).not.toMatch(forbidden);
    expect(await page.locator('main input[type="password"]').count()).toBe(0);
  };
  await arrive(page, "/internet/internet-air", "internet-air");
  await scan();
  await answer(page, AIR);
  await scan();
  await address(page, "300 Plainview Road");
  await expectQuote(page, "$55.00");
  await page.getByRole("button", { name: "Continue" }).click();
  await scan();
});

test("Order page: noindex, no-store, not in the sitemap; server log holds no personal data", async ({ request }, info) => {
  test.skip(isMobile(info), "Header check runs once");
  const res = await request.get("/att/order?plan=internet-air");
  expect(res.status()).toBe(200);
  expect(res.headers()["cache-control"]).toMatch(/no-store/);
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
  expect(await res.text()).toMatch(/<meta name="robots" content="noindex/);
  expect(await (await request.get("/att/sitemap.xml")).text()).not.toContain("/order");
  expect(await (await request.get("/att/robots.txt")).text()).toContain("Disallow: /att/api/");
  // Give the flows running in parallel a moment, then check everything the server printed.
  await new Promise((r) => setTimeout(r, 1000));
  const log = fs.existsSync(SERVER_LOG) ? fs.readFileSync(SERVER_LOG, "utf8") : "";
  for (const marker of [...PII_MARKERS, "rejected@example.com", "handofffail@example.com", "Testa", "sec@example.com"]) expect(log).not.toContain(marker);
});

test("Without the automation configured, the page says so and the API answers unavailable", async ({ browser }, info) => {
  test.skip(isMobile(info), "Runs once");
  test.setTimeout(120_000);
  const port = 3201;
  const env = { ...process.env, ALLOW_TEST_ENV: "1", NEXT_PUBLIC_BUILD_LABEL: "AUDIT", ATTSPOC_SERVICE_URL: "", ATTSPOC_SERVICE_KEY: "" };
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { env, cwd: path.resolve(__dirname, ".."), stdio: "ignore" });
  try {
    const base = `http://localhost:${port}`;
    for (let i = 0; i < 60; i++) {
      const ok = await fetch(`${base}/att/order`).then((r) => r.ok).catch(() => false);
      if (ok) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    const page = await browser.newPage();
    await page.goto(`${base}/att/order?plan=internet-air`);
    await expect(page.getByText("Online ordering is currently unavailable.")).toBeVisible();
    await expect(page.getByLabel("Street address")).toHaveCount(0);
    const res = await page.request.post(`${base}/att/api/order/quote`, {
      data: { requestId: "unconfigured-000000001", plan: "internet-air", options: { autopay: true, wifi_extender: false }, address: { street: "1 Main St", unit: "", city: "Hicksville", state: "NY", zip: "11801" } },
    });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ state: "unavailable" });
    await page.close();
  } finally {
    child.kill();
  }
});
