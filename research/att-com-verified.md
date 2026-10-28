# AT&T Fiber and Internet Air, verified on att.com (28 Oct 2026)

The only source of plan names and prices shown to visitors, on the marketing pages and on the order page.
The partner portal is used only to tell which of these plans are available at an address, to list a plan's
options and to produce the cart; its own card prices are never shown.

**Method:** fetched with headless Chromium (desktop user agent, en-US), every "See offer details" dialog opened
and its text saved verbatim. No form submitted, no address entered, no cookie banner shown. Captures are kept
outside git (scratchpad `attcom/pages-recheck/`). `src/data/offers.ts` was updated from these captures only.

| Plan (as att.com prints it) | Speed (as printed) | Price (as printed) | Was | With an eligible wireless plan | Source | Retrieved (UTC) |
|---|---|---|---|---|---|---|
| AT&T Internet 300 | 300Mbps speed | $50.00/mo. plus taxes & fees | $60.00/mo. | $35.00/mo. (was $60.00) | https://www.att.com/internet/fiber/ | 2026-10-28 17:53:35 |
| AT&T Internet 500 | 500Mbps speed | $60.00/mo. plus taxes & fees | $75.00/mo. | $45.00/mo. (was $75.00) | https://www.att.com/internet/fiber/ | 2026-10-28 17:53:35 |
| AT&T Internet 1000 | Up to 1 GIG speed | $70.00/mo. plus taxes & fees | $90.00/mo. | $50.00/mo. (was $90.00) | https://www.att.com/internet/fiber/ | 2026-10-28 17:53:35 |
| AT&T Internet 5000 | Up to 5 GIG speed | $110.00/mo. plus taxes & fees | $135.00/mo. | $85.00/mo. (was $135.00) | https://www.att.com/internet/fiber/ | 2026-10-28 17:53:35 |
| AT&T Internet Air | not printed | $55 /mo. plus taxes | — | — | https://www.att.com/internet/internet-service-plans/ (also https://www.att.com/internet/internet-air/, H1 "…for $55/mo", 17:55:08) | 2026-10-28 17:55:55 |

AT&T Internet 1000 and 5000 cards also print "3 months of YouTube TV on us" and "$100 reward card".

## Price conditions (verbatim, printed under each price)

- **AT&T Fiber (all four tiers):** "Price plus taxes and fees after $10/mo. discount w/ elig. Autopay & Paperless
  bill (w/in 2 bills). Ltd. avail/areas."
- **AT&T Fiber, with wireless:** "Price + taxes & fees after discounts w/elig wireless svc, AutoPay & Paperless
  bill. Ltd avail/areas."
- **AT&T Internet Air:** "Price plus taxes and fees. AutoPay & Paperless bill req’d. Not available in all areas.
  In rare cases, if your usage is contributing to congestion on the network, AT&T will greatly reduce your speed
  for a min. of 30 min. 5G coverage not available in all areas."

## Fine print used for the order check (verbatim excerpts from "See offer details")

- **AT&T Fiber, AutoPay:** "Autopay & Paperless Bill Discount: $10/mo if enrolled in Autopay & Paperless billing
  w/ your bank account or the AT&T Points Plus® Card from Citi. Discount reduced to $5/mo when enrolled with a
  debit card. No discount if enrolled with any other credit card. Discount starts w/in 2 bills. … Taxes & Fees:
  Up to $99 installation fee may apply, plus tax where applicable."
- **AT&T Fiber, 12-month offer:** "Up to $15 Off Fiber Offer: Subj to change. New AT&T Fiber customers will receive
  a discount for 12 months off the monthly recurring charge for an AT&T Fiber plan ($5/mo w/500M; $10/mo w/1 Gig;
  $15/mo w/5 Gig). Pay full plan cost until discount starts w/in 3 bills. After 12 mos, prevailing rate for fiber
  plan applies."
- **AT&T Internet 1000/5000:** "YOUTUBE TV MAIN PLAN 3 MOS OFFER: …" and "$100 REWARD OFFER: …" (full text in
  `offers.ts`).
- **AT&T Internet Air, AutoPay:** "AutoPay & Paperless bill discount: $10/mo if enrolled in Autopay w/ your bank
  account. Discount reduced to $5/mo when enrolled with a debit or credit card. Paperless billing required. Pay
  full plan cost until discounts start w/in 2 bills."

The full fine print of every plan is in `src/data/offers.ts` (`finePrint`), copied verbatim; it matched today's
captures paragraph for paragraph.

## How the order page uses this

| Visitor's choice | Price the portal cart must equal |
|---|---|
| AutoPay & paperless taken | the att.com price above |
| AutoPay declined | the att.com price + the $10/mo. discount att.com states |
| A paid add-on att.com does not price (e.g. Extended Wi-Fi) | not offered online; the visitor can add it by phone |

If the cart total differs, the page shows no price and asks the visitor to call; the mismatch (plan, ZIP, both
amounts, no personal data) is written to the server log as `order_price_mismatch`.

## Changes made to offers.ts from this check

- `retrievedAt` set to the fetch times above for fiber-300/500/1000/5000 and internet-air.
- Price conditions now use att.com's exact sentences (previously reworded as "After $10/mo. AutoPay & Paperless
  bill discount (within 2 bills)", "Plus taxes & fees", "Limited availability/areas", "AutoPay & Paperless bill
  required", "Not available in all areas").
- **Removed:** "for 12 mos." next to the Internet 500, 1000 and 5000 prices and in their headlines (both price
  views). att.com's cards no longer print it; the 12-month term stays in the fine print ("Up to $15 Off Fiber
  Offer").
- Added the AutoPay discount att.com states ($10/mo.) as `autopayDiscount`, used only to check quotes.

## Portal plans not on att.com

| Portal plan | Seen at | Handling |
|---|---|---|
| Internet 100 | Dallas TX test address (portal card $60/mo., $99 install) | Hidden from visitors; listed in OPEN_ITEMS O-30 |
