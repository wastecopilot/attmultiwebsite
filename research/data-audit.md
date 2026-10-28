# Marketing data audit against att.com (2026-10-28)

Owner rule applied: every plan, price, speed, promo and fine-print line a visitor sees must come from
https://www.att.com/ as fetched today, with source URL and retrieval date. Anything not confirmable is removed;
every difference is recorded below for the boss to decide.

## Date and method

- **Fetched:** 2026-10-28, 15:42–16:12 UTC, with Playwright 1.64.1 / headless Chromium (desktop Chrome user agent,
  1440×900, en-US, America/New_York), run from `att-site`. Each page was loaded, scrolled so lazy sections render,
  then every "See offer details" dialog was opened and its text recorded verbatim. AT&T Fiber pages were captured in
  both price states ("Without wireless plan" and "With wireless plan").
- **Privacy / safety:** no cookie banner appeared on any page (nothing accepted). No form was submitted, no address
  or ZIP entered, no sign-in.
- **Evidence (not in git):** `C:\Users\pavit\AppData\Local\Temp\claude\C--Users-pavit-Downloads-AT-T-Multi-page-claude\13ff4757-b6a5-4783-88f4-e79f595c76ed\scratchpad\attcom\pages\`
  (`<slug>.txt` / `.json` / `.png` per page). Scripts in the same `attcom` folder: `crawl.mjs` (capture),
  `compare.ts` (paragraph-by-paragraph comparison of `offers.ts` with the captures), `update.ts` (applies the changes;
  fine print is copied programmatically from the captures and the script fails if any price or fine-print paragraph
  is not found verbatim on att.com today).
- **Comparison:** for every offer, plan name, speed, monthly price, "was" price, per-line/line-count and AutoPay
  conditions, promo text/dates, features and each fine-print paragraph were checked against the capture of its
  `sourceUrl` (whitespace and quote characters normalised; nothing else).

| att.com page | HTTP | Retrieved (UTC) | Dialogs captured |
|---|---|---|---|
| https://www.att.com/ | 200 | 2026-10-28T15:42:09Z | 12 |
| https://www.att.com/internet/ | 200 | 2026-10-28T15:44:49Z | 2 |
| https://www.att.com/internet/fiber/ | 200 | 2026-10-28T15:46:03Z | 4 (both price states) |
| https://www.att.com/internet/internet-air/ | 200 | 2026-10-28T16:02:59Z | 2 |
| https://www.att.com/internet/internet-service-plans/ | 200 | 2026-10-28T16:04:09Z | 5 |
| https://www.att.com/wireless/ | 200 | 2026-10-28T16:07:00Z | 9 |
| https://www.att.com/plans/unlimited-data-plans/ | 200 | 2026-10-28T16:09:54Z | 1 |
| https://www.att.com/wireless/switch-and-save/ | 200 | 2026-10-28T16:09:55Z | 5 |
| https://www.att.com/wireless/byod/ | 200 | 2026-10-28T16:11:21Z | 3 |
| https://www.att.com/deals/cell-phone-deals/ | 200 | 2026-10-28T15:44:49Z | 19 |
| https://www.att.com/deals/ | 200 | 2026-10-28T16:04:47Z | 21 |
| https://www.att.com/bundles/ | 200 | 2026-10-28T16:10:30Z | 6 |
| https://www.att.com/bundles/55-plus-internet-wireless/ | 200 | 2026-10-28T16:11:38Z | 0 (terms are on the page) |
| https://www.att.com/home-phone/ | 200 | 2026-10-28T16:09:55Z | 3 |
| https://www.att.com/home-phone/phone-advanced/ | 200 | 2026-10-28T16:10:52Z | 0 (terms are on the page) |
| https://www.att.com/wi-fi/ | 200 | 2026-10-28T16:11:37Z | 1 |
| https://www.att.com/why-att/guarantee/ | 200 | 2026-10-28T16:12:22Z | 8 |

## Offers (`att-site/src/data/offers.ts`)

Result: **21 offers kept, 0 removed** (no offer id removed, so no order-flow reference changes are needed).
Every kept offer now has `retrievedAt` = its page's 2026-10-28 fetch time; every `sourceUrl` is the page used.

| Offer id | att.com source | att.com today | Our site showed | Action | Reason |
|---|---|---|---|---|---|
| fiber-300 | /internet/fiber/ | AT&T Internet 300, 300Mbps, $50/mo. (was $60) w/ AutoPay & Paperless; $35/mo. with wireless | Same prices | **Changed** (fine print, wireless condition) | Prices confirmed. att.com rewrote the wireless-discount terms and the "With wireless plan" card line (see Differences). Fine print replaced with today's dialog text, verbatim. |
| fiber-500 | /internet/fiber/ | $60/mo. (was $75); $45 with wireless; 12-month $5 discount in fine print | $60 for 12 mos., then **$65**; $45 with wireless | **Changed** | As above; `thenAmount` $65 removed (att.com does not print a post-12-month price). |
| fiber-1000 | /internet/fiber/ | Up to 1 GIG, $70/mo. (was $90); $50 with wireless; 12-month $10 discount | $70 for 12 mos., then **$80**; $50 with wireless | **Changed** | As above; `thenAmount` $80 removed. |
| fiber-5000 | /internet/fiber/ | Up to 5 GIG, $110/mo. (was $135); $85 with wireless; 12-month $15 discount | $110 for 12 mos., then **$125**; $85 with wireless | **Changed** | As above; `thenAmount` $125 removed. |
| internet-air | /internet/internet-service-plans/ | AT&T Internet Air $55/mo. plus taxes; AutoPay & Paperless req'd | $55/mo. | Kept | Price, features and all 4 fine-print paragraphs verbatim. |
| all-fi-pro | /wi-fi/ | All-Fi Pro "can be added for $25/mo. plus tax" (also $25.00/mo. on fiber cards) | $25/mo. | Kept | All 4 paragraphs verbatim. |
| bundle-fiber-wireless | /bundles/ | Save up to $420/year; $15/$20/$25 fiber discount | Same | Kept | 3/3 paragraphs verbatim ("Internet Savings Offer" still published on /bundles/ and the home page). |
| bundle-55-plus | /bundles/55-plus-internet-wireless/ | Two unlimited lines + home internet $99/mo., customers 55+ | $99/mo. | Kept | Page text unchanged since 2026-10-22 (only AT&T's phone numbers differ). |
| phone-unlimited-north-america | /home-phone/ | Phone Unlimited North America $24.99/mo. for 12 mos.; then currently $34.99 | Same | Kept | 4/4 paragraphs verbatim. |
| phone-international-plus-ii | /home-phone/ | International Plus II $34.99/mo. for 12 mos.; then currently $44.99 | Same | Kept | 4/4 verbatim. |
| phone-advanced | /home-phone/phone-advanced/ | Equipment for $1 ($188 value), free shipping; excludes rotary/pulse | Same | Kept | 4/4 verbatim. |
| wireless-elite-2 | /plans/unlimited-data-plans/ | $70.00/mo. per line when you get 4 lines | $70 per line, 4 lines | Kept | Features and 4/4 paragraphs verbatim. |
| wireless-premium-2 | same | $50.00 per line, 4 lines; single line min. $100/mo. before discounts* | $50; single line $100 | Kept | Verbatim. |
| wireless-extra-2 | same | $40.00 per line, 4 lines; single line $80/mo. before discounts* | $40; single line $80 | Kept | Verbatim. |
| wireless-value-2 | same | $30.00 per line, 4 lines; single line $60/mo. before discounts* | $30; single line $60 | Kept | Verbatim. |
| wireless-switch-reward-800 | /wireless/switch-and-save/ | Up to $800 Reward Card Switcher Offer | Same | Kept | 10/10 verbatim. |
| wireless-byod-credit-360 | /wireless/switch-and-save/ | BYOD Bill Credit Switcher Offer, up to $360 over 36 mos.; $35 activation credited online only | Same | Kept | 2/2 verbatim; card line also on /wireless/byod/. |
| wireless-new-line-5-off | /wireless/switch-and-save/ | Extra $5/mo. off for 12 months per new line with 4+ lines; per-line prices $65/$45/$35/$25 (4 lines); full terms: **"Ends 12/31/26"** | Same amounts; no end date ("Limited time") | **Changed** | `expiresAt` null → 2026-12-31T23:59:59-05:00; att.com's full promo terms (home-page "See offer details", verbatim) appended to the fine print. |
| wireless-trade-in-samsung-z8 | /wireless/switch-and-save/ | Galaxy Z Flip8 / Z Fold8 / Z Fold8 Ultra up to $1,200 off w/ trade-in | Same | Kept | 28/28 verbatim. |
| wireless-trade-in-iphone-18 | https://www.att.com/ | iPhone 18 Pro / 18 Pro Max / iPhone Duo up to $1,200 off w/ trade-in | Same | Kept | 37/37 verbatim. |
| wireless-appreciation-savings | /bundles/ | Save 20% Premium 2.0, 15% Extra 2.0, 10% Value 2.0 (proof of eligibility) | Same | Kept | 11/11 verbatim. |

\* Single-line rates are not on the plans page; they come from the device-offer fine print on https://www.att.com/
and https://www.att.com/deals/cell-phone-deals/ ("AT&T Premium 2.0 plan or higher (min. $100/mo. plus taxes and fees,
before discounts for single line)", Extra $80, Value $60), confirmed today. att.com publishes none for Elite 2.0; the
plans table keeps "Call for pricing".

### Code changes that go with the data

- `att-site/src/app/(site)/internet/fiber/page.tsx`: the featured box no longer prints "$80/mo. after 12 months";
  it reads "With an eligible AT&T wireless plan: $50/mo. for 12 mos. · After 12 mos., AT&T's prevailing rate
  applies" (att.com: "After 12 mos, prevailing rate for fiber plan applies"). In the price table, "for 12 mos." now
  follows the plan qualifier, and the "After 12 months" row shows "AT&T's prevailing rate" (500/1000/5000) or
  "No change" (300) instead of $65/$80/$125. The tier pages and plan cards drop the "Then $X/mo." line automatically.
- No other file changed. `faq.ts`, `guarantee.ts`, `i18n.ts` and the page copy were checked and still match att.com.

## Hard-coded prices and claims on marketing pages

| Where | Text | att.com today | Status |
|---|---|---|---|
| Home, internet, fiber, es pages, OG images | AT&T Fiber "from $50/mo." | Internet 300 $50/mo. | OK |
| Internet, Air pages, landing, OG images, FAQ | Internet Air $55/mo., AutoPay & paperless required, $0 self-setup, no annual contract / no overage fees | Same (/internet/internet-air/, /internet/internet-service-plans/) | OK |
| `lp/fiber` + OG/Twitter images | 1 GIG $70/mo. for 12 months; $50/mo. for 12 months with eligible wireless | $70 / $50 with the 12-month $10 discount (fine print) | OK |
| Fiber page intro, deals page, es fiber | "Internet 500, 1000 and 5000 include a 12-month discount for new customers" | "Up to $15 Off Fiber Offer … discount for 12 months … ($5/mo w/500M; $10/mo w/1 Gig; $15/mo w/5 Gig)" | OK |
| Internet page, FAQ, es fiber | Wireless discount $15/$20/$25; "starts within 3 bills"; up to $420/year | Same (/bundles/ "Internet Savings Offer"; fiber dialog) | OK |
| Fiber page, FAQ | $0 self or tech install; up to $99 installation fee; equal upload/download; no contract, no data caps; All-Fi included | Fiber comparison table, fiber dialog, home page | OK |
| Wireless pages, `lp/wireless`, FAQ, plans table | $70/$50/$40/$30 per line with 4 lines; hotspot 250/100/50/3GB; 4K UHD (Elite/Premium); 20 Latin American countries; tablet/watch terms; fee up to $4.99 | /plans/unlimited-data-plans/ | OK |
| Switch page, FAQ, es | Up to $800 per line reward card; up to $360 BYOD credits | /wireless/switch-and-save/, /wireless/byod/ | OK |
| Phone deals page | Up to $1,200 off iPhone 18 Pro, iPhone Duo, Galaxy Z Flip8/Fold8 | Home, switch and cell-phone-deals dialogs | OK |
| Phone page, OG images, FAQ, es | $24.99/mo. for 12 months; $34.99/mo. (Intl Plus II); then currently $34.99 | /home-phone/ | OK |
| Fiber page featured box + table | **$65 / $80 / $125 after 12 months** | Not printed on att.com | **Removed** (see Differences) |
| `guarantee.ts` (Fiber, Air, wireless pages) | 20-minute internet outage → full day credit; wireless note (60 min, 8 towers); backup note | /why-att/guarantee/; the wireless note verbatim on /plans/unlimited-data-plans/ | OK (file not edited) |

## Differences for the boss to decide

1. **AT&T Fiber "after 12 months" prices — removed from the site.** Old: Internet 500 "then $65/mo.", Internet
   1000 "then $80/mo." ($80/mo. after 12 months in the fiber page header), Internet 5000 "then $125/mo.".
   New: not shown; the site says AT&T's prevailing rate applies after 12 months. att.com prints only the current
   price, the struck "was" price ($75/$90/$135) and "After 12 mos, prevailing rate for fiber plan applies". The old
   figures were arithmetic (was price − $10 AutoPay, decision D-28), not att.com text. Restore only if the boss
   accepts derived prices.
2. **AT&T Fiber wireless-discount wording (no price change).** The "With wireless plan" card line changed from
   "Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills).
   Ltd. avail/areas." to "Price + taxes & fees after discounts w/elig wireless svc, AutoPay & Paperless bill. Ltd
   avail/areas." The "Internet w/ Wireless Savings Offer" paragraph is now "INTERNET W/ WIRELESS DISCOUNT" (now also
   names existing fiber customers adding wireless). Updated verbatim, including att.com's typo "within 1 3 bills".
   /bundles/ still publishes the older "Internet Savings Offer" paragraph ("w/in 3 bills"), kept for the bundle card.
3. **AT&T Fiber fine print per tier.** att.com now opens the same "See offer details" dialog for all four tiers,
   so Internet 300 now carries the "Up to $15 Off Fiber Offer" paragraph too (it names only 500M/1 Gig/5 Gig).
4. **New-line $5 discount end date.** Our page said only "Limited time"; att.com's full terms say "Ends 12/31/26"
   (new lines activated 10/12/2026–12/31/2026). `expiresAt` is now 2026-12-31 (the build fails after that date)
   and the full terms were added to the fine print. Also: att.com's switch page shows "Was $80/$60/$50/$40 → Now
   $65/$45/$35/$25 per line"; our card describes the same $65/$45/$35/$25 as "$5 below the $70/$50/$40/$30 AutoPay
   & paperless bill price". Same amounts, different "was" reference.
5. **Fiber "for 12 mos." next to the price.** att.com's fiber plan cards do not say "for 12 mos." next to the
   price; the 12-month term is in "See offer details". On 2026-10-22 the fiber page hero read "Get unlimited 1 GIG
   internet for $70/mo. For your first year."; today that hero is the YouTube TV offer, and /deals/ reads "Get AT&T
   Fiber® 1 GIG internet for $50/mo. For your first year when you bundle with an eligible wireless plan." Our cards
   still show "for 12 mos.", which the fine print supports. Keep or drop is the boss's call.
6. **Wireless plan disclaimer wording.** att.com's plan section says "Prices after AutoPay, paperless billing
   discount, and wireless discount. Req. proof of eligibility. Discounts start within three bills." Our condition
   says "After $10/mo. per line AutoPay & paperless bill discount (starts within 2 bills)", taken from AT&T's own
   AutoPay paragraph ("Pay full plan cost until discount starts within 2 bills"). Prices match; the wording differs.
   Unchanged since 2026-10-22; not changed.
7. **Single-line prices** ($100 Premium / $80 Extra / $60 Value, before discounts) are shown on our plans table but
   appear on att.com only inside device-offer fine print, not on the plans page. They are confirmed today.
8. **Plan name style.** att.com lists "Phone Unlimited North America" / "Phone International Plus II" under the
   "AT&T Phone" heading; our titles prefix "AT&T Phone". "Unlimited Your Way new line discount" is our label for
   att.com's "New line discount" ("EXTRA $5 OFF UYW 4 LINE PROMO" in the full terms).
9. **On att.com today but not on our site (no action taken):** AT&T Fiber 3 months of YouTube TV + $100 reward card
   with 1 GIG+ ("Online only", D-26); AT&T Phone + AT&T Internet "$24.99 + $55/mo."; AT&T Phone – Advanced plans at
   $45/mo. and $50/mo.; Galaxy Z Fold8 for $0 (switch hero, trade-in $290+); iPhone 18 Pro, Pixel 11 Pro and Galaxy
   S26+ for $0 with trade-in; iPhone 17 Pro under $10/mo. on a new line; HomeTech Protection $25/mo.; free 30-day
   wireless trial; accessories up to 60% off (ends 10/29/26, online only).

## Not verified

- Availability or price at any specific address (no address was entered, by design).
- att.com's FAQ answers (collapsed on att.com) and the Spanish copy word by word; the Spanish pages reuse the
  `offers.ts` numbers checked above.
- `/deals/autopay-discount/` was not fetched (not cited by any offer).
- `att-site/src/data/order-plans.ts` and the order flow (covered below and in research/portal-vs-site.md).

## Partner portal vs att.com

Partner portal prices are from the read-only live exploration of 28 Oct 2026 with the documented test addresses
(research/portal-options.md): the plan **card** price, and the **cart** total for AutoPay taken and paid add-ons
declined. The order page shows only the portal's own figures for the visitor's address; the marketing pages show
only att.com's. No price was changed because of this comparison: the differences are listed for the boss.

| Plan | att.com today | Our marketing pages | Portal plan card | Portal cart (12-month promo + AutoPay) |
|---|---|---|---|---|
| AT&T Internet 300 | $50/mo. (was $60) | $50/mo. for 12 mos. | $50/mo. ("after $10/mo. AutoPay") | $60.00 − $10.00 = **$50.00** (on 2 Oct also −$15 for 12 months = $35.00) |
| AT&T Internet 500 | $60/mo. (was $75), $5 off for 12 months | $60/mo. for 12 mos. | **$65/mo.** | $75.00 − $5.00 (12 months) − $10.00 = **$60.00** |
| AT&T Internet 1000 | $70/mo. (was $90), $10 off for 12 months | $70/mo. for 12 mos. | **$80/mo.** | $90.00 − $10.00 (12 months) − $10.00 = **$70.00** |
| AT&T Internet 5000 | $110/mo. (was $135), $15 off for 12 months | $110/mo. for 12 mos. | **$125/mo.** | $135.00 − $15.00 (12 months) − $10.00 = **$110.00** |
| AT&T Internet Air | $55/mo. | $55/mo. | **$60/mo.** ("after **$5**/mo. AutoPay"); $55/mo. on 28 Sep–2 Oct | $65.00 − $10.00 = **$55.00** |
| AT&T Internet 100 | not checked (not on our site) | not shown | $60/mo. ("after $10/mo. AutoPay") | $70.00 with AutoPay declined; $60.00 with AutoPay |

Differences for the boss:

10. **Portal cards for Internet 500, 1000 and 5000 show $65, $80 and $125**, while att.com and our pages show $60,
    $70 and $110. The cards leave out the 12-month promotion, which the portal applies only on the Options page
    and in the cart. The cart totals equal att.com's prices. On the order page visitors see the card price on the
    plan step and the cart total on the quote step, both as the portal shows them.
11. **Internet Air card: $60/mo. "after $5/mo. AutoPay" vs a cart of $65 − $10 = $55.** The card text and price
    changed between 2 Oct ($55) and 28 Oct ($60); the cart did not. att.com and our pages say $55.
12. **Internet 300's "$15 off for 12 months"** was in the portal cart on 2 Oct ($35.00 total) and is gone on
    28 Oct ($50.00). att.com's fiber fine print still names an "Up to $15 Off Fiber Offer" (500M/1 Gig/5 Gig only).
13. **Fiber 1 GIG and 5 GIG include "YouTube TV 3 months Free with Fiber 1G+" and "$100 Reward Card (Requires
    Redemption)"** (listed twice) in the portal; att.com marks the YouTube TV + $100 reward card offer "Online
    only" (difference 9). The order page shows them because the portal includes them in the cart; our marketing
    pages do not advertise them.
14. **Internet 100** is sold by the portal (Dallas test address) but is not on our marketing pages. Visitors can
    order it on the order page when the portal offers it at their address.
15. **Installation:** fiber installation is $0 in the portal ("waived with speeds of 300MB or more"); Internet 100
    carries a $99 one-time professional installation fee. att.com's fine print says "Up to $99 installation fee
    may apply".
