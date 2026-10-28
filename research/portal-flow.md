# The AT&T partner portal (SPOC) order flow

How the partner portal ("SPOC - SARA Plus Online Cart") takes an Internet order, step by step, as seen in
every recording and screenshot in the private `attspoc AT&T` folder (28 Sep, 30 Sep and 2 Oct 2026) and in
the read-only live exploration of 28 Oct 2026 (research/portal-options.md).

## Sources

| Source | Content |
|---|---|
| 7 recorded sessions (23 video files; the `demo_*`, `videos/test-*` and `share/*` files are copies or joins of the 14 `video_*.webm`) | Hicksville NY Air ×3 (30 Sep), Atlanta GA Fiber 300 ×2 and Dallas TX Air ×2 (2 Oct) |
| 126 step screenshots | Same runs plus 28 Sep failures: untouched Options defaults, invalid email, a DIRECTV add-ons page |
| 15 saved portal pages (HTML) | Plan cards, Options pages, set-up complete page, checkout page |
| Live exploration, 28 Oct | Plans, options and carts for Internet 300/500/1000/5000 (Atlanta), Internet 100 and Air (Dallas), Air (Hicksville) |

Privacy: the folders `real-customer-001` and `sai-ram-atl-001` were not opened. Several 2 Oct recordings show
typed checkout values unblurred; none are reproduced here (OPEN_ITEMS O-20).

Only the three documented test addresses appear in this file: 915 Courtenay Dr NE, Atlanta GA 30306;
2650 Lakeforest Ct, Dallas TX 75214; 300 Plainview Road, Hicksville NY 11801.

## On every page

- Header: "Show Cart" with a cart icon (badge "1" once a plan is in the cart).
- Footer: "AUTHORIZED PARTNER", "Privacy Policy", "Powered By", and a **session timer** that shows **30:00**
  on every page load and counts down. The portal session (in the URL) expires after 30 minutes without
  activity. No expiry message was ever recorded.
- After the address is accepted: "Showing services for: 915 COURTENAY DR NE, ATLANTA, GA 30306-3426 change".

## Step 1: "Find offers in your area"

- Sub-heading: "Enter your address and build your ultimate entertainment experience."
- Fields: **Address** (placeholder "Enter address"), **Zip code**, button **Go**, and the link
  **Show Full Address**, which switches to the full form: street, **unit type** (Apartment, Building, Floor, …),
  **unit number**, **city**, **state** (full names), ZIP. The link was never clicked in a recording; the
  fields come from the automation's verified selectors.
- Typing the street opens a SmartyStreets autocomplete list (Hicksville: the test address first, then
  similar addresses in other states). Picking one sets the street in capitals and the ZIP+4.
- After Go, a loading modal: "Hang tight..." / "We've got some great plans for you." / then one line cycling
  "We're finding plans in your area." → "You'll love these options!" → "Sorry for the delay." Recorded 15–37 s.
- Possible outcomes (automation code): a confirmation modal "Is the address below entered correctly?", a
  "Multiple potential addresses were returned" list, help text asking for more details (a unit number), "We
  could not find that address", or the error modal "We've Encountered an Error".

## Step 2: "Get the best of everything"

Two tiles: **Internet** ("Add Internet") and **TV** ("Add TV"). A tile is hidden when that product is not sold
at the address. All three test addresses showed both. A "$99 Installation fee is waived when bundling with AT&T
Video products!" banner appears on later pages. Our site never offers TV or bundles.

## Step 3: "Select your Internet plan"

Step bar: **Base Package** (active) › **Options**. One card per plan available at the address. Each card shows:
"AT&T", the plan name, the speed line, feature bullets or a paragraph, the price "$NN/mo.", the price note
"Price plus taxes and fees after $10/mo. AutoPay & Paperless Bill discount." (Internet Air: "$5/mo."),
**Offer Details** (a dialog with the offer's legal text), **Broadband Facts** (AT&T's label from
www.att.com/labels/…), and **Add**. No promo or strike-through prices appear on the cards. A footnote under
the cards: "†Internet speed claims represent maximum network service capability speeds…".

| Address | Plans (card price) | Seen |
|---|---|---|
| Atlanta GA | Internet 5000 (Fiber 5 GIG) $125/mo. · Internet 1000 (Fiber 1 GIG) $80/mo. · Internet 500 (Fiber 500) $65/mo. · Internet 300 (Fiber 300) $50/mo. | 2 Oct, 28 Oct (unchanged) |
| Dallas TX | Internet 100 $60/mo. · AT&T Internet Air $55/mo. (2 Oct) → **$60/mo.** (28 Oct) | 2 Oct, 28 Oct |
| Hicksville NY | AT&T Internet Air only, $55/mo. (28 Sep–30 Sep) → **$60/mo.** (28 Oct) | 28 Sep, 30 Sep, 28 Oct |

Speeds: "Speeds up to 5 Gig", "1 Gig", "500 Mbps", "300 Mbps", "100 Mbps"; Internet Air "Speeds up to 300 Mbps".
Bullets are listed per plan in research/portal-options.md. Clicking **Add** shows "This won't take long..." /
"You're one step closer to your new plan!" / "We're making sure you get the best price." → "Sorry for the
delay." (4–23 s), then the toast "✓ Internet 300 (Fiber 300) added to cart".

## Step 4: Options

Step bar: ✓ Base Package › **Options**. One section per option group; each choice is a card with a title, a
price and a **Select** button ("Selected" when chosen). **The portal pre-selects** a choice in every group,
including the paid Extended Wi-Fi. Buttons: **Previous** and **Next: Finish**.

