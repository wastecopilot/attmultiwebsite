# Portal checkout: the sections after the credit check

Research date: 29 Oct 2026. Read-only. Nothing was opened or fetched on attspoc.com or any partner portal. No
personal data or session URLs are reproduced here.

## Bottom line

- **The saved pages contain no panel bodies.** Every saved Checkout.aspx page (8 files, builds of 24 Sep and
  27 Oct 2026) renders the later panels as **header-only, disabled** divs (`class="aspNetDisabled panel-header"`).
  They hold no inputs, validators or panel scripts. Every field name below comes from other sources: page
  scaffolding, other order-entry tools, att.com, or inference. The script that probably drives the panels
  (`OE/Scripts/checkout.js`) was never saved. **Nothing in this report about panel contents has been seen on the
  portal.**
- What the saved pages do show for certain: the panel order, their element ids, which product shows which
  panel, and that the ABP panel appears even when AutoPay was declined.
- The best outside evidence:
  1. The **SARA Plus iOS Order Entry Guide**, from the same vendor as the portal (~2018, DIRECTV and AT&T
     bundles). It has screens for Customer Security, Terms and Conditions, Payment Collection and Scheduling.
  2. The **CableFinder "AT&T AIR" dealer guide** (2025). It shows AT&T's PIN and secret-question rules and
     separate service, billing and shipping addresses.

Neither guide is the SPOC web checkout. Treat them as strong hints, not as the portal's fields.

## Sources used

Project files (read-only):

| Id | File | What it is |
|---|---|---|
| P1 | `attspoc AT&T\order_artifacts\aria-call-TEST-0001_20260928T072111Z\06_FAILED_fill_customer_details.html` (also `..._065535Z\05`, `..._070442Z\06`, `..._071518Z\05`, `..._071854Z\05`, all the same apart from whitespace and redaction) | Checkout.aspx, Build "9/24/2026 6:25 AM", Internet Air |
| P2 | `order-service\order_artifacts\UW-KMT8SB9T_20261028T173145Z\03_FAILED_fill_customer_details.html` | Checkout.aspx, Build "10/27/2026 6:48 AM", Internet 1000 (Fiber 1 GIG) |
| P3 | `order-service\order_artifacts\UW-PCJ3E9QB_20261028T151746Z\03_...html` and `..._151902Z\05_...html` | Checkout.aspx, Build "10/27/2026 6:48 AM", Internet Air, **AutoPay declined** (cart has Extended Wi-Fi $12 and no AutoPay discount; total $77.00) |
| P4 | `order-service\order_artifacts\UW-QC7W68BA_20261029T131550Z\04_after_fill_customer_details.png`, `UW-TT6V95BS_20261029T080630Z\04_after_fill_customer_details.png` | Screenshots from 29 Oct, Fiber 300 and Fiber 500. Neither cart has an AutoPay discount line. Headers: Billing Address, Terms, Scheduling, Account Security, ABP - AutoPay Option |
| P5 | `attspoc AT&T\order_artifacts\test-atl-…_20261002T013746Z\03_FAILED_select_products.html` (the Atlanta test-address run of 2 Oct; folder name shortened here) | Fiber plan cards with the "Offer Details" legal text |
| P6 | `attspoc AT&T\order_artifacts\aria-call-TEST-0001_20260928T062459Z\03_FAILED_select_products.html` | Internet Air Options/plan page with disclosure text |
| P7 | `research\portal-flow.md`, `research\spoc-analysis.md` | What we documented before |

Folders `real-customer-001` and `sai-ram-atl-001` were not opened. No artifact HTML exists for any step after
Personal Information; only "FAILED_fill_customer_details" pages and screenshots exist.

Web sources (public):

