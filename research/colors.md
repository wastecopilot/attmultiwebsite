# Brand colors (Milestone 1e)

Retrieved from live att.com on **2026-10-21** (06:3x UTC). Nothing was guessed: every value below was read either from
`getComputedStyle()` on rendered att.com elements or from att.com's own named color classes / CSS custom properties.

## Method

1. **Computed styles** — `att-site/scripts/research/extract-colors.mjs` (Playwright/Chromium, desktop Chrome UA) loaded
   `https://www.att.com/`, `/internet/fiber/` and `/plans/unlimited-data-plans/`, sampled header, nav, H1/H2, body text,
   links, buttons, hero bands, cards, legal text, badges and footer, and took a census of every visible element's
   `color`, `background-color` and `border-color`. Evidence: `research/raw/colors.json`.
2. **Stylesheet** — att.com's core stylesheet
   `https://www.att.com/ui/frameworks/css/v2.1.0/core-global-styles-fonts.min.css` (saved as
   `research/raw/att-core-global-styles.css`) defines the named palette (`.color-att-blue`, `.bg-att-cobalt`,
   `--btn-primary-bgcolor`, `--btn-border-hover`, `--form-error-dot`, …). Used to name each computed value and to source
   states that cannot be sampled statically (hover, error, success).
3. **CSS variables on `:root`** — att.com sets no color custom properties on `:root`/`html`/`body` (0 found); its
   variables are scoped to components inside the stylesheet above.

## Cross-check: AT&T blue `#009FDB`

