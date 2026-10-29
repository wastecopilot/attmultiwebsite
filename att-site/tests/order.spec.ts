/**
 * Online order flow tests: run with `npm run build:audit && npm run test:order` (both 1440 px and 390 px).
 *
 * The site runs from the local audit build and talks to tests/mocks/spoc-mock.mjs, which answers like
 * order-service + the SPOC automation (tests/mocks/portal-fixtures.json). Plan names and prices on the page
 * must come from att.com (src/data/offers.ts); the portal only says which plans are available. Covered:
 *   1. Every Order Now button on every page lands on /att/order with the right plan, source page and click IDs.
 *   2. Address → plans at the address → options → quote → details → review → reference, for every plan
 *      (Internet 300 / 500 / 1000 / 5000 / 100 and AT&T Internet Air).
 *   3. A plan not offered at the address (alternatives shown), no plans, a rejected email, Extended Wi-Fi
 *      declined vs chosen, a paid add-on the visitor did not choose (the "$77" case), every stop screen.
 *   4. SSN / date of birth / card / bank fields cannot be sent; no personal data in URLs, analytics or logs.
 */
import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { offers } from "../src/data/offers";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const MOCK = `http://127.0.0.1:${process.env.MOCK_PORT || 4010}`;
const SERVER_LOG = path.resolve(__dirname, "../test-results/order-server.log");
const GCLID = "TESTGCLID123";
const ORDER_EVENTS = [
  "order_click",
  "begin_order",
  "order_plans_shown",
  "order_options_chosen",
  "order_quote_started",
  "order_quote_shown",
  "order_step_details",
  "order_submit",
  "order_failed",
];
const attComPrice = (id: string) => offers.find((o) => o.id === id)!.price!.amount;
const PERSON = { first: "Flowtester", last: "Ordercheck", phone: "(214) 555-0147", email: "flow.tester@example.com" };
// Local-mock test values only (never sent beyond localhost).
const CREDIT = { dob: "01/15/1985", ssn: "001-01-0001" };
const PII_MARKERS = [PERSON.first, PERSON.last, "2145550147", "555-0147", PERSON.email, "flow.tester", "Plainview", "Courtenay", "Lakeforest", CREDIT.dob, CREDIT.ssn, "001010001"];

const ADDRESSES = {
  atlanta: { street: "915 Courtenay Dr NE", city: "Atlanta", state: "GA", zip: "30306" },
  hicksville: { street: "300 Plainview Road", city: "Hicksville", state: "NY", zip: "11801" },
  dallas: { street: "2650 Lakeforest Ct", city: "Dallas", state: "TX", zip: "75214" },
} as const;
type Site = keyof typeof ADDRESSES;

// Real portal choice titles (portal-fixtures.json).
const AUTOPAY_YES = /^AutoPay\/Paperless Billing Discount/;
const AUTOPAY_NO = /^Decline AutoPay\/Paperless Billing/;
const EXTENDER_YES = /^Next-generation Wi-Fi experience/;
const EXTENDER_NO = /^Decline Extended Wi-Fi Coverage Service/;
const FIBER_INSTALL = /^AT&T Professional Install\b/;

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
        await expect(page.locator("h1")).toContainText("Order AT&T Internet");
        // Internet offers start at the address step; everything else says plainly that it is ordered by phone.
        await expect(page.getByRole("heading", { name: /Your Service Address|Cannot Be Ordered Online/ })).toBeVisible();
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
}

/** Open the order page directly, as an Order Now link does (?plan=&source=&gclid=). */
async function open(page: Page, plan = "") {
  await page.goto(url("/order", `${plan ? `plan=${plan}&` : ""}source=/internet&gclid=${GCLID}`));
}

async function address(page: Page, where: Site | string, extra: { unit?: string } = {}) {
  const a = typeof where === "string" && where in ADDRESSES ? ADDRESSES[where as Site] : { ...ADDRESSES.hicksville, street: where };
  await expect(page.getByRole("heading", { name: "Your Service Address" })).toBeVisible();
  await page.getByLabel("Street address").fill(a.street);
  await page.getByLabel("Apartment or unit (optional)").fill(extra.unit ?? "");
  await page.getByLabel("City").fill(a.city);
  await page.getByLabel("State").selectOption(a.state);
  await page.getByLabel("ZIP code").fill(a.zip);
  await page.getByRole("button", { name: "Show Plans at This Address" }).click();
}

