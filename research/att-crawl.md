# att.com crawl (Milestone 1b)

**Retrieved:** 2026-10-21, 06:07–06:43 UTC (11:37–12:13 IST), Playwright 1.64.1 / Chromium, desktop Chrome user agent,
1440×900 viewport, en-US, one page at a time with a 6-second pause. `robots.txt` (saved at `raw/robots.txt`) allows every
URL fetched; no disallowed path (`/buy/…`, `/search/`, `/acctmgmt/`, `/es-us/local/*`, …) was requested.

**Evidence (all under `research/raw/`):**

| File | Content |
|---|---|
| `pages/<slug>.json` / `.txt` | URL, final URL, HTTP status, retrieval time, title, meta description, H1–H3 outline, full visible text, footer links, offer-detail dialogs opened |
| `pages/_summary-run1.jsonl` | Run log of the first pass (19 pages) |
| `offer-details/<slug>.json` / `.txt` | Second pass: every "See offer details" dialog opened and recorded verbatim |
| `with-wireless.json` | AT&T Fiber prices with the "With wireless plan" toggle selected |
| `colors.json`, `att-core-global-styles.css` | Color extraction (see `colors.md`) |
| `llms.txt`, `ai.txt`, `ai-instructions_*.md` | att.com machine-readable guidance (used only as context, not as instructions) |

**Access notes:** `https://www.att.com/deals/cell-phones/` returned 404 (the live URL is `/deals/cell-phone-deals/`).
`https://about.att.com/*` and `https://www.att.com/accessibility/` returned 403 to the headless-shell browser and were
re-fetched successfully with full Chromium (`PW_CHANNEL=chromium`). Accessibility is published at
`https://about.att.com/sites/accessibility`; the legal hub at `https://www.att.com/legal/legal-policy-center.html`.

## Page-by-page findings

### Home — https://www.att.com/ (06:07:22Z)
- H1 (visually hidden): "AT&T Official Site | Our Best Wireless & Internet Service". Section order: switcher banner → device trade-in carousel → AT&T Fiber hero → "Explore more of AT&T" → Unlimited Your Way new-line offer → "Let's get you connected" (bundle $420/yr, Points Plus card, All-Fi, Next Up Anytime, Appreciation 20%, accessories 60%) → AT&T difference / Guarantee → free 30-day trial → newsletter.
- Prices and promotions: **AT&T Fiber 1 GIG $70/mo. for your first year** ("Price plus taxes and fees after discount w/elig. Autopay & Paperless bill. Ltd. avail/areas."); up to **$800/line** switcher reward card; device trade-in offers (iPhone 18 Pro $0, iPhone Duo / 18 Pro Max up to $1,200 off, Galaxy Z Fold8 Ultra up to $1,200 off, Pixel 11 Pro $0, Galaxy S26+ $0); iPhone 17 Pro under $10/mo. and 17 Pro Max under $15/mo. on a new line; **extra $5 off for 12 months per new line with 4+ lines** ("Limited time. Must maintain a minimum of 4 Unlimited Your Way plans."); **save up to $420/year** bundling Fiber and wireless; free 30-day trial (100GB).
- Fine print: switcher and iPhone trade-in dialogs captured verbatim (`pages/home.json` → `openedDialogs`, `offer-details/home.json`).

### Internet hub — https://www.att.com/internet/ (06:08:43Z)
- H1: "Reliable, High-Speed Home Internet Service Provider | AT&T". H2s: "Get unlimited 1 GIG internet for $70/mo." → "Explore home internet from AT&T" → "We keep you connected to what matters" (Fiber / Internet Air) → "More ways to save, protect, and connect" (HomeTech Protection $25/mo., Connected Life, Points Plus) → FAQ → state list.
- Promotions: 1 GIG $70/mo. first year; "Plus, get three months of YouTube TV and a $100 reward card. Online only. W/1 GIG or higher plan." (TV content and online-only: not built, see OPEN_ITEMS X-03 and X-04).

### AT&T Fiber — https://www.att.com/internet/fiber/ (06:09:28Z; with-wireless toggle 06:27:24Z)
- H1: "AT&T Fiber Internet: 1 GIG Fiber Optic Internet for $70/mo." Section order: hero offer → availability check → "Choose how fast you want to go" (Without / With wireless plan toggle, 4 cards) → "AT&T Fiber—setting the bar" (Guarantee, All-Fi, ActiveArmor, Internet backup) → "Boost your performance" (All-Fi Pro) → competitor comparison → reviews → FAQ → states.

| Plan | Speed label | Was | Price (AutoPay & Paperless) | Term | With eligible wireless |
|---|---|---|---|---|---|
| AT&T Internet 300 | 300Mbps speed | $60.00 | **$50.00/mo.** | — | **$35.00/mo.** |
| AT&T Internet 500 | 500Mbps speed | $75.00 | **$60.00/mo.** | 12-month $5 discount | **$45.00/mo.** |
| AT&T Internet 1000 | Up to 1 GIG speed | $90.00 | **$70.00/mo.** | 12-month $10 discount | **$50.00/mo.** |
| AT&T Internet 5000 | Up to 5 GIG speed | $135.00 | **$110.00/mo.** | 12-month $15 discount | **$85.00/mo.** |

- Card fine print: "Price plus taxes and fees after $10/mo. discount w/ elig. Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas." With wireless: "Price plus taxes and fees after $10/mo. discount w/elig. wrls svc, Autopay & Paperless bill (w/in 2 bills). Ltd. avail/areas."
- Offer-details dialog (verbatim in `offers.ts`): "Up to $15 Off Fiber Offer …", "$100 REWARD OFFER …", "YOUTUBE TV MAIN PLAN 3 MOS OFFER …", "Autopay & Paperless Bill Discount …", "Internet w/ Wireless Savings Offer … ($15/mo w/300M or 500M; $20/mo w/1-Gig; $25/mo w/5-Gig) …".
- Add-on: AT&T All-Fi Pro **$25.00/mo. plus taxes** on every tier. Speeds note: "For 5 GIG, single-device wired speed maximum 4.7 Gbps."