| Id | URL | Note |
|---|---|---|
| W1 | https://files.saraplus.com/docs/SARAPlus_SmartCircle_Guide.pdf | "SARA Plus IOS Order Entry Guide". A public PDF from the portal's vendor; its calendar shows May 2018. DIRECTV-led bundle with AT&T Internet. **Not the SPOC web checkout.** |
| W2 | https://cablefinder.net/wp-content/uploads/2025/07/ATT-AIR-in-CableFinder.pdf | A dealer guide for placing **AT&T Internet Air (business)** orders through CableFinder into AT&T's B2B system |
| W3 | https://www.att.com/deals/autopay-discount/ | AutoPay discounts by payment type |
| W4 | https://www.att.com/support/article/my-account/000095109 (updated 10 Apr 2026) and https://www.att.com/autopayinfo | AutoPay discount changes (Citi card, from 12 Feb 2026) |
| W5 | https://www.att.com/support/smallbusiness/article/smb-my-account/KM1189775 (updated 27 Apr 2026) | AutoPay can use a bank account, debit card or credit card; "may take up to six weeks to start" |
| W6 | https://www.att.com/support/article/dsl-high-speed/KM1050270 (updated 26 Feb 2026) | "Next steps after upgrading": passcode chosen at order, Terms accepted at att.com/login registration, appointment changes |
| W7 | https://www.att.com/install and https://www.att.com/support/article/u-verse-voice/KM1066216/ | Fiber install takes "four to six hours" |
| W8 | https://www.att.com/legal/terms.HSIAAttTermsofService.html | AT&T Internet Terms of Service (the archived 14 Jan 2019 version; the current one is at att.com/internet-terms, which did not render for the fetch tool) |
| W9 | https://www.att.com/support/article/wireless/KM1049472, https://att.com/support/article/wireless/KM1159574 (updated 12 Apr 2026) | "Every account has a passcode"; account passcode vs extra-security passcode |
| W10 | https://www.business.att.com/content/dam/businesscenter/pdf/legal/att-business-aia-b-pro-install.pdf (search snippet only) | Business Internet Air pro install "no earlier than 5-7 business days after the ... device order" |
| W11 | AT&T Community forum thread on install windows, via search results (forums.att.com) | "8-10, 10-12, 2-4, and rare possible 4-6" two-hour windows. Anecdotal |
| W12 | https://www.att.com/internet/internet-air/ | Internet Air: "$0 self-setup", "AutoPay & paperless bill required" |

---

## What the saved checkout page tells us about all the later panels

These facts come from P1–P4:

1. **Order and ids** (top to bottom, below `PersonalInfoBody`):

   | Header text | Element id | Air (24 Sep build) | Air (27 Oct build) | Fiber (27 Oct build, 28–29 Oct runs) |
   |---|---|---|---|---|
   | Shipping & Billing Address / Billing Address | `ShippingHeader` | "Shipping & Billing Address" | "Shipping & Billing Address" | "Billing Address" |
   | Terms | `TermsHeader` inside `MainContent_TermsInfo_TermsWrapper` | yes | yes | yes |
   | Scheduling | `MainContent_Scheduling_ScheduleHeader` | yes | yes | yes |
   | Account Security | `PanelHeader` | **absent** | **absent** | yes |
   | ABP - AutoPay Option | `PaymentHeader` | yes | yes | yes |

   The ids suggest server user controls named `TermsInfo` and `Scheduling`, so their inputs will probably be
   `MainContent_TermsInfo_*` and `MainContent_Scheduling_*`. The Billing, Account Security and Payment headers
   use static ids. Account Security's id is the generic `PanelHeader`, so its body's id prefix cannot be guessed.
2. **Locked until earlier panels pass.** Every later header carries `aspNetDisabled` and has no body. The
   bodies are rendered server-side only after the credit check passes, which matches what we were told.
3. **Each panel probably has its own Continue button.** Personal Information has
   `MainContent_PersonalInfo_PersonalInfoContinueButton`, validation group `PersonalInfo`, and
   `onkeypress="WebForm_FireDefaultButton(event, ...)"` on the panel body. That last attribute means
   **pressing Enter in any field clicks Continue**. Later panels probably follow the same pattern (pattern
   inference, not seen).