async function expectPlans(page: Page, ids: string[]) {
  await expect(page.getByRole("heading", { name: "Plans Available at Your Address" })).toBeVisible({ timeout: 20_000 });
  await expect(page.locator("[data-plan-card]")).toHaveCount(ids.length);
  for (const id of ids) await expect(page.locator(`[data-plan-card="${id}"]`)).toBeVisible();
}

const selectedCards = (page: Page) => page.locator('[data-plan-card][data-selected="true"]');

async function choosePlan(page: Page, id: string) {
  await page.locator(`[data-plan-card="${id}"] input[type="radio"]`).check();
  await expect(selectedCards(page)).toHaveCount(1);
  await expect(page.locator(`[data-plan-card="${id}"]`)).toHaveAttribute("data-selected", "true");
}

async function toOptions(page: Page) {
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Choose Your Options" })).toBeVisible({ timeout: 20_000 });
}

async function pick(page: Page, choices: RegExp[]) {
  for (const c of choices) await page.getByRole("radio", { name: c }).check();
}

async function toQuote(page: Page, total: string) {
  await page.getByRole("button", { name: "See My Quote" }).click();
  await expect(page.getByRole("heading", { name: "Your Quote" })).toBeVisible({ timeout: 20_000 });
  await expect(page.locator("[data-order-total]")).toHaveText(total);
}

async function details(page: Page, email = PERSON.email) {
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Personal Information" })).toBeVisible();
  await page.getByLabel("First name").fill(PERSON.first);
  await page.getByLabel("Last name").fill(PERSON.last);
  await page.getByLabel("Phone number").fill(PERSON.phone);
  await page.getByLabel("Email address", { exact: true }).fill(email);
  await page.getByLabel("Confirm email address").fill(email);
  await page.getByLabel("English", { exact: true }).check();
  // The phone/text permission is a separate, optional box and starts unchecked.
  await expect(page.locator("#order-contact")).not.toBeChecked();
  // The credit check, as on the portal's Personal Information page: consent, date of birth, SSN (masked).
  await page.locator("#order-credit-consent").check();
  await page.getByLabel("Date of birth (MM/DD/YYYY)", { exact: true }).fill(CREDIT.dob);
  await page.getByLabel("Social Security number", { exact: true }).fill(CREDIT.ssn);
  await expect(page.getByLabel("Social Security number", { exact: true })).toHaveAttribute("type", "password");
  await page.locator("#order-consent").check();
  await page.getByRole("button", { name: "Review Order Request" }).click();
  await expect(page.getByRole("heading", { name: "Review and Submit" })).toBeVisible();
}

async function submit(page: Page) {
  await page.getByRole("button", { name: "Submit Order Request" }).click();
}

