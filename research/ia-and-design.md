# Milestone 2 — Information architecture and design

## Site map (all under `https://authorizedinternetretailer.net/att`)

| Route | H1 | Purpose | Offers shown (src/data/offers.ts) | Primary action |
|---|---|---|---|---|
| `/` | AT&T Fiber, Internet Air and wireless plans, explained clearly | Overview, featured offer above the fold, services, promotions, FAQ, call-back form | fiber-1000 (hero), fiber-300, internet-air, wireless-value-2, phone-unlimited-north-america, bundle, switch-800, byod-360 | Call / Check availability |
| `/internet` | AT&T home internet plans | Fiber vs Internet Air, all internet prices, bundle | all fiber tiers, internet-air, bundle | ZIP check / Call |
| `/internet/fiber` | AT&T Fiber internet plans | 4 tiers with and without wireless, price table, All-Fi Pro, bundle, FAQ, form | fiber-300…5000, all-fi-pro, bundle | Call |
| `/internet/internet-air` | AT&T Internet Air 5G home internet | One plan, features, fit, FAQ, form | internet-air | Call |
| `/wireless` | AT&T wireless plans and deals | Plan overview, promotions, links | 4 plans, switch-800, byod-360, new-line-5 | Call |
| `/wireless/plans` | AT&T unlimited plans compared | 4 plan cards, comparison table, discounts, form | 4 plans, new-line-5, appreciation | Call |
| `/wireless/deals` | AT&T phone deals and trade-in offers | Device trade-in offers, line/switch offers | iphone-18, samsung-z8, new-line-5, switch-800, byod-360 | Call |
| `/wireless/switch` | Switch to AT&T and keep your number | Switching offers, preparation checklist, form | switch-800, byod-360, new-line-5 | Call |
| `/phone` | AT&T Phone home phone service | 2 plans, features, power/911 notice, FAQ, form | phone-unlimited-north-america, phone-international-plus-ii | Call |
| `/deals` | All current AT&T deals and promotions | Every offer grouped, each stamped "As of …" | all 19 | Call |
| `/check-availability` | Check AT&T service at your address | ZIP entry → call CTA + call-back form (never shows a result) | fiber-300 (context only) | Call / form |
| `/about`, `/faq`, `/contact` | About …, Frequently asked questions, Contact us | Company, Q&A (FAQPage), contact details + form | — | Call / form |
| `/privacy`, `/terms`, `/cookie-policy`, `/do-not-sell-or-share`, `/accessibility`, `/disclaimer`, `/sitemap-page` | Policy titles | Legal and compliance | — | — |
| `/lp/fiber`, `/lp/internet-air`, `/lp/wireless` | Offer headline | Distraction-free Google Ads landing template (no menu), `noindex` | fiber-1000 / internet-air / wireless-value-2 | Call |
| any other | We could not find that page | Custom 404 with helpful links | — | — |

Navigation: primary menu Internet · Wireless · Home Phone · Deals · Check Availability; mobile menu adds every sub-page; footer has all services, company pages, all policy links, Contact and "Cookie settings" on every page (including landing pages).

## Design system

- **Colors**: `src/styles/tokens.ts` only (values extracted from att.com, see `research/colors.md`). Primary action AT&T cobalt `#00388F`, hover `#0057B8`, links `#0072B2`, AT&T blue `#009FDB` as a decorative accent, dark bands `#002837`, light bands `#F2FAFD` / `#F3F4F6`.
- **Typography**: Inter via `next/font` (self-hosted, latin subset, `display: swap`); bold, tight headings; 16px+ body; `text-wrap: balance/pretty`.
- **Layout**: 76rem max container, 16px gutters on phones, generous section padding (64–88px), rounded 20px cards with 1px borders, featured cards with a 2px cobalt border.
- **Components** (`src/components`): SiteHeader (sticky, disclosure strip, phone button), MobileNav, MobileCallBar (fixed on < 1024px), SiteFooter (disclosure, trademark notice, policy links, cookie settings), PlanCard/PromoCard (price, conditions, "As of" date, fine print), Price, FinePrint (`<details>`), CtaLink (`cta_click`), PhoneLink (only renderer of the phone number; `phone_click` + Ads call conversion), ZipCheck (`zip_check`), LeadForm (`form_submit`), CookieBanner (Consent Mode v2), FaqList, Breadcrumbs (+ BreadcrumbList JSON-LD), HeroArt (original SVG).
- **Imagery**: no AT&T logos or photographs; a neutral "A" tile wordmark ("Authorized Internet Retailer") and original inline SVG illustrations and icons.
- **Motion**: CSS transitions and one IntersectionObserver (`RevealObserver`); disabled under `prefers-reduced-motion`; content is visible without JavaScript.

## Compliance rules applied in copy

- Disclosure on every page: header strip ("Independent authorized retailer of AT&T services. This is not AT&T's official website.") and footer (legal name, "is not AT&T Inc.", trademark notice); full text on `/disclaimer`.
- No order-placement mechanics and no instruction to contact AT&T; existing-account questions are answered with "we handle new service only".
- Every price and promotion shows conditions, an "As of <date>" stamp and the full att.com fine print.
- Phone number and tag IDs come only from environment variables; development shows a "DEV PREVIEW" badge.
