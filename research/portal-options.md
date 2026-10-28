# Live portal exploration: plans, options and carts (28 Oct 2026)

Read-only exploration of the AT&T partner portal with the documented test addresses, using the order
automation's new `list_plans` call and its quote mode (research/spoc-integration-plan.md). For every plan:
plans at the address (nothing added), then **Add**, the Options page as the portal shows it (with its own
pre-selections), explicit answers, and the cart on the "set-up complete" page. It stopped there: no personal
information, no Checkout, no credit check, no order. The portal carts were left to expire (30 minutes).
Screenshots and logs were kept outside git and deleted afterwards.

Redacted: no portal link, session id or cart id. Broadband Facts labels are public att.com pages (their
`taxationgeocode` is a tax-area code, not personal data). These results are copied exactly into
`att-site/tests/mocks/portal-fixtures.json`, which only the automated tests use.

Answers used: AutoPay discount taken (Dallas: declined, to price the other branch); paid add-ons declined
(Dallas Internet Air: Extended Wi-Fi taken, AutoPay declined: the "$77" combination); single-choice groups
taken.

## Summary

| Address | Plan (portal name) | Card price | Options groups | Cart with the answers used | Total |
|---|---|---|---|---|---|
| Atlanta | Internet 5000 (Fiber 5 GIG) | $125/mo. | autopay, equip, install | Internet 5000 (Fiber 5 GIG) $135.00; $15 off for 12 months -$15.00; YouTube TV 3 months Free with Fiber 1G+ (no amount); AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included | **$110.00** |
| Atlanta | Internet 1000 (Fiber 1 GIG) | $80/mo. | autopay, equip, install | Internet 1000 (Fiber 1 GIG) $90.00; $10 off for 12 months -$10.00; YouTube TV 3 months Free with Fiber 1G+ (no amount); AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included | **$70.00** |
| Atlanta | Internet 500 (Fiber 500) | $65/mo. | autopay, equip, install | Internet 500 (Fiber 500) $75.00; $5 off for 12 months -$5.00; AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included | **$60.00** |
| Atlanta | Internet 300 (Fiber 300) | $50/mo. | autopay, equip, install | Internet 300 (Fiber 300) $60.00; AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included | **$50.00** |
| Hicksville | AT&T Internet Air | $60/mo. | autopay, wifi_extender | AT&T Internet Air $65.00; AutoPay/Paperless Billing Discount -$10.00; AT&T All-Fi Hub Included | **$55.00** |
| Dallas | Internet 100 | $60/mo. | autopay, equip, install | Internet 100 $70.00; AT&T Internet Equipment Fee Included; Unlimited Data Included | **$70.00** |
| Dallas | AT&T Internet Air | $60/mo. | autopay, wifi_extender | AT&T Internet Air $65.00; AT&T Extended Wi-Fi $12.00; AT&T All-Fi Hub Included | **$77.00** |

Internet Air in Hicksville with AutoPay taken and Extended Wi-Fi declined is **$55.00**; with the portal's
own pre-selections kept it is $67.00; with AutoPay declined and Extended Wi-Fi taken it is **$77.00** (Dallas).

## 915 Courtenay Dr NE, Atlanta GA 30306

Plans lookup: `plans_ready` in 61.5 s. Product tiles: internet, tv.

### AT&T Internet 5000 (Fiber 5 GIG)

- Speed: Speeds up to 5 Gig
- Card price: **$125/mo.** — "Price plus taxes and fees after $10/mo. AutoPay & Paperless Bill discount."
- Bullets: "Extended Wi-Fi Coverage Service and Active Armor Internet Security Advanced Included in selected Rate Plan"; "5 GB connection — max speed and bandwidth"; "Fastest speed for smart homes and seamless collaboration"; "25x faster upload speeds than cable"; "Ultra-low lag for pro-level gaming"; "AT&T Internet Security included"
- Offer Details: 7 paragraphs, first: "Extended Wi-Fi Coverage Service and Active Armor Internet Security Advanced Included in selected Rate Plan…"
- Broadband Facts: att.com label present

### AT&T Internet 1000 (Fiber 1 GIG)

