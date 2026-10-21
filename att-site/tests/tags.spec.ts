/**
 * Milestone 6 tag tests. Evidence (network logs, HAR, dataLayer snapshots) is written to ../audit/tags/.
 *
 * 1. Consent defaults are set before gtag.js loads.
 * 2. The gtag.js request starts within 1 second on a cold visit.
 * 3. A page_view hit is sent.
 * 4. A phone click sends the Google Ads call conversion.
 * 5. "Reject non-essential" updates consent to denied.
 *
 * Google endpoints are real (gtag.js is fetched from googletagmanager.com); analytics/ads hits are
 * answered locally with 204 so the dummy test IDs never reach Google's collection servers.
 */
import { test, expect, type BrowserContext, type Page, type Request } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(__dirname, "../../audit/tags");
fs.mkdirSync(OUT, { recursive: true });

const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "AW-0000000000";
const CALL_LABEL = process.env.NEXT_PUBLIC_GADS_CALL_LABEL || "DEV-TEST-LABEL";

const GTAG_RE = /googletagmanager\.com\/gtag\/js/;
const COLLECT_RE = /google-analytics\.com\/(g\/)?collect|analytics\.google\.com\/g\/collect/;
const ADS_HIT_RE = /(googleads\.g\.doubleclick\.net|google\.com|googleadservices\.com)\/pagead\/(viewthroughconversion|conversion|1p-conversion)/;

interface LoggedRequest {
  t: number;
  method: string;
  type: string;
  url: string;
}

async function newLoggedContext(browser: import("@playwright/test").Browser, name: string) {
  const context = await browser.newContext({ recordHar: { path: path.join(OUT, `${name}.har`), content: "omit" } });
  const log: LoggedRequest[] = [];
  const t0 = Date.now();
  context.on("request", (r: Request) => log.push({ t: Date.now() - t0, method: r.method(), type: r.resourceType(), url: r.url() }));
  // Answer analytics/ads collection endpoints locally (evidence is the outgoing request itself).
  await context.route(COLLECT_RE, (route) => route.fulfill({ status: 204, body: "" }));
  await context.route(ADS_HIT_RE, (route) => route.fulfill({ status: 204, body: "" }));
  return { context, log };
}

async function save(name: string, context: BrowserContext, log: LoggedRequest[], extra: Record<string, unknown> = {}) {
  fs.writeFileSync(path.join(OUT, `${name}.network.json`), JSON.stringify({ requests: log, ...extra }, null, 2));
  await context.close(); // flushes the HAR file
}

const dataLayer = (page: Page) => page.evaluate(() => (window.dataLayer || []).map((e) => (Array.isArray(e) || Object.prototype.toString.call(e) === "[object Arguments]" ? Array.from(e as ArrayLike<unknown>) : e)));

