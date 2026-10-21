// Second research pass: att.com loads "See offer details" fine print on demand, so this opens each
// offer-details trigger on a page, records the dialog text verbatim, and closes it before the next one.
//
// Usage: node scripts/research/offer-details.mjs <outDir> <slug>=<url> [...]
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] || "../research/raw/offer-details");
const TARGETS = process.argv.slice(3).map((a) => {
  const i = a.indexOf("=");
  return { slug: a.slice(0, i), url: a.slice(i + 1) };
});
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function closeDialog(page) {
  const dlg = page.locator('[role="dialog"]:visible, [aria-modal="true"]:visible');
  for (let attempt = 0; attempt < 3 && (await dlg.count()); attempt++) {
    const close = page
      .locator('[role="dialog"]:visible, [aria-modal="true"]:visible')
      .last()
      .locator('button[aria-label*="close" i], button:has-text("Close"), [data-testid*="close" i]')
      .first();
    if (await close.count()) await close.click({ timeout: 2000 }).catch(() => {});
    else await page.keyboard.press("Escape");
    await sleep(700);
  }
}

async function run(context, { slug, url }) {
  const page = await context.newPage();
  const retrievedAt = new Date().toISOString();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await sleep(1500);
  // Tabbed price panels (e.g. "Without wireless plan" / "With wireless plan"): click each tab and record its panel.
  const tabs = [];
  const tabLoc = page.locator('[role="tab"]');
  const tabCount = Math.min(await tabLoc.count(), 20);
  for (let i = 0; i < tabCount; i++) {
    const tab = tabLoc.nth(i);
    if (!(await tab.isVisible().catch(() => false))) continue;
    try {
      const label = (await tab.innerText()).trim();
      await tab.scrollIntoViewIfNeeded({ timeout: 3000 });
      await tab.click({ timeout: 4000 });
      await sleep(1500);
      const panelId = await tab.getAttribute("aria-controls");
      const panel = panelId ? page.locator(`[id="${panelId}"]`) : page.locator('[role="tabpanel"]:visible').first();
      const text = (await panel.innerText().catch(() => "")).trim();
      tabs.push({ label, text });
    } catch (e) {
      tabs.push({ index: i, error: String(e).slice(0, 200) });
    }
  }
  const triggers = page.locator(
    'button:has-text("offer details"), a:has-text("offer details"), button:has-text("See details"), button:has-text("See price details"), a:has-text("See details")',
  );
  const n = await triggers.count();
  const dialogs = [];
  const seen = new Set();
  for (let i = 0; i < n; i++) {
    const t = triggers.nth(i);
    if (!(await t.isVisible().catch(() => false))) continue;
    // Context: the nearest preceding heading / text block, so each dialog can be tied to its offer.
    const context = await t
      .evaluate((el) => {
        let n = el;
        for (let k = 0; k < 6 && n; k++) {
          n = n.parentElement;
          const txt = (n?.innerText || "").replace(/\s+/g, " ").trim();
          if (txt.length > 60) return txt.slice(0, 400);
        }
        return "";
      })
      .catch(() => "");
    try {
      await t.scrollIntoViewIfNeeded({ timeout: 3000 });
      await t.click({ timeout: 4000 });
      const dlg = page.locator('[role="dialog"]:visible, [aria-modal="true"]:visible').last();
      await dlg.waitFor({ state: "visible", timeout: 6000 });
      await sleep(1200);
      const text = (await dlg.innerText()).trim();
      const key = text.slice(0, 300);
      if (!seen.has(key)) {
        seen.add(key);
        dialogs.push({ index: i, context, text });
      }
    } catch (e) {
      dialogs.push({ index: i, context, error: String(e).slice(0, 200) });
    }
    await closeDialog(page);
  }
  await page.close();
  const rec = { slug, url, retrievedAt, triggers: n, tabs, dialogs };
  fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(rec, null, 2));
  fs.writeFileSync(
    path.join(OUT, `${slug}.txt`),
    [`URL: ${url}`, `Retrieved: ${retrievedAt}`, `Triggers found: ${n}`, ""]
      .concat(tabs.map((t) => `=== Tab: ${t.label || t.index}\n${t.error ? "ERROR: " + t.error : t.text}\n`))
      .concat(dialogs.map((d) => `=== Dialog #${d.index}\nCONTEXT: ${d.context}\n${d.error ? "ERROR: " + d.error : d.text}\n`))
      .join("\n"),
  );
  console.log(slug, "triggers", n, "dialogs", dialogs.filter((d) => d.text).length);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined });
  const context = await browser.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 }, locale: "en-US" });
  for (const t of TARGETS) {
    try {
      await run(context, t);
    } catch (e) {
      console.log(t.slug, "FAILED", String(e).slice(0, 200));
    }
    await sleep(6000);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
