# Milestone 1 — research summary

Date: 2026-10-21. Sources: live att.com (fetched 06:07–06:43 UTC) and `reference/att-recording.mp4`.

## 1. What the recording is

A 1:42 scroll through the retailer's **current** page `authorizedinternetretailer.net/att/#internet-air`, operated by
**Transtech Marketing Network LLC** (70 Bagatelle Rd, Melville, NY 11747; order line (877) 365-2069; Mon–Fri 8 AM–9 PM ET,
Sat–Sun 9 AM–6 PM ET). Sections: hero with ZIP check → Fiber tiers → Internet Air → Wireless → Fiber + wireless bundle →
AT&T Phone → gear & protection → terms table → "What one call handles" → order steps → FAQ → footer. **No TV or DIRECTV
content.** Full inventory with timestamps: `research/video-inventory.md`.

Two kinds of recording copy must not be reused: lines telling customers to contact AT&T directly (incl. AT&T's support
number) and descriptions of who places orders.

## 2. Verified offers (att.com, 2026-10-21) → `att-site/src/data/offers.ts` (19 records)

| Offer | Price on att.com | Matches recording? |
|---|---|---|
| AT&T Internet 300 | $50/mo. ($35 with eligible wireless) | Yes |
| AT&T Internet 500 | $60/mo. for 12 mos., then $65 ($45 with wireless) | Yes |
| AT&T Internet 1000 | $70/mo. for 12 mos., then $80 ($50 with wireless) | Yes |
| AT&T Internet 5000 | $110/mo. for 12 mos., then $125 ($85 with wireless) | Yes |
| AT&T Internet Air | $55/mo. | Yes (standalone); bundled $35 not on att.com |
| AT&T All-Fi Pro add-on | $25/mo. plus tax | Recording says "included with 5 Gig" — not supported |
| Fiber + wireless bundle | Save up to $420/year; $15/$20/$25 per-month Fiber discounts | Recording's "20% off" not supported |
| AT&T Phone Unlimited North America | $24.99/mo. for 12 mos., then $34.99 | Recording shows no price |
| AT&T Phone International Plus II | $34.99/mo. for 12 mos., then $44.99 | Not in recording |
| AT&T Elite 2.0 / Premium 2.0 / Extra 2.0 / Value 2.0 | $70 / $50 / $40 / $30 per line with 4 lines | Recording omits Elite 2.0 |
| Switcher reward card | Up to $800 per line | Not in recording |
| BYOD bill credit | Up to $360 per line | Not in recording |
| New line discount | Extra $5/mo. off for 12 months per new line (4+ lines) | Not in recording |
| Samsung Galaxy Z Flip8/Fold8 trade-in | Up to $1,200 off | Not in recording |
| iPhone 18 Pro / Pro Max / Duo trade-in | Up to $1,200 off | Not in recording |
| AT&T Appreciation Savings | Up to 20% off wireless | Not in recording |

Every record carries `sourceUrl`, `retrievedAt`, `expiresAt` (null: att.com publishes no end dates for these offers)
and the full att.com fine print copied programmatically from the saved evidence.

## 3. Brand colors (`research/colors.md`, `att-site/src/styles/tokens.ts`)

Read from att.com computed styles and att.com's own named palette: AT&T blue `#009FDB` (confirmed), AT&T cobalt
`#00388F` (primary buttons), cobalt-600 `#0057B8` (hover/focus), func blue `#0072B2` (links), gray-800 `#1D2329` (text),
gray-700 `#454B52` (legal), blue-000 `#F2FAFD` (light bands), cobalt-800 `#002837` (dark bands), red-600 `#C70032`
(errors), green-600 `#2D7E24` (success). All 22 text/background pairs used pass WCAG 2.2 AA; `#009FDB` is restricted to
decoration (3.01:1 on white).

## 4. Conflicts resolved in favour of att.com

Four wireless plans instead of three; "$420/year" instead of "20% off"; All-Fi Pro as a $25 add-on; no bundled Internet
Air price; 4-line wireless prices only. Details: `DECISIONS.md` D-20 – D-28.

## 5. Not built (`OPEN_ITEMS.md`)

YouTube TV (TV content, online only), online-only reward cards and bill credits, Build-A-Plan, Internet Air bundled price,
ActiveArmor Advanced $7, AT&T Phone + Internet combo, 55+ plan teaser, free trial, single-line prices. Owner inputs
needed: real phone number, tag IDs, licensed logo/imagery, lead endpoint, legal review, channel eligibility per offer.

## 6. Next

Milestone 2 (information architecture and design) and Milestone 3 (build) use only `offers.ts`, `tokens.ts`,
`site.ts` and `faq.ts` as content sources.
