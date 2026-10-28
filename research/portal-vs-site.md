# Partner portal vs our order flow and offers.ts

What the AT&T partner portal does (research/portal-flow.md, research/portal-options.md) compared with the
order flow the website had until 28 Oct 2026, and what the rebuilt `/att/order` does now.

## The flow

| | Partner portal | Old `/att/order` (b84dd39) | New `/att/order` |
|---|---|---|---|
| Order of steps | Address → Internet/TV → plans at the address → Options → set-up complete (cart) → Checkout | **Plan first** (from offers.ts), options from a hard-coded list, then address, quote | Address → plans at the address (live) → options (live, for the chosen plan) → quote (the portal cart) → details → review |
| Plans offered | Only what the portal sells at that address | All five marketing plans, wherever the visitor lives | Only the portal's plan cards for that address, incl. plans not on our marketing pages (e.g. Internet 100) |
| Plan not sold at the address | Not listed | Ended on "This Plan Is Not Available Online at Your Address", no alternatives | "AT&T Internet 1000 is not available at this address. These plans are available:" with the available plans |
| Plan card | Name, speed, bullets, price + note, Offer Details, Broadband Facts, Add | offers.ts card (marketing price, conditions, fine print) | The portal card: name, speed, bullets, price + note, Offer Details text, Broadband Facts (att.com label) |
| Options | Read from the page for the chosen plan; the portal **pre-selects** every group, incl. the $12 Extended Wi-Fi | Hard-coded per plan in order-plans.ts; groups for 500/1000/5000 unknown | Read live for the chosen plan; nothing preselected except paid add-ons, which start on their Decline choice |
| Staff scripts in options | Shown to agents ("Please ask the Customer…") | Not shown | Never shown (filtered on the server) |
| Included items | "These items are automatically included with this offer." | Not shown | Shown on the options and quote steps |
| Price shown | Card price, then the cart | The marketing price, then the cart | Card price on the plan step, then the cart line for line |
| One-time charges | Option price (e.g. $99 install), applied on the first bill | Not handled | Listed under "One-time charges you chose" |
| Unrequested items | Portal can push a DIRECTV bundle; paid add-ons pre-selected | Bundle check; extender check only for "declined" | Every paid cart line must be the plan or a paid option the visitor chose, otherwise the call screen |
| Session | 30-minute idle timer per portal session | A new portal session for every quote and hand-off | One portal session kept open from plans to quote (closed after 20 minutes idle); hand-off resumes the quote's session; a lost session restarts automatically |
| Personal information | Name, phone, billing preference (English pre-selected), **pre-checked** contact box, email, **Confirm Email**, credit check (DOB, SSN) | Name, phone, email, billing language, contact choice (radio), consent | Name, phone, email, **confirm email**, billing language, a separate **unchecked** contact box, consent; never DOB, SSN, card or bank details |
| Email the portal rejects | "We were unable to verify your email…" / "Email is invalid. Please fix." | "This email address was not accepted. Please check it and try again." | "This email address was not accepted. Please enter a working email address that can receive mail." on the same screen |
| Credit check / submit | Continue runs the credit check; later panels take payment and submit | Never reached (automation stops before Continue) | Same: never reached |
| TV and bundles | "Add TV" tile, DIRECTV add-ons | Not offered | Not offered (TV results are ignored) |

## Data: offers.ts vs the portal

| Item | offers.ts (marketing pages, att.com 28 Oct) | Portal (28 Oct) | Handling |
|---|---|---|---|
| Plan names | "AT&T Internet 300 / 500 / 1000 / 5000", "AT&T Internet Air" | "Internet 300 (Fiber 300)", "Internet 500 (Fiber 500)", "Internet 1000 (Fiber 1 GIG)", "Internet 5000 (Fiber 5 GIG)", "AT&T Internet Air", "Internet 100" | `order-plans.ts` links each offer id to the portal name, only to preselect the clicked plan |
| Fiber prices | $50 / $60 / $70 / $110 for 12 mos. | Cards $50 / $65 / $80 / $125; carts $50 / $60 / $70 / $110 | Order page shows the portal's figures; differences recorded in research/data-audit.md (items 10–15) |
| Internet Air | $55/mo. | Card $60/mo. ("after $5/mo."); cart $55.00 | As above |
| Internet 100 | not on the site | $60/mo. card, $99 install | Orderable on the order page where offered |
| Options | none in offers.ts (old order-plans.ts hard-coded AutoPay, Extended Wi-Fi, equipment, install) | Read per plan (portal-options.md) | Hard-coded options removed |
| AutoPay wording | "After $10/mo. AutoPay & paperless bill discount" | "$10/mo AutoPay and Paperless Billing discount with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. If you decline AutoPay and Paperless Billing your price will increase." | Order page shows the portal's text with the AutoPay choice |

## Causes of the three reported bugs

1. **$77.00 at Hicksville with Extended Wi-Fi and no AutoPay discount.** The service log of 28 Oct (20:4x) shows the
   order arrived with AutoPay **declined** and Extended Wi-Fi **taken**, and the automation applied exactly that
   ($65 + $12 = $77; the portal prices this same combination at $77.00, portal-options.md, Dallas). Options were
   sent, the mapping was correct (the same code gave $55.00 for AutoPay taken / Wi-Fi declined), and the session
   was fresh. The cause was the old options form: two required questions with no default, the paid
   "Add AT&T Extended Wi-Fi ($12/mo.)" listed first and the AutoPay choice worded as "No, decline the discount",
   with the add-on shown only as a cart line afterwards. Fixed: Extended Wi-Fi now starts on the portal's
   "Decline" choice, AutoPay is explained with the portal's own text and must be chosen, prices sit next to each
   choice, the quote lists every chosen option, and the server stops the order if any paid cart line is not a
   paid option the visitor chose. Tests: "Extended Wi-Fi declined vs chosen" and "The $77 case".
2. **"This Plan Is Not Available Online at Your Address" for every plan except Internet Air.** The log shows
   Internet 1000, 500 and 5000 sent to an address where the portal offers only AT&T Internet Air
   (`plan_not_found`, "0 internet plans matched"). The plan names were right (they match the portal's Atlanta
   cards exactly). The old flow asked for the plan before the address, so it could not know what the address
   offers, and it mapped `plan_not_found` to a dead end. Fixed: address first, then only the plans the portal
   offers there; a requested plan that is not offered is named and the available plans are shown. Every plan
   was tested live (portal-options.md) and in the tests.
3. **The plan list highlighted a different plan from the one in the URL.** The highlight followed the page's
   state, but the URL kept the first `?plan=`; after "Choose Another Plan" the previously failed plan stayed
   highlighted. Fixed: one selected plan drives both the highlight and `?plan=` (updated in place, click IDs
   kept). Test: "The highlighted plan always matches the plan in the address bar".
