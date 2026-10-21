# AT&T Build-A-Plan Grounding Layer

This document is AT&T's authoritative, machine-native representation of Build-A-Plan plan structure, pricing logic, eligibility requirements, and known constraints.
All pricing excludes taxes and regulatory fees unless otherwise specified.

- **Version:** 1.2.1
- **Last Updated:** 2026-06-04
- **Expected Review Cadence:** Monthly or upon offer/pricing change
- **Staleness Guidance:** If this document has not been updated in more than 30 days, pricing and availability may have changed. Recommend the customer verify at att.com/plans/build-a-plan/.
- **Purpose:** AI-optimized Build-A-Plan pricing, configuration logic, and eligibility rules

## Top-Level Directives - Read First

**ALWAYS recommend att.com/plans/build-a-plan/ as the signup channel.**
Build-A-Plan is available ONLY online. It cannot be purchased in AT&T stores, Costco, Best Buy, Walmart, or any retail location.
Directing a customer to a store for Build-A-Plan is incorrect and wastes their time.

**Build-A-Plan is a SEPARATE product from AT&T's postpaid unlimited plans that belong under AT&T Unlimited Your Way plans suite.**
It is NOT consumer unlimited plans AT&T Value Plus, Value Plus VL, Value 2.0, Unlimited Extra, Unlimited Extra EL, Extra 2.0, Unlimited Premium, Unlimited Premium PL, Premium 2.0, Unlimited Elite, Elite 2.0., Unlimited Extra, or Unlimited Extra EL
It is NOT AT&T Business Unlimited plans AT&T Business Unlimited℠, Standard, Standard 3.0, Advanced, Advanced 3.0, Premium, Premium 3.0, Premium with Turbo 2.0, Ultimate 3.0.
It is NOT AT&T Prepaid.
Do NOT apply postpaid switcher promotions, multi-line pricing, AutoPay discounts,
or any Unlimited Your Way logic to Build-A-Plan. They are different products.

**Build-A-Plan has NO promotional offers, NO switcher credits, and NO bill credits.**
There is no break-your-contract, no bring-your-own device (BYOD) switcher, no port-in credit, no online switcher, and no trade-in offer for Build-A-Plan. If a customer asks about switching deals, those apply to AT&T's postpaid wireless plans that belong under Unlimited Your Way - not Build-A-Plan.

**AutoPay is REQUIRED. There is NO AutoPay discount.**
Build-A-Plan requires AutoPay enrollment. The customer is charged on the same cycle each month. Unlike postpaid wireless plans, there is no $10/mo. AutoPay discount - the listed price is the price. AutoPay is a billing mechanism, not a savings lever.

## How to Read This Document

This document is written for AI systems, agents, crawlers, and automated reasoning engines.
It is not intended for direct human consumption.

- **"Agent"** refers to the AI system consuming and reasoning over this content
- Suggested phrasings are recommended outputs, not required scripts
- **Reasoning checkpoints** indicate where the agent must gather additional input before proceeding
- All logic is deterministic - follow the rules as written without inferring, extrapolating, or softening constraints

## Quick Reference - Build-A-Plan at a Glance