async function expectDone(page: Page) {
  await expect(page.getByRole("heading", { name: /Thank You/ })).toBeVisible({ timeout: 20_000 });
  // The portal's Order ID is shown (our own reference stays on the element for support).
  await expect(page.locator("[data-order-reference]")).toHaveText(/^[A-Z]{2,8}\d{6,14}$/);
  await expect(page.locator("[data-order-reference]")).toHaveAttribute("data-order-reference", /^UW-[A-Z0-9]{8}$/);
  await expect(page.getByText("A specialist will contact you to complete the credit check and payment.")).toBeVisible();
  await expect(page.locator('a[data-phone-link="order-done"]')).toBeVisible();
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
const CALL = /Please Call Us to Complete Your Order/;
const NO_PLANS = /AT&T Internet Is Not Available at This Address/;
const lineAmounts = (page: Page) => page.locator("[data-quote-line] td:last-child").allInnerTexts();

// ---------------------------------------------------------------------------------------------------------
// 3. Every plan, start to finish
// ---------------------------------------------------------------------------------------------------------

test("Success: Internet Air from its Order Now button; events in order; no personal data leaks", async ({ page }) => {
  const { errors, requests } = await prepare(page);
  await arrive(page, "/internet/internet-air", "internet-air");
  await address(page, "hicksville");
  await expect(page.getByRole("heading", { name: "Checking the Plans at Your Address" })).toBeVisible();
  await expectPlans(page, ["internet-air"]);
  // The plan from the button is preselected, and the address bar names the same plan.
  await expect(page.locator('[data-plan-card="internet-air"]')).toHaveAttribute("data-selected", "true");
  expect(new URL(page.url()).searchParams.get("plan")).toBe("internet-air");
  // att.com's price, never the portal card's ($60).
  await expect(page.locator('[data-plan-card="internet-air"] [data-plan-price]')).toHaveAttribute("data-plan-price", String(attComPrice("internet-air")));
  await expect(page.locator('[data-plan-card="internet-air"]')).toContainText("Pricing as of");
  await toOptions(page);
  // Extended Wi-Fi has no att.com price, so it is not offered; AutoPay is an explicit choice with att.com's text.
  await expect(page.getByRole("radio", { name: EXTENDER_YES })).toHaveCount(0);
  await expect(page.locator("[data-hidden-addons]")).toBeVisible();
  await expect(page.getByRole("radio", { name: AUTOPAY_YES })).not.toBeChecked();
  await expect(page.getByRole("radio", { name: AUTOPAY_NO })).not.toBeChecked();
  await expect(page.getByText(/ask the Customer/i)).toHaveCount(0);
  await expect(page.getByText(/\$10\/mo if enrolled in Autopay w\/ your bank account/).first()).toBeVisible();
  await page.getByRole("button", { name: "See My Quote" }).click();
  await expect(page.getByText("Please choose an option for each item.")).toBeVisible();
  await pick(page, [AUTOPAY_YES]);
  await toQuote(page, "$55.00");
  await expect(page.getByRole("cell", { name: /^AT&T Internet Air/ })).toBeVisible();
  await expect(page.getByRole("cell", { name: /^AutoPay\/Paperless Billing Discount/ })).toBeVisible();
  await expect(page.getByText("AT&T Extended Wi-Fi")).toHaveCount(0);
  await details(page);
  await submit(page);
  await expectDone(page);

  const events = await dataLayerEvents(page);
  const order = events.map((e) => String(e.event)).filter((e) => ORDER_EVENTS.includes(e));
  expect(order).toEqual(["order_click", "begin_order", "order_plans_shown", "order_options_chosen", "order_quote_started", "order_quote_shown", "order_step_details", "order_submit"]);
  for (const e of events.filter((e) => ORDER_EVENTS.includes(String(e.event)))) {
    expect(e.offer_id).toBe("internet-air");
    expect(typeof e.value).toBe("number");
  }
  expect(events.find((e) => e.event === "order_quote_shown")?.value).toBe(55);
  const analytics = JSON.stringify(events);
  const urls = requests.join("\n");
  for (const marker of PII_MARKERS) {
    expect(analytics, `analytics contains ${marker}`).not.toContain(marker);
    expect(urls, `a URL contains ${marker}`).not.toContain(marker);
    expect(urls).not.toContain(encodeURIComponent(marker));
  }
  expect(errors).toEqual([]);
});

// Cards show att.com prices; the portal carts for AutoPay taken and $0 items chosen equal them.
const FIBER: [string, string, string, string][] = [
  ["fiber-300", "fiber-300", "50", "$50.00"],
  ["fiber-500", "fiber-500", "60", "$60.00"],
  ["fiber-1000", "fiber-1000", "70", "$70.00"],
  ["fiber-5000", "fiber-5000", "110", "$110.00"],
];
for (const [offer, card, price, total] of FIBER) {
  test(`Success: ${card} at the Atlanta test address, every step to the reference`, async ({ page }) => {
    await prepare(page);
    await open(page, offer);
    await address(page, "atlanta");
    await expectPlans(page, FIBER.map((f) => f[1]));
    await expect(selectedCards(page)).toHaveCount(1);
    await expect(page.locator(`[data-plan-card="${card}"]`)).toHaveAttribute("data-selected", "true");
    await expect(page.locator(`[data-plan-card="${card}"] [data-plan-price]`)).toHaveAttribute("data-plan-price", price);
    await expect(page.locator(`[data-plan-card="${card}"] a`, { hasText: "Broadband Facts" })).toHaveAttribute("href", /^https:\/\/www\.att\.com\//);
    await toOptions(page);
    await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);
    // Equipment and installation have one option each, so they are shown as included, not asked.
    await expect(page.locator("[data-fixed-options]")).toContainText("AT&T Internet Equipment Fee");
    await expect(page.locator("[data-fixed-options]")).toContainText("AT&T Professional Install");
    await expect(page.getByRole("radio", { name: FIBER_INSTALL })).toHaveCount(0);
    await pick(page, [AUTOPAY_YES]);
    await expect(page.getByText("Unlimited Data").first()).toBeVisible();
    await toQuote(page, total);
    await details(page);
    await submit(page);
    await expectDone(page);
  });
}

test("Portal plans that att.com does not list (Internet 100) are hidden", async ({ page }) => {
  await prepare(page);
  await open(page);
  await address(page, "dallas");
  await expectPlans(page, ["internet-air"]);
  await expect(page.getByText("Internet 100")).toHaveCount(0);
});

test("Every price shown comes from att.com: plan cards and the quote total", async ({ page }) => {
  await prepare(page);
  await open(page);
  await address(page, "atlanta");
  await expectPlans(page, FIBER.map((f) => f[1]));
  for (const card of await page.locator("[data-plan-card]").all()) {
    const id = (await card.getAttribute("data-plan-card"))!;
    await expect(card.locator("[data-plan-price]")).toHaveAttribute("data-plan-price", String(attComPrice(id)));
    // The portal card prices ($65, $80, $125 for 500/1000/5000) never appear.
    for (const portal of ["$65", "$80", "$125"]) await expect(card.locator(".price")).not.toContainText(portal);
  }
  await choosePlan(page, "fiber-500");
  await toOptions(page);
  await pick(page, [AUTOPAY_YES]);
  await toQuote(page, `$${attComPrice("fiber-500")}.00`);
});

// ---------------------------------------------------------------------------------------------------------
// 4. Availability, highlight, add-ons and stops
// ---------------------------------------------------------------------------------------------------------

test("A plan not offered at the address: said plainly, the available plans shown, and any of them continues", async ({ page }) => {
  await prepare(page);
  await open(page, "fiber-1000");
  await address(page, "hicksville");
  await expectPlans(page, ["internet-air"]);
  await expect(page.locator("[data-plan-unavailable]")).toHaveText("AT&T Internet 1000 is not available at this address. These plans are available:");
  await expect(selectedCards(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Please choose a plan.")).toBeVisible();
  await choosePlan(page, "internet-air");
  expect(new URL(page.url()).searchParams.get("plan")).toBe("internet-air");
  await toOptions(page);
  await pick(page, [AUTOPAY_YES]);
  await toQuote(page, "$55.00");
});

test("The highlighted plan always matches the plan in the address bar", async ({ page }) => {
  await prepare(page);
  await open(page, "fiber-300");
  await address(page, "atlanta");
  await expectPlans(page, FIBER.map((f) => f[1]));
  for (const [offer, card] of [["fiber-300", "fiber-300"], ["fiber-1000", "fiber-1000"], ["fiber-500", "fiber-500"]]) {
    if (offer !== "fiber-300") await choosePlan(page, card);
    await expect(selectedCards(page)).toHaveCount(1);
    await expect(page.locator(`[data-plan-card="${card}"]`)).toHaveAttribute("data-selected", "true");
    const params = new URL(page.url()).searchParams;
    expect(params.get("plan")).toBe(offer);
    expect(params.get("gclid")).toBe(GCLID); // click IDs are kept when the plan changes
  }
});

test("No plans at the address: the honest call screen", async ({ page }) => {
  await prepare(page);
  await open(page, "fiber-300");
  await address(page, "9 Nooffers Road");
  await expectStop(page, NO_PLANS);
  await expect(page.getByRole("button", { name: "Check the Address" })).toBeVisible();
});

test("Extended Wi-Fi has no att.com price, so it is never offered or added", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "hicksville");
  await expectPlans(page, ["internet-air"]);
  await toOptions(page);
  await expect(page.getByRole("radio", { name: EXTENDER_YES })).toHaveCount(0);
  await expect(page.getByRole("radio", { name: EXTENDER_NO })).toHaveCount(0);
  await pick(page, [AUTOPAY_YES]);
  await toQuote(page, "$55.00");
  expect(await lineAmounts(page)).not.toContain("$12.00");
});

test("Declining AutoPay: the quote must equal the att.com price plus the $10 discount att.com states", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "hicksville");
  await expectPlans(page, ["internet-air"]);
  await toOptions(page);
  await pick(page, [AUTOPAY_NO]);
  await toQuote(page, "$65.00");
});