- Speed: Speeds up to 1 Gig
- Card price: **$80/mo.** — "Price plus taxes and fees after $10/mo. AutoPay & Paperless Bill discount."
- Bullets: "1 GB connection — max speed and bandwidth"; "Fastest speed for smart homes and seamless collaboration"; "25x faster upload speeds than cable"; "Ultra-low lag for pro-level gaming"; "AT&T Internet Security included"
- Offer Details: 6 paragraphs, first: "Geographic and service restrictions apply to AT&T Internet services. Not all speeds available in all areas.…"
- Broadband Facts: att.com label present

### AT&T Internet 500 (Fiber 500)

- Speed: Speeds up to 500 Mbps
- Card price: **$65/mo.** — "Price plus taxes and fees after $10/mo. AutoPay & Paperless Bill discount."
- Bullets: "500 Mbps equal upload and download speeds"; "Faster speed and more bandwidth for the always connected household"; "20x faster upload speeds than cable"; "Power even more devices so everyone can enjoy their own screen"; "AT&T Internet Security included"
- Offer Details: 6 paragraphs, first: "Geographic and service restrictions apply to AT&T Internet services. Not all speeds available in all areas.…"
- Broadband Facts: att.com label present

### AT&T Internet 300 (Fiber 300)

- Speed: Speeds up to 300 Mbps
- Card price: **$50/mo.** — "Price plus taxes and fees after $10/mo. AutoPay & Paperless Bill discount."
- Bullets: "300 Mbps equal upload and download speeds"; "Fast online speeds for the whole family"; "15x faster upload speeds than cable"; "Connect 10+ devices at once throughout your whole home"; "AT&T Internet Security included"
- Offer Details: 6 paragraphs, first: "Geographic and service restrictions apply to AT&T Internet services. Not all speeds available in all areas.…"
- Broadband Facts: att.com label present

### Options and cart: Internet 5000 (Fiber 5 GIG)

Options read in 22.9 s (status `options_required`); quote in 36.6 s (status `quote_ready`).

| Group | Heading | Choice | Price | Portal pre-selected |
|---|---|---|---|---|
| autopay | Select your Autopay option. | AutoPay/Paperless Billing Discount | -$10/mo. | yes |
| autopay | Select your Autopay option. | Decline AutoPay/Paperless Billing | $0 |  |
| equip | Select your Internet equipment. | AT&T Internet Equipment Fee | $0 | yes |
| install | How do you want your internet installed? | AT&T Professional Install | $0 | yes |

Included with this offer: $15 off for 12 months; YouTube TV 3 months Free with Fiber 1G+; $100 Reward Card (Requires Redemption); $100 Reward Card (Requires Redemption); Unlimited Data

Cart with the portal's own pre-selections (on the Options page): Internet 5000 (Fiber 5 GIG) $135.00; $15 off for 12 months -$15.00; YouTube TV 3 months Free with Fiber 1G+ ; AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included = **$110.00**

Answers sent: autopay = "AutoPay/Paperless Billing Discount"; equip = "AT&T Internet Equipment Fee"; install = "AT&T Professional Install"

| Cart item | Sub-line | Amount |
|---|---|---|
| Internet 5000 (Fiber 5 GIG) | Provided by AT&T | $135.00 |
| $15 off for 12 months | $15.00 off Internet 5000 (Fiber 5 GIG) for 12 months | -$15.00 |
| YouTube TV 3 months Free with Fiber 1G+ | 3 Months YouTube TV Trial with AT&T Fiber 1GB+ |  |
| AutoPay/Paperless Billing Discount | Taxes and fees extra. Plan price after $10/mo. discount (starts within 2 bills) when you sign up for paperless billing and AutoPay with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. | -$10.00 |
| AT&T Internet Equipment Fee |  | Included |
| Unlimited Data | Unlimited data included with package | Included |
| **Monthly total** | | **$110.00** |

Options the portal reports as selected: autopay: AutoPay/Paperless Billing Discount (-$10/mo.); equip: AT&T Internet Equipment Fee ($0); install: AT&T Professional Install ($0)

### Options and cart: Internet 1000 (Fiber 1 GIG)

Options read in 33.5 s (status `options_required`); quote in 17.1 s (status `quote_ready`).