Confirmed on the live site: `h2.heading-xxl.color-att-blue` ("Great connections start here", https://www.att.com/)
computes to `rgb(0, 159, 219)` = **#009FDB**, and the stylesheet defines `.color-att-blue{color:#009fdb}`.
On white it measures 3.01:1, so this site uses it only for graphics and accents, never for body text.

## Observations worth knowing

- att.com's primary CTA color is **AT&T cobalt `#00388F`** (not `#009FDB`); hover is cobalt-600 `#0057B8`.
- Inline links use "func blue" `#0072B2`; text is gray-800 `#1D2329`; legal text gray-700 `#454B52`.
- The dark hero art on the Fiber page uses cobalt-800 / dark-accent `#002837`.
- Typography on att.com is the proprietary "ATT Aleck Sans" family (`font-regular`, `font-bold` aliases). It is not
  licensed for this site; Inter (Google Fonts, self-hosted by next/font) is used instead.

## Tokens (`att-site/src/styles/tokens.ts`)

| Token | Hex | att.com name | Source (selector / rule) | Usage on this site |
|---|---|---|---|---|
| `brand` | `#009FDB` | `.color-att-blue / .bg-att-blue` | h2.heading-xxl.color-att-blue ("Great connections start here") on https://www.att.com/; nav underline span (background-color) | Decorative accent only (rules, illustration strokes, icons). 3.01:1 on white: meets 3:1 for graphics, never used for body text. |
| `brandStrong` | `#00388F` | `--btn-primary-bgcolor / .bg-att-cobalt` | a#plan-card-cta-5-0 "Shop now" background-color on /internet/fiber/; button.btn-primary "Select plan" on /plans/unlimited-data-plans/ | Primary buttons, header call button, secondary-button text and border, eyebrows, prices accents. |
| `brandHover` | `#0057B8` | `--btn-border-hover / .color-button-focus (cobalt-600)` | core stylesheet: .btn-primary:hover { background-color: var(--btn-border-hover, #0057b8) } | Primary button hover, keyboard focus ring on light backgrounds. |
| `link` | `#0072B2` | `--a-default-color / .color-func-blue` | a#link-:r1: "Learn more" color on /internet/fiber/; button#plan-card-accordion-5-0-btn "Features & benefits" | Inline text links. |
| `tint` | `#F2FAFD` | `.bg-att-blue-000` | div.theme-base-bg.bgcolor background-color on https://www.att.com/ (hero band) | Light blue section and hero backgrounds, badge backgrounds, light button on dark. |
| `tint2` | `#DCF3FA` | `.bg-att-blue-100` | core stylesheet .color-att-blue-100 / --btn-border-hover (on-dark) | Selection highlight, secondary-button hover background. |
| `ink` | `#1D2329` | `.color-gray-800 / --heading-color` | body color on https://www.att.com/ (html.theme-att-2022 > body); h1/h2 color | Body text and headings. |
| `inkMuted` | `#454B52` | `.color-gray-700` | div#legalId_Legal span color (offer legal text) on https://www.att.com/ | Secondary text, fine print, captions. |
| `inputBorder` | `#686E74` | `--textfield-border / .color-gray-600` | input#input-addressInput border-color on /internet/fiber/ | Form field borders (non-text contrast). |
| `border` | `#DCDFE3` | `.border-gray-300 / --accordion-border` | div#5-0 plan card border-top-color on /internet/fiber/; search button border | Card and divider borders; muted text on the dark band. |
| `surface` | `#FFFFFF` | `.bg-white` | body background-color on https://www.att.com/ | Page background, cards. |
| `surfaceAlt` | `#F3F4F6` | `.border-gray-200 / --bgcolor` | div.mega-universal-nav-row.bg-ui-background-gray background-color on https://www.att.com/ | Alternate section background, table header cells. |
| `night` | `#002837` | `.bg-dark-accent / .color-cobalt-800` | div.hero-panel > div.bg-art background-color on /internet/fiber/ | Disclosure strip, dark bands, footer, table headers. |
| `danger` | `#C70032` | `--form-error-dot / .color-red-600 / --color-urgent` | core stylesheet: --form-error-dot: #c70032; .bg-urgent | Form validation errors. |
| `success` | `#2D7E24` | `--color-success / .color-green-600` | core stylesheet: .color-success { color: var(--color-success, #2d7e24) } | Confirmation messages. |

## WCAG 2.2 AA contrast for every text/background pair used

Generated by `node node_modules/tsx/dist/cli.mjs scripts/research/contrast.ts` (exits non-zero on any failure).

| Use | Pair | Ratio | AA requirement | Result |
|---|---|---|---|---|
| Body text and headings on white | `#1D2329` on `#FFFFFF` | 15.85:1 | 4.5:1 (text) | PASS |
| Body text on gray sections | `#1D2329` on `#F3F4F6` | 14.41:1 | 4.5:1 (text) | PASS |
| Body text on light blue hero | `#1D2329` on `#F2FAFD` | 15.00:1 | 4.5:1 (text) | PASS |
| Secondary text / fine print on white | `#454B52` on `#FFFFFF` | 8.82:1 | 4.5:1 (text) | PASS |
| Secondary text on gray sections | `#454B52` on `#F3F4F6` | 8.01:1 | 4.5:1 (text) | PASS |
| Secondary text on light blue hero | `#454B52` on `#F2FAFD` | 8.34:1 | 4.5:1 (text) | PASS |
| Links on white | `#0072B2` on `#FFFFFF` | 5.19:1 | 4.5:1 (text) | PASS |
| Links on gray sections | `#0072B2` on `#F3F4F6` | 4.71:1 | 4.5:1 (text) | PASS |
| Links on light blue hero | `#0072B2` on `#F2FAFD` | 4.91:1 | 4.5:1 (text) | PASS |
| Secondary button text, eyebrows, call link on white | `#00388F` on `#FFFFFF` | 10.70:1 | 4.5:1 (text) | PASS |
| Eyebrows on gray sections | `#00388F` on `#F3F4F6` | 9.72:1 | 4.5:1 (text) | PASS |
| Badge text / on-dark button text on light blue | `#00388F` on `#F2FAFD` | 10.12:1 | 4.5:1 (text) | PASS |
| Primary button and header call button text | `#FFFFFF` on `#00388F` | 10.70:1 | 4.5:1 (text) | PASS |
| Primary button text (hover) | `#FFFFFF` on `#0057B8` | 6.87:1 | 4.5:1 (text) | PASS |
| Text on dark band, disclosure strip, footer | `#FFFFFF` on `#002837` | 15.46:1 | 4.5:1 (text) | PASS |
| Muted text on dark band and footer | `#DCDFE3` on `#002837` | 11.56:1 | 4.5:1 (text) | PASS |
| Form error messages | `#C70032` on `#FFFFFF` | 6.04:1 | 4.5:1 (text) | PASS |
| Confirmation messages | `#2D7E24` on `#FFFFFF` | 5.10:1 | 4.5:1 (text) | PASS |
| Form field border (non-text, 3:1) | `#686E74` on `#FFFFFF` | 5.16:1 | 3:1 (non-text) | PASS |
| Focus ring on white (non-text, 3:1) | `#0057B8` on `#FFFFFF` | 6.87:1 | 3:1 (non-text) | PASS |
| Focus ring on dark band (non-text, 3:1) | `#FFFFFF` on `#002837` | 15.46:1 | 3:1 (non-text) | PASS |
| AT&T blue on white — decorative only, never text | `#009FDB` on `#FFFFFF` | 3.01:1 | 3:1 (non-text) | PASS |