test("1. consent defaults are set before gtag.js loads", async ({ browser }) => {
  const { context, log } = await newLoggedContext(browser, "1-consent-before-gtag");
  const page = await context.newPage();
  // Snapshot window.dataLayer synchronously at the moment the gtag.js <script> element is inserted
  // (which is what starts the request).
  await page.addInitScript(() => {
    const w = window as unknown as { dataLayer?: unknown[]; __gtagSnap?: unknown[] };
    for (const m of ["insertBefore", "appendChild"] as const) {
      const orig = Node.prototype[m] as (...a: unknown[]) => Node;
      (Node.prototype as unknown as Record<string, unknown>)[m] = function (this: Node, n: Node, ...rest: unknown[]) {
        if (n instanceof HTMLScriptElement && n.src.includes("googletagmanager.com/gtag/js") && !w.__gtagSnap) {
          w.__gtagSnap = (w.dataLayer || []).map((e) => Array.from(e as ArrayLike<unknown>));
        }
        return orig.call(this, n, ...rest);
      };
    }
  });
  await page.goto("/att", { waitUntil: "load" });
  const snapshotAtGtagRequest = await page.evaluate(() => (window as unknown as { __gtagSnap?: unknown[] }).__gtagSnap ?? null);
  expect(snapshotAtGtagRequest, "gtag.js was requested").not.toBeNull();
  const snap = snapshotAtGtagRequest as unknown as unknown[][];
  const defaults = snap.filter((e) => e[0] === "consent" && e[1] === "default");
  expect(defaults.length, "two consent default commands (strict regions + rest)").toBe(2);
  const strict = defaults[0][2] as Record<string, unknown>;
  expect(strict.ad_storage).toBe("denied");
  expect(strict.ad_user_data).toBe("denied");
  expect(strict.ad_personalization).toBe("denied");
  expect(strict.analytics_storage).toBe("denied");
  expect(strict.region).toEqual(expect.arrayContaining(["DE", "FR", "GB", "CH", "NO", "IS", "LI"]));
  const rest = defaults[1][2] as Record<string, unknown>;
  expect(rest.analytics_storage).toBe("granted");
  // The consent command is the first entry in the dataLayer, before any config/js command.
  expect(snap[0][0]).toBe("consent");
  // No Google request precedes gtag.js.
  const firstGoogle = log.find((r) => /google/.test(r.url));
  expect(firstGoogle?.url).toMatch(GTAG_RE);
  await save("1-consent-before-gtag", context, log, { dataLayerAtGtagRequest: snapshotAtGtagRequest });
});

test("2. gtag.js request starts within 1 second on a cold visit", async ({ browser }) => {
  const { context, log } = await newLoggedContext(browser, "2-gtag-timing");
  const page = await context.newPage();
  await page.goto("/att", { waitUntil: "load" });
  const timing = await page.evaluate(() => {
    const e = performance.getEntriesByType("resource").find((r) => /googletagmanager\.com\/gtag\/js/.test(r.name)) as PerformanceResourceTiming | undefined;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    return { gtagStartTime: e?.startTime ?? null, responseStart: nav.responseStart, domContentLoaded: nav.domContentLoadedEventEnd };
  });
  expect(timing.gtagStartTime, "gtag.js resource entry exists").not.toBeNull();
  // Measured from navigation start (includes server response time); must be under 1000 ms.
  expect(timing.gtagStartTime!).toBeLessThan(1000);
  await save("2-gtag-timing", context, log, { timing });
});

test("3. a page_view hit is sent", async ({ browser }) => {
  const { context, log } = await newLoggedContext(browser, "3-page-view");
  const page = await context.newPage();
  const hit = page.waitForRequest((r) => COLLECT_RE.test(r.url()) && /[?&]en=page_view/.test(r.url() + "&" + (r.postData() || "")), { timeout: 20_000 });
  await page.goto("/att/internet/fiber", { waitUntil: "load" });
  const req = await hit;
  const url = new URL(req.url());
  expect(url.searchParams.get("tid")).toMatch(/^G-/);
  await save("3-page-view", context, log, { pageViewHit: req.url(), consentState: url.searchParams.get("gcs") });
});

test("4. a phone click sends the Google Ads call conversion", async ({ browser }) => {
  const { context, log } = await newLoggedContext(browser, "4-phone-click");
  const page = await context.newPage();
  await page.goto("/att/internet/fiber", { waitUntil: "load" });
  await page.waitForFunction(() => typeof window.gtag === "function" && !!document.getElementById("gtag-js"));
  await page.waitForLoadState("networkidle");
  const conversionHit = page.waitForRequest((r) => ADS_HIT_RE.test(r.url()) && r.url().includes(CALL_LABEL), { timeout: 20_000 });
  // Keep the browser on the page when the tel: link is followed.
  await page.evaluate(() => document.addEventListener("click", (e) => (e.target as Element).closest('a[href^="tel:"]') && e.preventDefault()));
  const link = page.locator('a[data-phone-link="plan-card"][data-offer-id="fiber-1000"]').first();
  await link.click();
  const req = await conversionHit;
  const dl = await dataLayer(page);
  const conversion = dl.find((e) => Array.isArray(e) && e[0] === "event" && e[1] === "conversion") as unknown[] | undefined;
  expect((conversion?.[2] as Record<string, unknown>)?.send_to).toBe(`${ADS_ID}/${CALL_LABEL}`);
  const phoneClick = dl.find((e) => !Array.isArray(e) && (e as Record<string, unknown>).event === "phone_click") as Record<string, unknown> | undefined;
  expect(phoneClick).toMatchObject({ offer_id: "fiber-1000", value: 70, page: "/att/internet/fiber" });
  // Website call conversion (number swap) is configured with the displayed number.
  const swapConfig = dl.find((e) => Array.isArray(e) && e[0] === "config" && typeof e[1] === "string" && (e[1] as string).includes("/") && (e[2] as Record<string, unknown>)?.phone_conversion_number);
  expect(swapConfig, "phone_conversion_number config present").toBeTruthy();
  await save("4-phone-click", context, log, { conversionHit: req.url(), phoneClickEvent: phoneClick, conversion, swapConfig });
});

