// Measures first-layout cost (4x CPU) with optional CSS injected into <head> of the HTML response.
import { chromium } from "@playwright/test";
const [url, css = ""] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 412, height: 823 } });
await page.route(/google|gstatic|doubleclick/, (r) => r.abort());
if (css) await page.route(url, async (route) => { const resp = await route.fetch(); const body = (await resp.text()).replace("</head>", `<style>${css}</style></head>`); await route.fulfill({ response: resp, body }); });
const cdp = await page.context().newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await browser.startTracing(page, { categories: ["devtools.timeline"] });
await page.goto(url, { waitUntil: "networkidle" });
const { traceEvents } = JSON.parse((await browser.stopTracing()).toString());
const layouts = traceEvents.filter((e) => e.name === "Layout" && e.ph === "X").map((e) => Math.round(e.dur / 1000));
const style = traceEvents.filter((e) => e.name === "UpdateLayoutTree" && e.ph === "X").map((e) => Math.round(e.dur / 1000));
console.log(`layouts ${JSON.stringify(layouts)} style ${JSON.stringify(style)}`);
await browser.close();
