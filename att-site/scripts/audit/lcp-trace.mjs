// Prints every LCP candidate (time, element, size) plus FCP and font/script timings for a URL.
// Usage: node scripts/audit/lcp-trace.mjs <url> [blockPattern]
import { chromium } from "@playwright/test";
const [url, block] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 } });
const page = await ctx.newPage();
if (block) await page.route(new RegExp(block), (r) => r.abort());
await page.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lcp.push({ t: Math.round(e.startTime), size: e.size, el: (e.element?.tagName || "?") + " " + (e.element?.textContent || "").trim().slice(0, 40) }))).observe({ type: "largest-contentful-paint", buffered: true });
});
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const r = await page.evaluate(() => ({
  lcp: window.__lcp,
  fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime),
  res: performance.getEntriesByType("resource").filter((e) => /woff2|\.js|gtag|gtm/.test(e.name)).map((e) => `${Math.round(e.startTime)}-${Math.round(e.responseEnd)} ${e.name.split("/").pop().slice(0, 50)}`),
  fontsReady: document.fonts.status,
}));
console.log(JSON.stringify(r, null, 1));
await browser.close();
