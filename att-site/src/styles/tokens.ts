/**
 * Brand color tokens — every value was read from live att.com on 2026-10-21 (no guessed shades).
 *
 * Evidence:
 *   - computed styles (getComputedStyle) on https://www.att.com/, /internet/fiber/, /plans/unlimited-data-plans/
 *     → research/raw/colors.json (scripts/research/extract-colors.mjs)
 *   - named classes and CSS custom properties in att.com's core stylesheet
 *     https://www.att.com/ui/frameworks/css/v2.1.0/core-global-styles-fonts.min.css
 *     → research/raw/att-core-global-styles.css
 * Full table with usage and WCAG contrast results: research/colors.md.
 * These values are written to :root as CSS custom properties by src/app/layout.tsx.
 */
export interface ColorToken {
  hex: string;
  /** att.com name (class or custom property) for the value. */
  attName: string;
  /** Where it was observed on att.com (selector of a computed-style sample or stylesheet rule). */
  source: string;
  /** How this site uses it. */
  usage: string;
}

export const colors = {
  brand: {
    hex: "#009FDB",
    attName: ".color-att-blue / .bg-att-blue",
    source: "h2.heading-xxl.color-att-blue (\"Great connections start here\") on https://www.att.com/; nav underline span (background-color)",
    usage: "Decorative accent only (rules, illustration strokes, icons). 3.01:1 on white: meets 3:1 for graphics, never used for body text.",
  },
  brandStrong: {
    hex: "#00388F",
    attName: "--btn-primary-bgcolor / .bg-att-cobalt",
    source: "a#plan-card-cta-5-0 \"Shop now\" background-color on /internet/fiber/; button.btn-primary \"Select plan\" on /plans/unlimited-data-plans/",
    usage: "Primary buttons, header call button, secondary-button text and border, eyebrows, prices accents.",
  },
  brandHover: {
    hex: "#0057B8",
    attName: "--btn-border-hover / .color-button-focus (cobalt-600)",
    source: "core stylesheet: .btn-primary:hover { background-color: var(--btn-border-hover, #0057b8) }",
    usage: "Primary button hover, keyboard focus ring on light backgrounds.",
  },
  link: {
    hex: "#0072B2",
    attName: "--a-default-color / .color-func-blue",
    source: "a#link-:r1: \"Learn more\" color on /internet/fiber/; button#plan-card-accordion-5-0-btn \"Features & benefits\"",
    usage: "Inline text links.",
  },
  tint: {
    hex: "#F2FAFD",
    attName: ".bg-att-blue-000",
    source: "div.theme-base-bg.bgcolor background-color on https://www.att.com/ (hero band)",
    usage: "Light blue section and hero backgrounds, badge backgrounds, light button on dark.",
  },
  tint2: {
    hex: "#DCF3FA",
    attName: ".bg-att-blue-100",
    source: "core stylesheet .color-att-blue-100 / --btn-border-hover (on-dark)",
    usage: "Selection highlight, secondary-button hover background.",
  },
  ink: {
    hex: "#1D2329",
    attName: ".color-gray-800 / --heading-color",
    source: "body color on https://www.att.com/ (html.theme-att-2022 > body); h1/h2 color",
    usage: "Body text and headings.",
  },
  inkMuted: {
    hex: "#454B52",
    attName: ".color-gray-700",
    source: "div#legalId_Legal span color (offer legal text) on https://www.att.com/",
    usage: "Secondary text, fine print, captions.",
  },
  inputBorder: {
    hex: "#686E74",
    attName: "--textfield-border / .color-gray-600",
    source: "input#input-addressInput border-color on /internet/fiber/",
    usage: "Form field borders (non-text contrast).",
  },
  border: {
    hex: "#DCDFE3",
    attName: ".border-gray-300 / --accordion-border",
    source: "div#5-0 plan card border-top-color on /internet/fiber/; search button border",
    usage: "Card and divider borders; muted text on the dark band.",
  },
  surface: {
    hex: "#FFFFFF",
    attName: ".bg-white",
    source: "body background-color on https://www.att.com/",
    usage: "Page background, cards.",
  },
  surfaceAlt: {
    hex: "#F3F4F6",
    attName: ".border-gray-200 / --bgcolor",
    source: "div.mega-universal-nav-row.bg-ui-background-gray background-color on https://www.att.com/",
    usage: "Alternate section background, table header cells.",
  },
  night: {
    hex: "#002837",
    attName: ".bg-dark-accent / .color-cobalt-800",
    source: "div.hero-panel > div.bg-art background-color on /internet/fiber/",
    usage: "Disclosure strip, dark bands, footer, table headers.",
  },
  danger: {
    hex: "#C70032",
    attName: "--form-error-dot / .color-red-600 / --color-urgent",
    source: "core stylesheet: --form-error-dot: #c70032; .bg-urgent",
    usage: "Form validation errors.",
  },
  success: {
    hex: "#2D7E24",
    attName: "--color-success / .color-green-600",
    source: "core stylesheet: .color-success { color: var(--color-success, #2d7e24) }",
    usage: "Confirmation messages.",
  },
} satisfies Record<string, ColorToken>;

