# OPEN ITEMS

Anything that could not be confirmed from the two sources of truth (live att.com, retrieved 2026-10-21, and the screen recording), or that needs a decision or asset from the business before launch. **Nothing in this list is shown on the site.**

## Must be supplied before launch

| # | Item | Why it is open | Where it goes |
|---|---|---|---|
| O-01 | **Real order-line phone number** (display and `tel:` formats) | The site reads the number from environment variables. The recording shows **(877) 365-2069** on the current retailer page; confirm it is the number to advertise and that it is enabled for Google Ads call reporting. | `NEXT_PUBLIC_PHONE_DISPLAY`, `NEXT_PUBLIC_PHONE_TEL` in `.env.production` |
| O-02 | **Google tag ID** (GA4 `G-…` or GTM `GTM-…`) | Not available to the build. | `NEXT_PUBLIC_GTM_ID` |
| O-03 | **Google Ads account ID** (`AW-…`) and **call conversion label** | Not available to the build. | `NEXT_PUBLIC_GADS_ID`, `NEXT_PUBLIC_GADS_CALL_LABEL` (and optional `NEXT_PUBLIC_GADS_SWAP_LABEL` for website call conversions) |
| O-04 | **Licensed AT&T logo and imagery** | No licensed assets were provided (`./assets` does not exist). The site uses a neutral text wordmark and brand-free photos supplied by the owner (no logos or brand marks). The retailer's current striped globe mark (seen in the recording) closely resembles the AT&T Globe and was not reused. | `att-site/public/` once licensed, with the licence on file |
| O-05 | ~~Lead-form destination~~ **Closed** | Contact and call-back forms were removed at the owner's request; the site is call-only (DECISIONS D-34). | — |
| O-06 | **Legal review of policy pages** | Privacy, Terms, Cookie Policy, CCPA/CPRA notice, Accessibility statement and Disclaimer are professionally drafted templates based on the retailer details shown in the recording; they need review by the retailer's counsel. | `att-site/src/app/(site)/{privacy,terms,…}` |
| O-08 | **Channel eligibility of each promotion** | att.com publishes the offers; whether each one can be provided through the retailer's sales channel must be confirmed with the retailer's AT&T program manager before advertising. Offers marked "Online only" on att.com are already excluded. | src/data/offers.ts |
| O-07 | **Business details confirmation**: legal name "Transtech Marketing Network LLC", address "70 Bagatelle Rd, Melville, NY 11747", hours "Mon–Fri 8 AM–9 PM ET · Sat–Sun 9 AM–6 PM ET", email "admin@authorizedinternetretailer.net" | Taken from the recording (footer, 1:39–1:41); not independently verifiable. | `att-site/src/data/site.ts` |

## Seen in the sources but deliberately not built

| # | Item | Source | Reason |
|---|---|---|---|
| X-01 | Recording copy telling customers to "contact AT&T directly" and giving AT&T's support number 1-800-288-2020 | Video 0:49 and 1:39 | Brief forbids directing customers to AT&T for account, billing or support. |
| X-02 | Recording copy describing who places orders ("The person on the line places AT&T residential orders", "Three steps, one phone call") | Video 0:92–0:96 | Brief forbids describing order-placement mechanics. |
| X-03 | YouTube TV (3 months) bundled with AT&T Fiber 1 GIG and above | att.com Fiber, Internet and Bundles pages | TV/streaming content is out of scope; the offer is also "Online only". |
| X-04 | Online-only offers: $100 AT&T Visa Reward Card with Fiber 1 GIG+, $200 new-line bill credits, AT&T Build-A-Plan | att.com Fiber, Deals and Switch dialogs; att.com Build-A-Plan grounding file | att.com states these are online only. |
| X-05 | Internet Air "$35/mo. bundled with eligible AT&T wireless" | Recording 0:64–0:67 | Not published on att.com on 2026-10-21. |
| X-06 | "ActiveArmor Advanced $7/MO" add-on | Recording 0:83 | Not found as a priced add-on on att.com (advanced internet security is part of All-Fi Pro, $25/mo.). |
| X-07 | "AT&T Phone + AT&T Internet $24.99 + $55/mo." | att.com /home-phone/ | Its internet terms reference legacy data-allowance plans; unclear which internet plan applies. |
| X-08 | "Customers 55+: two lines of wireless and home internet for $99/mo." | att.com /wireless/ | Teaser only; no offer details published on the crawled pages. |
| X-09 | Free 30-day AT&T wireless trial | att.com home, /switch-and-save/ | An eSIM trial the customer starts on att.com, not a retail offer. |
| X-10 | Single-line wireless prices ($50 / $70 / $90) | Recording 0:68–0:70 | att.com displays 4-line prices only. |
| X-11 | "Reward cards on select plans*" chip | Recording 0:49 | Only online-only reward cards found on att.com. |
| X-12 | "All-Fi Pro (Wi-Fi 7) included" with 5 Gig | Recording 0:52 | att.com sells All-Fi Pro as a $25/mo. add-on. |
| X-13 | TV / DIRECTV | Recording (all 102 frames checked) | The recording shows no TV or DIRECTV section; the only TV-related item found anywhere is X-03. |
