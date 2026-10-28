# AT&T SPOC order automation: complete analysis

Analysed on 28 Oct 2026 for wiring the website's **Order Now** flow to the automation. Sources are only the
files listed in section 0. Nothing here is assumed. Where the folder is silent, this document says so, and
the question is recorded in `OPEN_ITEMS.md` (O-17 onwards).

> **Security note.** The folder `attspoc AT&T/` holds the partner portal key (in `portal_url.txt`, and
> hard-coded in `attspoc_probe.py`). It also holds real people's test data and portal screenshots. It has been
> added to `.gitignore` and is **not** in the website repository. This document never reproduces the key or
> the portal link.

---

## 0. Files read

There are two copies: `AT&T Multi-page claude/attspoc AT&T/` and `Downloads/attspoc AT&T/`. They are
byte-identical (same names, sizes and dates). Two older snapshots also exist: `Downloads/attspoc AT&T.zip`
from 30 Sep and `Downloads/attspoc AT&T (2).zip` from 2 Oct. Their listings were read, and they contain
nothing the folder lacks.

| File | What it is | How it was read |
|---|---|---|
| `README.md` | Setup, test commands, backend usage, notes | In full |
| `att_order_automation.py` (1,748 lines) | The automation: schema, statuses, portal steps, quote/handoff orchestration, test CLI | In full, every line |
| `attspoc_probe.py` (184 lines) | Earlier feasibility probe of the address step only | In full |
| `requirements.txt` | `playwright==1.60.0`, `pydantic==2.13.3`, `email-validator==2.3.0` (Python 3.11) | In full |
| `sample_order.json` | Test request: Internet Air, 300 Plainview Road, Hicksville NY 11801, "Test Customer" | In full |
| `orders/atlanta_915_courtenay.json` | Test request: Internet 300 (Fiber 300), Atlanta GA 30306 | In full |
| `orders/dallas_2650_lakeforest.json` | Test request: AT&T Internet Air, Dallas TX 75214 | In full |
| `orders/customer_name.json` | A request with a real-looking person's name and phone number (Atlanta, Fiber 300) | In full (contents not repeated here) |
| `portal_url.txt` | The partner link, including the partner key (a credential) | Read; host only noted (`www.attspoc.com`) |
| `share/att_order_automation_src.zip` | 30 Sep copy of the module, README, requirements and sample (4 files) | Listing; it is an older version of the files above |
| `share/att_automation_demo.mp4`, `share/client_demo_dallas.mp4` | Demo recordings | Binary video; not viewable here, noted by name and size |
| `__pycache__/*.pyc` (2) | Compiled copies of the two `.py` files | Not decompiled; the sources were read instead |
| `order_artifacts/*/*.html` (15 files) | Redacted portal pages saved on failed steps | All 15 parsed: plan cards, option groups, cart lines and help texts extracted |
| `order_artifacts/*/*.png` (about 140) | Masked step screenshots from 26 runs (28 Sep to 2 Oct) | Listed by run and step; representative ones viewed (checkout "ready for specialist", options) |
| `order_artifacts/**/*.webm`, `*.mp4` (20) | Step recordings | Binary video; noted by name and size |

**Not present anywhere.** The task and the README mention these, but none exists in the folder, the two zips
or the user's Downloads, Documents or Desktop:

- the integration handbook ("SPOC Order Prep Handbook");
- the specialist runbook;
- Aria's system prompt;
- any Dockerfile, deployment notes or monitoring notes;
- automated tests;
- sample responses.

The README itself says the result statuses, the payload format, Aria's prompt rules, the runbook and the
deployment notes "are in the integration handbook". Everything below is therefore taken from the code, which
is the only authoritative source available (O-17).

---

## 1. Architecture

