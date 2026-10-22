// Research crawler for Milestone 1b / 8.5.
// Fetches public att.com pages (robots.txt allows these paths; see research/raw/robots.txt),
// one page at a time with a pause between requests, and stores for each page:
//   - retrieval timestamp (UTC)
//   - H1/H2/H3 outline in document order
//   - visible text of the page
//   - text of offer-detail / legal modals present in the DOM (opened when possible)
//   - full-page screenshot
//
// Usage: node scripts/research/crawl-att.mjs [outDir] [slug ...]
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] || "../research/raw/pages");
const ONLY = process.argv.slice(3);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const PAUSE_MS = 6000;

export const PAGES = [
  { slug: "home", url: "https://www.att.com/" },
  { slug: "internet-hub", url: "https://www.att.com/internet/" },
  { slug: "internet-fiber", url: "https://www.att.com/internet/fiber/" },
  { slug: "internet-air", url: "https://www.att.com/internet/internet-air/" },
  { slug: "internet-plans", url: "https://www.att.com/internet/internet-service-plans/" },
  { slug: "wireless-hub", url: "https://www.att.com/wireless/" },
  { slug: "wireless-plans", url: "https://www.att.com/plans/unlimited-data-plans/" },
  { slug: "phone-deals", url: "https://www.att.com/deals/cell-phone-deals/" },
  { slug: "switch", url: "https://www.att.com/wireless/switch-and-save/" },
  { slug: "byod", url: "https://www.att.com/wireless/byod/" },
  { slug: "home-phone", url: "https://www.att.com/home-phone/" },
  { slug: "bundles", url: "https://www.att.com/bundles/" },
  { slug: "deals", url: "https://www.att.com/deals/" },
  { slug: "autopay-discount", url: "https://www.att.com/deals/autopay-discount/" },
  { slug: "all-fi", url: "https://www.att.com/wi-fi/" },
  { slug: "legal", url: "https://www.att.com/legal/legal-policy-center.html" },
  { slug: "terms-of-use", url: "https://www.att.com/legal/terms.attWebsiteTermsOfUse.html" },
  { slug: "privacy", url: "https://about.att.com/privacy.html" },
  { slug: "accessibility", url: "https://about.att.com/sites/accessibility" },
  { slug: "broadband-details", url: "https://about.att.com/sites/broadband" },
  { slug: "privacy-choices", url: "https://about.att.com/privacy/choices-and-controls.html" },
  // Added 2026-10-22 for the competitor audit follow-up
  { slug: "oneconnect", url: "https://www.att.com/oneconnect/" },
  { slug: "55-plus", url: "https://www.att.com/bundles/55-plus-internet-wireless/" },
  { slug: "guarantee", url: "https://www.att.com/why-att/guarantee/" },
  { slug: "moving", url: "https://www.att.com/moving/" },
  { slug: "phone-advanced", url: "https://www.att.com/home-phone/phone-advanced/" },
  { slug: "broadband-labels", url: "https://www.att.com/broadbandlabels/dapbbfacts" },
  // Added 2026-10-22: att.com state-level AT&T Fiber pages, listed in https://www.att.com/local/sitemap_0.xml / sitemap_1.xml
  // (32 /local/fiber/<state> URLs exist; these are the 25 with the most city pages in the sitemap).
  { slug: "state-california", url: "https://www.att.com/local/fiber/california" },
  { slug: "state-texas", url: "https://www.att.com/local/fiber/texas" },
  { slug: "state-florida", url: "https://www.att.com/local/fiber/florida" },
  { slug: "state-illinois", url: "https://www.att.com/local/fiber/illinois" },
  { slug: "state-georgia", url: "https://www.att.com/local/fiber/georgia" },
  { slug: "state-michigan", url: "https://www.att.com/local/fiber/michigan" },
  { slug: "state-alabama", url: "https://www.att.com/local/fiber/alabama" },
  { slug: "state-tennessee", url: "https://www.att.com/local/fiber/tennessee" },
  { slug: "state-north-carolina", url: "https://www.att.com/local/fiber/north-carolina" },
  { slug: "state-louisiana", url: "https://www.att.com/local/fiber/louisiana" },
  { slug: "state-ohio", url: "https://www.att.com/local/fiber/ohio" },
  { slug: "state-mississippi", url: "https://www.att.com/local/fiber/mississippi" },
  { slug: "state-kentucky", url: "https://www.att.com/local/fiber/kentucky" },
  { slug: "state-indiana", url: "https://www.att.com/local/fiber/indiana" },
  { slug: "state-missouri", url: "https://www.att.com/local/fiber/missouri" },
  { slug: "state-south-carolina", url: "https://www.att.com/local/fiber/south-carolina" },
  { slug: "state-wisconsin", url: "https://www.att.com/local/fiber/wisconsin" },
  { slug: "state-oklahoma", url: "https://www.att.com/local/fiber/oklahoma" },
  { slug: "state-minnesota", url: "https://www.att.com/local/fiber/minnesota" },
  { slug: "state-kansas", url: "https://www.att.com/local/fiber/kansas" },
  { slug: "state-arkansas", url: "https://www.att.com/local/fiber/arkansas" },
  { slug: "state-utah", url: "https://www.att.com/local/fiber/utah" },
  { slug: "state-washington", url: "https://www.att.com/local/fiber/washington" },
  { slug: "state-colorado", url: "https://www.att.com/local/fiber/colorado" },
  { slug: "state-arizona", url: "https://www.att.com/local/fiber/arizona" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function extract(page) {
  return page.evaluate(() => {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    const outline = [...document.querySelectorAll("h1,h2,h3")]
      .map((h) => ({ tag: h.tagName.toLowerCase(), text: clean(h.innerText || h.textContent), visible: !!(h.offsetWidth || h.offsetHeight) }))
      .filter((h) => h.text);
    const main = document.querySelector("main") || document.body;
    const footer = document.querySelector("footer");
    const modalSel = '[role="dialog"], [aria-modal="true"], [class*="modal" i], [id*="modal" i], [class*="legal" i], [id*="legal" i], [class*="disclaimer" i], [class*="offer-details" i]';
    const modals = [...document.querySelectorAll(modalSel)]
      .map((m) => clean(m.textContent))
      .filter((t) => t.length > 40);
    const uniqModals = [...new Set(modals)].filter((t, i, arr) => !arr.some((o, j) => j !== i && o.length > t.length && o.includes(t)));
    const links = [...document.querySelectorAll("footer a")].map((a) => ({ text: clean(a.innerText), href: a.href })).filter((l) => l.text);
    return {
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.content || null,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      outline,
      mainText: main.innerText,
      footerText: footer ? footer.innerText : null,
      footerLinks: links,
      modalTexts: uniqModals,
    };
  });
}

async function openOfferDetails(page) {
  // Click "See offer details" / "See details" style buttons one by one, capture dialog text, close it.
  const captured = [];
  const buttons = page.locator('button:has-text("offer details"), button:has-text("See details"), a[role="button"]:has-text("offer details"), button:has-text("See legal"), button:has-text("Details")');
  const count = Math.min(await buttons.count(), 25);
  for (let i = 0; i < count; i++) {
    const b = buttons.nth(i);
    try {
      if (!(await b.isVisible())) continue;
      const label = (await b.innerText()).trim();
      await b.scrollIntoViewIfNeeded({ timeout: 3000 });
      await b.click({ timeout: 3000 });
      await sleep(1200);
      const dlg = page.locator('[role="dialog"]:visible, [aria-modal="true"]:visible').last();
      if (await dlg.count()) {
        const text = (await dlg.innerText()).trim();
        captured.push({ trigger: label, text });
        await page.keyboard.press("Escape");
        await sleep(600);
        const closeBtn = page.locator('[role="dialog"]:visible button[aria-label*="close" i]').first();
        if (await closeBtn.count()) await closeBtn.click({ timeout: 2000 }).catch(() => {});
      }
    } catch {
      /* keep going; a button that cannot be opened is recorded as missing */
    }
  }
  return captured;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PW_CHANNEL || undefined });
  const context = await browser.newContext({
    userAgent: UA,
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "America/New_York",
  });
  const summary = [];
  for (const p of PAGES.filter((p) => !ONLY.length || ONLY.includes(p.slug))) {
    const page = await context.newPage();
    const retrievedAt = new Date().toISOString();
    let status = null;
    let error = null;
    try {
      const resp = await page.goto(p.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      status = resp ? resp.status() : null;
      await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});
      // Scroll through the page so lazy sections render.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 150));
        }
        window.scrollTo(0, 0);
      });
      await sleep(1500);
      const data = await extract(page);
      const dialogs = await openOfferDetails(page);
      await page.screenshot({ path: path.join(OUT, `${p.slug}.png`), fullPage: true }).catch(() => {});
      const record = { ...p, finalUrl: page.url(), status, retrievedAt, ...data, openedDialogs: dialogs };
      fs.writeFileSync(path.join(OUT, `${p.slug}.json`), JSON.stringify(record, null, 2));
      fs.writeFileSync(
        path.join(OUT, `${p.slug}.txt`),
        [`URL: ${p.url}`, `Final URL: ${page.url()}`, `HTTP: ${status}`, `Retrieved: ${retrievedAt}`, `Title: ${data.title}`, "", "== OUTLINE ==", ...data.outline.map((h) => `${h.tag.toUpperCase()}${h.visible ? "" : " (hidden)"}: ${h.text}`), "", "== MAIN TEXT ==", data.mainText, "", "== OPENED DIALOGS ==", ...dialogs.map((d) => `--- [${d.trigger}]\n${d.text}`), "", "== DOM MODAL / LEGAL TEXT ==", ...data.modalTexts.map((t) => `--- ${t}`), "", "== FOOTER ==", data.footerText || ""].join("\n"),
      );
      summary.push({ slug: p.slug, url: p.url, status, retrievedAt, h1: data.outline.find((h) => h.tag === "h1")?.text || null, dialogs: dialogs.length });
    } catch (e) {
      error = String(e);
      summary.push({ slug: p.slug, url: p.url, status, retrievedAt, error });
    }
    console.log(JSON.stringify(summary[summary.length - 1]));
    await page.close();
    await sleep(PAUSE_MS);
  }
  fs.writeFileSync(path.join(OUT, `_summary.json`), JSON.stringify(summary, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
