# Keyword map

One primary keyword per page (no two pages target the same primary keyword), with supporting terms used naturally in the
title, H1, description, headings and copy. Landing pages (`/lp/*`) are `noindex` and target paid-search ad groups instead.

| Page | Primary keyword | Supporting keywords | Title tag | H1 |
|---|---|---|---|---|
| `/att/` | AT&T authorized retailer | AT&T Fiber, AT&T Internet Air, AT&T wireless, AT&T plans | AT&T Authorized Retailer: Fiber, Internet Air & Wireless | AT&T Fiber, Internet Air and wireless plans, explained clearly |
| `/att/internet` | AT&T home internet | AT&T internet plans, fiber vs 5G home internet | AT&T Home Internet: Fiber & Internet Air Plans | AT&T home internet plans |
| `/att/internet/fiber` | AT&T Fiber internet plans | AT&T Fiber prices, AT&T Fiber 1 GIG, AT&T Fiber with wireless discount | AT&T Fiber Internet Plans & Prices \| Authorized Retailer | AT&T Fiber internet plans |
| `/att/internet/internet-air` | AT&T Internet Air | AT&T 5G home internet, Internet Air price | AT&T Internet Air 5G Home Internet: $55/mo. | AT&T Internet Air 5G home internet |
| `/att/wireless` | AT&T wireless plans | AT&T Unlimited Your Way, AT&T wireless deals | AT&T Wireless Plans, Deals & Switching Offers | AT&T wireless plans and deals |
| `/att/wireless/plans` | AT&T unlimited plans | AT&T Elite 2.0, Premium 2.0, Extra 2.0, Value 2.0 | AT&T Unlimited Plans: Elite, Premium, Extra, Value | AT&T unlimited plans compared |
| `/att/wireless/deals` | AT&T wireless deals | AT&T phone deals, iPhone trade-in offer, Samsung Galaxy deal | AT&T Phone Deals: iPhone & Samsung Trade-In Offers | AT&T phone deals and trade-in offers |
| `/att/wireless/switch` | switch to AT&T | keep your number, AT&T switcher offer, bring your own phone | Switch to AT&T: Up to $800 per Line, Keep Your Number | Switch to AT&T and keep your number |
| `/att/phone` | AT&T Phone home phone service | AT&T home phone, digital home phone | AT&T Phone Home Phone Service from $24.99/mo. | AT&T Phone home phone service |
| `/att/deals` | AT&T deals and promotions | current AT&T offers, AT&T bundle savings | Current AT&T Deals & Promotions \| Authorized Retailer | All current AT&T deals and promotions |
| `/att/check-availability` | AT&T availability by address | is AT&T Fiber available at my address | Check AT&T Availability at Your Address | Check AT&T service at your address |
| `/att/faq` | AT&T internet FAQ | AT&T AutoPay discount, AT&T installation fee, AT&T contract | AT&T Fiber, Internet Air & Wireless FAQ | Frequently asked questions |
| `/att/about` | independent AT&T authorized retailer | Transtech Marketing Network LLC | About Us \| Independent AT&T Authorized Retailer | About Transtech Marketing Network LLC |
| `/att/contact` | contact AT&T authorized retailer | call back, sales hours | Contact Us \| AT&T Authorized Retailer | Contact us |
| `/att/privacy`, `/terms`, `/cookie-policy`, `/do-not-sell-or-share`, `/accessibility`, `/disclaimer`, `/sitemap-page` | (navigational; brand + policy name) | — | "<Policy> \| Authorized Internet Retailer" | Policy name |

## Paid search landing pages (noindex)

| Page | Ad group theme | Offer above the fold |
|---|---|---|
| `/att/lp/fiber` | AT&T Fiber, AT&T fiber internet deals | AT&T Internet 1000: $70/mo. for 12 mos. ($50 with eligible wireless) + fine print |
| `/att/lp/internet-air` | AT&T Internet Air, AT&T 5G home internet | AT&T Internet Air: $55/mo. + fine print |
| `/att/lp/wireless` | AT&T unlimited plans, AT&T wireless deals | AT&T Value 2.0: $30/mo. per line with 4 lines + fine print |

## Rules followed

- Brand terms are used only to describe the AT&T services sold; every page carries the independent-retailer disclosure.
- No keyword stuffing; each primary keyword appears in the title, H1 or first paragraph, and the description.
- Titles are under 60 characters and descriptions under 160 (verified by `att-site/scripts/audit/seo-check.mjs`, report in `audit/seo/`).