| Aspect | Finding |
|---|---|
| Language and framework | **Python 3.11**. **Playwright for Python 1.60.0** (async API) drives **Chromium**; **Pydantic 2** validates the request schema; `email-validator` backs `EmailStr`. |
| What it is | A **Python module plus a test CLI**, not a web service. The entry point is `await process_att_order(payload: dict) -> dict`, which never raises and always returns a result dict. `to_aria(result)` strips internal keys. `shutdown()` closes the shared browser. |
| How it starts | CLI only: `python att_order_automation.py <order.json> --mode quote\|handoff\|both [--headed] [--record-video] [--blur-inputs] [--keep-open]`. In code: `import att_order_automation` and call `process_att_order` inside an asyncio event loop. |
| Hosting and deployment | **Not documented, and no server code exists.** There is no HTTP layer, no port, no Dockerfile and no auth. The README's backend example calls placeholder functions (`send_to_aria`, `specialist_queue.push`) that do not exist. |
| Browser | One shared Chromium process, launched lazily (`_get_browser`). Each call gets a fresh, isolated `BrowserContext` (1400×900, en-US, America/Chicago). Headless by default (`ATTSPOC_HEADLESS=0` shows it). Setup: `pip install -r requirements.txt` then `python -m playwright install chromium`. |
| Concurrency | Up to `ATTSPOC_MAX_CONCURRENCY` (default 3) orders at once (asyncio semaphore). The duplicate-call guard (`_in_flight`) and the quote-session store (`quote_store`) are **in process memory**. The README says: with several workers, route each `order_ref` to one worker or move both to Redis. |
| Timeouts | 60 s per step (`step_timeout_s`); a 300 s hard cap per order (`overall_timeout_s`). The portal session expires after 30 minutes idle. A quote can be resumed by a handoff for 20 minutes (`quote_reuse_ttl_min`). |
| Secrets | **`ATTSPOC_URL`**, the partner link `https://www.attspoc.com/?key=…`. It falls back to `portal_url.txt` next to the module. This is the only credential. Without it the result is `not_configured`. |
| Other env vars | `ATTSPOC_HEADLESS` (default `1`), `ATTSPOC_ARTIFACT_DIR` (default `order_artifacts`), `ATTSPOC_MAX_CONCURRENCY` (default `3`). |
| Disk | Every step writes masked screenshots, and failed steps write redacted HTML, to `ATTSPOC_ARTIFACT_DIR/<order_ref>_<UTC time>/`. Successful runs also save screenshots (`save_success_artifacts=True`). Video goes there only with `--record-video` (needs ffmpeg to join clips). |
| Network | Outbound HTTPS to `*.attspoc.com` only. Any other host mid-run gives `portal_error` (`allowed_host_suffix`). The portal is ASP.NET WebForms with a **cookieless session in the URL** (`/(S(<id>))/`). |
| Ports | None: it opens no port. |
| Resources | Not documented. Chromium with up to 3 contexts typically needs 1–2 GB RAM. The Playwright Chromium download is about 150 MB (this is general Playwright knowledge, not from the folder). |

### Portal flow the code drives

1. **Landing page:** enter the address, click Go, and resolve the address prompts.
2. **Products page:** confirm the qualified address, then open the product tile.
3. **Plans page:** pick the requested plan card and click **Add**.
4. **Install-bundle popup:** choose **Continue**.
5. **Options page:** answer every option group, then **Next**.
6. **Complete page:** this is the hub page, where the cart total is read.

A **handoff** then continues: **Checkout → Personal Information** (name, phone, email, billing language,
contact consent), and **stops before Continue**.

---

## 2. The API

**There is no network API.** No base URL, no authentication, no endpoints and no HTTP status codes exist. The
interface is the Python function below. The two "calls" in the task (Quote about 43 s, Handoff about 10 s)
are two invocations of this function with `mode` set to `"quote"` or `"handoff"`. **Recorded timings:** the
artifact folders of non-recorded runs show about 60 s from quote start to handoff start (for example
`162027Z → 162130Z`). That includes CLI overhead, so a quote takes roughly 45–60 s. No timing is documented
for the handoff alone.

```python
result = await process_att_order(payload)   # dict in, dict out, never raises
public = to_aria(result)                    # drops handoff, detail, failed_step, session_id, artifacts_dir, duration_s
```

Because the website needs a network API, the integration adds a thin authenticated HTTP wrapper,
`order-service/` (see the integration plan). Its endpoints are ours, not the automation's.

### 2.1 Request (`OrderRequest`; every level forbids unknown keys)

```json
{
  "order_ref": "string, min 4 chars, idempotency key",
  "mode": "quote | handoff",
  "customer_confirmed": false,
  "service_address": {
    "street": "min 3 chars, street line only",
    "unit_type": "Apartment|Building|Floor|… or null",
    "unit_number": "string or null",
    "city": "min 2",
    "state": "2-letter code or full name",
    "zip_code": "^\\d{5}(-\\d{4})?$"
  },
  "customer": {
    "first_name": "min 1",
    "last_name": "min 1",
    "phone": "10-digit US number, any formatting (leading 1 accepted)",
    "email": "valid email syntax (EmailStr)",
    "billing_language": "english | spanish (default english)",
    "contact_consent": false
  },
  "products": [
    { "product_type": "internet | tv | wireless", "plan_name": "plan name as shown in the portal", "options": { "<group_key>": true } }
  ]
}
```