4. **One UpdatePanel holds all the panels.** `Sys.WebForms.PageRequestManager._initialize(...)` lists
   `MainContent_ctl00` as the UpdatePanel that wraps every panel. A Continue click is an async postback that
   re-renders the whole accordion, so an automation must wait for the postback to end (`endRequest`) before
   reading the next panel. The page's startup script calls `registerCheckoutStep('PersonalInfo', 1, '<cart
   json>')` and `scrollToElement('PersonalInfoHeader')`. After each postback these calls (with the next step's
   name and number) probably show which panel is open; that is inferred.
5. **The ABP panel appears even when AutoPay was declined in Options.** In P3 (Air, AutoPay declined) and P4
   (Fiber 300 and 500, no AutoPay discount line in the cart), "ABP - AutoPay Option" is still listed. So it is
   either always shown or used for something beyond AutoPay enrolment (see ABP below).
6. **A required-checkbox validator is defined on the page but not used by any visible panel.** The page defines
   `function CheckBoxValidatorEvaluateIsValid(val) { ... return control.checked == true }` next to
   `checkout.js` (P1, P2). No validator in Personal Information uses it (`Page_Validators` lists only
   PersonalInfo and QualityCheck validators), so **a later panel has at least one checkbox that must be
   ticked**. The Terms panel is the likeliest home ("I agree"), but that is inferred.
7. **Other hidden hooks:**
   - `function pipConfigComplete(code)` sets the hidden fields `MainContent_PIPConfigInfo_hdnPIPOptionsComplete`
     and `..._hdnPIPOptionsCompleteCode`. Neither field exists in the saved pages. It looks like a callback
     from a pop-up or iframe step.
   - `personalInfoLoad(...)` also names `MainContent_PersonalInfo_DLExpTxt_InputTxt`, a driver's-licence
     expiry field that is not rendered. W1 says the DTV credit check accepts a driver's licence instead of an SSN.
   - The page holds 16 empty slots before `ShippingHeader` and 3 after `PaymentHeader`. These are server
     controls not rendered for this order; they may be product-specific panels or a review/submit step.
   - Hidden inputs `hdnPromoCode`, `hdnRequestID`, `__REQUESTID`.
   - The session timer is 30:00 (`CustomFooter_hdnRefreshTimer` = 1799/1800 s).
8. **Scripts.** The page loads the portal-wide scripts (jQuery 3.6.4, jQuery UI, `smartystreets.js`,
   `jquery.mask.min.js`, `pdfobject.min.js`, bootstrap, `main.js`) plus the page-specific **`checkout.js`**.
   SmartyStreets and pdfobject also load on the landing, Products and Options pages, so their presence says
   nothing about the later panels. We hold no copy of `checkout.js` or `main.js`, and fetching them would mean
   requesting the portal, which this task did not do.

---

## 1. "Billing Address" (Fiber) / "Shipping & Billing Address" (Internet Air)

### (a) Confident (seen on the portal)
- The header text depends on the product: "Shipping & Billing Address" for Air (P1, P3; builds of 24 Sep and
  27 Oct) and "Billing Address" for Fiber (P2, P4). Both use id `ShippingHeader`, so it is one control with a
  product-dependent label. The difference fits Air hardware being **shipped** (an "AT&T All-Fi Hub", P1 cart)
  while Fiber is installed by a technician ("AT&T Professional Install", Options page, P7).
- It is the first panel after the credit check.
- No fields have been seen.