| Group | Heading | Choice | Price | Portal pre-selected |
|---|---|---|---|---|
| autopay | Select your Autopay option. | AutoPay/Paperless Billing Discount | -$10/mo. | yes |
| autopay | Select your Autopay option. | Decline AutoPay/Paperless Billing | $0 |  |
| equip | Select your Internet equipment. | AT&T Internet Equipment Fee | $0 | yes |
| install | How do you want your internet installed? | AT&T Professional Install | $0 | yes |

Included with this offer: $10 off for 12 months; YouTube TV 3 months Free with Fiber 1G+; $100 Reward Card (Requires Redemption); $100 Reward Card (Requires Redemption); Unlimited Data

Cart with the portal's own pre-selections (on the Options page): Internet 1000 (Fiber 1 GIG) $90.00; $10 off for 12 months -$10.00; YouTube TV 3 months Free with Fiber 1G+ ; AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included = **$70.00**

Answers sent: autopay = "AutoPay/Paperless Billing Discount"; equip = "AT&T Internet Equipment Fee"; install = "AT&T Professional Install"

| Cart item | Sub-line | Amount |
|---|---|---|
| Internet 1000 (Fiber 1 GIG) | Provided by AT&T | $90.00 |
| $10 off for 12 months | $10.00 off Internet 1000 (Fiber 1 GIG) for 12 months | -$10.00 |
| YouTube TV 3 months Free with Fiber 1G+ | 3 Months YouTube TV Trial with AT&T Fiber 1GB+ |  |
| AutoPay/Paperless Billing Discount | Taxes and fees extra. Plan price after $10/mo. discount (starts within 2 bills) when you sign up for paperless billing and AutoPay with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. | -$10.00 |
| AT&T Internet Equipment Fee |  | Included |
| Unlimited Data | Unlimited data included with package | Included |
| **Monthly total** | | **$70.00** |

Options the portal reports as selected: autopay: AutoPay/Paperless Billing Discount (-$10/mo.); equip: AT&T Internet Equipment Fee ($0); install: AT&T Professional Install ($0)

### Options and cart: Internet 500 (Fiber 500)

Options read in 26.8 s (status `options_required`); quote in 14.7 s (status `quote_ready`).

| Group | Heading | Choice | Price | Portal pre-selected |
|---|---|---|---|---|
| autopay | Select your Autopay option. | AutoPay/Paperless Billing Discount | -$10/mo. | yes |
| autopay | Select your Autopay option. | Decline AutoPay/Paperless Billing | $0 |  |
| equip | Select your Internet equipment. | AT&T Internet Equipment Fee | $0 | yes |
| install | How do you want your internet installed? | AT&T Professional Install | $0 | yes |

Included with this offer: $5 off for 12 months; Unlimited Data

Cart with the portal's own pre-selections (on the Options page): Internet 500 (Fiber 500) $75.00; $5 off for 12 months -$5.00; AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included = **$60.00**

Answers sent: autopay = "AutoPay/Paperless Billing Discount"; equip = "AT&T Internet Equipment Fee"; install = "AT&T Professional Install"

| Cart item | Sub-line | Amount |
|---|---|---|
| Internet 500 (Fiber 500) | Provided by AT&T | $75.00 |
| $5 off for 12 months | $5.00 off Internet 500 (Fiber 500) for 12 months | -$5.00 |
| AutoPay/Paperless Billing Discount | Taxes and fees extra. Plan price after $10/mo. discount (starts within 2 bills) when you sign up for paperless billing and AutoPay with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. | -$10.00 |
| AT&T Internet Equipment Fee |  | Included |
| Unlimited Data | Unlimited data included with package | Included |
| **Monthly total** | | **$60.00** |

Options the portal reports as selected: autopay: AutoPay/Paperless Billing Discount (-$10/mo.); equip: AT&T Internet Equipment Fee ($0); install: AT&T Professional Install ($0)

### Options and cart: Internet 300 (Fiber 300)

Options read in 23.5 s (status `options_required`); quote in 7.6 s (status `quote_ready`).

| Group | Heading | Choice | Price | Portal pre-selected |
|---|---|---|---|---|
| autopay | Select your Autopay option. | AutoPay/Paperless Billing Discount | -$10/mo. | yes |
| autopay | Select your Autopay option. | Decline AutoPay/Paperless Billing | $0 |  |
| equip | Select your Internet equipment. | AT&T Internet Equipment Fee | $0 | yes |
| install | How do you want your internet installed? | AT&T Professional Install | $0 | yes |