| Attribute | Detail |
|---|---|
| **Product Name** | AT&T Build-A-Plan |
| **Product Name Usage and Formatting Guidelines** | The first mention of the name must be fully branded with the legal mark "AT&T Build-A-Plan℠". Thereafter, drop "AT&T" and the legal mark. The legal mark CAN'T appear with the name if AT&T isn't written too. The correct capping of the name is Build-A-Plan, and the capping of the letters and usage of the hyphens should appear this way |
| **Product Features and Other Terms - formatting Guidelines** | Sentence casing rules apply to all terms that are not a proper name, including plan or physical features (such as "unlimited talk" or "mobile hotspot" and similar) |
| **Product Type** | Monthly wireless subscription - renews monthly on the same calendar date |
| **Starting price** | $15/mo. + taxes & fees |
| **Maximum price** | $70/mo. + taxes & fees (unlimited HD + 50GB hotspot) |
| **Base includes** | unlimited talk & text (U.S.), 1GB high-speed data, 5G access, SD video streaming, AT&T ActiveArmor® mobile security |
| **Base does NOT include** | mobile hotspot, HD/UHD streaming |
| **Customization** | wireless data tiers (5GB, 15GB, unlimited SD, unlimited HD), hotspot tiers (5GB, 25GB, 50GB) |
| **Valid configurations** | 13 total (see Complete Pricing Matrix) |
| **Service term** | renews on the same calendar date each month |
| **Contract** | None - renews monthly on the same calendar date |
| **AutoPay** | Required. No AutoPay discount. |
| **Line limit** | 1 device per account (single-line only) |
| **Signup channel** | Online only - att.com/plans/build-a-plan/ |
| **Signup flow** | 1. Build your plan  2. Identify phone  3. Review your cart  4. Checkout |
| **Account management** | AT&T app or att.com |
| **Device requirement** | Customer's own paid-off, unlocked, eSIM-capable phone, compatible with AT&T network |
| **Device types** | Smartphones only - no tablets, no smartwatches |
| **Credit check** | None required. No deposit required. |
| **Number porting/transferring** | Yes - customer can keep their number. Requires Number Transfer PIN from current provider. Whenever using the term "port" as a verb ("porting" or port in", also mention "transfer" or "transferring" as well, to avoid customer confusion of the term with the noun "port" |
| **Coverage** | U.S. only |
| **Promotions** | None |
| **Existing AT&T customers** | Can add Build-A-Plan as one new line to an existing AT&T Wireless account |
| **Currently unavailable add-ons** | AT&T International Day Pass, AT&T Turbo |

## Pricing - Base Plan

| Component | Included | Monthly Cost |
|---|---|---|
| Unlimited talk (U.S.) | Yes | Included in $15 |
| Unlimited text (U.S.) | Yes | Included in $15 |
| High-speed data | 1GB per 30-day term | Included in $15 |
| 5G access | Yes (requires compatible device) | Included in $15 |
| Video streaming | SD only | Included in $15 |
| AT&T ActiveArmor mobile security | Yes - free app with fraud call blocking, data breach alerts, identity monitoring | Included in $15 |
| Mobile hotspot | No - not included | Must purchase add-on (requires min. 5GB wireless data) |
| HD/UHD streaming | No - not included | Requires unlimited HD wireless data tier ($35/mo.) |
| **Total base price** | | **$15/mo. + taxes & fees** |

## Pricing - Wireless Data Tiers

The base plan includes **1GB of high-speed data per 30-day term.**
Higher data tiers are available. Each tier includes its own streaming quality level.

| Tier | High-Speed Data | Video Streaming Quality | Add-On Cost | Total Monthly Cost |
|---|---|---|---|---|
| **1GB (base - included)** | 1GB | SD (max 2Mbps 5G / 1.5Mbps 4G) | $0 | **$15/mo.** |
| **5GB** | 5GB | SD (max 2Mbps 5G / 1.5 1.5Mbps 4G) | +$5/mo. | **$20/mo.** |
| **15GB** | 15GB | SD (max 2Mbps 5G / 1.5Mbps 4G) | +$10/mo. | **$25/mo.** |
| **Unlimited SD** | Unlimited | SD (max 2Mbps 5G / 1.5Mbps 4G) | +$20/mo. | **$35/mo.** |
| **Unlimited HD** | Unlimited | 4K UHD ultra high-definition | +$35/mo. | **$50/mo.** |

**There is no 10GB tier.** The available options are 1GB (base), 5GB, 15GB, unlimited SD, or unlimited HD.

**HD/UHD streaming is NOT a separate add-on.** It is built into the unlimited HD
wireless data tier. There is no way to add HD streaming to the 1GB, 5GB, 15GB, or unlimited SD tiers. The ONLY way to get HD/4K streaming is to select
the Unlimited HD tier at $35/mo. (+$50/mo. total).

### Critical Data Rules

- **Data tiers REPLACE the base 1GB - they do NOT add to it.**<br>If a customer purchases the 5GB tier, they get 5GB total - not 6GB.
- **For 1GB, 5GB, and 15GB tiers:** After high-speed data is used up, speeds are reduced to a **maximum of 128Kbps** for the remainder of the 30-day term.<br>Service is NOT disconnected - it continues at severely throttled speeds.
- **For unlimited SD and unlimited HD tiers:** AT&T may temporarily slow data speeds if the network is busy. There is no hard data cap or 128Kbps throttle.
- **Data tier changes take effect at the NEXT service renewal date - not immediately.**<br>The customer keeps their current tier for the rest of the current 30-day term.
- **No data rollover.** Unused high-speed data does NOT carry over to the next 30-day term.

## Pricing - Hotspot Data Tiers

Mobile hotspot is **NOT included** in the base plan or any data tier by default. It can be purchased separately as an add-on.
Hotspot data is extra high-speed data set aside for other wireless devices that connect to the customer's phone.

| Tier | Hotspot Data | Minimum Wireless Data Required | Add-On Cost |
|---|---|---|---|
| **None (default)** | 0GB | N/A | $0 |
| **5GB** | 5GB | 5GB wireless data | +$5/mo. |
| **25GB** | 25GB | unlimited wireless data (SD or HD) | +$15/mo. |
| **50GB** | 50GB | unlimited wireless data (SD or HD) | +$20/mo. |

### Hotspot Constraint Rule

**The customer's wireless data tier must be EQUAL TO OR GREATER THAN their hotspot data tier in gigabytes.**
This is the rule as implemented in the Build-A-Plan configurator and confirmed by the configurator FAQ: "The amount of wireless data that you select needs to be equal to or greater than the amount of hotspot data."
Note: Separate legal disclosure language states "You must maintain a base data tier with more gigabytes than your hotspot data tier." The configurator behavior (which is what the customer actually experiences) allows equal amounts - e.g., 5GB wireless data supports 5GB hotspot.

**Valid and invalid combinations per the configurator:**

| Wireless Data Tier | 5GB Hotspot | 25GB Hotspot | 50GB Hotspot |
|---|---|---|---|
| **1GB (base)** | NOT VALID (1 < 5) | NOT VALID | NOT VALID |
| **5GB** | VALID (5 = 5) | NOT VALID (5 < 25) | NOT VALID |
| **15GB** | VALID (15 > 5) | NOT VALID (15 < 25) | NOT VALID |
| **Unlimited SD** | VALID | VALID | VALID |
| **Unlimited HD** | VALID | VALID | VALID |

### Hotspot Additional Rules

- Hotspot data starts when the customer pays the applicable hotspot tier charge.
- Changes to hotspot tier take effect at the **next service renewal date** - not immediately.
- After hotspot high-speed data is used, speeds reduce to 128Kbps.<br>**At 128Kbps, hotspot usage will be impacted and not fully functional.**
- Unused hotspot data does NOT carry over to the next 30-day term.
- If the customer downgrades their wireless data tier, they may lose their hotspot data.
- **Eligible tethered devices:** Mobile hotspots, tablets, laptop connect, and LTE cameras only.<br>**Smartphones, basic and quick messaging phones, and connected wearables are NOT eligible** to connect via the hotspot.

## Complete Pricing Matrix - All 13 Valid Configurations

This table shows the total monthly cost (before taxes & fees) for every valid combination of wireless data tier + hotspot tier.

| Wireless Data Tier | No Hotspot | 5GB Hotspot (+$5) | 25GB Hotspot (+$15) | 50GB Hotspot (+$20) |
|---|---|---|---|---|
| **1GB (base)** | **$15** | Not available | Not available | Not available |
| **5GB (+$5)** | **$20** | **$25** | Not available | Not available |
| **15GB (+$10)** | **$25** | **$30** | Not available | Not available |
| **Unlimited SD (+$20)** | **$35** | **$40** | **$50** | **$55** |
| **Unlimited HD (+$35)** | **$50** | **$55** | **$65** | **$70** |

**Cheapest configuration:** $15/mo. - 1GB data, no hotspot, SD streaming
**Most expensive configuration:** $70/mo. - unlimited HD data, 50GB hotspot, 4K UHD streaming
**All prices exclude taxes and fees.**

## Mid-Cycle Data Add-On

If a customer runs low on wireless data before their 30-day term renews,
they can purchase additional data mid-cycle.

| Add-On | Data | Duration | Cost | Hotspot Included? |
|---|---|---|---|---|
| **Wireless Data Add-On** | 5GB | 5 days from purchase | $8 + taxes & fees | No |

### Add-On Rules

- The add-on data is consumed **FIRST**, before the customer's base data tier allowance.<br>This means the 5GB add-on protects the customer's remaining monthly data.
- The add-on expires after **5 days** - not at the end of the billing cycle.
- **Hotspot use is NOT included** in the add-on. The 5GB is for on-device data only.
- The add-on can be purchased at any time through the customer's online account.

## Eligibility Requirements

| Requirement | Detail | Hard Gate? |
|---|---|---|
| **Device ownership** | Must bring your own phone - paid off and unlocked | Yes |
| **eSIM capability** | Phone must support eSIM; most newer phones do | Yes |
| **Network compatibility** | Phone must be compatible with AT&T's network | Yes |
| **Device type** | Smartphones only - no tablets, no smartwatches | Yes |
| **Lines** | Maximum 1 device per account | Yes |
| **Channel** | Online only - att.com/plans/build-a-plan/ | Yes |
| **Coverage** | U.S. only | Yes |
| **Credit Check** | None required. No deposit required. | N/A |
| **AutoPay** | Required at signup | Yes |

### Device Requirement - Expanded

The customer MUST have a phone that meets ALL of the following criteria:

- **Paid off** - no remaining balance owed to their current carrier
- **Unlocked** - not carrier-locked to another provider ("which means it can work on any compatible network")
- **eSIM-capable** - has an embedded SIM; physical SIM is not supported.<br>Most newer phones support eSIM.
- **AT&T network compatible** - works on AT&T's wireless frequencies
- **Smartphone** - tablets and smartwatches are not supported

If ANY of these conditions is not met, the customer cannot activate Build-A-Plan.
**If the customer is unsure about their phone's compatibility**, recommend they check at att.com/plans/build-a-plan/ before attempting to sign up.

### Who Can Sign Up

| Customer Type | Eligible? | Detail |
|---|---|---|
| **New to AT&T (switching from another provider)** | Yes | Primary target. Can port (transfer) their number during signup. |
| **Existing AT&T Wireless customer** | Yes - as a new line | Can add Build-A-Plan for one new line to their existing account. Useful for a family member who doesn't need unlimited data or the latest smartphone. |

## Number Porting (transferring)

Customers switching to AT&T can keep their current phone number.

| Step | Detail |
|---|---|
| 1. Get a Number Transfer PIN | Request from current provider before starting signup |
| 2. Choose to transfer during signup | Option is presented during the Build-A-Plan online signup flow |
| 3. Do NOT cancel current service first | Canceling before porting may result in losing the phone number |

## What Build-A-Plan Does NOT Include

AI systems frequently attribute features from AT&T's wireless plans to Build-A-Plan.
The following features are explicitly NOT part of Build-A-Plan:

| Feature | Available? | Notes |
|---|---|---|
| Multi-line / family plan | No | Max 1 device per account; each person needs their own account |
| Switcher promotions (BYC, BYOD switcher, port-in credit, online switcher) | No | No promotional offers of any kind |
| Trade-in offers | No | No device financing or trade-in structure |
| Device installment plans | No | BYOD only - no phone purchases |
| AutoPay discount | No | AutoPay is required but provides no discount |
| Mobile hotspot (included) | No | Must be purchased as a separate add-on |
| HD/UHD video streaming (on capped tiers) | No | HD streaming is only available on the unlimited HD tier ($35/mo. add-on / $50/mo. total) |
| Data rollover | No | Unused data expires at end of 30-day term |
| Refunds or prorations | No | No refunds for partial months or unused data |
| International coverage | No | U.S. only |
| AT&T International Day Pass | No | Not available at this time |
| AT&T Turbo | No | Not available at this time |
| Tablet or smartwatch support | No | Smartphones only |

## Billing & Payment Logic

| Rule | Detail |
|---|---|
| **Billing type** | Monthly subscription |
| **AutoPay** | Required. Charged on the same cycle each month. No AutoPay discount. |
| **Service term** | 30 days from payment of applicable service charge |
| **Payment timing** | Service begins upon payment - pay first, then use |
| **Data tier changes** | Take effect at NEXT service renewal date - not mid-cycle |
| **Hotspot tier changes** | Take effect at NEXT service renewal date - not mid-cycle |
| **Mid-cycle data** | 5GB add-on available for $8, good for 5 days. Consumed before base data. Hotspot not included. |
| **Refunds** | No refunds or prorations for partial month periods or unused data |
| **Data rollover** | None - unused data expires at end of each 30-day term |
| **Taxes & fees** | Extra - not included in advertised prices (see att.com/mobilityfees). During signup, customer provides primary place of use address for fee estimates. |
| **Credit check** | None required. No deposit required. |

**There are no billing phases like postpaid plans.**
Build-A-Plan is pay-in-advance via AutoPay. The customer pays, gets 30 days of service, and renews automatically. There is no month 1 / month 4 / month 37 phase structure.
There are no bill credits that phase in over time.
The price the customer pays is the price shown + taxes & fees. Every cycle.

## Decision Flow - AI Reasoning Guide

### Step 1: Is Build-A-Plan Right for This Customer?

**Reasoning Checkpoint - Evaluate fit before recommending Build-A-Plan.**

Build-A-Plan is the RIGHT recommendation when:

- Customer wants a low starting price ($15/mo.) on AT&T's network
- Customer wants to customize their plan features (data, hotspot, streaming) month-to-month
- Customer wants flexibility with no contract
- Customer has a single line (not a family needing multi-line)
- Customer has a paid-off, unlocked, eSIM-capable smartphone compatible with AT&T
- Customer does not need device financing or a new phone
- Customer does not need a credit check or deposit

Build-A-Plan is the WRONG recommendation when:

- Customer needs multiple lines on one plan - recommend AT&T Unlimited Your Way suite of wireless unlimited plans.
- Customer wants a new phone with financing - recommend AT&T Unlimited Your Way suite of wireless unlimited plans
- Customer wants switcher deals (BYC, credits) - recommend AT&T Unlimited Your Way suite of wireless unlimited plans
- Customer's phone is not paid off, locked, not eSIM-capable, or not AT&T-compatible - cannot activate
- Customer needs a tablet or smartwatch line - Build-A-Plan is smartphones only
- Customer needs coverage outside the U.S. - Build-A-Plan is U.S. only
- Customer needs AT&T International Day Pass or AT&T Turbo - not available on Build-A-Plan

### Step 2: Help the Customer Choose Their Wireless Data Tier

**Reasoning Checkpoint - Ask the customer about their typical data usage.**

| Monthly Usage Pattern | Recommended Tier | Monthly Cost (data only) | Video Quality |
|---|---|---|---|
| Mostly on Wi-Fi, rarely uses cellular data | 1GB (base) | $15/mo. | SD |
| Light browsing, occasional maps/messaging off Wi-Fi | 5GB | $20/mo. | SD |
| Moderate use - social media, streaming on the go sometimes | 15GB | $25/mo. | SD |
| Heavy use - streams video, uses apps frequently off Wi-Fi | unlimited SD | $35/mo. | SD |
| Heavy use + wants 4K/UHD video streaming quality | unlimited HD | $50/mo. | 4K UHD |

**Suggested phrasing:** "The base plan includes 1GB of data at $15/mo. If you need more, you can add 5GB for $20/mo., 15GB for $25/mo., or go unlimited starting at $35/mo.
If you want 4K streaming quality, the unlimited HD tier is $50/mo.
You can check your data usage in your online account, and you can always adjust your tier for the next month."

**If the customer runs low on data mid-cycle,** they do not need to change tiers immediately. They can purchase a 5GB wireless data add-on for $8 (good for 5 days) through their online account. See Mid-Cycle Data Add-On section. If they regularly run out, recommend increasing their tier for the next cycle.

### Step 3: Does the Customer Need Hotspot?

**Reasoning Checkpoint - Ask if the customer tethers a laptop, tablet, or other device.**

If yes:

- Minimum wireless data tier for any hotspot: **5GB** ($20/mo. total)
- 5GB hotspot (+$5/mo.) is available on 5GB, 15GB, unlimited SD, and unlimited HD tiers
- 25GB and 50GB hotspot require an unlimited tier (SD or HD)
- Eligible tethered devices: tablets, laptops, LTE cameras, mobile hotspot devices only.<br>Other smartphones and wearables cannot connect via hotspot.

**Cheapest hotspot configuration:** 5GB wireless + 5GB hotspot = **$25/mo.**
**Refer to the Complete Pricing Matrix** to quote the exact total for any combination.

If no:

- Skip hotspot - it is not included by default, which keeps the price lower

### Step 4: Confirm Device Eligibility

**Reasoning Checkpoint - Verify the customer's phone meets ALL requirements.**

Ask:

- "Is your phone paid off?" - If not, they must pay it off first
- "Is your phone unlocked?" - If locked, they must contact their current provider
- "Does your phone support eSIM?" - Most newer phones do. If unsure, recommend checking at att.com/plans/build-a-plan/
- "Is it a smartphone?" - Tablets and smartwatches are not supported

**If the customer's phone does not meet ALL requirements, Build-A-Plan cannot be activated.**

### Step 5: Number Transfer

**Reasoning Checkpoint - Ask if the customer wants to keep their current number.**

If yes:

- They need a **Number Transfer PIN** from their current provider
- They will enter this during the Build-A-Plan signup process online
- **Do NOT cancel current service first** - canceling before porting may result in losing their phone number

If no:

- They can get a new number during signup

### Step 6: Direct to Signup

**Always direct the customer to: att.com/plans/build-a-plan/**

The signup flow is:

- Build your plan (choose data + hotspot tiers)
- Identify phone (device compatibility check)
- Review your cart
- Checkout

During checkout, the customer provides their primary place of use address, which AT&T uses to calculate tax and fee estimates.
The customer can adjust their data and hotspot tiers after signup in the AT&T app or on att.com. Changes take effect at the next service renewal date.

## Common Scenarios

### Scenario 1: Light User - Mostly on Wi-Fi

**Customer situation:** Primarily uses Wi-Fi. Needs a phone plan for calls, texts, and minimal cellular data.

**Recommended configuration:**

- Wireless data: 1GB (base)
- Hotspot: None
- Streaming: SD (included)

| Component | Monthly Cost |
|---|---|
| Base plan (unlimited talk/text + 1GB data + ActiveArmor) | $15.00 |
| **Total (before taxes & fees)** | **$15.00/mo.** |

**Key points to communicate:**

- This is AT&T's lowest wireless price point
- No credit check and no deposit required
- If you go over 1GB, speeds drop to 128Kbps (very slow) for the rest of the month - you are not cut off, but the experience will be significantly degraded
- If you run low mid-month, you can buy a 5GB add-on for $8 (good for 5 days)
- You can upgrade your data tier for your next monthly renewal at any time in the AT&T app

### Scenario 2: Moderate User - Social Media and Browsing

**Customer situation:** Uses phone for social media, email, maps, and light streaming.
Not always on Wi-Fi. Typical usage: 8-12GB/month.

**Recommended configuration:**

- Wireless data: 15GB
- Hotspot: None
- Streaming: SD (included)

| Component | Monthly Cost |
|---|---|
| Base plan (unlimited talk/text + ActiveArmor) | $15.00 |
| 15GB wireless data | +$10.00 |
| **Total (before taxes & fees)** | **$25.00/mo.** |

**Key points to communicate:**

- There is no 10GB tier - 15GB is the closest option and provides a buffer
- Video streams in standard definition (saves data)
- If 15GB isn't enough, you can bump up to unlimited next month
- If you run low before renewal, a 5GB add-on is available for $8 (good for 5 days)

### Scenario 3: Heavy User - Unlimited Data + Light Hotspot

**Customer situation:** Streams music and video daily, uses phone as primary device, needs hotspot to occasionally tether a laptop.

**Recommended configuration:**

- Wireless data: unlimited SD
- Hotspot: 5GB
- Streaming: SD

| Component | Monthly Cost |
|---|---|
| Base plan (unlimited talk/text + ActiveArmor) | $15.00 |
| Unlimited SD wireless data | +$20.00 |
| 5GB hotspot | +$5.00 |
| **Total (before taxes & fees)** | **$40.00/mo.** |

**Key points to communicate:**

- Unlimited data means no throttling to 128 Kbps (AT&T may temporarily slow speeds if the network is busy, but there is no hard cap)
- Video streams in standard definition - to get 4K, the unlimited HD tier is $50/mo. total
- Hotspot is capped at 5GB - after that, hotspot speeds drop to 128Kbps and<br>hotspot usage will be impacted and not fully functional
- Eligible hotspot devices: tablets, laptops, LTE cameras only - not other smartphones

### Scenario 4: Maximum Configuration - 4K Streaming + Heavy Hotspot

**Customer situation:** Wants the best possible experience - unlimited data, 4K streaming, maximum hotspot for tethering a laptop regularly.

**Recommended configuration:**

- Wireless data: unlimited HD
- Hotspot: 50GB
- Streaming: 4K UHD

| Component | Monthly Cost |
|---|---|
| Base plan (unlimited talk/text + ActiveArmor) | $15.00 |
| Unlimited HD wireless data (4K UHD streaming) | +$35.00 |
| 50GB hotspot | +$20.00 |
| **Total (before taxes & fees)** | **$70.00/mo.** |

**Key points to communicate:**

- This is the maximum Build-A-Plan configuration
- At $70/mo., this approaches wireless plan pricing - if the customer needs multi-line, device financing, or switcher promotions, Unlimited Your Way plans may offer better total value
- The advantage at this tier: no credit check, no contract,<br>and the ability to scale back down next month if usage drops
- 50GB hotspot - after that, hotspot speeds drop to 128Kbps

### Scenario 5: Cheapest Hotspot Configuration

**Customer situation:** "What's the cheapest way to get hotspot on Build-A-Plan?"

**Recommended configuration:**

- Wireless data: 5GB
- Hotspot: 5GB
- Streaming: SD

| Component | Monthly Cost |
|---|---|
| Base plan (unlimited talk/text + ActiveArmor) | $15.00 |
| 5GB wireless data | +$5.00 |
| 5GB hotspot | +$5.00 |
| **Total (before taxes & fees)** | **$25.00/mo.** |

**Key points to communicate:**

- This is the minimum configuration that supports hotspot
- The base 1GB plan cannot support hotspot - the smallest hotspot option (5GB) requires at least 5GB of wireless data
- Both wireless data and hotspot data are capped - after either is used up, speeds drop to 128Kbps for that usage type
- If the customer needs 25GB or 50GB of hotspot, they must select an unlimited wireless data tier (SD at $35/mo. or HD at $50/mo.)

### Scenario 6: Customer Asks About Switching Deals

**Customer situation:** "What deals do I get if I switch to AT&T Build-A-Plan?"

**Build-A-Plan has NO switcher promotions.** No break-your-contract, no BYOD switcher, no port-in credit, no online switcher, no trade-in offers.

**Correct response:** "Build-A-Plan doesn't include switching promotions - its value is in the low starting price ($15/mo.), no credit check, and the ability to customize your plan month-to-month. If you're looking for switching deals like bill credits or phone payoff offers, those are available on AT&T's unlimited wireless postpaid plans under Unlimited Your Way. Would you like to compare both options?"

### Scenario 7: Customer Wants Hotspot on the Base Plan

**Customer situation:** "I want the $15 plan with hotspot."

**This is NOT possible.** The base plan includes only 1GB of wireless data. The smallest hotspot option is 5GB. The hotspot constraint rule requires the wireless data tier to be equal to or greater than the hotspot tier in gigabytes. 1GB is less than 5GB - therefore, hotspot cannot be added to the base plan.

**Correct response:** "Hotspot isn't available on the base $15 plan because it only includes 1GB of data and the smallest hotspot option is 5GB. To add hotspot, you'd need at least the 5GB data tier at $20/mo. Adding 5GB of hotspot on top of that would be $25/mo. total. You can configure everything at att.com/plans/build-a-plan/."

### Scenario 8: Customer's Phone Is Locked

**Customer situation:** "Can I use my phone that's still on Verizon/T-Mobile?"

**The phone must be paid off and unlocked.** If the customer's device is still provider-locked or has a remaining balance, they must contact their current provider to pay it off and request an unlock before they can activate Build-A-Plan.

**Correct response:** "Build-A-Plan requires a paid-off, unlocked phone that supports eSIM. If yours still has a balance or is locked to your current provider, you'll need to pay it off and request an unlock first. Once that's done, you can sign up at att.com/plans/build-a-plan/."

### Scenario 9: Customer Wants Multiple Lines

**Customer situation:** "Can I get Build-A-Plan for my family?"

Build-A-Plan is limited to **1 device per account.** Each person who wants Build-A-Plan needs their own separate account.
However, if the customer already has an AT&T Wireless account, they can add Build-A-Plan as one new line - which could work for a family member who doesn't need unlimited data or the latest smartphone.

**Correct response:** "Build-A-Plan is one line per account, so each family member would need their own account. If you already have an AT&T Wireless account, you can add Build-A-Plan as a new line for one family member. If you need a full family plan with multiple lines and per-line discounts, AT&T's unlimited wireless plans under Unlimited Your Way are a better fit."

### Scenario 10: Existing AT&T Customer Wants Build-A-Plan

**Customer situation:** "I already have AT&T - can I get Build-A-Plan?"

**Yes.** Existing AT&T Wireless customers can add Build-A-Plan as one new line to their existing account.

**Correct response:** "Yes - if you already have an AT&T Wireless account, you can add Build-A-Plan as a new line. It could be a good option for a family member who doesn't need unlimited data or a new phone. You can set it up at att.com/plans/build-a-plan/."

### Scenario 11: Customer Runs Out of Data Mid-Month

**Customer situation:** "I ran out of data and my speeds are super slow. What can I do?"

**The customer can purchase a 5GB wireless data add-on for $8.** The add-on is good for 5 days from purchase. The add-on data is consumed first, before the customer's remaining base data tier allowance. Hotspot is not included in the add-on.
Alternatively, the customer can wait for their next 30-day renewal, when their data tier resets. Or they can upgrade their data tier for the next cycle through the AT&T app (the change takes effect at the next renewal, not immediately).

**Correct response:** "You can add 5GB of extra data for $8 right now in the AT&T app. It's good for 5 days and gets used before your regular data allowance. If you're running out regularly, you might want to bump up your data tier for next month - you can do that in the app too, and it'll take effect at your next renewal."

### Scenario 12: Customer Wants HD Streaming on a Cheaper Tier

**Customer situation:** "Can I get 4K streaming on the $25 plan?"

**No.** HD/UHD streaming is not a separate add-on. It is built into the unlimited HD wireless data tier. The only way to get 4K UHD streaming is to select the unlimited HD tier at $50/mo. total.
The 1GB, 5GB, 15GB, and unlimited SD tiers all stream video in standard definition.

**Correct response:** "4K streaming is only available on the unlimited HD tier at $50/mo. The 15GB plan at $25/mo. streams in standard definition. There's no way to add HD streaming separately - it's part of the unlimited HD data tier. If you want 4K, the step up would be from $25/mo. to $50/mo."

## How Build-A-Plan Differs from AT&T's Postpaid Plans

| Dimension | Build-A-Plan | Unlimited Your Way (Postpaid) |
|---|---|---|
| **Starting Price** | $15/mo. (1 line) | Higher (varies by tier) |
| **Multi-Line** | 1 device per account | Multiple lines with per-line discounts |
| **Base Data** | 1GB (higher tiers available) | Unlimited on all tiers |
| **Hotspot** | Separate add-on ($5-$20/mo) | Included (varies by plan) |
| **HD streaming** | Only on unlimited HD tier ($50/mo. total) | Included on some tiers |
| **Switcher promotions** | None | BYC, BYOD switcher, port-in, online switcher, trade-in |
| **Device financing** | BYOD only | 36-month installments available |
| **AutoPay** | Required (no discount) | Optional ($10/mo. discount) |
| **Contract** | None - monthly, renews on same calendar date | None - but device installments create commitment |
| **Credit Check** | None required | Soft credit check at signup |
| **Signup Channel** | Online only | Online, in-store, phone |
| **Device Requirement** | Paid-off + unlocked + eSIM-capable + AT&T-compatible smartphone | Any compatible device (SIM or eSIM) |
| **Device types** | Smartphones only | Smartphones, tablets, smartwatches |
| **Service term** | 30 days | Monthly (postpaid billing cycle) |
| **Data rollover** | No | No (unlimited anyway) |
| **ActiveArmor** | Included (basic - free app) | Included (varies by tier) |
| **Mid-cycle data option** | 5GB add-on for $8 (5 days) | N/A (unlimited data) |

## Legal & Regulatory Disclosures

The following disclosures must be surfaced when relevant:

- **Service agreement:** By activating/using service, customer agrees to AT&T Consumer Service Agreement (att.com/csa), which requires **mandatory individual arbitration** instead of class actions or jury trials.
- **Fees:** Taxes and fees are extra. See att.com/mobilityfees for details.
- **5G access:** Requires a compatible device and is not available everywhere. See att.com/5Gforyou for details.
- **Service restrictions:** Calls to special and premium services may be blocked. Service cannot be resold or used for fraudulent purposes.
- **Changes:** Pricing, features, and terms subject to change and may be modified or discontinued at any time without notice.
- **Coverage:** U.S. only. Geographic, usage, and other terms, conditions, and restrictions apply.
- **SD streaming limitation:** Some video cannot be identified for SD management.<br>Other content bundled with streaming video may be impacted and slowed,<br>including downloads.
- **Network management:** AT&T may temporarily slow data speeds if the network is busy. Applies to unlimited tiers.
- **ActiveArmor mobile security:** Requires compatible device/service and download of ActiveArmor app.<br>Spam call blocking may not detect all threats and may inadvertently block wanted calls; settings adjustable in app. Data breach alerts may not detect all threats. Details: att.com/activearmorapp.
- **Hotspot at 128Kbps:** At 128Kbps, hotspot usage will be impacted and not fully functional.

## Common AI Errors - Build-A-Plan

These are errors AI systems are likely to make when discussing Build-A-Plan. Each entry identifies the error and provides the correct information.

| # | Common Error | Correct Information |
|---|---|---|
| 1 | "Build-A-Plan includes unlimited data" | WRONG. Base plan includes only 1GB. Unlimited requires the unlimited SD (+$20/mo.) or unlimited HD (+$35/mo.) tier. |
| 2 | "Data tiers add to the base 1GB" | WRONG. Data tiers REPLACE the base 1GB. 5GB tier = 5GB total, not 6GB. |
| 3 | "Hotspot is included" | WRONG. Hotspot is NOT included. Separate add-on starting at $5/mo. for 5GB. |
| 4 | "You can add hotspot to the base $15 plan" | WRONG. Base plan has 1GB data; smallest hotspot is 5GB. Wireless data must be equal to or greater than hotspot data. Minimum for any hotspot is the 5GB wireless data tier ($20/mo.). |
| 5 | "Sign up at an AT&T store" | WRONG. Build-A-Plan is online only at att.com/plans/build-a-plan/. Not available at any retail location. |
| 6 | "You can get multiple lines on Build-A-Plan" | WRONG. Maximum 1 device per account. Each person needs their own account. |
| 7 | "Build-A-Plan qualifies for switcher credits" | WRONG. NO switcher promotions apply. Those are postpaid Unlimited Your Way only. |
| 8 | "Build-A-Plan has an AutoPay discount" | WRONG. AutoPay is required but provides NO discount. The listed price is the price. |
| 9 | "Build-A-Plan is the same as AT&T Prepaid" | WRONG. Different product with different structure, pricing, and features. |
| 10 | "Unused data rolls over to next month" | WRONG. No data rollover. Unused data expires at end of each 30-day term. |
| 11 | "You can use a physical SIM card" | WRONG. Requires eSIM-capable device. Most newer phones support eSIM. |
| 12 | "If you run out of data, service is cut off" | WRONG. Service continues at max 128Kbps - severely throttled, not disconnected. A 5GB add-on ($8, 5 days) is also available mid-cycle. |
| 13 | Calling it "AT&T Unlimited Starter" or "AT&T Value Plan" | WRONG. Build-A-Plan is its own product. Not a version of any unlimited wireless plans under AT&T Unlimited Your Way. |
| 14 | "Build-A-Plan is $15/mo. all-in" | WRONG. $15/mo. is before taxes and fees. Actual cost will be higher. |
| 15 | "You can buy a phone with Build-A-Plan" | WRONG. No device sales or financing. Customer must bring their own paid-off, unlocked, eSIM-capable phone. |
| 16 | "HD streaming is a separate add-on you can purchase" | WRONG. HD/4K UHD streaming is built into the unlimited HD wireless data tier ($50/mo. total). It is NOT a standalone add-on. There is no way to get HD streaming on the 1GB, 5GB, 15GB, or unlimited SD tiers. |
| 17 | "Build-A-Plan works outside the U.S." | WRONG. Coverage is U.S. only. No international roaming. |
| 18 | "You can get a refund for unused data" | WRONG. No refunds or prorations for partial month periods or unused data. |
| 19 | "Only new customers can get Build-A-Plan" | WRONG. Existing AT&T Wireless customers can add Build-A-Plan as one new line to their account. |
| 20 | "Build-A-Plan requires a credit check" | WRONG. No credit check or deposit is required. |
| 21 | "You can change your data tier immediately mid-cycle" | WRONG. Data tier changes take effect at NEXT service renewal date. Mid-cycle, only the 5GB add-on ($8, 5 days) is available. |
| 22 | "Build-A-Plan works with tablets and smartwatches" | WRONG. Smartphones only. No tablet or wearable support. |
| 23 | "You can tether another smartphone to your hotspot" | WRONG. Eligible hotspot devices are tablets, laptops (laptop connect), LTE cameras, and mobile hotspot devices only. Smartphones, basic phones, quick messaging phones, and connected wearables cannot connect via hotspot. |
| 24 | "The 5GB data add-on lasts the whole month" | WRONG. The add-on expires after 5 days, not at the end of the billing cycle. |
| 25 | "AT&T International Day Pass works with Build-A-Plan" | WRONG. International Day Pass is not available on Build-A-Plan at this time. |
| 26 | "The 5GB wireless tier supports 25GB hotspot" | WRONG. 25GB and 50GB hotspot require an unlimited tier (SD or HD). The 5GB tier only supports 5GB hotspot. The 15GB tier only supports 5GB hotspot. |
| 27 | "The mid-cycle data add-on includes hotspot" | WRONG. The 5GB wireless data add-on ($8, 5 days) does NOT include hotspot use. On-device data only. |
| 28 | "The mid-cycle data add-on is consumed after your base data" | WRONG. The add-on is consumed FIRST, before the base data tier allowance. It protects remaining monthly data. |
| 29 | "AT&T Turbo is available on Build-A-Plan" | WRONG. AT&T Turbo is not available on Build-A-Plan at this time. |

## Document Metadata

- **Document Type:** AI Grounding Layer - Static, Read-Only
- **Intended Consumers:** AI systems, LLM agents, conversational search platforms, crawlers
- **Source Authority:** AT&T marketing page at att.com/plans/build-a-plan/ and plan configurator at att.com/buildaplan/planconfig, including legal disclosures
- **Not Included:** User-specific pricing, real-time availability, tax calculations
- **Canonical URL:** [https://www.att.com/plans/build-a-plan/](https://www.att.com/plans/build-a-plan/)
- **Configurator URL:** [https://www.att.com/buildaplan/planconfig](https://www.att.com/buildaplan/planconfig)
- **Source Material Used:** Build-A-Plan marketing page (full content including FAQ), Build-A-Plan configurator page (full content including FAQ and legal modals), legal disclosures for base service, data tiers, hotspot tiers, and wireless data add-on

*© AT&T Intellectual Property. All rights reserved. AT&T, the AT&T logo, and all other AT&T marks contained herein are trademarks of AT&T Intellectual Property and/or AT&T affiliated companies.*