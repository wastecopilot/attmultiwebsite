# Handover — AT&T authorized-retailer website

This document explains, in plain language, how to run, update and publish the website. The site lives in the
`att-site` folder and is published at **https://authorizedinternetretailer.net/att/**.

---

## 1. What you have

- A 24-page website (plus a "page not found" page) about AT&T Fiber, AT&T Internet Air, AT&T wireless and AT&T Phone,
  run by Transtech Marketing Network LLC as an independent authorized retailer.
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
| `NEXT_PUBLIC_CONTACT_EMAIL` (optional) | Email address shown on the Contact page and in the footer | defaults to admin@authorizedinternetretailer.net |

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
| `retrievedAt` | When it was checked (date and time) — shown to visitors as "Pricing as of …" |
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
- **Events** for GA4/GTM: `phone_click`, `zip_check`, `cta_click` — each with the page, offer id and
  value (the offer's monthly price, or 0).
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
| — | Offers not shown because they are unconfirmed, online-only or TV (YouTube TV): see OPEN_ITEMS X-03…X-13 | — |

## 10. Where things are

| Path | Contents |
|---|---|
| `att-site/src/data/offers.ts` | All prices, promotions and fine print |
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
