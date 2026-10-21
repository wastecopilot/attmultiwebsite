// Captures the "With wireless plan" price toggle on att.com internet pages (not exposed as ARIA tabs).
// Usage: node scripts/research/with-wireless.mjs <out.json> <url> [...]
import { chromium } from "@playwright/test";
import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const [out, ...urls] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, locale: "en-US" });
const results = [];
for (const url of urls) {
  const page = await ctx.newPage();
  const retrievedAt = new Date().toISOString();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});
  const toggle = page.getByText("With wireless plan", { exact: true }).first();
  const info = { url, retrievedAt };
  try {
    info.toggleTag = await toggle.evaluate((el) => `${el.tagName} role=${el.getAttribute("role")} class=${el.className}`);
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click({ timeout: 5000 });
    await page.waitForTimeout(2000);
    // Section that contains the toggle and the plan cards.
    info.text = await toggle.evaluate((el) => {
      let n = el;
      for (let i = 0; i < 12 && n; i++) {
        n = n.parentElement;
        if (n && /Internet 5000/.test(n.innerText) && /Internet 300/.test(n.innerText)) return n.innerText;
      }
      return document.body.innerText;
    });
  } catch (e) {
    info.error = String(e).slice(0, 300);
  }
  results.push(info);
  await page.close();
  await new Promise((r) => setTimeout(r, 6000));
}
fs.writeFileSync(out, JSON.stringify(results, null, 2));
await browser.close();
console.log("done", results.map((r) => r.error || r.toggleTag));
