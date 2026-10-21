// Quick profiling helper: loads a page with 4x CPU throttling and prints Chrome performance metrics.
// Usage (from att-site): node <this> <url> [blockGoogle=0|1] [extraCss]
import { chromium } from "@playwright/test";
const [url, blockGoogle = "0", extraCss = ""] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 } });
const page = await ctx.newPage();
if (blockGoogle === "1") await page.route(/google|gstatic|doubleclick/, (r) => r.abort());
const cdp = await ctx.newCDPSession(page);
await cdp.send("Performance.enable");
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
if (extraCss) await page.addInitScript((css) => { document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s); }); }, extraCss);
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const { metrics } = await cdp.send("Performance.getMetrics");
const m = Object.fromEntries(metrics.map((x) => [x.name, x.value]));
const lcp = await page.evaluate(() => new Promise((res) => new PerformanceObserver((l) => { const e = l.getEntries().at(-1); res({ t: Math.round(e.startTime), el: e.element?.tagName + "." + (e.element?.className || "").toString().slice(0, 40) }); }).observe({ type: "largest-contentful-paint", buffered: true })));
const dom = await page.evaluate(() => document.getElementsByTagName("*").length);
console.log(JSON.stringify({ layoutMs: Math.round(m.LayoutDuration * 1000), styleMs: Math.round(m.RecalcStyleDuration * 1000), scriptMs: Math.round(m.ScriptDuration * 1000), taskMs: Math.round(m.TaskDuration * 1000), layouts: m.LayoutCount, styleRecalcs: m.RecalcStyleCount, nodes: m.Nodes, dom, lcp }));
await browser.close();
