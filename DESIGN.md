---
version: alpha
name: visavista-design-ibm
description: "VisaVista CRM design system, derived faithfully from IBM Carbon. White surfaces, charcoal type, IBM Blue (#0f62fe) as the single confident accent, and a deliberately flat-square aesthetic where corners stay at 0–4px. IBM Plex Sans 300 for display sizes, 400 for body, 600 for emphasis. Cards are thin-bordered tiles with no shadow; sections separate via subtle gray rows. The chrome is square, the typography is light, and the only color in the system is one assertive blue."

colors:
  primary: "#0f62fe"
  on-primary: "#ffffff"
  ink: "#161616"
  ink-muted: "#525252"
  ink-subtle: "#8c8c8c"
  canvas: "#ffffff"
  surface-1: "#f4f4f4"
  surface-2: "#e0e0e0"
  inverse-canvas: "#161616"
  inverse-surface-1: "#262626"
  inverse-ink: "#ffffff"
  inverse-ink-muted: "#c6c6c6"
  hairline: "#e0e0e0"
  hairline-strong: "#161616"
  blue-60: "#0043ce"
  blue-80: "#002d9c"
  blue-hover: "#0050e6"
  semantic-success: "#24a148"
  semantic-warning: "#f1c21b"
  semantic-error: "#da1e28"
  semantic-info: "#0f62fe"

typography:
  display-xl: { fontFamily: IBM Plex Sans, fontSize: 76px, fontWeight: 300, lineHeight: 1.17, letterSpacing: -0.5px }
  display-lg: { fontFamily: IBM Plex Sans, fontSize: 60px, fontWeight: 300, lineHeight: 1.17, letterSpacing: -0.4px }
  display-md: { fontFamily: IBM Plex Sans, fontSize: 42px, fontWeight: 300, lineHeight: 1.20, letterSpacing: 0 }
  headline:   { fontFamily: IBM Plex Sans, fontSize: 32px, fontWeight: 400, lineHeight: 1.25, letterSpacing: 0 }
  card-title: { fontFamily: IBM Plex Sans, fontSize: 24px, fontWeight: 400, lineHeight: 1.33, letterSpacing: 0 }
  subhead:    { fontFamily: IBM Plex Sans, fontSize: 20px, fontWeight: 400, lineHeight: 1.40, letterSpacing: 0 }
  body-lg:    { fontFamily: IBM Plex Sans, fontSize: 18px, fontWeight: 400, lineHeight: 1.50, letterSpacing: 0 }
  body:       { fontFamily: IBM Plex Sans, fontSize: 16px, fontWeight: 400, lineHeight: 1.50, letterSpacing: 0.16px }
  body-sm:    { fontFamily: IBM Plex Sans, fontSize: 14px, fontWeight: 400, lineHeight: 1.29, letterSpacing: 0.16px }
  body-emphasis: { fontFamily: IBM Plex Sans, fontSize: 14px, fontWeight: 600, lineHeight: 1.29, letterSpacing: 0.16px }
  caption:    { fontFamily: IBM Plex Sans, fontSize: 12px, fontWeight: 400, lineHeight: 1.33, letterSpacing: 0.32px }
  button:     { fontFamily: IBM Plex Sans, fontSize: 14px, fontWeight: 400, lineHeight: 1.29, letterSpacing: 0.16px }
  eyebrow:    { fontFamily: IBM Plex Sans, fontSize: 14px, fontWeight: 400, lineHeight: 1.29, letterSpacing: 0.16px }

rounded: { none: 0px, xs: 2px, sm: 4px, pill: 9999px }

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px
---

## Brand voice
Carbon, applied to a CRM. White canvas, charcoal type, square corners, IBM Blue accent. Plex Sans 300 for display, 400 for body with `letter-spacing: 0.16px`. Card hierarchy uses 1px hairlines and surface change — never shadows.

## Tokens → Tailwind
The values above are mirrored as CSS variables in `src/styles/tokens.css` and consumed by `tailwind.config.js` `theme.extend`. Components must use Tailwind utility classes, not raw hex codes or px values.

## Do
- `rounded-none` on every CTA, card, input, container.
- Plex Sans `font-light` (300) on display sizes ≥ 42px.
- IBM Blue `bg-primary` only for primary CTAs, links, focused-input underlines, and the CTA banner.
- `letter-spacing: 0.16px` on body sizes (Tailwind `tracking-carbon`).
- Surface change (`canvas` → `surface-1`) and 1px `border-hairline` for hierarchy.

## Don't
- Don't round corners on buttons, cards, or inputs.
- Don't bold display headlines (no `font-bold` on 42px+).
- Don't add a second brand color. IBM Blue is the only chromatic accent.
- Don't use drop shadows. Use surface + hairline.
- Don't use all-caps tracked eyebrows. Sentence case 14px.

## Surfaces
- Page: `canvas` (#ffffff).
- Alternate band: `surface-1` (#f4f4f4).
- Footer / dark island: `inverse-canvas` (#161616).
- Card: `canvas` + 1px `hairline`. Hover: lift to `surface-1`.

## Focus
2px `primary` outline + 1px `hairline-strong` underline. The Carbon focus treatment is mandatory on every interactive element.
