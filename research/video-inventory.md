# Video inventory: `reference/att-recording.mp4`

| Property | Value |
|---|---|
| File | `reference/att-recording.mp4` (98.3 MB) |
| Duration | 102.37 s (1:42), 1892 × 952, 30 fps, H.264 |
| Frames extracted | 102 frames at 1 fps → `reference/frames/1fps/f_0001.png` … `f_0102.png` (frame *n* ≈ timestamp *n − 1* s) |
| Scene-change frames | 118 frames (`select='gt(scene,0.08)'`) → `reference/frames/scenes/`, timestamps in `reference/frames/scenes/timestamps.tsv` |
| OCR | Tesseract 5.4.0 (`--psm 3`, eng) for all 220 frames → `reference/frames/ocr/*.txt`. Every entry below was also checked by eye against the frame image. |
| Inventoried | 2026-10-21 |

## What the recording shows

The recording is **not att.com**. It is a single long scroll of the *existing* retailer page at
`authorizedinternetretailer.net/att/#internet-air` (browser address bar, every frame), operated by
**Transtech Marketing Network LLC** ("AUTHORIZED RETAILER"). It is therefore a source for the retailer's
identity, layout ideas and *claimed* AT&T pricing. Each AT&T price/promo it shows must still be confirmed
against att.com (source of truth #1) before it can appear on the new site; see `research/att-crawl.md` and
`DECISIONS.md` for the reconciliation.

- Only one page is shown (one URL, anchored at `#internet-air`). No other routes are visited.
- **No TV or DIRECTV content appears anywhere in the recording.** Navigation items are Fiber, Internet Air, Wireless, Add-ons, FAQ.
- The phone number shown throughout is **(877) 365-2069**.
- From 0:00 to 0:47 the page is static at the top (only cursor movement; frame diffs ≈ 0). Scrolling runs 0:47–1:41.

## Section-by-section inventory

### 0:00–0:48 · Global header and hero (frames f_0001–f_0049)

| Element | Exact text (as shown) |
|---|---|
| Parent-site strip | "Authorized Internet Retailer" · "You're in our AT&T section · independent authorized retailer" · "Compare providers reported in your ZIP →" |
| Disclosure bar (dark) | "Independent Authorized Retailer of AT&T® — Not AT&T. Orders by phone: (877) 365-2069" (number is a link) |
| Logo lock-up | Striped globe-style mark + "Transtech Marketing Network LLC" / "AUTHORIZED RETAILER" |
| Nav | Fiber · Internet Air · Wireless · Add-ons · FAQ |
| Header CTA | "Call (877) 365-2069" (bright blue button) |
| Eyebrow | "INDEPENDENT AUTHORIZED RETAILER" |
| H1 | "AT&T Fiber from $50/mo — and the price after month 12, up front." |
| Lead | "Where AT&T Fiber is built, every tier uploads as fast as it downloads, up to 5 Gbps. Standard plans have no data cap and no annual contract. We check your address, then read out AT&T's price for each speed, with and without an AT&T wireless line." |
| Address-check card | Eyebrow "ADDRESS CHECK"; title "What AT&T can serve at your address"; body "The FCC map carries what AT&T reports, but it cannot confirm a single address. Search your ZIP to see every provider filed there, then call: we check the street address and give you the speeds and price that apply."; input placeholder "5-digit ZIP"; button "Search this ZIP"; note "Coverage source: the FCC National Broadband Map, which shows provider-reported data. broadbandmap.fcc.gov" |
| Price card | "AT&T FIBER INTERNET 300" · "$50.00 /mo" · "with Auto Pay & Paperless Billing" · "$35/mo with eligible AT&T wireless · plus taxes & fees" · link "Pricing as of Oct 2026 · see fine print" |
| CTA | "Call (877) 365-2069" |
| Hours | "Order line open Mon–Fri 8 AM–9 PM ET · Sat–Sun 9 AM–6 PM ET" |
| Support note | "This number takes new orders. For billing, account changes or an outage on an existing account, contact AT&T directly." **(not to be reproduced: the brief forbids telling customers to contact AT&T directly)** |
| Chips | "No annual contract*" · "Unlimited internet data*" · "FCC filings checked first" · "Reward cards on select plans*" |
| Background | Dark navy photo overlay (two people at a table with a phone) |

### 0:49–0:62 · AT&T Fiber tiers (f_0050–f_0063)

Eyebrow "AT&T FIBER"; H2 "Four fiber tiers, upload equal to download"; intro "On every AT&T Fiber tier an All-Fi gateway is included, data is unlimited and there is no annual contract. Uploads run at the download speed. Internet 300 has no 12-month promo; on the faster tiers a first-year discount ends and the regular rate applies." Decorative fiber-light image.

| Card | Speed label | Plan | Blurb | Price | Price qualifier | Secondary line | Bullets | CTA |
|---|---|---|---|---|---|---|---|---|
| 1 | 300 MBPS | AT&T Fiber Internet 300 | "Sized for streaming, video meetings and one or two home offices." | $50.00/mo | "with Auto Pay & Paperless Billing" | "$35/mo with eligible AT&T wireless · plus taxes & fees" | Symmetrical 300 Mbps; Unlimited data; All-Fi Hub included; No annual contract | "Order this tier (877) 365-2069" |
| 2 | 500 MBPS | AT&T Fiber Internet 500 | "When three or four people stream in 4K on the same evening." | $60.00/mo | "for 12 mos with Auto Pay & Paperless Billing" | "then $65/mo · plus taxes & fees" | Symmetrical 500 Mbps; Unlimited data; All-Fi Hub included; No annual contract | same |
| 3 (POPULAR) | 1 GIG | AT&T Fiber Internet 1000 | "For homes that push large uploads or run dozens of devices." | $70.00/mo | "for 12 mos with Auto Pay & Paperless Billing" | "then $80/mo · plus taxes & fees" | Symmetrical 1000 Mbps; Unlimited data; All-Fi Hub included; No annual contract | same |
| 4 | 5 GIG | AT&T Fiber Internet 5 Gig | "Five gigabits each way, offered where the local fiber plant is built for it." | $110.00/mo | "for 12 mos with Auto Pay & Paperless Billing" | "then $125/mo · plus taxes & fees" | Symmetrical 5 Gbps; Unlimited data; All-Fi Pro (Wi-Fi 7) included; No annual contract | same |

Every card carries "Pricing as of Oct 2026 · see fine print".

### 0:62–0:67 · AT&T Internet Air (f_0063–f_0068)

Eyebrow "AT&T INTERNET AIR"; H2 "Internet Air: 5G home service where fiber is not built"; intro "Internet Air delivers home internet as fixed wireless over AT&T's 5G network. AT&T mails the gateway, you plug it in yourself, and there is no annual contract." Living-room photo with a TV showing a streaming app.

| Card | Label | Price | Qualifier | Secondary |
|---|---|---|---|---|
| Standalone | Internet Air | $55.00/mo | "with Auto Pay & Paperless Billing" | "starting price · plus taxes & fees" |
| Bundled with wireless (highlighted) | Internet Air | $35.00/mo | "when bundled with eligible AT&T wireless" | "with Auto Pay & Paperless Billing · plus taxes & fees" |
| What comes with it | — | — | Plug-and-play self-install - no technician appointment; Unlimited data on the home internet plan; No annual contract; Available where AT&T 5G capacity supports it | CTA "Order Internet Air (877) 365-2069" |

Both price cards: "Pricing as of Oct 2026 · see fine print".

### 0:67–0:71 · AT&T Wireless (f_0068–f_0072)

Eyebrow "AT&T WIRELESS"; H2 "Three unlimited tiers, mixed line by line"; intro "Put each line on whichever tier suits it, all on one account. Numbers can be ported in, and no tier needs an annual contract." Three device photos (two phones, one tablet).

| Plan | Blurb | Price | Qualifier | Single line | Bullets |
|---|---|---|---|---|---|
| AT&T Value 2.0℠ | "The entry tier: unlimited talk, text and data, with 5GB at full speed." | $30.00/line/mo | "per line for 4 lines with Auto Pay & Paperless Billing" | "$50/mo for a single line · plus taxes & fees" | Unlimited talk, text & data in the US, Mexico & Canada; 5GB of high-speed data; 3GB of hotspot data per line; SD video streaming |
| AT&T Extra 2.0℠ (POPULAR) | "Steps up to 100GB of high-speed data and 50GB of hotspot." | $40.00/line/mo | same | "$70/mo for a single line · plus taxes & fees" | Unlimited talk, text & data in the US, Mexico & Canada; 100GB of high-speed data; 50GB of hotspot data per line; SD video streaming |
| AT&T Premium 2.0℠ | "High-speed data that is never slowed for usage, plus 4K streaming." | $50.00/line/mo | same | "$90/mo for a single line · plus taxes & fees" | Unlimited high-speed data, never slowed for usage; 100GB of hotspot data per line; Talk, text & data in 20 Latin American countries; 4K UHD video streaming |

CTA on each: "Order this plan (877) 365-2069". Each: "Pricing as of Oct 2026 · see fine print".

### 0:72–0:75 · Fiber plus wireless bundle (f_0073–f_0076)

Eyebrow "FIBER PLUS WIRELESS"; H2 "One account, two services, a lower Fiber bill"; intro "AT&T discounts the Fiber bill when an eligible wireless plan sits on the same account. Both can be ordered on one call, and the discount your combination earns is confirmed before you order." Photo of a person on a sofa with a phone.

Promo panel: headline **"20% off your monthly internet bill"**; body "Requires AT&T Fiber and an eligible AT&T wireless plan on the same account. Discount amount and eligibility vary by plan combination and are confirmed before you order."; bullets "Internet and wireless billed together on one account" · "Internet Air also drops in price when bundled" · "Your exact discount is confirmed before the order goes in"; CTA "Price the bundle (877) 365-2069".

> Note: the "20% off" headline conflicts with the same page's footer, which describes fixed $15/$20/$25 per-month wireless discounts. Resolved against att.com; see `DECISIONS.md`.

### 0:75–0:79 · AT&T Phone (f_0076–f_0080)

Eyebrow "AT&T PHONE"; H2 "A home line over AT&T internet"; intro "AT&T Phone is a digital voice line carried over your AT&T internet connection, added on top of an internet plan." Photo of a roadside produce stand.
Bullets: "Unlimited calling across the US on eligible plans" · "Keep your existing home number" · "Works with your existing handsets" · "Ordered together with your AT&T internet". Side note: "The price depends on the internet plan and the address; we give it to you on the call." CTA "Add a home line (877) 365-2069". **No price shown.**

### 0:79–0:85 · Gear and protection / Add-ons (f_0080–f_0086)

Eyebrow "GEAR AND PROTECTION"; H2 "What AT&T supplies, and what costs extra"; intro "The gateway and extenders are AT&T hardware, and ActiveArmor is AT&T's security service. Any of them can go on the order during the call." Photo of a family in a living room.

| Tile | Badge | Text |
|---|---|---|
| All-Fi Hub | INCLUDED WITH FIBER | "Comes with every AT&T Fiber plan, and the bill shows no monthly equipment charge for it." |
| All-Fi Pro (Wi-Fi 7) | MULTI-GIG TIERS | "The Wi-Fi 7 gateway AT&T sends out with its multi-gig Fiber tiers." |
| All-Fi Extenders | WHOLE-HOME MESH | "Mesh units that stretch the gateway's Wi-Fi to rooms beyond the hub's range." |
| AT&T ActiveArmor | INCLUDED | "Network-level security from AT&T, part of eligible internet plans with nothing added to the monthly bill." |
| ActiveArmor Advanced | **$7/MO** | "Puts a VPN and identity monitoring on top of the standard ActiveArmor protection." |
| Unlimited home data | INCLUDED | "Home plans on AT&T Fiber and Internet Air are not metered." |

Bar: "Equipment and ActiveArmor are added by phone: (877) 365-2069" + "Call (877) 365-2069".

### 0:85–0:90 · Terms table (f_0086–f_0091)

Eyebrow "TERMS"; H2 "AT&T Fiber terms in one table"; intro "Laid out like the FCC Broadband Facts label. The figures are AT&T's published national terms, and the quote for your address is confirmed on the call before anything is ordered."

| Plan detail | Internet 300 | Internet 500 | Internet 1000 | 5 Gig |
|---|---|---|---|---|
| Monthly price with Auto Pay | $50.00 | $60.00 | $70.00 | $110.00 |
| With eligible AT&T wireless | $35.00 | $45.00 | $50.00 | $85.00 |
| Price after 12 months | $50.00 | $65.00 | $80.00 | $125.00 |
| Download (typical) | 300 Mbps | 500 Mbps | 1000 Mbps | 5000 Mbps |
| Upload (typical) | 300 Mbps | 500 Mbps | 1000 Mbps | 5000 Mbps |
| Monthly data limit | None | None | None | None |
| Gateway charge per month | Included | Included | Included | Included |
| Self-setup kit | $0 | $0 | $0 | $0 |
| Technician install | $99 | $99 | $99 | $99 |
| Contract term | None | None | None | None |

Footnotes (verbatim, f_0088/f_0090):
1. "Prices shown require Auto Pay & Paperless Billing and apply to new residential customers."
2. "AT&T Wireless prices are per line with 4 lines on the account, after the $10/mo per-line Auto Pay & Paperless discount ($5 with a debit card). After 5GB (Value 2.0) or 100GB (Extra 2.0) of data in a bill cycle, AT&T may slow data speeds when the network is busy; hotspot speeds slow to 128kbps after 3GB, 50GB or 100GB."
3. "All prices exclude taxes, fees and government surcharges, which are billed in addition to the monthly rate."
4. "Speeds are the plan provisioned rate. Actual throughput varies with in-home wiring, Wi-Fi conditions and device capability."
5. "Install method, install fee and reward-card offers vary by address and current promotion, and are confirmed before you order."
6. "Availability is address-specific. Coverage published by the FCC National Broadband Map is provider-reported and not address-level."

Link: "Read AT&T's Broadband Facts label →".

### 0:90–0:93 · Ordering here (f_0091–f_0094)

Eyebrow "ORDERING HERE"; H2 "What one call handles"; photo of three people in a grocery store. Cards:
- "Internet, wireless and home phone on one order" — "Fiber or Internet Air, wireless lines and AT&T Phone go in together rather than as separate orders."
- "The address checked before the price" — "The street address is checked against AT&T first; only then do you hear the monthly price and whether an AT&T wireless line lowers it. Nothing is submitted until you agree."
- "AT&T's published pricing" — "The rates you hear are the prices AT&T publishes, with no markup from us."
- "A sales agent who knows the tiers" — "The person on the line places AT&T residential orders and can weigh tiers, bundles and install methods with you." **(describes order-placement mechanics — not to be reproduced per the brief)**

### 0:93–0:97 · Order steps (f_0094–f_0098)

Eyebrow "ORDER STEPS"; H2 "Three steps, one phone call"; night-lights map of the US. Steps: (1) "Dial the order line" — "Sales agents answer the order line at (877) 365-2069. A call is not an order, so ask everything first." (2) "Your address against AT&T's coverage" — "On the same call we match the street address to the speeds AT&T can serve there and read out the price, any wireless discount you qualify for and any reward-card offer." (3) "AT&T installs and bills" — "Fiber means an AT&T technician appointment; Internet Air means a gateway shipped to your door for self-setup. From there AT&T bills and supports the service." CTA "Call (877) 365-2069" + "Call us Mon–Fri 8 AM–9 PM ET · Sat–Sun 9 AM–6 PM ET". **(steps 1–3 describe order mechanics; not reproduced)**

### 0:97–0:99 · FAQ (f_0098–f_0100)

Eyebrow "BEFORE YOU CALL"; H2 "What callers check first"; sub "Coverage, pricing, installation, contracts, equipment and support." Accordion questions:
1. "Has AT&T built fiber to my address?" (open) — "Not something a ZIP code or a city name can answer. AT&T qualifies Fiber per address, and the FCC National Broadband Map, which shows provider-reported coverage, is not address-level, so it cannot settle the question for one home. Give us the street address on the call and we tell you the plans AT&T will actually serve there."
2. "Am I on AT&T's website?"
3. "Are the prices tied to Auto Pay?"
4. "How is AT&T installed, and is there a fee?"
5. "Do I sign a contract?"
6. "Does a gateway come with it, and can I use my own router?"
7. "Can you help with an existing AT&T bill or outage?"

Answers 2–7 are collapsed in the recording (not visible). Closing panel: "Want the numbers first?" — "Ask for the address check and the full price; ordering is a separate decision." + "Call (877) 365-2069".

### 0:99–1:42 · Footer (f_0100–f_0102)

| Element | Exact text |
|---|---|
| Disclosure box | "Transtech Marketing Network LLC is an independent authorized retailer of AT&T services and is not AT&T Inc." / "AT&T, the Globe logo, AT&T Fiber, All-Fi and ActiveArmor are trademarks of AT&T Intellectual Property." |
| Company details | "Transtech Marketing Network LLC" · "70 Bagatelle Rd, Melville, NY 11747" · "(877) 365-2069 · Mon–Fri 8 AM–9 PM ET · Sat–Sun 9 AM–6 PM ET" · "admin@authorizedinternetretailer.net" |
| Support note | "Sales line for new service only; AT&T handles account, billing and outage support. Existing AT&T customers can reach AT&T at 1-800-288-2020." **(not reproduced: the brief forbids directing customers to AT&T)** |
| Legal & policies links | Privacy Policy · Terms & Conditions · Disclaimer · Cookie Notice · TCPA Consent · Trademark Attributions · Marketing Policy · Service & Fulfillment · Payment Security · Do Not Sell or Share My Personal Information |
| Copyright | "© 2026 Transtech Marketing Network LLC. All rights reserved." |
| Footer fine print | "AT&T Fiber prices shown are after a $10/mo Auto Pay & Paperless bill discount when Auto Pay uses a bank account or the AT&T Points Plus card ($5/mo with a debit card; starts within 2 bills). Internet 500, 1000 and 5 GIG prices also include a 12-month discount of $5, $10 or $15/mo (starts within 3 bills), after which the regular rate applies. Prices with AT&T wireless are after a further $15/mo (Internet 300 and 500), $20/mo (1 GIG) or $25/mo (5 GIG) discount with an eligible AT&T unlimited plan (starts within 3 bills). Prices and offers are set by AT&T and are subject to change." |

## Consolidated lists

**Plans and prices claimed in the video (all "as of Oct 2026", all must be verified on att.com):**
Fiber 300 $50 ($35 w/ wireless); Fiber 500 $60 for 12 mo then $65 ($45 w/ wireless); Fiber 1000 $70 for 12 mo then $80 ($50 w/ wireless); Fiber 5 Gig $110 for 12 mo then $125 ($85 w/ wireless); Internet Air $55 ($35 w/ wireless); Value 2.0 $30/line (4 lines), $50 single; Extra 2.0 $40/line, $70 single; Premium 2.0 $50/line, $90 single; ActiveArmor Advanced $7/mo; technician install $99; self-setup kit $0; bundle "20% off your monthly internet bill".

**Promos:** 12-month first-year discount on Fiber 500/1000/5 Gig; wireless-bundle internet discount; "Reward cards on select plans*" (no amount shown).

**Legal footnotes:** six terms-table footnotes + footer fine print (verbatim above); disclosure and trademark notice.

**CTAs:** "Call (877) 365-2069", "Search this ZIP", "Order this tier …", "Order Internet Air …", "Order this plan …", "Price the bundle …", "Add a home line …", "Read AT&T's Broadband Facts label →".

**Content deliberately not carried over:** "contact AT&T directly" / "reach AT&T at 1-800-288-2020" lines; descriptions of who places orders ("The person on the line places AT&T residential orders", order-step sequence); third-party photos (licensing unknown); the retailer's globe-style logo mark (resembles the AT&T globe; see OPEN_ITEMS.md).