| Plan | Group (heading) | Choices (price) — portal default in bold |
|---|---|---|
| Every plan seen | "Select your Autopay option." | **AutoPay/Paperless Billing Discount (−$10/mo.)** · Decline AutoPay/Paperless Billing ($0). Text: "$10/mo AutoPay and Paperless Billing discount with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. If you decline AutoPay and Paperless Billing your price will increase." |
| Internet Air | "Select your All-Fi Extender Option." | **"Next-generation Wi-Fi experience, delivers more coverage to more corners of your home" ($12/mo.)** · Decline Extended Wi-Fi Coverage Service ($0). The card text is a script for sales staff ("Please ask the Customer the question below…") plus a disclosure ("$12/month plus tax for up to 5 Wi-Fi Extenders…", typo "xxtender" on screen). |
| Fiber 300/500/1000/5000, Internet 100 | "Select your Internet equipment." | **AT&T Internet Equipment Fee ($0)** — only choice |
| Fiber 300/500/1000/5000 | "How do you want your internet installed?" | **AT&T Professional Install ($0)** — only choice; "AT&T professional installation fee waived with speeds of 300MB or more" |
| Internet 100 | "How do you want your internet installed?" | **AT&T Professional Install Fee ($99)** — only choice; "$99 AT&T Professional Installation fee applied on first bill…" (one-time, not a monthly cart line) |

"These items are automatically included with this offer." (no buttons):

| Plan | Included (28 Oct) | Included (2 Oct) |
|---|---|---|
| Internet 5000 | $15 off for 12 months · YouTube TV 3 months Free with Fiber 1G+ · $100 Reward Card (Requires Redemption) ×2 · Unlimited Data | not recorded |
| Internet 1000 | $10 off for 12 months · YouTube TV 3 months Free with Fiber 1G+ · $100 Reward Card (Requires Redemption) ×2 · Unlimited Data | not recorded |
| Internet 500 | $5 off for 12 months · Unlimited Data | not recorded |
| Internet 300 | Unlimited Data | $15 off for 12 months (−$15) · Unlimited Data |
| Internet 100 | Unlimited Data | not recorded |
| Internet Air | AT&T All-Fi Hub | AT&T All-Fi Hub |

## Step 5: "Your Internet order set-up is complete."

"Would you like to bundle with additional services or checkout?" Tiles: **Change Internet**, **Add TV**,
**Checkout**; button **Previous**. The cart (header flyout) now holds the priced order.

### The cart (Monthly Charges › Internet Charges)

Each line: item, optional sub-line, amount. Then "Internet Total:", "Monthly Total*:" and the footnote
"* Plus taxes and fees. Price higher after discount(s) removed or promo(s) end." Example, Atlanta, 2 Oct:

| Item | Sub-line | Amount |
|---|---|---|
| Internet 300 (Fiber 300) | Provided by AT&T | $60.00 |
| $15 off for 12 months | $15.00 off Internet 300 (Fiber 300) for 12 months | −$15.00 |
| AutoPay/Paperless Billing Discount | Taxes and fees extra. Plan price after $10/mo. discount (starts within 2 bills) when you sign up for paperless billing and AutoPay with bank account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card. | −$10.00 |
| AT&T Internet Equipment Fee | | Included |
| Unlimited Data | Unlimited data included with package | Included |
| **Monthly Total*** | | **$35.00** |

The plan line is the price **before** the AutoPay discount (card $50 = cart $60 − $10). With the portal's
own defaults kept, Internet Air prices at $67.00 ($65 − $10 + "AT&T Extended Wi-Fi" $12); with AutoPay
declined and Extended Wi-Fi kept, at **$77.00**. All live carts are in research/portal-options.md.

## Step 6: Checkout (Checkout.aspx)

One page of accordion panels, opened in order:

1. **Personal Information**: "Entering your information allows us to communicate with you about your order and
   set up your service." First Name *, Last Name *, Phone Number * ("(###) ###-####"), Billing Preference *
   (English pre-selected / Spanish), a **pre-checked** box "Reach me by phone or text with information about my
   services. Examples include install and repair appointments, billing and account information, and customer
   satisfaction inquiries.", Email Address *, **Confirm Email Address ***, then the credit-check box
   "Before we continue with your order, we will need to initiate a credit check. Is that OK?" with
   **Date of Birth *** and **Social Security Number *** (masked), and **Continue**.
2. Air: "Shipping & Billing Address"; Fiber: "Billing Address" and "Account Security".
3. "Terms", "Scheduling", "ABP - AutoPay Option".

The automation stops after the non-sensitive Personal Information fields and **never clicks Continue**, so no
credit check is run and nothing is submitted. A specialist completes the credit check, addresses, terms,
scheduling and payment.

Validation seen on screen: "Enter valid phone number." (while typing), "Email is invalid. Please fix." (red
envelope icon), and on 28 Oct "We were unable to verify your email, please confirm your entry before
continuing." for an address the portal could not verify. The page also contains (hidden) "Required.",
"Minimum 2 characters required; no space/characters at end allowed.", "Invalid Email.", "Emails must match.",
"Invalid Date.", "Invalid SSN.".

## Timings (live, 28 Oct)

| Step | Seconds |
|---|---|
| Address to plan cards | 33–62 |
| Add the plan, read Options | 21–65 |
| Apply answers, set-up complete, read cart | 8–60 |
| Hand-off (checkout, Personal Information) | 14–46 (earlier runs) |
