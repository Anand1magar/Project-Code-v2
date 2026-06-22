# VisaVista CRM — read this first

Before doing anything in this repo, read:
1. `TECHNICAL-PRD.md` — scope, architecture, folder rules
2. `DESIGN.md` — IBM Carbon-derived tokens; the only place colors/fonts/spacing are defined

## Hard rules
- No `fetch` outside `src/services/apiClient.js`.
- No hardcoded hex colors or px values in `src/features/**`, `src/routes/**`, `src/components/**`. Use Tailwind classes mapped to tokens.
- Feature-first folder layout. New files follow the table in TECHNICAL-PRD §8.
- Components stay presentational. Data lives in hooks; hooks call services; services call `apiClient`.
- JS + JSDoc `@typedef` for data shapes. No TypeScript.
- Square corners (`rounded-none`). IBM Blue (`bg-primary`) only for primary CTAs, links, CTA banner, focus.

## Mock → real backend flip
1. Remove the MSW import block in `src/main.jsx`.
2. Set `VITE_API_BASE_URL=https://your.api` in `.env`.
3. Real backend must match the endpoint contract in TECHNICAL-PRD §3.

Nothing in `src/features/**` should change.