Fields and rules:

- **`order_ref`:** the idempotency key.
- **`customer_confirmed`:** must be `true` for a handoff.
- **`customer`:** required for `handoff`. A quote needs no personal data and the code never reads it.
- **`products`:** at least 1 entry, at most one per `product_type`. Several entries make a bundle.
- **`options`:** maps a group key to an answer. `true` takes the single offered choice. `false` takes the one
  "Decline…" choice. A string picks the choice whose title contains it.
- **Option group keys** are derived from the portal's DOM ids, for example `_divAutopayOption` gives
  `autopay`. The keys seen in saved pages are listed in 2.6.

### 2.2 Result (`OrderResult.model_dump(mode="json")`)

```json
{
  "status": "quote_ready | handoff_ready | … (19 values, 2.3)",
  "order_ref": "…",
  "message": "voice-agent sentence for the customer",
  "retryable": true,
  "data": {
    "cart_order_id": "DSIX…",
    "selected_plans": [{ "product_type": "internet", "name": "AT&T Internet Air", "subtitle": "AT&T Speeds up to 300 Mbps", "price": "$65/mo.", "disclosure": "…" }],
    "selected_options": [{ "product_type": "internet", "group": "autopay", "choice": "AutoPay/Paperless Billing Discount", "price": "-$10/mo." }],
    "cart_summary": { "sections": ["internet"], "monthly_lines": [{ "section": "internet", "item": "AT&T Internet Air", "charge": "$65.00" }], "monthly_total": "$55.00" }
  },
  "detail": "internal only",
  "failed_step": "internal only",
  "session_id": "internal only",
  "artifacts_dir": "internal only",
  "duration_s": 51.3,
  "handoff": "internal only: specialist queue, see 2.5"
}
```

What `data` carries, by status:

- **Run data:** `cart_order_id`, `selected_plans`, `selected_options` and `cart_summary` are added whenever the
  run got that far, including on failures.
- **`options_required`:** `option_groups: [{key, heading, choices: [{title, price, selected, details}]}]`.
  **`details` can contain agent scripts and disclosures, so it is not for customers.**
- **`plan_not_found`:** `available_plans`.
- **`product_not_available`:** `available_products`.
- **`address_ambiguous`:** `address_options`.
- **`address_not_found`:** `field_errors`.
- **`invalid_customer_details`:** `fields` (for example `["email"]`) and `field_errors`, the portal's own
  messages.
- **`unexpected_cart_items`:** `unexpected_sections`.
- **`invalid_input`:** `field_errors`.
- **`sensitive_data_rejected`:** `rejected_fields` (the key paths only, never the values).

### 2.3 Every status and how to respond

| Status | Meaning (from code) | Retryable flag | Website response |
|---|---|---|---|
| `quote_ready` | Plan available; real monthly total in `data.cart_summary.monthly_total`; portal session stored for the handoff | no (OK) | Show the itemised quote |
| `handoff_ready` | Checkout Personal Information filled, stopped before Continue; `handoff` block built | no (OK) | Show the reference number; a specialist completes the credit check and payment |
| `invalid_input` | Schema validation failed | yes | Our server validates first, so this is a bug. Show the honest failure with Call Now |
| `sensitive_data_rejected` | Unknown key looks like SSN, DOB, card, bank, PIN or password | yes | Never sent: our server rejects such requests first. Show the honest failure |
| `not_confirmed` | Handoff without `customer_confirmed: true` | no | Bug; honest failure |
| `duplicate_request` | Same `order_ref` already running in this process | no | The wrapper prevents it with idempotency keys; if seen, honest failure |
| `address_not_found` | Portal could not verify the address, or rejected its format | yes | Back to Address with a "check the address" message |
| `address_needs_unit` | Portal wants an apartment or unit | yes | Back to Address; ask for the unit |
| `address_ambiguous` | Several matches, or the portal proposed or qualified a different address | yes | Back to Address; ask the visitor to check, or call |
| `no_offers` | No product tiles or plan cards at the address | no | "No online offers at this address"; Call Now |
| `product_not_available` | Service type not sold at the address | yes | "Plan not available at this address"; Change plan or Call Now |
| `plan_not_found` | Not exactly one plan card matched `plan_name` | yes | Same as above |
| `options_required` | An option group has no usable answer (the portal pre-selects paid options) | yes | Show those groups as explicit choices (title and price only, nothing preselected); re-run the quote |
| `unexpected_cart_items` | Cart holds a product type that was not ordered (DIRECTV push) | no | Stop: "Please call us to complete your order"; no total shown |
| `invalid_customer_details` | Portal rejected contact details (for example an invalid email) | yes | Back to Your Details; highlight the field |
| `session_expired` | Portal session dead or replaced | yes | Offer one retry, then Call Now |
| `portal_error` | Portal error modal, unexpected page, wrong host, field refused to stick | yes | Honest failure; one retry plus Call Now |
| `timeout` | A step exceeded 60 s or the order exceeded 300 s | yes | Honest failure; one retry plus Call Now |
| `not_configured` | Portal link missing, or a selector for this step not configured | no | Honest failure; Call Now |