export type ColorName = keyof typeof colors;

/** CSS custom properties consumed by src/app/globals.css. */
export const cssVariables: Record<string, string> = {
  "--att-brand": colors.brand.hex,
  "--att-brand-strong": colors.brandStrong.hex,
  "--att-brand-hover": colors.brandHover.hex,
  "--att-link": colors.link.hex,
  "--att-brand-tint": colors.tint.hex,
  "--att-brand-tint-2": colors.tint2.hex,
  "--att-ink": colors.ink.hex,
  "--att-ink-muted": colors.inkMuted.hex,
  "--att-input-border": colors.inputBorder.hex,
  "--att-border": colors.border.hex,
  "--att-surface": colors.surface.hex,
  "--att-surface-alt": colors.surfaceAlt.hex,
  "--att-night": colors.night.hex,
  "--att-night-muted": colors.border.hex,
  "--att-danger": colors.danger.hex,
  "--att-success": colors.success.hex,
  "--att-focus": colors.brandHover.hex,
};

export function rootCss(): string {
  return `:root{${Object.entries(cssVariables)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
}

/** Text/background pairs used on the site; checked for WCAG 2.2 AA by scripts/research/contrast.mjs. */
export const contrastPairs: { fg: ColorName | "white"; bg: ColorName | "white"; use: string; large?: boolean; nonText?: boolean }[] = [
  { fg: "ink", bg: "surface", use: "Body text and headings on white" },
  { fg: "ink", bg: "surfaceAlt", use: "Body text on gray sections" },
  { fg: "ink", bg: "tint", use: "Body text on light blue hero" },
  { fg: "inkMuted", bg: "surface", use: "Secondary text / fine print on white" },
  { fg: "inkMuted", bg: "surfaceAlt", use: "Secondary text on gray sections" },
  { fg: "inkMuted", bg: "tint", use: "Secondary text on light blue hero" },
  { fg: "link", bg: "surface", use: "Links on white" },
  { fg: "link", bg: "surfaceAlt", use: "Links on gray sections" },
  { fg: "link", bg: "tint", use: "Links on light blue hero" },
  { fg: "brandStrong", bg: "surface", use: "Secondary button text, eyebrows, call link on white" },
  { fg: "brandStrong", bg: "surfaceAlt", use: "Eyebrows on gray sections" },
  { fg: "brandStrong", bg: "tint", use: "Badge text / on-dark button text on light blue" },
  { fg: "white", bg: "brandStrong", use: "Primary button and header call button text" },
  { fg: "white", bg: "brandHover", use: "Primary button text (hover)" },
  { fg: "white", bg: "night", use: "Text on dark band, disclosure strip, footer" },
  { fg: "border", bg: "night", use: "Muted text on dark band and footer" },
  { fg: "danger", bg: "surface", use: "Form error messages" },
  { fg: "success", bg: "surface", use: "Confirmation messages" },
  { fg: "inputBorder", bg: "surface", use: "Form field border (non-text, 3:1)", nonText: true },
  { fg: "brandHover", bg: "surface", use: "Focus ring on white (non-text, 3:1)", nonText: true },
  { fg: "white", bg: "night", use: "Focus ring on dark band (non-text, 3:1)", nonText: true },
  { fg: "brand", bg: "surface", use: "AT&T blue on white — decorative only, never text", nonText: true },
];
