// Full-page screenshots of every route at 390px and 1440px.
// Usage: node scripts/audit/screenshots.mjs <baseUrl> <outDir> [route ...]
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "./routes.mjs";

const [base = "http://localhost:3000/att", out = "../audit/screenshots", ...only] = process.argv.slice(2);
const routes = only.length ? only : ROUTES.map((r) => r.path);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const width of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
  // Pre-set a consent choice so the banner does not cover content in the screenshots (banner is captured separately).
  await ctx.addCookies([{ name: "att_consent", value: encodeURIComponent(JSON.stringify({ v: 1, analytics: true, ads: true, ts: "2026-10-21T00:00:00Z" })), url: new URL(base).origin }]);
  const page = await ctx.newPage();
  for (const r of routes) {
    const url = base + (r === "/" ? "" : r);
    await page.goto(url, { waitUntil: "networkidle" }).catch(() => {});
    await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible")));
    await page.waitForTimeout(800);
    const name = (r === "/" ? "home" : r.slice(1).replace(/\//g, "_")) + `-${width}.png`;
    await page.screenshot({ path: path.join(out, name), fullPage: true });
    console.log("shot", name);
  }
  await ctx.close();
}
await browser.close();
