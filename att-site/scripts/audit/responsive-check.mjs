// Quick responsive check: horizontal overflow, overlapping elements, mobile menu, call bar, tap targets.
// Usage: node scripts/audit/responsive-check.mjs <baseUrl> [route ...]
import { chromium } from "@playwright/test";
import { ROUTES } from "./routes.mjs";

const [base = "http://localhost:3000/att", ...only] = process.argv.slice(2);
const routes = only.length ? only : ROUTES.filter((r) => !r.expectStatus).map((r) => r.path);
const browser = await chromium.launch();
let problems = 0;
for (const width of [390, 768, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 1024 });
  await ctx.addCookies([{ name: "att_consent", value: encodeURIComponent(JSON.stringify({ v: 1, analytics: true, ads: true, ts: "2026-10-21T00:00:00Z" })), url: new URL(base).origin }]);
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(base + (r === "/" ? "" : r), { waitUntil: "load", timeout: 120000 });
    const res = await page.evaluate((w) => {
      const issues = [];
      const sw = document.documentElement.scrollWidth;
      if (sw > window.innerWidth + 1) {
        const wide = [...document.querySelectorAll("body *")].filter((el) => {
          const b = el.getBoundingClientRect();
          return b.right > window.innerWidth + 1 && getComputedStyle(el).position !== "fixed" && !el.closest("[role=region][tabindex]");
        });
        issues.push(`horizontal scroll ${sw}px > ${window.innerWidth}px: ${wide.slice(0, 3).map((e) => e.tagName + "." + String(e.className).slice(0, 40)).join(", ")}`);
      }
      const bar = document.querySelector(".mobile-call-bar");
      const barVisible = bar && getComputedStyle(bar).display !== "none";
      if (w < 1024 && !barVisible) issues.push("mobile call bar hidden");
      if (w >= 1024 && barVisible) issues.push("call bar visible on desktop");
      const small = [...document.querySelectorAll("a.btn, button, .header-call, .icon-btn")].filter((el) => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && (b.height < 24 || b.width < 24);
      });
      if (small.length) issues.push(`${small.length} small tap targets: ${small.slice(0, 3).map((e) => e.textContent.trim().slice(0, 20)).join(", ")}`);
      // Overlap check between header items
      const hdr = [...document.querySelectorAll(".site-header .wordmark, .site-header .header-call, .site-header .icon-btn")].map((e) => e.getBoundingClientRect()).filter((b) => b.width);
      for (let i = 0; i < hdr.length; i++) for (let j = i + 1; j < hdr.length; j++) {
        const a = hdr[i], b = hdr[j];
        if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) issues.push("header items overlap");
      }
      return issues;
    }, width);
    if (width < 1024 && r === "/") {
      const btn = page.getByRole("button", { name: "Open menu" });
      if (await btn.isVisible()) {
        await btn.click();
        const ok = await page.locator("#mobile-menu").isVisible();
        if (!ok) res.push("mobile menu did not open");
        await page.keyboard.press("Escape");
      } else res.push("menu button not visible");
    }
    if (res.length) {
      problems += res.length;
      console.log(`FAIL @${width} ${r}: ${res.join(" | ")}`);
    }
  }
  await ctx.close();
  console.log(`checked ${routes.length} pages @${width}`);
}
await browser.close();
console.log(problems ? `${problems} problems` : "no layout problems");
