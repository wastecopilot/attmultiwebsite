# Handover — AT&T authorized-retailer website

This document explains, in plain language, how to run, update and publish the website. The site lives in the
`att-site` folder and is published at **https://authorizedinternetretailer.net/att/**.

---

## 1. What you have

- A 24-page website (plus a "page not found" page) about AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone,
  run by Urban Wireless as an independent authorized retailer.
- Every price and promotion comes from one file, `att-site/src/data/offers.ts`, copied from att.com on 21 October
  2026, with AT&T's full fine print and the date it was checked.
- Phone-call tracking for Google Ads and Google Analytics, a cookie banner, and privacy controls.
- 20 photos (hero backgrounds, service cards and section photos) in `att-site/public/images/`.
- Research, decisions and audit evidence in the folders next to `att-site`:
  `research/`, `audit/`, `seo/`, `DECISIONS.md`, `OPEN_ITEMS.md`, `AUDIT.md`.

## 2. Running the site on a computer

You need **Node.js 20.9 or newer** (Node 24 was used).

1. Open a terminal in the `att-site` folder.
2. First time only: `npm install`
3. Start the preview: `npm run dev`
4. Open **http://localhost:3000/att** in a browser.

The preview uses clearly fake test values (phone number (202) 555-0147, dummy tag IDs) and shows a red
**DEV PREVIEW** badge, so it can never be mistaken for the live site.

> Note for this computer: the parent folder name contains "&". All `npm run …` commands were set up to work
> from this folder anyway (see DECISIONS.md D-03).

## 3. Settings you must fill in before publishing (environment variables)

The phone number and tracking IDs are not written into the code. They are read from "environment variables".
**The production build refuses to run** if the phone number is missing, or if any value that is set looks like a test/placeholder value. The three Google IDs can be left out until the accounts exist: the site then loads no Google tags. Add them later in Vercel and redeploy to switch tracking on.