### (b) Likely, from outside material (not seen on the portal)
- **"Same as service address" checkbox plus address fields.** CableFinder's AT&T Air guide (W2, step 10) shows
  "Customer Address Information":
  - Service Address Line 1 / Line 2, City, State (drop-down), Zip;
  - a checkbox "I confirm that there is no Unit or Suite number for this location." (described as "a required
    field");
  - a checkbox "Same as Service?";
  - Billing Address Line 1 / Line 2, City, State, Zip.
  - The guide says the page confirms "the service address and billing address, and shipping address".
- **For Air, a shipping address for the hub.** W2 lists a separate shipping address. The portal's Air label
  "Shipping & Billing" suggests one panel with both (or "shipping same as billing").
- The service address itself is already fixed by the qualified address from Step 1. The Personal Information
  panel's address pop-up ("Is the address below entered correctly?") confirms it before the credit check (P1).

### (c) Open questions
- Is billing address = service address the default (pre-filled or pre-ticked)?
- For Air, can the shipping address differ from the service address, and are PO boxes accepted?
- Does the portal re-validate a different billing or shipping address with a SmartyStreets suggestion or a
  "Is the address below entered correctly?" pop-up (the one Personal Information uses)?
- Is there a unit or suite confirmation checkbox like W2's?

---

## 2. "Terms"

### (a) Confident (seen on the portal)
- Header "Terms", id `TermsHeader`, inside wrapper `MainContent_TermsInfo_TermsWrapper` (user control
  `TermsInfo`), shown for Air and Fiber (P1–P4). The wrapper probably exists so the whole section can be hidden
  for some orders; that is inferred.
- A page-level required-checkbox validator exists (`CheckBoxValidatorEvaluateIsValid`, see point 6 above). It
  probably belongs to an "I agree" box in this panel (inferred).
- The legal text the portal already shows at plan selection, likely repeated or referenced in Terms (P5 Fiber
  "Offer Details"; P6 Air), verbatim excerpts:
  - "Service Disclosure and Easy Cancellation: You agree that the service(s) selected will automatically renew
    each month based on the rates in effect at the time of renewal (currently the rate shown on the screen),
    minus any discounts or promotions qualified for. This will continue until the service is cancelled. To avoid
    further charges, cancel before the end of the monthly bill cycle by visiting att.com/cancel or calling
    800-288-2020" (Air version: att.com/support/how-to/cancel/).
  - "Subj. to Internet Terms of Service at att.com/internet-terms."
  - "Credit restrictions apply."
  - "Up to $99 installation fee may apply, plus tax where applicable."
  - "Must maintain autopay/paperless bill and valid email address to continue discount."

### (b) Likely, from outside material (not seen on the portal)
- **AT&T Internet Terms of Service** (W8, archived 2019 version):
  - "You must accept this Agreement as a condition of receiving the Service."
  - "By enrolling in, activating, using, or paying for the Service, you agree to the terms and conditions in this
    Agreement".
  - It "REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS"; residential arbitration is in Section 13.
  - Equipment must be returned "within twenty-one (21) calendar days" after termination, or a non-return fee
    applies.
  - A third-party terms tracker says the arbitration opt-out must be made in writing within 30 days of first
    accepting; this was not verified on att.com.
- **Where AT&T itself takes acceptance:** "Before your installation day, you can register at att.com/login with
  your account number and passcode"; registration includes accepting the Internet Terms of Service (W6).
- **The SARA Plus iOS guide (W1, ~2018):**
  - "Terms & Conditions are displayed and must be read through with the customer."
  - "To proceed forward, a signature must be captured" (a finger or stylus signature on the device). The guide
    stores "Date, Time and IP address".
  - Its 2018 T&C sections were Programming Agreement (DIRECTV), Equipment, Agreement Term, Installation
    ("Someone 18 years of age or older must be present when the technician arrives. The installation averages 2 -
    4 hours..."; renters need landlord permission) and General.
  - That app also had a separate "CPNI Agreement" step ("Customer Approved CPNI") and credit-check initials.
  - The 2018 1-year term and $180 early-termination fee are outdated; current portal offers are month-to-month
    (P5).
- **CableFinder business Air (W2):** after the dealer clicks Place Order, "the customer will receive a link from
  AT&T with the required actions: Accept Terms and Conditions; Pay their first month of service". The dealer
  separately accepts "AT&T Rules of Engagement" in a pop-up. So in at least one AT&T channel the customer
  accepts the terms themselves through an AT&T link, not the dealer.

### (c) Open questions
- What does the portal's Terms panel contain: scrollable text, PDF links (pdfobject is loaded), checkbox(es),
  or a "send to customer" e-sign or SMS step?
- How many checkboxes, and with what wording (Internet Terms of Service, arbitration, auto-renewal, AutoPay
  terms, CPNI)?
- Is the agent allowed to tick it after reading it to the customer, or must the customer act (link, OTP,
  signature)?
- Does it differ for Air (equipment return, 30-day money-back: W2 says "If the service does not work within the
  first 30 days, the customer will get their money back")?

---

## 3. "Scheduling"

### (a) Confident (seen on the portal)
- Header "Scheduling", id `MainContent_Scheduling_ScheduleHeader` (user control `Scheduling`), shown for **both
  Air and Fiber** (P1–P4). So it is not only for technician appointments.
- Install type comes from the Options step (P7):
  - Fiber 300/500/1000/5000: "AT&T Professional Install ($0)" is the only choice.
  - Internet 100: "AT&T Professional Install Fee ($99)" is the only choice.
  - Internet Air: no install group (self-setup hub).
- The Personal Information contact-consent text mentions "install and repair appointments" (P1).

### (b) Likely, from outside material (not seen on the portal)
- **A calendar with time-of-day availability.** The SARA Plus iOS "Scheduling (Proposed)" screen (W1):
  - a month calendar (Sunday–Saturday) where each day has **Morning / Afternoon / Evening** slots marked
    available (green) or not (grey);
  - separate tabs per provider ("DIRECTV", "AT&T");
  - a summary line per provider with the chosen window. The **AT&T window is two hours** (shown as
    "08:00 AM - 10:00 AM"); the DIRECTV window is four hours ("08:00 AM - 12:00 PM").
  - The guide says the area "shows all available appointments for the selected product installation".
- **Window format.** An AT&T Community forum post (W11) gives two-hour windows "8-10, 10-12, 2-4, and rare
  possible 4-6". Third-party guides also cite 4-hour windows; sources disagree.
- **Fiber install length:** "It takes four to six hours to install AT&T Fiber" (W7). An adult (18+) must be
  present (W1 2018 T&C; third-party guides).
- **Air:** consumer Air is "$0 self-setup", "plug in your included equipment" (W12). So for Air this panel
  probably shows a ship or activation (due) date or a self-install confirmation rather than a technician slot
  (inferred). Business Air pro install is "no earlier than 5-7 business days after the ... device order to allow
  for shipment" (W10, business product only).
- **After the order:** AT&T sends "confirmation of your service activation or tech installation date". To change
  it, "enter your order or account number to find a time that works for you", or call 800.288.2020 and say
  "change installation" (W6).

### (c) Open questions
- What does the portal list: date plus window radio buttons, a drop-down, or a calendar? How many days ahead?
- Are slots reserved (held) when picked, and do they expire with the 30-minute session?
- For Air: is there anything to choose (ship speed, activation date), or is the panel informational?
- Are there install notes or extra contact fields (alternate phone, gate code, "adult present" acknowledgment)?

---

## 4. "Account Security"

### (a) Confident (seen on the portal)
- Header "Account Security", id `PanelHeader`, between Scheduling and ABP. It appears for **Fiber** (P2 build
  27 Oct; P4 on 29 Oct) and is **absent for Internet Air** in both the 24 Sep and 27 Oct builds (P1, P3).
- No fields have been seen.

### (b) Likely, from outside material (not seen on the portal)
- **A 4-digit PIN plus a security question and answer.**
  - SARA Plus iOS "Customer Security" (W1). Screen text: "For authentication purposes, customers are required
    to set up a 4-digit passcode (Pin), a security question & answer, and provide an email address. This PIN
    will be used to verify you whenever you contact AT&T about your account. Please make a note of this
    information."
  - W1 field labels: "Select PIN Number:", "Security Question:" (a picker; visible options "What is your
    favorite restaurant?" and "Who is your favorite actor?"), "Security Answer:", "Email Address:". Note under
    the fields: "An email address is required for account, billing and installation notifications."
- **AT&T's PIN rules**, CableFinder "Account Registration" for AT&T Air (W2, step 12): "Create a 4 digit PIN for
  your account". Validation text: "A valid AT&T PIN is a 4 digit number. It cannot be 1234, the same number
  repeated (e.g.2222) or the last four digits of the social security number." Then "Select one secret
  question", radio options including "What is your favorite restaurant?", "What is your favorite actor?", "Who is
  your favorite childhood hero?", "What is your favorite singer?" (the list is cut off in the screenshot).
- **What AT&T says the passcode is for:**
  - "Every account has a passcode" (W9).
  - The account passcode "is used when you visit a store or call us" (W9).
  - "It is the same passcode you chose when you ordered your service", and the customer uses it with the account
    number to register at att.com/login (W6).
  - A search-result snippet of an AT&T small-business page (the page now returns 404) said a four-digit
    passcode is "required to complete your AT&T installation".
  - Snippets of another AT&T page said "a 4-digit account security passcode is available for U-verse TV, AT&T
    Internet, DIRECTV STREAM, and DIRECTV accounts", while wireless-only accounts use a separate passcode of
    4–8 characters. That page could not be fetched either; treat it as unverified.

### (c) Open questions
- Exact portal labels: is the PIN typed twice (confirm)? Masked? Is the security question a drop-down or
  radios, and what is the full list?
- Rules for the security answer (length, characters).
- Does the panel also ask for an email (as in W1), or reuse the Personal Information email?
- Why does Air have no Account Security panel? Possibly Air's account security is set another way (for example
  a wireless-style passcode or AT&T contacting the customer). This could not be found.

---

## 5. "ABP - AutoPay Option"

### (a) Confident (seen on the portal)
- Header "ABP - AutoPay Option", id `PaymentHeader`, for Air and Fiber (P1–P4). **It is present even when
  AutoPay was declined in Options** (P3, P4).
- The portal's own AutoPay text:
  - Options step (P7): "$10/mo AutoPay and Paperless Billing discount with bank account or AT&T Citi. Reduced
    to $5/mo with debit card and no discount with credit card. If you decline AutoPay and Paperless Billing your
    price will increase."
  - Cart line (P1, P2): "AutoPay/Paperless Billing Discount −$10.00", sub-line "Taxes and fees extra. Plan price
    after $10/mo. discount (starts within 2 bills) when you sign up for paperless billing and AutoPay with bank
    account or AT&T Citi. Reduced to $5/mo with debit card and no discount with credit card."
  - Offer details (P5): "Discount off the monthly rate when account is active & enrolled in both. Pay full plan
    cost until discount starts w/in 2 bill cycles. Must maintain autopay/paperless bill and valid email address
    to continue discount."
- The page has hooks that fit a pop-up or iframe step (`pipConfigComplete(code)` and its hidden fields; see the
  general section). Which panel uses them is unknown.

### (b) Likely, from outside material (not seen on the portal)
- **"ABP" = Automatic Bill Payment**, AT&T's term for AutoPay ("AutoPay (Automatic Bill Payment)", AT&T
  small-business support, per search results). This is weakly sourced.
- **Payment types and discounts** (W3, W4):
  - Bank account (checking or savings) or AT&T Points Plus Card from Citi: $10/mo.
  - Debit card: $5/mo.
  - "There's no longer an AutoPay discount for other credit cards."
  - Internet Air: "$5 regardless of payment method" (W3). **This conflicts with the portal's Air cart, which
    showed −$10** (P1). The Air plan card said "$5/mo." (P7). Needs checking.
  - Paperless billing required; a valid email must be kept.
  - W5: AutoPay can use a bank account, debit card or credit card.
- **Fields this implies** (inferred; AT&T's exact labels not found):
  - bank: account type (checking/savings), routing number, account number, maybe account-holder name;
  - card: card number, expiration, billing ZIP, maybe CVV.
  - The SARA Plus iOS guide (W1) shows a "Payment Information" screen with "Today's Charges", "On File Payment:
    AT&T/DIRECTV requires on file payment information for all customers", a button "Enter Payment Information"
    (the device is handed to the customer), card-type detection, and a "Payment Information Verified" label.
    That screen was marked "(Proposed)" in 2018.
- **Can AutoPay be set up later?** Yes, on att.com: the AutoPay page describes enrolling an existing account in
  the Payment Center. "It can take up to two bill periods for AutoPay to start" (W3); "it may take up to six
  weeks to start" (W5). Whether the **order's** discount survives if AutoPay is not set up at checkout is not
  stated anywhere found; the portal cart only says "starts within 2 bills".
- **Payment due at order:** CableFinder business Air says the customer must "Pay their first month of service"
  through an AT&T link (W2). Whether consumer portal orders take a payment today is unknown.

### (c) Open questions
- What does the panel show when AutoPay was declined in Options: a decline confirmation, a second chance to
  enrol, or a required payment method on file?
- Is payment entered directly in portal inputs, or in a hosted or tokenised iframe or pop-up (PCI)? Possibly
  the `pipConfigComplete` callback, but unconfirmed.
- Is there a separate paperless-billing checkbox or email confirmation?
- Is there a review/submit step after this panel? The page has 3 empty control slots after `PaymentHeader`, and
  no "Submit order" control has been seen.

---

## Sensitive items (each needs a decision before building or automating)

| Item | Why it is sensitive | Source of the claim |
|---|---|---|
| Card numbers, expiry or CVV; bank routing and account numbers (ABP panel) | Payment credentials, PCI scope. Our own rules forbid collecting them: `research/spoc-analysis.md` §3 ("No SSN, DOB, card or bank data is ever collected"), and the sensitive-key regex in `order-service/server.py:83` and `att-site/src/lib/order/validation.ts:21` (matches `card`, `routing`, `bank`, `account`, `expir`, `cvv`) | Payment types: portal Options/cart text (P1, P5, P7), W3–W5. Payment-entry screen: W1 |
| 4-digit account PIN or passcode, and security question answer (Account Security, Fiber) | Account credentials AT&T uses to verify the customer by phone or in store and to register online. The same regex matches `pin` and `passcode`, so the current server would **reject** these fields | W1 Customer Security screen; W2 PIN rules; W6, W9 |
| Accepting AT&T's Terms (Internet Terms of Service with individual arbitration, auto-renewal disclosure) **on the customer's behalf** | Acceptance is legally the customer's act ("You must accept this Agreement..."); the arbitration clause has a 30-day opt-out (third-party claim). Other channels capture the customer's own signature (W1) or send the customer an AT&T link to accept (W2) | W8, W1, W2; portal disclosure text P5/P6 |
| AutoPay enrolment and paperless-billing consent | Authorises recurring debits; paperless changes how bills are delivered | P7 Options text; W3 |
| Booking an install appointment | Commits the customer's time and starts AT&T work orders; changes go through AT&T (att.com or 800.288.2020) | W6; W1 |
| SSN / DOB (credit check, before these panels) | Already covered in OPEN_ITEMS O-33; noted because every later panel depends on that check passing | P1 validators |

## Gaps

- No source shows the actual SPOC web panel bodies, their input ids, validation messages or button labels for
  any of the five sections.
- The current att.com Internet Terms of Service page (att.com/internet-terms) could not be read by the fetch
  tool; only the archived 2019 version was read.
- AT&T's consumer passcode rule pages could not be fetched (404 or no rules shown); the 4-digit rules come from
  the dealer and vendor guides (W1, W2) and search snippets.
- No official AT&T source gives consumer Internet Air shipping times or the consumer install window length.