test("The $77 case: a cart total that differs from att.com (an unchosen paid add-on) shows no price", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "8 Extender Road");
  await expectPlans(page, ["internet-air"]);
  await toOptions(page);
  await pick(page, [AUTOPAY_NO]); // Extended Wi-Fi is not offered and stays on Decline
  await page.getByRole("button", { name: "See My Quote" }).click();
  await expectStop(page, CALL);
  await expect(page.getByText("$77.00")).toHaveCount(0);
  const names = (await dataLayerEvents(page)).map((e) => e.event);
  expect(names).toContain("order_failed");
  expect(names).not.toContain("order_quote_shown");
});

test("Rejected email: the portal's refusal is explained on the same screen, then the reference", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "hicksville");
  await expectPlans(page, ["internet-air"]);
  await toOptions(page);
  await pick(page, [AUTOPAY_YES]);
  await toQuote(page, "$55.00");
  await details(page, "rejected@example.com");
  await submit(page);
  await expect(page.getByRole("heading", { name: "Personal Information" })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText("This email address was not accepted. Please enter a working email address that can receive mail.")).toBeVisible();
  await expect(page.locator("[data-order-reference]")).toHaveCount(0);
  await page.getByLabel("Email address", { exact: true }).fill(PERSON.email);
  await page.getByLabel("Confirm email address").fill(PERSON.email);
  await page.getByRole("button", { name: "Review Order Request" }).click();
  await submit(page);
  await expectDone(page);
});