Included with this offer: Unlimited Data

Cart with the portal's own pre-selections (on the Options page): Internet 300 (Fiber 300) $60.00; AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included = **$50.00**

Answers sent: autopay = "AutoPay/Paperless Billing Discount"; equip = "AT&T Internet Equipment Fee"; install = "AT&T Professional Install"

| Cart item | Sub-line | Amount |
|---|---|---|
| Internet 300 (Fiber 300) | Provided by AT&T | $60.00 |
| AutoPay/Paperless Billing Discount | Taxes and fees extra. Plan price after $10/mo. discount (starts within 2 bills) when you sign up for paperless billing and AutoPay with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. | -$10.00 |
| AT&T Internet Equipment Fee |  | Included |
| Unlimited Data | Unlimited data included with package | Included |
| **Monthly total** | | **$50.00** |

Options the portal reports as selected: autopay: AutoPay/Paperless Billing Discount (-$10/mo.); equip: AT&T Internet Equipment Fee ($0); install: AT&T Professional Install ($0)

## 300 Plainview Road, Hicksville NY 11801

Plans lookup: `plans_ready` in 32.7 s. Product tiles: internet, tv.

### AT&T Internet Air

- Speed: Speeds up to 300 Mbps
- Card price: **$60/mo.** — "Price plus taxes and fees after $5/mo. AutoPay & Paperless Bill discount."
- Card text: "AT&T Internet Air is our new, fast home internet, delivered over the reliable AT&T wireless network."
- Offer Details: 2 paragraphs, first: "Service Disclosure and Easy Cancellation: You agree that the service(s) selected will automatically renew each month based on the rates in effect at the time of…"
- Broadband Facts: att.com label present

### Options and cart: AT&T Internet Air

Options read in 21.1 s (status `options_required`); quote in 40.6 s (status `quote_ready`).

| Group | Heading | Choice | Price | Portal pre-selected |
|---|---|---|---|---|
| autopay | Select your Autopay option. | AutoPay/Paperless Billing Discount | -$10/mo. | yes |
| autopay | Select your Autopay option. | Decline AutoPay/Paperless Billing | $0 |  |
| wifi_extender | Select your All-Fi Extender Option. | Next-generation Wi-Fi experience, delivers more coverage to more corners of your home | $12/mo. | yes |
| wifi_extender | Select your All-Fi Extender Option. | Decline Extended Wi-Fi Coverage Service | $0 |  |

Included with this offer: AT&T All-Fi Hub

Cart with the portal's own pre-selections (on the Options page): AT&T Internet Air $65.00; AutoPay/Paperless Billing Discount -$10.00; AT&T Extended Wi-Fi $12.00; AT&T All-Fi Hub Included = **$67.00**

Answers sent: autopay = "AutoPay/Paperless Billing Discount"; wifi_extender = "Decline Extended Wi-Fi Coverage Service"

| Cart item | Sub-line | Amount |
|---|---|---|
| AT&T Internet Air | Provided by AT&T | $65.00 |
| AutoPay/Paperless Billing Discount | Taxes and fees extra. Plan price after $10/mo. discount (starts within 2 bills) when you sign up for paperless billing and AutoPay with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. | -$10.00 |
| AT&T All-Fi Hub |  | Included |
| **Monthly total** | | **$55.00** |

Options the portal reports as selected: autopay: AutoPay/Paperless Billing Discount (-$10/mo.); wifi_extender: Decline Extended Wi-Fi Coverage Service ($0)

## 2650 Lakeforest Ct, Dallas TX 75214

Plans lookup: `plans_ready` in 51.7 s. Product tiles: internet, tv.

### AT&T Internet 100

- Speed: Speeds up to 100 Mbps
- Card price: **$60/mo.** — "Price plus taxes and fees after $10/mo. AutoPay & Paperless Bill discount."
- Bullets: "No annual contract"; "Fast, reliable internet"; "Stream on multiple devices"; "AT&T Wi-Fi Hot Spot access included"
- Offer Details: 6 paragraphs, first: "Geographic and service restrictions apply to AT&T Internet services. Not all speeds available in all areas.…"
- Broadband Facts: att.com label present

