# `/flow` — Product Flow Viewer

**Status:** Approved for planning
**Date:** 2026-07-19

## Problem

VisaVista has no single place to show a teammate "how the app actually works,
screen by screen." Explaining a flow today means clicking through the live
app live, which is slow and easy to fumble mid-demo. The user wants something
in the spirit of Mobbin — a page that lays out a product flow as a sequence of
real screens, so it can be pulled up and walked through (or screen-captured by
an external tool) without narrating live navigation.

## Goal

A new route, `localhost:5173/flow` (or whatever port Vite picks), that shows
the four core flows below as horizontal rows of real, live-rendered screens
connected by arrows and short action captions — display-only, no login
required to view the page itself.

## Scope: the four flows

1. **Login** — Sign-in screen → Dashboard.
2. **Add a Student** — Students list → "Add student" modal open → resulting
   Case Detail page (this matches actual current app behavior: creating a
   student auto-creates a case and redirects to its Case Detail page — the
   flow page documents what the app *does*, not an idealized spec).
3. **Case Pipeline** — Kanban board → Case Detail page.
4. **Document Checklist** — Case Detail (Activity tab, the default) →
   Case Detail (Documents tab).

All screens use real seeded demo data (student "Roshan Thapa", case `c1`) so
the page always has something real to show without needing to simulate a
fresh signup each time.

Explicitly out of scope: download/export of the flow page, screenshot capture
(handled by an external browser extension per the user), editing flows
through a UI (flows are a static config file), any flows beyond the four
listed above.

## Approach

**Screens are real `<iframe>`s pointing at the live app's own routes**, not
re-rendered React components and not static screenshots. This was chosen
over inline component rendering (Approach B, rejected) because:

- It guarantees the tile shows *exactly* what a real visitor sees — same
  data fetching, same MSW mocks, same layout chrome — with zero risk of
  breaking route/context assumptions (`useParams`, `useNavigate`, nested
  layout) that the real page components rely on.
- It needs almost no changes to existing pages — just two new optional query
  params that drive state the pages already have.
- It stays live: as the app's real screens change, the flow page's tiles
  change with them automatically. Nothing to manually recapture.

The trade-off is one loading pass per tile (each iframe boots its own JS
context), which is a non-issue for four flows' worth of tiles on a demo page.

### Auth handling

`/flow` itself does **not** require login (so it's fast to pull up for a
teammate). But three of the four flows embed routes that normally sit behind
`RequireAuth` (Students, Pipeline, Case Detail). To avoid those tiles
rendering the login screen instead of real content:

On mount, `FlowPage` calls `GET /api/auth/me`; if that fails (no session),
it silently calls the existing admin login (`login({ role: 'admin' })`) before
rendering any tiles. A short "Preparing preview…" spinner covers this check
so tiles never flash a login wall. If the visiting browser already has *any*
session (admin or counsellor), that session is left alone and reused —
the flow page just needs *a* session to exist, not a specific one.

This only works meaningfully when the app is running in dev mode with MSW
active, same as the rest of the app (there is no real backend in this MVP).

### Interactivity

Per the user's choice, tiles are **display-only**: a transparent overlay
(`absolute inset-0`, no handlers, `tabIndex={-1}` on the iframe) sits on top
of each iframe so nothing inside can be clicked or focused accidentally
during a walkthrough.

### Layout

- Page header: title ("VisaVista — Product Flows") + one-line subtitle.
- One section per flow, stacked vertically, each with:
  - A header: flow number + name + one-line description.
  - A horizontally-scrollable row of screen tiles (Mobbin-style), connected
    by an arrow + short caption of the user action that leads to the next
    screen (e.g. "→ clicks Add student").
- Each tile: a label above it (screen name) + a fixed-size thumbnail box.
  The iframe renders the real page at a full desktop viewport size and is
  scaled down via CSS transform to fit the thumbnail — the same
  fixed-arbitrary-width technique already used in this codebase (e.g.
  `AskPanel.jsx`'s `w-[380px]` panel), so no new styling pattern is
  introduced. Square corners, hairline borders, tokens — same as the rest of
  `src/routes/**` per `CLAUDE.md`.

## New files

- `src/routes/FlowPage.jsx` — the page: session bootstrap, renders one
  `FlowSection` per entry in `flowsConfig.js`.
- `src/features/flow/flowsConfig.js` — static data: the 4 flows, each an
  ordered array of `{ label, path, caption }` (caption = the action that
  leads to the *next* screen; last screen in a flow has no caption).
- `src/features/flow/components/FlowScreenTile.jsx` — scaled iframe +
  click-blocking overlay + label.
- `src/features/flow/components/FlowSection.jsx` — flow header + tile row +
  connector arrows, driven by one `flowsConfig` entry.

## Changes to existing files

- `src/App.jsx` — add `<Route path="/flow" element={<FlowPage />} />` as a
  top-level route (sibling to `/login`), outside `RequireAuth`.
- `src/routes/StudentsPage.jsx` — read a `?open=new` search param on mount
  and call the existing `openModal()` if present. No behavior change when
  the param is absent.
- `src/routes/CaseDetailPage.jsx` — read a `?tab=` search param to set the
  initial `tab` state instead of hardcoding `'activity'`, falling back to
  `'activity'` if the param is missing or not a valid tab id. No behavior
  change when the param is absent.

## Error handling

- No session available and login bootstrap itself fails (e.g. MSW not
  running because this isn't a dev build): tiles render whatever the iframe
  naturally shows (most likely the login screen) — acceptable for what is
  inherently a dev-only internal tool, no special-cased error UI needed.
- An iframe's target route 404s or errors: no special handling — this would
  only happen if `flowsConfig.js` itself has a typo'd path, which is a
  content bug to fix in the config, not a runtime case to design around.

## Testing

Manual verification only, consistent with how the rest of this MVP is
verified (no test suite in this project): load `/flow` in a fresh browser
session (no prior login) and confirm all four flows render real, populated
screens with no login walls; confirm tiles are not clickable; confirm the
page works when already logged in as either role.