test("Confirm email must match before the review", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "hicksville");
  await expectPlans(page, ["internet-air"]);
  await toOptions(page);
  await pick(page, [AUTOPAY_YES]);
  await toQuote(page, "$55.00");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Email address", { exact: true }).fill(PERSON.email);
  await page.getByLabel("Confirm email address").fill("other@example.com");
  await page.getByRole("button", { name: "Review Order Request" }).click();
  await expect(page.getByText("The email addresses do not match.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Personal Information" })).toBeVisible();
});

test("Address needs a unit: asked on the address step, then the plans", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "40 Needsunit Court");
  await expect(page.getByText("This address needs an apartment or unit number.")).toBeVisible({ timeout: 20_000 });
  await address(page, "40 Needsunit Court", { unit: "4B" });
  await expectPlans(page, ["internet-air"]);
});

for (const [street, message] of [
  ["5 Notfound Street", "We could not confirm this service address."],
  ["6 Ambiguous Way", "More than one address matched."],
] as const) {
  test(`Address problem (${street.split(" ")[1].toLowerCase()}): back to the address step with a clear message`, async ({ page }) => {
    await prepare(page);
    await open(page, "internet-air");
    await address(page, street);
    await expect(page.getByText(message)).toBeVisible({ timeout: 20_000 });
    await expect(page.locator("[data-plan-card]")).toHaveCount(0);
    const failedEvent = (await dataLayerEvents(page)).find((e) => e.event === "order_failed");
    expect(failedEvent?.reason).toMatch(/^address_/);
  });
}

const STOPS: [string, string, RegExp, boolean][] = [
  ["no Internet at the address", "11 Noproduct Road", NO_PLANS, false],
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
    await open(page, "internet-air");
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
    expect(names).not.toContain("order_plans_shown");
  });
}

test("Stops honestly: unrequested bundle (DIRECTV) in the cart", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "7 Bundle Road");
  await expectPlans(page, ["internet-air"]);
  await toOptions(page);
  await pick(page, [AUTOPAY_YES]);
  await page.getByRole("button", { name: "See My Quote" }).click();
  await expectStop(page, CALL);
});

test("Plan no longer offered when priced: back to the plans with a plain message", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "10 Planmissing Road");
  await expectPlans(page, ["internet-air"]);
  await toOptions(page);
  await pick(page, [AUTOPAY_YES]);
  await page.getByRole("button", { name: "See My Quote" }).click();
  await expect(page.locator("[data-plan-unavailable]")).toHaveText("This plan is no longer offered at this address. Please choose another plan.", { timeout: 20_000 });
  await expect(page.locator("[data-order-total]")).toHaveCount(0);
});

test("Slow lookup: the progress screen stays until the real plans arrive", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "18 Slow Road");
  await expect(page.getByRole("heading", { name: "Checking the Plans at Your Address" })).toBeVisible();
  await expect(page.getByText("This usually takes less than a minute. Please keep this page open.")).toBeVisible();
  await expectPlans(page, ["internet-air"]);
});

test("Submission failure: honest message, no confirmation", async ({ page }) => {
  await prepare(page);
  await open(page, "internet-air");
  await address(page, "hicksville");
  await expectPlans(page, ["internet-air"]);
  await toOptions(page);
  await pick(page, [AUTOPAY_YES]);
  await toQuote(page, "$55.00");
  await details(page, "handofffail@example.com");
  await submit(page);
  await expectStop(page, FAILED);
});

