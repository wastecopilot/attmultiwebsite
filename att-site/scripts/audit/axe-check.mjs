// Milestone 8.2: axe-core accessibility scan of every route (WCAG 2.0/2.1/2.2 A and AA rules) at 390px
// and 1440px, with the cookie banner visible (first visit). Also scans the open cookie-preferences dialog
// and the ZIP check next-step panel.
// Usage: node scripts/audit/axe-check.mjs <baseUrl> <outDir>
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { ROUTES } from "./routes.mjs";

const [base = "http://localhost:3100/att", out = "../audit/axe"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

const browser = await chromium.launch();
const summary = [];
async function scan(page, label) {
  // Reveal-on-scroll content is made visible so color contrast is measured on final colors.
  await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible")));
  // Let the 0.6 s reveal transition finish so contrast is measured on final colors, not mid-fade.
  await page.waitForTimeout(800);
  const res = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const violations = res.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")) }));
  summary.push({ label, violations: violations.length, passes: res.passes.length, incomplete: res.incomplete.length, details: violations });
  console.log(`${violations.length ? "FAIL" : "PASS"} ${label}${violations.length ? " " + violations.map((v) => `${v.id}(${v.nodes})`).join(", ") : ""}`);
  return res;
}

for (const width of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  for (const r of ROUTES) {
    await page.goto(base + (r.path === "/" ? "" : r.path), { waitUntil: "networkidle" }).catch(() => {});
    const res = await scan(page, `${r.path} @${width}`);
    fs.writeFileSync(path.join(out, `${(r.path === "/" ? "home" : r.path.slice(1).replace(/\//g, "_"))}-${width}.json`), JSON.stringify({ url: page.url(), violations: res.violations, incomplete: res.incomplete.map((i) => ({ id: i.id, nodes: i.nodes.length })) }, null, 2));
  }
  await ctx.close();
}

// Interactive states
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Manage preferences" }).click();
  await scan(page, "cookie preferences dialog (open)");
  await page.keyboard.press("Escape");
  await page.goto(base + "/check-availability", { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "ZIP code" }).first().fill("10001");
  await page.getByRole("button", { name: "Check Availability" }).click();
  await scan(page, "ZIP check next-step panel");
  await ctx.close();
}
await browser.close();

fs.writeFileSync(path.join(out, "axe-summary.json"), JSON.stringify(summary, null, 2));
const md = ["| Page / state | Violations | Rules passed | Needs review | Result |", "|---|---|---|---|---|", ...summary.map((s) => `| ${s.label} | ${s.violations} | ${s.passes} | ${s.incomplete} | ${s.violations ? "FAIL: " + s.details.map((d) => d.id).join(", ") : "PASS"} |`)].join("\n");
fs.writeFileSync(path.join(out, "axe-summary.md"), md + "\n");
const failed = summary.filter((s) => s.violations).length;
console.log(`\n${summary.length - failed}/${summary.length} scans without violations`);
process.exit(failed ? 1 : 0);