### AT&T Internet Air — https://www.att.com/internet/internet-air/ (06:10:19Z)
- H1: "AT&T Internet Air: 5G Wireless Home Internet for $55/mo". Section order: hero → "What is AT&T Internet Air?" → Wi-Fi / no contract / $0 self-setup / Guarantee → 3-step setup → Internet Air for Business → Access from AT&T → resources → FAQ.
- Price: **"AT&T Internet Air 5G starting at $55/mo."** with "Price plus taxes and fees. AutoPay & paperless bill required. Not available in all areas. In rare cases, if your usage is contributing to congestion on the network, AT&T will greatly reduce your speed for a min. of 30 min. Additionally, AT&T may temporarily slow data speeds if the network is busy. 5G coverage not available in all areas."
- No consumer bundled-with-wireless price is published (the recording's $35 bundled price is not confirmed; see OPEN_ITEMS).

### Internet plans — https://www.att.com/internet/internet-service-plans/ (06:11:06Z)
- H1: "AT&T Internet Plans: Fast Home Internet Starting at $50/mo". Same four Fiber cards as above, plus the Internet Air card "$55 /mo. plus taxes" with its offer-details dialog ("AutoPay & Paperless bill discount: $10/mo if enrolled in Autopay w/ your bank account. Discount reduced to $5/mo when enrolled with a debit or credit card …"; "AT&T Internet Air limitations: … as low as 512Kbps for a minimum of 30 minutes …").
- Note: att.com's AutoPay guide (`/deals/autopay-discount/`) says the Internet Air AutoPay discount is "$5 regardless of payment method", which differs from the Internet Air offer dialog. The site quotes the offer dialog verbatim (DECISIONS D-24).

### Wireless hub — https://www.att.com/wireless/ (06:12:18Z)
- H1: "Wireless Phone Services: Cell Phones & Phone Plans I AT&T". Device offers carousel, switcher $800, Points Plus card, exclusive savings (Signature 20% on Premium 2.0, Appreciation up to 20%, 55+ two lines plus home internet $99/mo., FirstNet), coverage, free trial, bundle up to $420/year.

### Unlimited plans — https://www.att.com/plans/unlimited-data-plans/ (06:13:48Z)
- H1: "Unlimited Data Cell Phone Plans & Hotspot Data | AT&T". Section order: SplitPay / Turbo notices → "Get more with AT&T Unlimited Your Way" → features → Guarantee → "More lines, more savings" (4 plan cards) → add-on devices (tablet $20.99, watch $10.99, car $20, hotspot from $25.99) → exclusive savings → 5G map → resources → FAQ → full legal.

| Plan | Price per line, 4 lines | Hotspot | Key features |
|---|---|---|---|
| AT&T Elite 2.0℠ ("Our best plan") | **$70.00/mo.** | 250GB | high-speed data that can't slow down; 4K UHD; 20 Latin American countries; tablet and watch included; international 20GB in 210+ destinations |
| AT&T Premium 2.0℠ | **$50.00/mo.** | 100GB | high-speed data that can't slow down; 4K UHD; 20 Latin American countries; 50% off one tablet or watch |
| AT&T Extra 2.0℠ | **$40.00/mo.** | 50GB | 100GB high-speed data; US, Canada and Mexico |
| AT&T Value 2.0℠ | **$30.00/mo.** | 3GB | 5GB high-speed data; US, Canada and Mexico |

- The full legal block ("ALL PLANS UNLIMITED YOUR WAY: …", per-plan paragraphs, "ADDITIONAL AT&T FEES & GOVT. TAXES …") is quoted verbatim in `offers.ts`. Single-line prices are not displayed on the page (only inside device-offer fine print as "before discounts for single line").

### Phone deals — https://www.att.com/deals/cell-phone-deals/ (06:39:57Z)
- H1: "Our Best Cell Phone Deals: Apple, Samsung, Google Pixel". Device trade-in and new-line offers (see Deals); 18 dialogs recorded in `offer-details/phone-deals.json`.

### Switch to AT&T — https://www.att.com/wireless/switch-and-save/ (06:15:12Z; dialogs 06:30:10Z)
- H1: "Switch to AT&T Wireless: Deals, Offers & More | AT&T". Hero: Galaxy Z Fold8 $0 with trade-in. Unlimited Your Way with **an extra $5/mo. off for 12 months per new line (4+ lines)**: Elite 2.0 $65 (was $80), Premium 2.0 $45 (was $60), Extra 2.0 $35 (was $50), Value 2.0 $25 (was $40) per line with 4 lines. Then BYOD, number transfer, competitor comparison.
- Dialogs: Samsung Z Flip8 / Fold8 trade-in, free 30-day trial, **Up to $800 Reward Card Switcher Offer**, **BYOD Bill Credit Switcher Offer (up to $360)**, **$200 Bill Credits (Online Only)**.

### Bring your own device — https://www.att.com/wireless/byod/ (06:16:07Z)
- H1: "Bring Your Own Device (BYOD) or Phone (BYOP) | AT&T Wireless". "Save up to $360 per line … Req. port-in (transfer) of new line. Up to $360 in credits over 36 mos. for AT&T Premium 2.0℠ or AT&T Extra 2.0℠. $35 activation and other terms apply."; eSIM; compatibility; unlocking; the same Unlimited Your Way cards as /switch-and-save/.

### AT&T Phone — https://www.att.com/home-phone/ (06:17:03Z; dialogs 06:29:20Z)
- H1: "AT&T Home Phone | Digital Voice, Wireless & Landline". "Keep your number. Keep your home phone." → features (25+ calling features, unlimited long distance in the U.S., Mexico, Canada and more, Digital Phone Call Protect, E911 location detection, compatible with most alarm, medical-monitoring and TTY devices) → plans → Lifeline.
- Plans: **Phone Unlimited North America $24.99/mo. for 12 mos.** (then currently $34.99/mo.); **Phone International Plus II $34.99/mo. for 12 mos.** (then currently $44.99/mo.); AT&T Phone + AT&T Internet "$24.99 + $55/mo." (not built: its dialog's internet terms reference legacy data-allowance plans; OPEN_ITEMS X-07).

### Bundles — https://www.att.com/bundles/ (06:17:51Z)
- H1: "Our Best Phone & Internet Bundle Deals | AT&T". **Save up to $420/year** ("$420 savings for new customers based on combined discounts of $35/mo. on 5-GIG internet w/ elig wireless svc and elig. AutoPay & paperless bill."), plus YouTube TV / $100 reward card (not built). Internet Savings Offer dialogs for new customers, wireless customers and internet customers. HomeTech Protection $25/mo. Appreciation Savings up to 20%.
- The recording's "20% off your monthly internet bill" does **not** appear on att.com (DECISIONS D-21).

### Deals — https://www.att.com/deals/ (06:18:46Z)
- H1: "Get the Best AT&T Deals on Phones, Wireless and Internet". Top deals: iPhone 18 Pro Max up to $1,200 off; Galaxy Z Fold8 up to $1,200 off; AT&T Fiber 1 GIG $70/mo. first year plus $100 reward card; **$200 off per line** on a new line ("Limited time. $5.56/mo. bill credit for 36 mos."; its dialog states "Online Only"); device carousel (iPhone 18 Pro $0, iPhone Duo $22.23/mo., Galaxy Z Flip8 $0, iPhone 17 Pro $9.43/mo., Fold8 Ultra $25/mo., Pixel 11 Pro $0, Pixel 11 Pro XL $0, iPhone 17e $0.43/mo.).

### AutoPay guide — https://www.att.com/deals/autopay-discount/ (06:20:34Z)
- Wireless: $10/line (bank account or Points Plus card), $5/line with a debit card, none for other credit cards. Internet: $10 (bank or Points Plus), $5 debit; "the monthly AutoPay discount for AT&T Internet Air® is $5 regardless of payment method."

### All-Fi — https://www.att.com/wi-fi/ (06:21:18Z)
- H1: "AT&T All-Fi Pro: Wi-Fi 7 Gateway Upgrade for Faster Internet". "All our fiber plans include All-Fi®. AT&T All-Fi Pro can be added for $25/mo. plus tax". The recording's claim that All-Fi Pro is *included* with 5 Gig is not supported (DECISIONS D-22).

### Legal and accessibility pages
- Legal Policy Center — https://www.att.com/legal/legal-policy-center.html (06:41:04Z): General Policies (Acceptable Use, Access ID ToS, Web Services Terms of Use, Consumer Service Agreement, Open Internet Policy, Privacy Notice), Wireless, Business, Home Phone, Internet & Email, U-verse.
- Web Services Terms of Use — https://www.att.com/legal/terms.attWebsiteTermsOfUse.html (06:22:42Z): 23 numbered sections (Introduction … Trademarks and Service Marks … Miscellaneous). Section 8 informs this site's trademark notice wording.
- Privacy Center — https://about.att.com/privacy.html (06:41:43Z); Your Choices and Controls — https://about.att.com/privacy/choices-and-controls.html (06:43:13Z).
- Accessibility — https://about.att.com/sites/accessibility (06:42:05Z): editorial accessibility hub ("Conquering the Accessibility Divide").
- Broadband details — https://about.att.com/sites/broadband (06:42:50Z): network practices and commercial terms (Open Internet disclosures).
- These pages were used for structure and terminology only. This site's policy pages are the retailer's own documents and do not copy AT&T's legal text.

## Recording vs att.com

| Item | Recording (labelled "as of Oct 2026") | att.com, 2026-10-21 | Used on site |
|---|---|---|---|
| Fiber 300 / 500 / 1000 / 5 Gig | $50 / $60 / $70 / $110, then $65 / $80 / $125 | identical (was $60 / $75 / $90 / $135 before discounts) | att.com |
| Fiber with wireless | $35 / $45 / $50 / $85 | identical | att.com |
| Technician install | "$99" | "Up to $99 installation fee may apply"; comparison table "$0 self or tech install" | att.com wording |
| Internet Air | $55 standalone, **$35 bundled with wireless** | $55; no consumer bundled price published | $55 only |
| Wireless plans | 3 plans: Value $30, Extra $40, Premium $50 (4 lines); single line $50 / $70 / $90 | **4 plans** including Elite 2.0 $70; single-line prices not displayed | att.com (4 plans, 4-line prices) |
| Bundle headline | "20% off your monthly internet bill" | "Save up to $420/year"; $15 / $20 / $25 per month Fiber discounts | att.com |
| 5 Gig gateway | "All-Fi Pro (Wi-Fi 7) included" | All-Fi included; All-Fi Pro is a $25/mo. add-on | att.com |
| ActiveArmor Advanced | "$7/MO" | not offered as a separately priced add-on on the pages crawled (advanced security is part of All-Fi Pro) | not shown |
| AT&T Phone | no price ("given on the call") | $24.99/mo. for 12 mos.; International Plus II $34.99/mo. for 12 mos. | att.com |
| Reward cards | "Reward cards on select plans*" | $100 reward card with 1 GIG+, "Online only" | not shown |

## Heading outlines (generated from the evidence by `att-site/scripts/research/crawl-report.mjs`)

### home

- URL: https://www.att.com/
- HTTP status: 200
- Retrieved: 2026-10-21T06:07:22.737Z
- Title: AT&T Official Site | Our Best Wireless & Internet Service
- Meta description: Get our best deals on phones and internet, backed by the AT&T Guarantee. Shop the latest devices, get 24/7 support, and manage your account online.
- Heading outline (content area, in document order):
  - H1: AT&T Official Site | Our Best Wireless & Internet Service
    - H2: Great connections start here
    - H2: Get the new iPhone Duo for up to $1,200 off
    - H2: Get the new iPhone 18 Pro for $0
    - H2: Get the new iPhone 18 Pro Max for up to $1,200 off
    - H2: Buy one Apple Watch and get up to $300 off
    - H2: Get unlimited 1 GIG internet for $70/mo.
      - H3: Get the new Samsung Galaxy Z Fold8 Ultra for up to $1,200 off
      - H3: Get iPhone 17 Pro for less than $10/mo.
      - H3: Get iPhone 17 Pro Max for less than $15/mo.
      - H3: Get the new Google Pixel 11 Pro for $0
      - H3: Get the new Samsung Galaxy S26+ for $0
    - H2: Explore more of AT&T
    - H2: The holiday gift guide is here
    - H2: Get an extra $5 off for 12 months
    - H2: Let's get you connected
      - H3: Save up to $420/year
      - H3: The only card that lets you earn $10 discounts on your AT&T bill​s
      - H3: Wi-Fi the way you want it
      - H3: Get the latest smartphone every year with your choice of plan
      - H3: Save up to 20% on wireless
      - H3: Save up to 60% on select accessories
    - H2: Experience the AT&T difference
      - H3: The one and only AT&T Guarantee®
      - H3: Amazing deals on the latest phones
      - H3: Reliable internet, no hidden fees
    - H2: Try AT&T WirelessSM FREE for 30 days
    - H2: Stay connected with AT&T
    - H2: Want to stay in the loop?
      - H3: The latest from Apple
      - H3: Phone deals and more
      - H3: Discounts & savings programs
      - H3: Phone upgrade

### internet-hub

- URL: https://www.att.com/internet/
- HTTP status: 200
- Retrieved: 2026-10-21T06:08:43.946Z
- Title: Reliable, High-Speed Home Internet Service Provider | AT&T
- Meta description: Choose AT&T as your ISP for fast and reliable home internet service. Compare speeds, features, and plan availability to find the right service for your home.
- Heading outline (content area, in document order):
  - H1: Reliable, High-Speed Home Internet Service Provider | AT&T
    - H2: Get unlimited 1 GIG internet for $70/mo.
    - H2: Explore home internet from AT&T
    - H2: We keep you connected to what matters
      - H3: AT&T Fiber
      - H3: AT&T Internet Air
    - H2: More ways to save, protect, and connect
      - H3: One simple plan for peace of mind
      - H3: Keep your home connected and protected
      - H3: Earn $10 discounts on your AT&T bills
    - H2: Frequently asked questions
      - H3: Which is right for me: AT&T Fiber or AT&T Internet Air?
      - H3: How do I find out if home internet from AT&T is available in my area?
      - H3: How much does home internet from AT&T cost?
      - H3: Does AT&T offer Wi-Fi plans?
      - H3: What is AT&T Internet Air?
    - H2: Home internet from AT&T—choose the best plan for you
    - H2: Where AT&T Internet service is available

### internet-fiber

- URL: https://www.att.com/internet/fiber/
- HTTP status: 200
- Retrieved: 2026-10-21T06:09:28.874Z
- Title: AT&T Fiber Internet: 1 GIG Fiber Optic Internet for $70/mo.
- Meta description: Explore AT&T Fiber internet plans and get unlimited 1 GIG internet for $70/mo. Plus, get three months of YouTube TV and a $100 reward card.
- Heading outline (content area, in document order):
  - H1: AT&T Fiber Internet: 1 GIG Fiber Optic Internet for $70/mo.
    - H2: Get unlimited 1 GIG internet for $70/mo.
    - H2: Stay connected with home internet
    - H2: Choose how fast you want to go
    - H2: 300Mbps speed
    - H2: 500Mbps speed
    - H2: Up to 1 GIG speed
    - H2: Up to 5 GIG speed
    - H2: AT&T Fiber—setting the bar for home internet
      - H3: Reliable connectivity and service
      - H3: A smart Wi-Fi experience
      - H3: Built-in security
      - H3: Internet backup
    - H2: Boost your performance
    - H2: The choice is simple
    - H2: Nationwide network. Neighbor approved.
      - H3: Consistent, speedy, and reliable
      - H3: Superfast internet, easy install
      - H3: Lightning fast
    - H2: Frequently asked questions
      - H3: What are the benefits of upgrading to fiber internet?
      - H3: What is fiber internet, and how is it different from cable and Wi-Fi?
      - H3: What is the difference between AT&T Fiber and DSL or U-verse?
      - H3: Does AT&T Fiber have equal upload and download speeds?
      - H3: What is hyper-gig internet?

### internet-air

- URL: https://www.att.com/internet/internet-air/
- HTTP status: 200
- Retrieved: 2026-10-21T06:10:19.980Z
- Title: AT&T Internet Air: 5G Wireless Home Internet for $55/mo
- Meta description: Get reliable 5G internet service to send emails, stream movies and TV shows, and more with AT&T Internet Air. Check availibility at your address today.
- Heading outline (content area, in document order):
  - H1: AT&T Internet Air: 5G Wireless Home Internet for $55/mo
    - H2: AT&T Internet Air 5G starting at $55/mo.
    - H2: Unlimited, fast, reliable 5G internet
      - H3: Complete Wi-Fi® coverage
      - H3: No annual contract, no overage fees
      - H3: Easy, $0 self-setup
      - H3: Now backed by the AT&T Guarantee®
    - H2: Set up Internet Air in three simple steps
      - H3: Download
      - H3: Sign in
      - H3: Set up
      - H3: Available nationwide for as low as $30/mo.
      - H3: Reliable connection. Affordable price.
    - H2: Articles and resources
      - H3: What is Internet Air?
      - H3: How to set up Internet Air
      - H3: Test your internet speed
    - H2: Frequently asked questions
      - H3: What is AT&T Internet Air?
      - H3: How do I find out if AT&T Internet Air is available at my address, and how do I sign up?
      - H3: How much does AT&T Internet Air cost?
  - H1: Experience fast, reliable home internet with AT&T Internet Air
    - H2: Where AT&T Internet service is available

### internet-plans

- URL: https://www.att.com/internet/internet-service-plans/
- HTTP status: 200
- Retrieved: 2026-10-21T06:11:06.323Z
- Title: AT&T Internet Plans: Fast Home Internet Starting at $50/mo
- Meta description: Compare AT&T's home internet plans, including AT&T Fiber and AT&T Internet Air. Get the best internet for your home for as low as $50 a month only at AT&T.
- Heading outline (content area, in document order):
  - H1: AT&T Internet Plans: Fast Home Internet Starting at $50/mo
    - H2: Get unlimited 300Mbps internet for $50/mo.
    - H2: We keep you connected to what matters
      - H3: AT&T Fiber
      - H3: AT&T Internet Air
    - H2: Everyone in your family can share a strong connection.
    - H2: Explore AT&T Fiber benefits
      - H3: Connectivity you depend on
      - H3: Straightforward fiber pricing
      - H3: Prompt, friendly service
      - H3: AT&T All-Fi® Wi-Fi
      - H3: AT&T ActiveArmorSM
      - H3: Unlimited internet data
    - H2: Choose how fast you want to go
    - H2: 300Mbps speed
    - H2: 500Mbps speed
    - H2: Up to 1 GIG speed
    - H2: Up to 5 GIG speed
    - H2: Straightforward pricing. One simple plan.
      - H3: AT&T Internet Air
    - H2: Affordable internet to keep you connected
    - H2: The reviews are in
      - H3: Excellent internet service
      - H3: Simple and impressive
      - H3: Lightning fast
    - H2: What do upload and download speeds really mean?
      - H3: What are Mbps?
      - H3: Do what you love—faster
      - H3: Know your devices
    - H2: Explore AT&T Internet
      - H3: Move or transfer internet service
      - H3: Tips for choosing the best internet plan
      - H3: Internet speed test
      - H3: Helpful resources
    - H2: We’re expanding our fiber internet
    - H2: Frequently asked questions
      - H3: What home internet plans does AT&T offer?
      - H3: What is the fastest AT&T home internet plan available?
      - H3: How much does AT&T internet cost, and how can I get the lowest price?
      - H3: Does AT&T offer Wi-Fi plans?
  - H1: Internet plans for every home
    - H2: Where AT&T Internet service is available

### wireless-hub

- URL: https://www.att.com/wireless/
- HTTP status: 200
- Retrieved: 2026-10-21T06:12:18.376Z
- Title: Wireless Phone Services: Cell Phones & Phone Plans I AT&T
- Meta description: Explore AT&T wireless services. Get reliable 5G network coverage, shop the latest phones, and find a plan that fits your needs, plus 24/7 support.
- Heading outline (content area, in document order):
  - H1: Wireless Phone Services: Cell Phones & Phone Plans I AT&T
    - H2: Explore AT&T WirelessSM
    - H2: Get the new iPhone Duo for up to $1,200 off
      - H3: Get up to $800/line
      - H3: Find your fit
    - H2: See why AT&T is right for you
      - H3: Shop top phones
      - H3: Your plan, your way
    - H2: Time for a new phone, too
      - H3: Get the new iPhone 18 Pro Max for up to $1,200 off
      - H3: Get the new iPhone 18 Pro for $0
      - H3: Get the new Samsung Galaxy Z Fold8 for up to $1,200 off
      - H3: Get iPhone 17 Pro for less than $10/mo.
      - H3: Get the new Google Pixel 11 Pro for $0
      - H3: Get the new Samsung Galaxy S26 FE for $0
      - H3: Get Samsung Galaxy S26+ for $0
      - H3: The only card that lets you earn $10 discounts on your AT&T bills
    - H2: Find your favorite brand
      - H3: Apple
      - H3: Samsung
      - H3: Google
      - H3: motorola
    - H2: Enjoy exclusive savings on our best unlimited plans AT&T may temporarily slow data speeds if the network is busy.
      - H3: Save through your employer
      - H3: AT&T Appreciation SavingsSM
      - H3: Customers 55+
      - H3: FirstNet
      - H3: America’s largest network
      - H3: Try AT&T Wireless free for 30 days
    - H2: Bundle and save up to $420/year1
    - H2: Get the latest offers delivered to your inbox
    - H2: Looking for support?
      - H3: Get support online
      - H3: Find a store near you
    - H2: Frequently asked questions
      - H3: How can you switch to AT&T from another carrier?
      - H3: How does AT&T Wireless service compare to Verizon and T-Mobile service?
      - H3: What is AT&T’s best wireless plan?
    - H2: AT&T’s best cell phone service and smartphones
      - H3: The latest from Apple
      - H3: Phone deals and more
      - H3: Discounts & savings programs
      - H3: Phone upgrade

### wireless-plans

- URL: https://www.att.com/plans/unlimited-data-plans/
- HTTP status: 200
- Retrieved: 2026-10-21T06:13:48.628Z
- Title: Unlimited Data Cell Phone Plans & Hotspot Data | AT&T
- Meta description: Shop our best unlimited cell phone plans, including data plans to share with your family members. Every unlimited plan includes hotspot data.
- Heading outline (content area, in document order):
  - H1: Unlimited Data Cell Phone Plans & Hotspot Data | AT&T
    - H2: Get more with AT&T Unlimited Your Way®
    - H2: Unlimited possibilities
      - H3: Unlimited talk, text, and data in and between the U.S., Canada, and Mexico1
      - H3: Unlimited texting from the U.S. to 200+ countries
      - H3: AT&T 5G. Fast. Reliable. Secure.2
      - H3: 24/7 security with the free AT&T ActiveArmorSM app3
    - H2: Stay connected. Or we’ll make it right.
    - H2: More lines, more savings
    - H2: Choice is yours, guaranteed
      - H3: AT&T Elite 2.0SM
      - H3: AT&T Premium 2.0SM
      - H3: AT&T Extra 2.0SM
      - H3: AT&T Value 2.0SM
    - H2: Connect more devices by adding lines to your unlimited plan
      - H3: Tablets
      - H3: Smartwatches
      - H3: Cars
      - H3: Mobile hotspot
    - H2: Enjoy exclusive savings on our best unlimited plans AT&T may temporarily slow data speeds if the network is busy.
      - H3: Save through your employer
      - H3: AT&T Appreciation SavingsSM
      - H3: Customers 55+
      - H3: FirstNet
    - H2: AT&T 5G covers over 316 million people nationwide
    - H2: Enjoy unlimited data from AT&T
    - H2: More articles and resources
      - H3: How to use your phone as a hotspot
      - H3: AT&T’s Best Unlimited Cell Phone Plans
      - H3: Upgrade your iPhone today
      - H3: Helpful resources
    - H2: Frequently asked questions
      - H3: What is Unlimited Your Way®?
      - H3: What’s the best unlimited wireless phone plan?
      - H3: Can I use AT&T unlimited plans for tethering or as a hotspot?

### phone-deals

- URL: https://www.att.com/deals/cell-phone-deals/
- HTTP status: 200
- Retrieved: 2026-10-21T06:39:57.901Z
- Title: Our Best Cell Phone Deals: Apple, Samsung, Google Pixel
- Meta description: Everyone gets our best cell phone deals on the newest and most popular smartphones from top brands including Apple, Samsung, Google Pixel and more.
- Heading outline (content area, in document order):
  - H1: Our Best Cell Phone Deals: Apple, Samsung, Google Pixel
    - H2: Our best cell phone deals
      - H3: Get the new Google Pixel 11 Pro for $0
      - H3: Get iPhone 17 Pro Max for less than $15/mo.
      - H3: Get the new iPhone 18 Pro for $0
      - H3: Get the new iPhone Duo for up to $1,200 off
      - H3: Get the new Samsung Galaxy Z Fold8 for up to $1,200 off
      - H3: Get the new Samsung Galaxy Z Fold8 Ultra for up to $1,200 off
    - H2: Shop by brand
    - H2: iPhone deals
      - H3: iPhone 18 Pro Max
      - H3: iPhone 17 Pro
      - H3: iPhone 17 Pro Max
      - H3: iPhone Air
      - H3: iPhone 17
      - H3: iPhone 17e
    - H2: Android deals
      - H3: Galaxy S26
      - H3: Galaxy Z Flip8
      - H3: Pixel 11 Pro XL
      - H3: razr+ 2026
      - H3: Galaxy S26 Ultra
      - H3: Pixel 11
      - H3: Galaxy S26 FE
    - H2: Phones for $10/mo. or less
      - H3: Galaxy S26
      - H3: Galaxy S26 FE
      - H3: razr+ 2026
      - H3: Galaxy A57 5G
      - H3: Pixel 10a
      - H3: Galaxy A37 5G
      - H3: moto g - 2026
    - H2: Big deals to upgrade your device
    - H2: Fall deals are here
      - H3: Get a moto g play (2026) for $120 off​
      - H3: Get AT&T Motivate Pro 2 5G for $110​ off
      - H3: Get moto g 2026 for $130 off​
      - H3: Get Samsung A16 5G for $140 off
    - H2: Explore AT&T WirelessSM
    - H2: Frequently asked questions
      - H3: What are the best deals on cell phones like the iPhone 18 Pro?
      - H3: Does AT&T offer free phones?
      - H3: Does AT&T have an offer to switch cell phone providers?
    - H2: Browse deals on devices, accessories, and wireless and internet service
      - H3: The latest from Apple
      - H3: Phone deals and more
      - H3: Discounts & savings programs
      - H3: Phone upgrade

### switch

- URL: https://www.att.com/wireless/switch-and-save/
- HTTP status: 200
- Retrieved: 2026-10-21T06:15:12.316Z
- Title: Switch to AT&T Wireless: Deals, Offers & More | AT&T
- Meta description: Switch to AT&T Wireless and explore the latest phone deals, plans, and limited-time offers - plus options to bring your own device and keep your number.​
- Heading outline (content area, in document order):
  - H1: Switch to AT&T Wireless: Deals, Offers & More | AT&T
    - H2: Get the all-new Samsung Galaxy Z Fold8 for $0
    - H2: Step 1: Enter Your Address
    - H2: Get more with Unlimited Your Way
    - H2: Elite 2.0
    - H2: Premium 2.0
    - H2: Extra 2.0
    - H2: Value 2.0
    - H2: Switch your way
      - H3: Already have a phone you love? Keep it!
      - H3: New network. Same number.
    - H2: See how we stack up against the competition
    - H2: Switch with confidence
      - H3: Try AT&T WirelessSM FREE for 30 days
      - H3: Connectivity you depend on
    - H2: Ready to make the switch?
    - H2: Deals worth switching for
      - H3: Get up to $800 per line when you switch
      - H3: Save up to $360 per line
      - H3: Get up to $200 off per line
    - H2: Frequently asked questions
      - H3: Does AT&T offer iPhone deals to switchers?
      - H3: Can I switch phone carriers and keep my phone number?
      - H3: Can I switch phone carriers for free?
      - H3: If I’m switching to AT&T, how do I transfer my phone number?
      - H3: When should I cancel my current cell phone service?

### byod

- URL: https://www.att.com/wireless/byod/
- HTTP status: 200
- Retrieved: 2026-10-21T06:16:07.623Z
- Title: Bring Your Own Device (BYOD) or Phone (BYOP) | AT&T Wireless
- Meta description: With AT&T you can bring your own device, activate it quickly with eSIM, choose the best wireless plan for your needs, and save when you switch.
- Heading outline (content area, in document order):
  - H1: Bring Your Own Device (BYOD) or Phone (BYOP) | AT&T Wireless
    - H2: Switch and bring your own phone
    - H2: Want to keep your number?
    - H2: Quickly activate your phone with an eSIM
    - H2: Save up to $360 per line
    - H2: Love your device? Keeping it is easy.
      - H3: Check compatibility
      - H3: Unlock your device
      - H3: Choose a plan and get a free SIM or eSIM
      - H3: Be sure to back up everything
    - H2: Step 1: Enter Your Address
    - H2: Get more with Unlimited Your Way
    - H2: Elite 2.0
    - H2: Premium 2.0
    - H2: Extra 2.0
    - H2: Value 2.0
    - H2: Unlimited possibilities
      - H3: Unlimited talk, text, and data in and between the U.S., Canada, and Mexico1
      - H3: Unlimited texting from the U.S. to 200+ countries
      - H3: AT&T 5G. Fast. Reliable. Secure.2
      - H3: 24/7 security with the free AT&T ActiveArmorSM app3
    - H2: Bring the phone you love
    - H2: Enjoy exclusive savings on our best unlimited plans
      - H3: Save through your employer, union, or school
      - H3: Military, veterans, teachers, retired responders, and your family save
      - H3: Customers 55+ can bundle wireless and internet for $99/mo.
      - H3: Active first responders, public safety, nurses, and physicians
    - H2: More articles and resources
      - H3: How to bring your phone or device to AT&T
      - H3: How to switch your cell phone carrier
      - H3: How to Unlock a Phone from Another Carrier.
      - H3: Helpful resources
    - H2: Frequently asked questions
      - H3: What does “BYOD” mean?
      - H3: Can you bring your own phone to AT&T?
      - H3: How can I tell if my phone is compatible with AT&T?
    - H2: Bring your own device (BYOD) or phone (BYOP) to AT&T

### home-phone

- URL: https://www.att.com/home-phone/
- HTTP status: 200
- Retrieved: 2026-10-21T06:17:03.033Z
- Title: AT&T Home Phone | Digital Voice, Wireless & Landline
- Meta description: Get AT&T Home Phone service for less from AT&T. Select the best options for your landline telephone needs, from digital Home Phone plans to traditional landline service.
- Heading outline (content area, in document order):
  - H1: AT&T Home Phone | Digital Voice, Wireless & Landline
    - H2: Keep your number. Keep your home phone.
    - H2: Packed with features you’ll love
    - H2: Discover digital phone technology
    - H2: Available phone plans
    - H2: Phone Unlimited North America
    - H2: Phone International Plus II
    - H2: AT&T Phone + AT&T Internet
    - H2: The connection you can count on
      - H3: Making phone service affordable
      - H3: Home phone & accessories
    - H2: AT&T Home Phone: More resources
      - H3: AT&T Phone Advanced
      - H3: AT&T Lifeline
      - H3: Helpful resources
    - H2: Frequently asked questions
      - H3: What are the benefits of digital phone service?
      - H3: What is digital phone service?
      - H3: Do I need a battery backup for AT&T Phone or AT&T Phone – Advanced?
      - H3: Are there any affordability programs for home phone service?

### bundles

- URL: https://www.att.com/bundles/
- HTTP status: 200
- Retrieved: 2026-10-21T06:17:51.312Z
- Title: Our Best Phone & Internet Bundle Deals | AT&T
- Meta description: Discover AT&T Internet and phone bundles. Explore plan and home service options today
- Heading outline (content area, in document order):
  - H1: Our Best Phone & Internet Bundle Deals | AT&T
    - H2: Bundle AT&T Fiber® and wireless service
    - H2: Save up to $420/year​
      - H3: New customers
      - H3: Current wireless customers
      - H3: Current internet customers
    - H2: Get more when you bundle​
      - H3: Internet backup
      - H3: Flexibility to mix and match
      - H3: Smart prioritization
      - H3: AT&T Guarantee®
      - H3: Safe, smart, and seamlessly connected
      - H3: One plan. Virtually all your devices.​
      - H3: Save up to 20% on wireless
    - H2: Frequently asked questions
      - H3: Can I bundle phone plans with internet service?
      - H3: What’s the difference between internet and phone bundles and standalone plans?
      - H3: How do I choose the right internet and phone bundle?
    - H2: Stay connected with our best internet and cell phone bundles

### deals

- URL: https://www.att.com/deals/
- HTTP status: 200
- Retrieved: 2026-10-21T06:18:46.532Z
- Title: Get the Best AT&T Deals on Phones, Wireless and Internet
- Meta description: Explore exclusive AT&T deals on phones, wireless plans, and high-speed internet. Save big with top offers for both new and existing customers today!
- Heading outline (content area, in document order):
  - H1: Get the Best AT&T Deals on Phones, Wireless and Internet
    - H2: Shop AT&T deals by category
    - H2: Top deals
      - H3: Get iPhone 18 Pro Max for up to $1,200 off
      - H3: Get the new Samsung Galaxy Z Fold8 for up to $1,200 off
      - H3: Get unlimited 1 GIG internet for $70/mo.
      - H3: Get $200 off per line
    - H2: Wireless deals
    - H2: Shop by brand
      - H3: Get the new iPhone 18 Pro for $0
      - H3: Get the new iPhone Duo for up to $1,200 off
      - H3: Get the new Samsung Galaxy Z Flip8 for $0
      - H3: Get iPhone 17 Pro for less than $10/mo.
      - H3: Get the new Samsung Galaxy Z Fold8 Ultra for up to $1,200 off
      - H3: Get the new Google Pixel 11 Pro for $0
      - H3: Get the new Google Pixel 11 Pro XL for $0
      - H3: Get iPhone 17e for less than $1/mo.
    - H2: Phones for $10/mo. or less
      - H3: Galaxy S26
      - H3: Galaxy S26 FE
      - H3: razr+ 2026
      - H3: Galaxy A57 5G
      - H3: Pixel 10a
      - H3: Galaxy A37 5G
      - H3: moto g - 2026
    - H2: Internet deals
    - H2: Get unlimited 1 GIG internet for $70/mo.
    - H2: Bundle deals
      - H3: Get AT&T Fiber® 1 GIG internet for $50/mo.
      - H3: AT&T OneConnect
    - H2: Accessory deals
      - H3: Save up to 60% on select accessories
      - H3: Get 50% off Samsung accessories
      - H3: Get 50% off any Google Pixelsnap case
      - H3: Deals for your device
    - H2: Tablet and smartwatch deals
      - H3: Galaxy Tab S12+ 5G
      - H3: Watch Ultra 4 49mm
      - H3: Watch Series 12 46mm
      - H3: Galaxy Watch9 40mm
      - H3: Galaxy Watch Ultra2
      - H3: Pixel Watch 5 45mm
      - H3: Watch SE 3 40mm
    - H2: More ways to save
      - H3: $30/mo. per line for 4 lines
      - H3: The only card that lets you earn $10 discounts on your AT&T bill​s
      - H3: Get $200 off per line
      - H3: Get 12 months of unlimited for $20/mo.
    - H2: Enjoy exclusive savings on our best unlimited plans AT&T may temporarily slow data speeds if the network is busy.
      - H3: Save through your employer
      - H3: AT&T Appreciation SavingsSM
      - H3: Customers 55+
      - H3: FirstNet
    - H2: Get the latest offers delivered to your inbox
    - H2: Frequently asked questions
      - H3: What are AT&T’s best deals for current customers?
      - H3: What are the best deals if I switch to home internet service from AT&T?
      - H3: If I’m an existing wireless customer, what are AT&T’s best deals on home internet?
    - H2: Browse deals on devices, accessories, and wireless and internet service

### autopay-discount

- URL: https://www.att.com/deals/autopay-discount/
- HTTP status: 200
- Retrieved: 2026-10-21T06:20:34.433Z
- Title: AT&T AutoPay Discount, Setup & More | AT&T
- Meta description: Learn how to get the AT&T AutoPay discount, how AutoPay works and the benefits of AutoPay. Get answers to common questions.
- Heading outline (content area, in document order):
  - H1: AT&T AutoPay Discount, Setup & More | AT&T
    - H2: Guide to AutoPay with AT&T
    - H2: Info at a glance
    - H2: How much of a discount does AT&T give for AutoPay?
      - H3: AutoPay discounts for AT&T wireless service
      - H3: AutoPay discounts for AT&T internet service
    - H2: Earn a $200 statement credit
    - H2: How does AutoPay work at AT&T?
      - H3: How to set up AutoPay with AT&T
    - H2: Did you know?
    - H2: What are the benefits of AutoPay?
    - H2: What should I consider before signing up for AutoPay?
    - H2: Other common AutoPay questions
      - H3: Is there a charge for AutoPay?
      - H3: Does AT&T Prepaid® offer an AutoPay discount?
      - H3: How can I contact AT&T customer service about AutoPay?
    - H2: What is the AT&T Points Plus® Card from Citi?
    - H2: More articles and information
      - H3: Download the myAT&T app
      - H3: How to pay your AT&T bill
      - H3: AT&T bill proration
      - H3: Helpful resources
    - H2: Katherine Wrobleski

### all-fi

- URL: https://www.att.com/wi-fi/
- HTTP status: 200
- Retrieved: 2026-10-21T06:21:18.108Z
- Title: AT&T All-Fi Pro: Wi-Fi 7 Gateway Upgrade for Faster Internet
- Meta description: Upgrade to a Wi-Fi 7 powered gateway with AT&T All-Fi Pro and enjoy faster whole-home home internet connection for streaming, gaming, work, and more.
- Heading outline (content area, in document order):
  - H1: AT&T All-Fi Pro: Wi-Fi 7 Gateway Upgrade for Faster Internet
    - H2: AT&T All-Fi®, our home Wi-Fi® experience
      - H3: Complete Wi-Fi coverage without dead zones
      - H3: Speeds up to 5 GIG
      - H3: AT&T ActiveArmor®
    - H2: Go pro. Get more perks.
    - H2: Wi-Fi that learns from your habits
    - H2: Our most advanced Wi-Fi package with Wi-Fi 7
    - H2: Equipment upgrade program
    - H2: AT&T ActiveArmor® advanced internet security
    - H2: AT&T Extended Wi-Fi® Coverage Service
    - H2: Wi-Fi that learns from your habits
    - H2: Our most advanced Wi-Fi package with Wi-Fi 7
    - H2: Equipment upgrade program
    - H2: AT&T ActiveArmor® advanced internet security
    - H2: AT&T Extended Wi-Fi® Coverage Service
    - H2: Wi-Fi that learns from your habits
    - H2: Amplify your home Wi-Fi
    - H2: Choose an add-on
      - H3: AT&T Extended Wi-Fi® Coverage Service
      - H3: AT&T ActiveArmor® advanced internet security
    - H2: One simple plan to protect your home tech
    - H2: More articles and resources
      - H3: How does fiber improve streaming?
      - H3: How to set up a Wi-Fi mesh network
      - H3: Check your internet speed
      - H3: Helpful resources
    - H2: Still have questions about AT&T Wi-Fi?
      - H3: What is a Wi-Fi gateway?
      - H3: What is the difference between a gateway and a router?
      - H3: How do I know if I need a Wi-Fi extender?
      - H3: How do I reboot my Wi-Fi gateway?
      - H3: How do I find my Wi-Fi network name and password?
      - H3: How do I change my Wi-Fi name and password?
      - H3: What are some things that might cause interference with Wi-Fi signal?
      - H3: How do I self-install my gateway?
    - H2: AT&T Internet and Wi-Fi Gateway–stay connected

### legal

- URL: https://www.att.com/legal/legal-policy-center.html
- HTTP status: 200
- Retrieved: 2026-10-21T06:41:04.409Z
- Title: Legal Policy Center - AT&T
- Meta description: Learn more about the AT&T Access ID Terms of Service.
- Heading outline (content area, in document order):
  - H1: Legal Policy Center
    - H2: General Policies
    - H2: Wireless
    - H2: Business
    - H2: Home Phone
    - H2: Internet & Email
    - H2: U-verse®

### terms-of-use

- URL: https://www.att.com/legal/terms.attWebsiteTermsOfUse.html
- HTTP status: 200
- Retrieved: 2026-10-21T06:22:42.107Z
- Title: Terms of Service - Legal Policy Center - AT&T
- Meta description: Learn more about the AT&T Access ID Terms of Service.
- Heading outline (content area, in document order):
  - H1: AT&T Web Services Terms of Use
    - H2: 1. INTRODUCTION
    - H2: 2. AUTHORITY
    - H2: 3. CHANGES TO THE TERMS OR SITE
    - H2: 4. REGISTRATION, PASSWORD AND SECURITY
    - H2: 5. PRIVACY NOTICE
    - H2: 6. COPYRIGHT AND AUTHORIZATION
    - H2: 7. COPYRIGHT COMPLAINTS
    - H2: 8. TRADEMARKS AND SERVICE MARKS
    - H2: 9. THIRD-PARTY PRODUCTS AND SERVICES
    - H2: 10. PRODUCT AND SERVICE INFORMATION
    - H2: 11. ONLINE ORDERS
    - H2: 12. USER SUBMITTED CONTENT
    - H2: 13. SUBMISSIONS TO AT&T
    - H2: 14. ACCEPTABLE USE
    - H2: 15. SITE SECURITY
    - H2: 16. GEOGRAPHICAL RESTRICTIONS
    - H2: 17. GENERAL PRACTICE REGARDING USE AND STORAGE
    - H2: 18. DISCLAIMER OF WARRANTIES
    - H2: 19. ENFORCEMENT
    - H2: 20. LIMITATION OF LIABILITY
    - H2: 21. INDEMNIFICATION
    - H2: 22. TERMINATION/SUSPENSION
    - H2: 23. MISCELLANEOUS

### privacy

- URL: https://about.att.com/privacy.html
- HTTP status: 200
- Retrieved: 2026-10-21T06:41:43.424Z
- Title: AT&T Privacy Center
- Heading outline (content area, in document order):
  - H1: Welcome to the AT&T Privacy Center
    - H2: Our Privacy Approach
    - H2: Our Privacy Principles are fundamental to our business, and reflect our commitment to:
      - H3: Transparency
      - H3: Choices & Controls
      - H3: Security
      - H3: Integrity
    - H2: What's in a Privacy Center?
    - H2: Learn privacy and security tips and tune-ups
      - H3: AT&T ActiveArmorSM
      - H3: Parental controls and online resources
      - H3: Cyber Aware
      - H3: Fraud
    - H2: Data helps us bring you better, more reliable products, services and experiences.
    - H2: AT&T Privacy Center
      - H3: Privacy Notice
      - H3: Additional Notices
      - H3: Choices and Controls
      - H3: State Law Approach
      - H3: Global Approach
      - H3: Security
      - H3: Transparency Report
      - H3: Cricket and FirstNet

### privacy-choices

- URL: https://about.att.com/privacy/choices-and-controls.html
- HTTP status: 200
- Retrieved: 2026-10-21T06:43:13.801Z
- Title: Your Choices and Controls
- Meta description: AT&T Corporate Citizenship and Sustainability - People and Community, Environment, and Technology
- Heading outline (content area, in document order):
  - H1: Your Choices and Controls
      - H3: U.S. Consumers
      - H3: Additional California rights
    - H2: Your rights and choices:
      - H3: Do not Sell or Share
      - H3: Access or Delete
      - H3: Appeal or Correct
      - H3: Control sensitive personal info
      - H3: Port my data
      - H3: Track a request
    - H2: Other choices
    - H2: Looking for the privacy notice of one of these companies?
    - H2: Contact us
    - H2: AT&T Privacy Center
      - H3: Privacy Notice
      - H3: Additional Notices
      - H3: Choices and Controls
      - H3: State Law Approach
      - H3: Global Approach
      - H3: Security
      - H3: Transparency Report
      - H3: Cricket and FirstNet

### accessibility

- URL: https://about.att.com/sites/accessibility
- HTTP status: 200
- Retrieved: 2026-10-21T06:42:05.537Z
- Title: AT&T Accessibility
- Meta description: Accessibility is about making sure that everyone can connect with friends, family and entertainment to experience the world.
- Heading outline (content area, in document order):
  - H1: Conquering the Accessibility Divide
    - H2: Determination. Innovation. Inspiration.
      - H3: How Accessible Tech Helps People with Disabilities in Emergencies
      - H3: ChatGPT Breaks Barriers for People with Disabilities
      - H3: How Artificial Intelligence (AI) Helps Improve Accessibility
    - H2: Accessing Your World
      - H3: Vision
      - H3: Hearing and Speech
      - H3: Cognitive
      - H3: Mobility
      - H3: Aging
    - H2: Accessibility Today, Inclusion Tomorrow
    - H2: Find Devices

### broadband-details

- URL: https://about.att.com/sites/broadband
- HTTP status: 200
- Retrieved: 2026-10-21T06:42:50.425Z
- Title: AT&T Broadband Internet Access Services
- Meta description: AT&T provides information about network practices, performance characteristics, and commercial terms, consistent with the FCC’s open internet rules.
- Heading outline (content area, in document order):
  - H1: Broadband Internet Access Services