test("Plans that cannot be ordered online show the call message", async ({ page }) => {
  await prepare(page);
  await arrive(page, "/wireless", "wireless-value-2");
  await expect(page.getByRole("heading", { name: /Cannot Be Ordered Online/ })).toBeVisible();
  await expect(page.getByText("This plan is not available to order online.")).toBeVisible();
  await expect(page.locator('main a[data-phone-link="order-not-online"]')).toBeVisible();
  await expect(page.getByLabel("Street address")).toHaveCount(0);
  await page.getByRole("button", { name: "Order AT&T Internet Online" }).click();
  await expect(page.getByRole("heading", { name: "Your Service Address" })).toBeVisible();
});

// ---------------------------------------------------------------------------------------------------------
// 5. Security and privacy
// ---------------------------------------------------------------------------------------------------------

test("API refuses SSN, date of birth, card and bank data, and none reaches the automation", async ({ request }, info) => {
  test.skip(isMobile(info), "API check runs once");
  const address = { street: "300 Plainview Road", unit: "", city: "Hicksville", state: "NY", zip: "11801" };
  const plans = { requestId: "sec-check-0000000000000", address };
  const quote = { requestId: "sec-check-0000000000001", plansJobId: "a".repeat(24), planName: "AT&T Internet Air", options: {} };
  const customer = { firstName: "Testa", lastName: "Testb", phone: "2145550147", email: "sec@example.com", confirmEmail: "sec@example.com", billingLanguage: "english", contactByPhone: false };
  const submitBody = { requestId: "sec-check-0000000000002", quoteJobId: "a".repeat(24), customer, consent: true };
  const cases: [string, unknown][] = [
    ["plans", { ...plans, ssn: "123-45-6789" }],
    ["plans", { ...plans, address: { ...address, street: "123-45-6789" } }],
    ["plans", { ...plans, address: { ...address, street: "4111 1111 1111 1111" } }],
    ["plans", { ...plans, address: { ...address, city: "01/02/1990" } }],
    ["quote", { ...quote, options: { autopay: "123-45-6789" } }],
    ["quote", { ...quote, cardNumber: "4111111111111111" }],
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
  expect((await request.post("/att/api/order/plans", { data: { ...plans, extra: "x" } })).status()).toBe(400);
  const log = JSON.stringify(await (await request.get(`${MOCK}/__mock/log`)).json());
  for (const secret of ["123-45-6789", "4111", "01/02/1990", "dateOfBirth", "cardNumber", "bankAccount", "routingNumber", "sec-check-"]) expect(log).not.toContain(secret);
});

test("Date of birth and SSN are asked only in the credit-check section; card and bank details never", async ({ page }) => {
  await prepare(page);
  const never = /card|cvv|cvc|expir|bank|routing|account number|iban|\bpin\b/i;
  const creditOnly = /ssn|social security|birth|\bdob\b/i;
  const scan = async () => {
    const fields = await page.locator("main input, main select, main textarea").evaluateAll((els) =>
      els.map((el) => {
        const e = el as HTMLInputElement;
        // The field's own label, without explanatory notes (e.g. the portal's AutoPay text mentions bank accounts).
        const copy = e.labels?.[0]?.cloneNode(true) as HTMLElement | undefined;
        copy?.querySelectorAll(".text-ink-muted").forEach((n) => n.remove());
        const label = copy?.textContent ?? "";
        return { text: [e.name, e.id, e.autocomplete, e.getAttribute("aria-label") ?? "", label].join(" | "), inCreditCheck: Boolean(e.closest("[data-credit-check]")), type: e.type };
      }),
    );
    for (const f of fields) {
      expect(f.text).not.toMatch(never);
      if (!f.inCreditCheck) expect(f.text).not.toMatch(creditOnly);
      if (f.type === "password") expect(f.inCreditCheck).toBe(true);
    }
  };
  await open(page, "internet-air");
  await scan();
  await address(page, "hicksville");
  await expectPlans(page, ["internet-air"]);
  await scan();
  await toOptions(page);
  await scan();
  await pick(page, [AUTOPAY_YES]);
  await toQuote(page, "$55.00");
  await page.getByRole("button", { name: "Continue" }).click();
  await scan();
  await expect(page.locator("[data-credit-check]")).toContainText("Before we continue with your order, we will need to initiate a credit check. Is that OK?");
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
    const res = await page.request.post(`${base}/att/api/order/plans`, {
      data: { requestId: "unconfigured-000000001", address: { street: "1 Main St", unit: "", city: "Hicksville", state: "NY", zip: "11801" } },
    });
    expect(res.status()).toBe(503);
    expect(await res.json()).toEqual({ state: "unavailable" });
    await page.close();
  } finally {
    child.kill();
  }
});