test('5. "Reject non-essential" updates consent to denied', async ({ browser }) => {
  const { context, log } = await newLoggedContext(browser, "5-reject");
  const page = await context.newPage();
  await page.goto("/att", { waitUntil: "load" });
  const banner = page.getByRole("region", { name: "Cookie consent" });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Reject non-essential" }).click();
  await expect(banner).toBeHidden();
  const dl = await dataLayer(page);
  const update = dl.filter((e) => Array.isArray(e) && e[0] === "consent" && e[1] === "update").at(-1) as unknown[];
  expect(update?.[2]).toEqual({ ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
  const cookies = await context.cookies();
  const consent = cookies.find((c) => c.name === "att_consent");
  expect(consent).toBeTruthy();
  const stored = JSON.parse(decodeURIComponent(consent!.value));
  expect(stored).toMatchObject({ analytics: false, ads: false });
  // Stored for 12 months.
  const days = (consent!.expires * 1000 - Date.now()) / 86_400_000;
  expect(days).toBeGreaterThan(360);
  // The choice is re-applied on the next page load, before gtag.js.
  await page.goto("/att/deals", { waitUntil: "load" });
  const dl2 = await dataLayer(page);
  const firstUpdateIndex = dl2.findIndex((e) => Array.isArray(e) && e[0] === "consent" && e[1] === "update");
  const firstConfigIndex = dl2.findIndex((e) => Array.isArray(e) && e[0] === "config");
  expect(firstUpdateIndex).toBeGreaterThan(-1);
  expect(firstUpdateIndex).toBeLessThan(firstConfigIndex);
  await expect(page.getByRole("region", { name: "Cookie consent" })).toBeHidden();
  await save("5-reject", context, log, { consentUpdate: update, storedCookie: stored, cookieDaysToExpiry: Math.round(days) });
});

test("6. click IDs and UTM parameters persist across internal navigation", async ({ browser }) => {
  const { context, log } = await newLoggedContext(browser, "6-attribution");
  const page = await context.newPage();
  await page.goto("/att/lp/fiber?gclid=TEST-GCLID-123&utm_source=google&utm_medium=cpc&utm_campaign=fiber", { waitUntil: "load" });
  await page.getByRole("link", { name: "Privacy Policy" }).first().click();
  await page.waitForURL(/\/att\/privacy/);
  await page.waitForFunction(() => location.search.includes("gclid=TEST-GCLID-123"));
  expect(page.url()).toContain("utm_campaign=fiber");
  const cookies = await context.cookies();
  const attr = cookies.find((c) => c.name === "att_attr");
  expect(attr, "90-day attribution cookie (US default consent)").toBeTruthy();
  const days = (attr!.expires * 1000 - Date.now()) / 86_400_000;
  expect(days).toBeGreaterThan(89);
  expect(days).toBeLessThanOrEqual(90.01);
  await save("6-attribution", context, log, { finalUrl: page.url(), attributionCookie: decodeURIComponent(attr!.value), cookieDaysToExpiry: Math.round(days) });
});