| Setting | What to enter | Example format |
|---|---|---|
| `NEXT_PUBLIC_PHONE_DISPLAY` | The order-line number exactly as it should appear | `(877) 365-2069` format: (###) ###-#### |
| `NEXT_PUBLIC_PHONE_TEL` | The same number for tap-to-call | `+1` followed by 10 digits |
| `NEXT_PUBLIC_GTM_ID` (optional until available) | Google Analytics 4 ID (`G-…`) **or** Google Tag Manager ID (`GTM-…`) | `G-` + letters/digits |
| `NEXT_PUBLIC_GADS_ID` (optional until available) | Google Ads account tag ID | `AW-` + digits |
| `NEXT_PUBLIC_GADS_CALL_LABEL` (optional until available) | Google Ads conversion label for "clicks on phone number" | letters/digits from Google Ads |
| `NEXT_PUBLIC_GADS_SWAP_LABEL` (optional) | Conversion label for "calls from website" (number swap); if empty, the call label is used | |
| `NEXT_PUBLIC_ORDER_URL` (optional) | Leave empty. Every "Order Now" button then opens the online order page `/att/order?plan=<offer id>&source=<page>`. Only set it to send the buttons to a different https address instead; `plan`, `source` and any `gclid`/`gbraid`/`wbraid`/`utm_*` are then added to that address. | full `https://` URL |
| `ATTSPOC_SERVICE_URL` (optional, server only) | The https address of **order-service**, which runs the AT&T partner-portal order automation (section 11). Until it is set, the order page shows the plan and says "Online ordering is currently unavailable. Please call …". | `https://orders.example.com` format |
| `ATTSPOC_SERVICE_KEY` (optional, server only) | The shared secret for order-service: the **same** random value (32+ characters) as on order-service. Never put it in a `NEXT_PUBLIC_` variable. | random letters/digits |
| `ATTSPOC_QUOTE_TIMEOUT_S` / `ATTSPOC_HANDOFF_TIMEOUT_S` (optional) | How long the order page waits for each portal step (plans, options, quote) or for the order request before showing the "please call" message. | seconds, default `240` |
| `NEXT_PUBLIC_SITE_INDEXABLE` (optional) | `1` lets search engines index the site, `0` blocks them. Leave it unset: indexing is then off on a `*.vercel.app` address and on once a custom domain is attached. Set `1` if the live domain reaches this project through a rewrite from another project. | `1` or `0` |
| `NEXT_PUBLIC_CONTACT_EMAIL` (optional) | Email address shown on the Contact page and in the footer | defaults to Backoffice@urbanwirelessusa.com |

**Where to put real values**

- **On Vercel (recommended):** Project → Settings → Environment Variables → add each one for "Production".
- **On a computer:** copy `att-site/.env.example` to `att-site/.env.production` and fill it in.
  Delete or rename `att-site/.env.local` on that computer first — it holds the test values and Next.js would
  otherwise use them (DECISIONS.md D-08).

The recording of the current site shows **(877) 365-2069** as the order line. Confirm it before using it (OPEN_ITEMS O-01).

## 4. Building and checking the production version

- `npm run build` — builds the real site. It first runs `scripts/prebuild-check.ts`, which stops the build if:
  - any setting in section 3 is missing or looks like a test value, or
  - any offer in `offers.ts` has no att.com source link, or was last checked **more than 14 days ago**, or has expired.
- `npm run start` — serves the built site at http://localhost:3000/att.
- `npm run build:audit` / `npm run start:audit` — a local-only "audit build" that uses the test values, shows an
  "AUDIT BUILD — NOT FOR DEPLOYMENT" badge and is refused on Vercel. Used for the Lighthouse and tag tests.
- `npm run test:tags` — the Google tag tests (see AUDIT.md).

## 5. Updating prices and offers (every 14 days at the latest)

All prices, plan names, promotions and fine print live in **`att-site/src/data/offers.ts`**. Each offer has:

| Field | Meaning |
|---|---|
| `id` | Short name used in tracking (do not change for an existing offer) |
| `title`, `headline` | Names shown on the site, exactly as AT&T words them |
| `price` | Amount, "/mo." or "/mo. per line", qualifier ("for 12 mos."), "was" price, price after the promotion |
| `altPrice` | A second price, e.g. AT&T Fiber "with an eligible AT&T wireless plan" |
| `conditions` | Short conditions shown under the price |
| `finePrint` | AT&T's full offer details, copied word for word from att.com |
| `sourceUrl` | The att.com page the offer was checked on |
| `retrievedAt` | When it was checked (date and time) — not shown to visitors; it drives the 14-day freshness check |
| `expiresAt` | AT&T's end date, or `null` if none is published |

To update:

1. Open the `sourceUrl` on att.com and compare the price and the "See offer details" text.
2. Edit the offer in `offers.ts` (copy AT&T's text exactly). Remove offers AT&T no longer shows.
3. Set `retrievedAt` to the current date and time, e.g. `"2026-11-03T14:00:00.000Z"`.
4. Run `npm run build`. If anything is older than 14 days the build tells you which offer to re-check.
5. Publish (section 7).

The scripts used to collect the original evidence are in `att-site/scripts/research/` (for example
`npm run research:crawl`) if a full re-check is ever needed.

## 6. Photos

The site has no contact or call-back forms: every page leads visitors to a **Call Now** button.

Photos are set up as named "slots" in `att-site/src/data/images.ts`. Each slot shows the file with the same name from
`att-site/public/images/` (for example `home-hero.webp`). To replace a photo, save the new file under the same name
(`.webp`, `.jpg` or `.png`), rebuild and publish. If a file is removed, that slot simply shows nothing.

- Hero backgrounds: 2400 × 1165 px. Service cards: 1200 × 796 px. Section photos: 1600 × 1061 px.
- The prompts used to generate them are in `IMAGE-PROMPTS.md`. Photos must not show logos, brand names or readable text.
- On screens narrower than 1024 px the hero photo appears as a banner above the headline; on wider screens it sits
  behind the headline under a navy overlay, so the main subject should be on the right side of the picture.

## 7. Publishing under /att on Vercel

1. The code is on GitHub at **https://github.com/wastecopilot/attmultiwebsite** (branch `main`).
2. In Vercel: **Add New Project → import the repository → Root Directory: `att-site`**. Framework: Next.js
   (detected). Build command and output: leave the defaults.
3. Add the environment variables from section 3 (Production) **before the first deploy**. Without real values the
   build stops with a message naming the missing setting.
   The build also stops once any offer was last checked more than 14 days ago. The current offers were checked on
   21 October 2026, so from **4 November 2026** builds stop until the offers are re-checked (section 5).
4. Deploy. The site answers on `/att/...` because the code sets `basePath: "/att"`.
5. Connect the domain so that **https://authorizedinternetretailer.net/att/** reaches this project. If the main
   domain is served by another project, add a rewrite there: `/att` and `/att/:path*` → this Vercel deployment
   (same paths).
6. **Search engines:** they only read `https://authorizedinternetretailer.net/robots.txt` at the domain root. Make
   sure that file allows `/att/` and lists the sitemap:
   ```
   User-agent: *
   Allow: /att/
   Sitemap: https://authorizedinternetretailer.net/att/sitemap.xml
   ```
   (The site also serves its own copy at `/att/robots.txt`, which crawlers do not read on their own.)
7. After going live: submit `https://authorizedinternetretailer.net/att/sitemap.xml` in Google Search Console, and
   run PageSpeed Insights on the live pages.

## 8. Google Ads and Analytics

- **Consent:** before any Google tag loads, the page sets Google Consent Mode v2 defaults. Visitors in the EEA, UK and
  Switzerland start with analytics and advertising **off**; everywhere else they start **on** (US opt-out model),
  except that a browser "Global Privacy Control" signal turns advertising off. The banner offers Accept all /
  Reject non-essential / Manage preferences, stores the choice for 12 months, and the footer link "Cookie settings"
  reopens it.
- **Tags load immediately** (no delay, no waiting for clicks).
- **Phone calls:** every phone number on the site is rendered by one component (`PhoneLink`). Each tap sends the
  Google Ads call conversion (label from `NEXT_PUBLIC_GADS_CALL_LABEL`) and a `phone_click` event. "Calls from
  website" number swapping is configured with the displayed number.
- **Events** for GA4/GTM: `phone_click`, `order_click`, `zip_check`, `cta_click` — each with the page, offer id and
  value (the offer's monthly price, or 0). The online order page adds `begin_order`, `order_quote_started`,
  `order_quote_shown`, `order_step_details`, `order_submit` and `order_failed` (with a non-personal `reason`), each
  with the plan id and value. No event ever carries a name, address, phone number or email.
- **Click IDs:** `gclid`, `gbraid`, `wbraid` and `utm_*` values are kept on the address bar as visitors move around the
  site, and stored in a first-party cookie for 90 days when advertising consent allows it.
- **Landing pages for ads (no menu):** `/att/lp/fiber`, `/att/lp/internet-air`, `/att/lp/wireless`. They point search
  engines to the matching main page (canonical) and are not in the sitemap.
- **Tip:** if the Google Analytics and Google Ads destinations are combined into a single Google tag, the browser loads
  one tag file instead of two, which speeds up mobile pages noticeably.

## 9. Open items (also in OPEN_ITEMS.md)

| # | What is needed | From whom |
|---|---|---|
| O-01 | Real order-line phone number (recording shows (877) 365-2069 — confirm) | Business owner |
| O-02 | Google Analytics 4 or Tag Manager ID | Marketing |
| O-03 | Google Ads account ID and call conversion label(s) | Marketing |
| O-04 | Licensed AT&T logo (none supplied; the site uses a neutral text wordmark and brand-free photos) | AT&T program / business owner |
| O-06 | Legal review of Privacy, Terms, Cookie Policy, CCPA notice, Accessibility statement, Disclaimer | Counsel |
| O-07 | Confirm company details: legal name, address, hours, email | Business owner |
| O-08 | Confirm each AT&T promotion may be offered through the retailer channel | AT&T program manager |
| O-17 | The automation's integration handbook, specialist runbook and Aria prompt (not in the folder) | Automation team |
| O-18 | Where specialists receive prepared orders (queue folder / internal webhook) and who watches it | Business owner |
| O-19 | Rotate the partner portal key (hard-coded in `attspoc_probe.py`) | Automation team / AT&T portal admin |
| O-20 | Retention for the automation's screenshots and test files with customer data | Business owner |
| O-21 | A permanent host for order-service (Cloud Run, Railway or a company server; single instance, HTTPS). Until then it runs on the demo laptop through a quick tunnel (section 11) | Business owner / IT |
| O-25 | Before hosting: stop order-service from logging the automation's portal session ids | Developer |
| O-26 | Give the extended automation module (plans call, kept-open sessions) to the automation team | Automation team |
| O-27 | Decide on the portal vs att.com price differences (research/data-audit.md, items 10–15) | Business owner |
| — | Offers not shown because they are unconfirmed, online-only or TV (YouTube TV): see OPEN_ITEMS X-03…X-13 | — |

## 11. Online ordering (Order Now)

Every **Order Now** button opens `/att/order?plan=<offer id>&source=<page>` (click IDs and `utm_*` kept). The
page is not indexed, not in the sitemap and never cached. It works like the AT&T partner portal
(research/portal-flow.md). The visitor:

1. enters the service address;
2. sees which att.com plans the portal offers **at that address**, with att.com's names, speeds, prices and fine
   print (about 30–60 seconds). The plan from the Order Now button is preselected when it is offered there;
   otherwise the page says so ("AT&T Internet 1000 is not available at this address") and shows the plans
   that are;
3. chooses the options the portal lists for that plan: AutoPay is an explicit choice (with att.com's $10/mo.
   discount text); items with a single option (equipment, installation) are shown as included; nothing else is
   preselected;
4. sees the quote: the portal cart line for line, shown only when its total equals the att.com price;
5. enters name, phone, email and confirm email, billing language, an optional phone/text permission, and
   confirms;
6. reviews and submits.

The automation then prepares the order in the portal **without** running the credit check. A specialist
receives it and completes the credit check, payment and submission with the customer. The visitor gets a
reference number (for example `UW-7K3M9QX2`).

**Plan names and prices come only from att.com** (`src/data/offers.ts`, re-checked 28 Oct, see
`research/att-com-verified.md`), on the marketing pages and the order page alike, each with its "Pricing as of"
date. The portal only says which of those plans are available at the address (`src/data/order-plans.ts` links
offer ids to portal plan names), lists a plan's options and produces the cart. Portal plans att.com does not list
(Internet 100) are hidden; paid add-ons att.com does not price (Extended Wi-Fi) are not offered online. A quote
is shown only when the portal cart total equals the att.com price for the chosen plan and options; otherwise the
visitor is asked to call and the server logs `order_price_mismatch` (OPEN_ITEMS O-30 to O-32).

**What makes the page stop and show "please call":**

- no Internet plans at the address;
- anything in the portal cart the visitor did not choose (a DIRECTV bundle, a paid add-on);
- any portal error or timeout;
- the service not configured or not reachable.

**What the website never does:**

- ask for or accept SSN, date of birth, card or bank details; the server refuses such requests;
- put personal data in URLs, analytics or logs;
- show a quote or confirmation the automation did not return.

**Hosting.** The automation is Python and Chromium and needs about a minute per order, so it cannot run on
Vercel. It runs as **order-service** (`order-service/`, see its README) on a single always-on container or
small server, with HTTPS in front. The partner portal link (`ATTSPOC_URL`) is set there only.

**Setup**

1. Deploy `order-service` with `ATTSPOC_SERVICE_KEY` (random, 32+ characters) and `ATTSPOC_URL`.
2. Point its specialist queue at a private folder and, optionally, an internal webhook. The specialist must
   open each prepared order within 30 minutes (portal idle limit).
3. In Vercel set `ATTSPOC_SERVICE_URL` (the service's https address) and the same `ATTSPOC_SERVICE_KEY`, then
   redeploy.

**Which plans can be ordered online.** Every Internet plan the portal offers at the visitor's address: seen
live on 28 Oct were Internet 300, 500, 1000, 5000, Internet 100 and AT&T Internet Air
(research/portal-options.md). Wireless, phone, TV and bundles show the call message.

**The automation module** (`att_order_automation.py`, private folder) was extended on 28 Oct with the plans
call, one kept-open portal session per visitor and options read for any plan. The original is kept next to
it as `att_order_automation.orig-20261028.py`. A hosted order-service needs the new version (OPEN_ITEMS O-26).

**Live test, 28 Oct (rebuilt flow, through the tunnel):** Internet 300 $50.00, 500 $60.00, 1000 $70.00,
5000 $110.00, Internet 100 $60.00 (+ $99 one-time install), Internet Air $55.00; each equal to the portal cart.
One hand-off, UW-DZ3SY7XR, stopped before the credit check (OPEN_ITEMS O-28).

**Tests:** `npm run build:audit && npm run test:order` (site, against a local mock) and
`python -m unittest discover -s tests` in `order-service/`.

**Background:** `research/spoc-analysis.md`, `research/spoc-integration-plan.md`, `research/portal-flow.md`,
`research/portal-options.md`, `research/portal-vs-site.md`.

### Demo setup: this laptop and a Cloudflare quick tunnel (since 2026-10-28)

**This is a demo setup, not the permanent one.** order-service runs on the demo laptop at
`127.0.0.1:8787`, which other computers cannot reach. A free Cloudflare quick tunnel gives it a public
address such as `https://<random words>.trycloudflare.com`, which the Vercel site calls. No cloud account,
billing or card is needed.

**Start and stop** (from the project folder on the laptop):

- **Start:** double-click `start-order-service.bat` (or run `./start-order-service.sh`). It starts:
  - order-service, as one process;
  - the tunnel;
  - a keep-awake helper.

  Then it prints the tunnel address. The three run hidden and keep running after the window is closed.
- **Stop:** double-click `stop-order-service.bat` (or run `./stop-order-service.sh`).
- **After a laptop restart,** run the start script again.
- **Restart only order-service** (for example after the automation was updated): `restart-order-service.bat`.
  The tunnel keeps running, so its address and the Vercel setting stay the same.

**Connect the website** in Vercel (Settings → Environment Variables, Production), then **redeploy**:

| Setting | Value |
|---|---|
| `ATTSPOC_SERVICE_URL` | the tunnel address the start script prints |
| `ATTSPOC_SERVICE_KEY` | the value of `ATTSPOC_SERVICE_KEY` in `order-service/.env.local` on the laptop (unchanged across restarts) |
| `NEXT_PUBLIC_PHONE_DISPLAY` | `(877) 365-2069` (the build fails without it) |
| `NEXT_PUBLIC_PHONE_TEL` | `+18773652069` |

Changes to environment variables only take effect after a redeploy.

**Two things to know**

- **The address changes every time the tunnel starts:** after running the start script again, or after the
  laptop restarts. Each time, paste the new address into `ATTSPOC_SERVICE_URL` in Vercel and redeploy.
- **The laptop must stay on, awake and online.** If it is off, asleep or offline, or the service is
  stopped, Order Now shows the "please call us" screen. The site never shows a quote or a reference that
  the automation did not return.

**Sleep.** While the service runs, the keep-awake helper asks Windows not to sleep. This is the same request a
video player makes, and no setting is changed. Closing the lid can still put the laptop to sleep, so for the
demo keep it plugged in and set:

- Settings → System → Power & battery → Screen, sleep & hibernate timeouts → "When plugged in, put my
  device to sleep after" → **Never**;
- Control Panel → Hardware and Sound → Power Options → "Choose what closing the lid does" → "When I close
  the lid", Plugged in → **Do nothing**.

**Where things are on the laptop.** Only the scripts are in the repository; everything else stays on the laptop.

| Path | Contents |
|---|---|
| `order-service/.env.local` | Service key, port and folders. Git-ignored. |
| `attspoc AT&T/portal_url.txt` | The partner portal link with the partner key. The service reads it from this file. It is never copied, logged or committed, and the key exists only on this laptop. |
| `order-service/local/` | The scripts behind the start and stop files (also `start-order-service.*`, `stop-order-service.*` in the project folder). In the repository; they hold no settings or secrets. |
| `order-service/.run/` | The service log, the tunnel log and the current tunnel address. The service log holds no personal data, portal addresses or session ids. |
| `order-service/specialist_queue/` | One file per prepared order. A specialist must open each within 30 minutes; delete it afterwards. |
| `order-service/order_artifacts/` | The automation's portal screenshots. Delete after the demo. |

**Tested 2026-10-28 through the tunnel:**

- The health check answered.
- Requests with no key or a wrong key were refused (401).
- SSN, date-of-birth, card and bank fields were refused (422).
- One real quote via the website, with the README test order (Internet Air, Hicksville, Test Customer):
  $55.00/mo. in 43 s.
- The order request was prepared in 16 s, reference `UW-PGBV78XM`. The credit-check section was shown and
  not used, Continue was not clicked, and no order was placed.
- The queue file and screenshots were then deleted.

**Not for real customers.** Cloudflare gives quick tunnels no uptime guarantee, the address is random, and
ordering depends on one laptop. The permanent version needs a hosted server with a fixed https address:

- Google Cloud Run, with min = max = 1 instance and CPU always allocated;
- Railway, single instance;
- or a company server.

Run `order-service/` there as described in its README, with the partner link in `ATTSPOC_URL`
(OPEN_ITEMS O-21, O-25).

## 10. Where things are

| Path | Contents |
|---|---|
| `att-site/src/data/offers.ts` | All prices, promotions and fine print |
| `att-site/src/data/order-plans.ts` | Plans orderable online, their partner-portal names and option questions |
| `att-site/src/components/order/`, `att-site/src/app/api/order/` | The order page and its server routes |
| `order-service/` | The HTTP service that runs the order automation (not deployed to Vercel) |
| `att-site/src/data/site.ts` | Company details, disclosure and trademark wording |
| `att-site/src/data/faq.ts` | Frequently asked questions |
| `att-site/src/styles/tokens.ts` | Brand colors (from att.com) |
| `att-site/src/app/` | The pages (folder names match the web addresses) |
| `att-site/src/data/images.ts`, `att-site/public/images/` | Photo slots and the photos |
| `IMAGE-PROMPTS.md` | Prompts used to generate the photos |
| `att-site/src/lib/tag-snippet.ts`, `consent.ts`, `analytics.ts` | Consent and Google tag set-up |
| `att-site/tests/tags.spec.ts` | Automated tag tests |
| `att-site/scripts/audit/` | Audit scripts (Lighthouse, axe, SEO, links, text scan, screenshots, content check) |
| `research/` | Video inventory, att.com crawl, colors, IA and design notes |
| `audit/` | All audit evidence; summary in `AUDIT.md` |