**Error codes.** There are none beyond these statuses. The voice-agent `message` texts (for example "I'm
connecting you with a specialist…") are written for Aria. The website uses its own wording instead.

**Retry rules (from code).**

- `RETRYABLE` lists the statuses where the same call may be repeated, "optionally after fixing the input".
- A stale or unusable stored quote is never retried: it is popped once.
- If the handoff cannot resume the quote's session, it falls back to a fresh run. The exception is
  `unexpected_cart_items`, which is always fatal.

### 2.4 How the handoff reuses the quote's portal session

- After `quote_ready`, the module stores a `QuoteSession` in `quote_store`, keyed by `order_ref`. It holds
  the hub-page URL with the session id, a SHA-256 **fingerprint** of address, products and options, the cart
  id, the selected plans and options, and the cart summary.
- A `handoff` with the **same `order_ref`** within **20 minutes** pops it (single use). If the fingerprint
  differs (anything changed except the customer details), it is ignored.
- Otherwise `resume_quote_session` reopens the URL and proves it is the same order:
  - the same session id, with no `LinkNotValid.aspx` and no new id;
  - a hub page;
  - the same qualified address;
  - cart sections exactly equal to the ordered product types;
  - **the same monthly total**.
- Any mismatch falls back to a fresh quote run, then checkout. `unexpected_cart_items` is never papered over.
- **Consequences for the integration:**
  - (a) the handoff must reuse the quote's `order_ref` and the identical address, products and options;
  - (b) both calls must reach the **same process**, because the store is in memory;
  - (c) a handoff after a failed handoff runs fresh (about a quote's duration plus the checkout).

### 2.5 The `handoff` block (specialist queue only)

`portal_url` is the live portal session, a **bearer link** to the customer's data. It also carries
`prepared_at`, `open_before` (now + 30 min), `cart_order_id`, `customer` (name, phone, email),
`service_address`, `monthly_total`, `credit_check_required`, `tasks` (text for the specialist) and
`resumed_from_quote`. The code comment says: "never pass to Aria or read aloud". It must never reach a
browser.

### 2.6 Portal facts confirmed by the saved pages

**Plan names on the Fiber plans page (Atlanta, 2 Oct):**

- `Internet 5000 (Fiber 5 GIG)`
- `Internet 1000 (Fiber 1 GIG)`
- `Internet 500 (Fiber 500)`
- `Internet 300 (Fiber 300)`

**Internet Air** (Hicksville, Dallas): `AT&T Internet Air`, "Speeds up to 300 Mbps".

**Internet Air option groups:**

- `autopay`: "AutoPay/Paperless Billing Discount", **-$10/mo.**, pre-selected; or "Decline AutoPay/Paperless
  Billing", $0.
- `wifi_extender`: Extended Wi-Fi (All-Fi Extender), **$12/mo.**, **pre-selected**; or "Decline Extended Wi-Fi
  Coverage Service", $0.
- Included: AT&T All-Fi Hub.
- Cart with the extender declined: $65.00 − $10.00 = **$55.00/mo.**

**Fiber 300 option groups:**

- `autopay` (as above).
- `equip`: "AT&T Internet Equipment Fee", $0, the only choice.
- `install`: "AT&T Professional Install", $0, the only choice.
- Included: "$15 off for 12 months", "Unlimited Data".
- Cart: $60 − $15 − $10 = **$35.00/mo.**

Option groups for Fiber 500, 1000 and 5000 were **not captured**. The flow therefore handles them through
`options_required`.

---

## 3. Security rules (as implemented)

1. **No SSN, DOB, card or bank data is ever collected or accepted.**
   - Every schema level is `extra="forbid"`.
   - An unknown key matching
     `ssn|social|tax_?id|dob|birth|card|cvv|cvc|expir|account|routing|bank|iban|\bpin\b|password|passcode`
     returns `sensitive_data_rejected`. It is logged as field paths only, and **values are never logged or
     echoed** (Pydantic's `input` is discarded).
2. **Masked fields are never typed into.** `type_into()` raises if the target is `type=password`; SSN and DOB
   are masked inputs. There are deliberately **no selectors** for DOB, SSN, the Continue button, or anything
   after it (shipping, terms, scheduling, AutoPay payment, submit).
3. **Screenshots and saved pages are redacted.**
   - Screenshots mask every text, email, tel, password and untyped input.
   - HTML dumps blank the `value=` of every text-like input (ASP.NET re-renders typed SSN and DOB into the
     HTML after a postback).
   - **Limit:** page text such as the qualified address banner and the cart is not masked. The README warns
     that artifacts "still describe the customer's order: keep them private and delete them on a schedule".
4. **The specialist portal link is never exposed** to the customer or the caller. `to_aria()` removes
   `handoff`, `detail`, `failed_step`, `session_id`, `artifacts_dir` and `duration_s`.
5. **Logging.** Contact details are logged masked (`***-***-0100`, `p***@domain`). The session URL *is*
   logged at `INFO` ("session opened <url>"). The landing URL contains only the session id, not the key, but
   logs still need private storage.
6. **The automation never places an order.** It stops before Continue on Checkout.

---

## 4. Portal behaviours handled

| Behaviour | How the code handles it |
|---|---|
| **Pre-selected paid add-ons** (Extended Wi-Fi **$12/mo.** pre-selected; the AutoPay discount pre-selected) | Every option group must be answered explicitly. Unanswered gives `options_required`. After clicking, it re-reads and verifies each answer "stuck", otherwise `portal_error`. Defaults are never accepted. |
| **Unrequested DIRECTV bundles** (a saved page of 28 Sep shows **DIRECTV PREMIER $203.98/mo.** pushed into an Internet Air cart) | `check_cart()` runs after every click and aborts with `unexpected_cart_items` if any cart section is not an ordered product type. Reaching the TV add-ons page during a non-TV flow does the same. It is never papered over on resume. |
| **Invalid email** (the portal validates server-side and showed "Email is invalid. Please fix." 3 times in saved pages) | After filling, it reads the email hidden flag and visible validation spans, then returns `invalid_customer_details` with `fields: ["email"]` so the customer can correct it while still in the flow. |
| **Credit check** ("Before we continue with your order, we will need to initiate a credit check. Is that OK?" plus DOB and SSN) | Detected only, to set `credit_check_required` and the specialist task. Continue (which runs the check) is **never clicked**; there is no selector for it. |
| **Pre-checked contact consent** ("Reach me by phone or text…") | Set from the order's `contact_consent` (default false); never left on the portal default. |
| Address prompts (SmartyStreets suggestions, "is this correct?", multiple matches, "more details" = unit) | Handled automatically when unambiguous. Otherwise `address_ambiguous` or `address_needs_unit`. The "This address is accurate" override is deliberately never ticked. |
| Install-fee bundle popup after Add | Always "Continue". |

---

## 5. The specialist queue

- **How an order is queued.** The code only *produces* `result["handoff"]`. The README's
  `specialist_queue.push(...)` is a placeholder. **No queue exists in the folder** (O-18).
- **What the specialist sees.**
  - The `handoff` block (2.5): the portal link, customer contact details, address, monthly total, cart id, a
    deadline (`open_before`, 30 min) and a task list:
    1. If the credit check is shown: ask the on-page consent question, then collect DOB and SSN from the
       customer and click Continue.
    2. If AutoPay was selected: collect the payment method in the "ABP - AutoPay Option" panel ($10/mo.
       discount with a bank account or AT&T Citi card, $5/mo. with a debit card, none with a credit card;
       confirm the price).
    3. Complete Shipping and Billing Address, Terms, Scheduling and payment, confirm the monthly total, then
       submit.
  - Opening the link shows Checkout with name, phone and email filled in and the credit-check box waiting (seen
    in the `ready_for_specialist` screenshot, with a 30:00 idle timer).
- **Who does what.** A **human specialist** does the credit check, payment and submission. The automation
  does none of them. `--keep-open` (CLI only) leaves the browser on Checkout for a specialist at the same
  machine.

---

## 6. Test results, known limits, gaps and contradictions

**Test evidence (artifacts, 28 Sep to 2 Oct 2026; 26 runs).**

- **Quote and handoff both reached `handoff_ready`** (a `ready_for_specialist` screenshot exists) for:
  - Internet Air at Hicksville NY (sample order), several runs;
  - Internet Air at Dallas TX, 3 runs;
  - Fiber 300 at Atlanta GA, 3 runs, including the order with real-looking customer data.
- **Earlier runs failed while the selectors were being built:**
  - select plan or products (the Plans, Options, Addons and Complete pages);
  - customer details (field loss after postback, invalid email);
  - one address failure (`real-customer-001`).
- Each later run shows the fix holding.

**Known limits (README and code).**

- Only **Internet** is mapped. TV and Wireless flows are not.
- The in-process duplicate guard and quote store allow **one worker process** only.
- Artifacts are sensitive and need retention.
- Options for Fiber 500, 1000 and 5000 are unknown until a quote returns `options_required`.

**Gaps and contradictions found.**

1. **The partner key is hard-coded** as the default in `attspoc_probe.py`. The README says the key "is not in
   the source". The key should be rotated, and the default removed (O-19).
2. The **handbook, runbook, Aria's system prompt and deployment notes** cited by the README do not exist in
   the folder (O-17).
3. **There is no HTTP API, no server, no auth, no deployment files and no specialist queue**, although the
   task describes an API with a base URL and key (O-17, O-18).
4. The README says "Tested end to end for Internet orders at one address". The artifacts show successful runs
   at **three** addresses (NY, TX, GA).
5. The README says `--record-video` blurs typed values. In the code, blurring happens **only with
   `--blur-inputs`** (`video_blur_inputs` defaults to `False`).
6. `orders/customer_name.json` and the `real-customer-001` and `sai-ram-atl-001` artifacts hold what look like
   **real people's details** in a test folder (O-20).
7. The `RETRYABLE` set includes `sensitive_data_rejected` and `invalid_input`, which only makes sense after
   the input is corrected. Callers must never resend sensitive data.
8. `EmailStr` checks syntax only, while the portal checks deliverability. The website must therefore handle
   `invalid_customer_details`; a client-side check cannot replace it.
9. Successful runs save screenshots (`save_success_artifacts=True`), so artifacts accumulate for every
   customer, not only on failure.
10. The `CUSTOMER_MESSAGES` texts are voice-agent phrasing, unsuitable for a web page.

---

## 7. What can run on Vercel and what cannot

| Part | Vercel? | Why |
|---|---|---|
| The automation (Python, Playwright, Chromium) | **No** | A quote takes about 45–60 s and a cold run can reach the 300 s cap. It needs a full Chromium, Python 3.11 with pinned packages, and **in-memory state shared between the quote and the handoff calls** (session store, duplicate guard, a shared browser). Serverless functions are short-lived, stateless and isolated, so the second call would not find the first call's session. |
| An HTTP wrapper around it (`order-service/`) | **No**; it runs alongside the automation | It must be in the same long-running process as the automation. |
| The order pages, form validation and the `/api/order/*` routes | **Yes** | Short requests: start a job, poll its status, submit. No secret reaches the browser. |

**Where the automation must run.** It needs **one long-running container or small VM**. Requirements:

- Python 3.11 and the Playwright Chromium;
- at least 2 GB RAM;
- **one instance** (until the stores move to Redis);
- outbound HTTPS to `attspoc.com`;
- HTTPS in front of it;
- private disk for artifacts and the specialist queue.

Suitable hosts include a small cloud VM, or Fly.io, Railway or Render (single instance), or Google Cloud Run
with min = max = 1 instance and CPU always on.

**How the website reaches it.** Next.js route handlers call the service's HTTPS URL with a shared secret, held
in server-only Vercel environment variables (`ATTSPOC_SERVICE_URL`, `ATTSPOC_SERVICE_KEY`).

**Unknown.** Whether the portal restricts by IP or region, or detects data-centre traffic. The probe checks
for bot-protection markers, but no result is saved. A first deployment should be tested from the chosen host
(O-21).