### AT&T Internet Air

- Speed: Speeds up to 300 Mbps
- Card price: **$60/mo.** — "Price plus taxes and fees after $5/mo. AutoPay & Paperless Bill discount."
- Card text: "AT&T Internet Air is our new, fast home internet, delivered over the reliable AT&T wireless network."
- Offer Details: 2 paragraphs, first: "Service Disclosure and Easy Cancellation: You agree that the service(s) selected will automatically renew each month based on the rates in effect at the time of…"
- Broadband Facts: att.com label present

### Options and cart: Internet 100

Options read in 65.2 s (status `options_required`); quote in 59.8 s (status `quote_ready`).

| Group | Heading | Choice | Price | Portal pre-selected |
|---|---|---|---|---|
| autopay | Select your Autopay option. | AutoPay/Paperless Billing Discount | -$10/mo. | yes |
| autopay | Select your Autopay option. | Decline AutoPay/Paperless Billing | $0 |  |
| equip | Select your Internet equipment. | AT&T Internet Equipment Fee | $0 | yes |
| install | How do you want your internet installed? | AT&T Professional Install Fee | $99 | yes |

Included with this offer: Unlimited Data

Cart with the portal's own pre-selections (on the Options page): Internet 100 $70.00; AutoPay/Paperless Billing Discount -$10.00; AT&T Internet Equipment Fee Included; Unlimited Data Included = **$60.00**

Answers sent: autopay = "Decline AutoPay/Paperless Billing"; equip = "AT&T Internet Equipment Fee"; install = "AT&T Professional Install Fee"

| Cart item | Sub-line | Amount |
|---|---|---|
| Internet 100 | Provided by AT&T | $70.00 |
| AT&T Internet Equipment Fee |  | Included |
| Unlimited Data | Unlimited data included with package | Included |
| **Monthly total** | | **$70.00** |

Options the portal reports as selected: autopay: Decline AutoPay/Paperless Billing ($0); equip: AT&T Internet Equipment Fee ($0); install: AT&T Professional Install Fee ($99)

### Options and cart: AT&T Internet Air

Options read in 22.8 s (status `options_required`); quote in 46.6 s (status `quote_ready`).

| Group | Heading | Choice | Price | Portal pre-selected |
|---|---|---|---|---|
| autopay | Select your Autopay option. | AutoPay/Paperless Billing Discount | -$10/mo. | yes |
| autopay | Select your Autopay option. | Decline AutoPay/Paperless Billing | $0 |  |
| wifi_extender | Select your All-Fi Extender Option. | Next-generation Wi-Fi experience, delivers more coverage to more corners of your home | $12/mo. | yes |
| wifi_extender | Select your All-Fi Extender Option. | Decline Extended Wi-Fi Coverage Service | $0 |  |

Included with this offer: AT&T All-Fi Hub

Cart with the portal's own pre-selections (on the Options page): AT&T Internet Air $65.00; AutoPay/Paperless Billing Discount -$10.00; AT&T Extended Wi-Fi $12.00; AT&T All-Fi Hub Included = **$67.00**

Answers sent: autopay = "Decline AutoPay/Paperless Billing"; wifi_extender = "Next-generation Wi-Fi experience, delivers more coverage to more corners of your home"

| Cart item | Sub-line | Amount |
|---|---|---|
| AT&T Internet Air | Provided by AT&T | $65.00 |
| AT&T Extended Wi-Fi |  | $12.00 |
| AT&T All-Fi Hub |  | Included |
| **Monthly total** | | **$77.00** |

Options the portal reports as selected: autopay: Decline AutoPay/Paperless Billing ($0); wifi_extender: Next-generation Wi-Fi experience, delivers more coverage to more corners of your home ($12/mo.)

## What this changes

- Option groups for Internet 500, 1000 and 5000 (OPEN_ITEMS O-22) are now known: AutoPay, equipment ($0, only
  choice), professional install ($0, only choice), like Internet 300. The website does not hard-code them: it
  shows whatever the portal returns for the chosen plan.
- Internet 100 (Dallas) is a real plan the portal sells online; its installation is a one-time $99 charge.
- Card prices are after AutoPay only; 12-month promotions appear only on the Options page and in the cart.
- The website's quote is the cart above, line for line; it never computes a price itself.
