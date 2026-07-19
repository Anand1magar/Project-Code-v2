# Technical PRD — Visa Vista CRM (MVP)

**Working title:** *Visa Vista* · **Stack:** React + Vite + JavaScript
**Companion files:** `prd.md` (product PRD — scope, flows, copy) · `DESIGN.md` (all look & feel — IBM Carbon)

This document is the engineering view of `prd.md`. When the two disagree, `prd.md` defines *what* and *why*; this file defines *how* and *where*.

## 1. Goal
A web CRM for education/visa consultancies in Nepal that replaces spreadsheets, WhatsApp, and physical folders with one shared system of record. MVP (Sprint 1 — Quick Wins) is done when:
- A counsellor logs a new inquiry in under 2 minutes (with duplicate detection and lead source).
- Every case has a stage, next action, deadline, and assigned counsellor, visible on a kanban pipeline.
- A counsellor logs session notes, offers, fees, lodgement, and the visa decision from the case detail.
- Visa status and structured refusal reasons are tracked and filterable.
- An admin sees the whole pipeline live, plus conversion rate, at-risk cases, and recent activity.

**No real backend in MVP.** All data flows through MSW + a localStorage-backed mock DB hidden behind a service layer.

> Document checklist/upload, the student portal, WhatsApp, and analytics beyond conversion rate are Phase 2 (`prd.md` §13). A basic per-case document checklist is present as a Sprint-1 placeholder; the verification workflow and file upload are deferred.

## 2. MVP scope
| # | Module | Done when |
|---|---|---|
| 1 | Auth + roles | Mock login as Admin or Counsellor; role controls visibility and route access |
| 2 | Students | Quick inquiry form (≤2 min); lead source; duplicate detection on phone/email; unified profile with linked cases |
| 3 | Cases / pipeline | Auto-placed at Stage 1; move across stages (kanban + list); next action, deadline, blocker, assignee; refused-case filter |
| 4 | Activity & notes | Session note composer (type, country/course/intake, rationale); timeline; admin read-access; last-contact auto-update |
| 5 | Tasks | Tied to case; today/upcoming/overdue; mark complete; appointment + refusal auto-tasks |
| 6 | Offers | Offer log form; auto-move to Offer Received; multiple offers per case |
| 7 | Fees | Fee receipt logger (amount, method, date, receipt #); immutable + voidable; timestamped |
| 8 | Lodgement & visa | Lodgement form (submission date, embassy ref, appointment); visa status field; one-click status update |
| 9 | Visa decision | Granted → Pre-Departure; Refused → structured reason + auto-task + refused filter |
| 10 | Dashboard | Admin: active/at-risk/enrolled/conversion + pipeline snapshot + recent activity. Counsellor: my tasks + my cases |
| 11 | Settings (admin) | Configurable pipeline stages; manage mock users |
| — | Documents | Per-case checklist placeholder (Phase 2: status workflow, upload, verification) |

## 3. Endpoint contract
| Resource | Endpoints |
|---|---|
| auth | `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` |
| students | `GET/POST /api/students`, `GET/PATCH/DELETE /api/students/:id`, `GET /api/students?q=`, `GET /api/students/duplicate?phone=&email=` |
| cases | `GET/POST /api/cases`, `GET/PATCH /api/cases/:id`, `GET /api/cases?studentId=&counsellorId=&stage=&visaOutcome=`, `PATCH /api/cases/:id/stage`, `PATCH /api/cases/:id/visa-status`, `PATCH /api/cases/:id/decision` |
| activity | `GET /api/cases/:caseId/activity`, `POST /api/activity` |
| tasks | `GET /api/tasks?assigneeId=&caseId=&due=today\|overdue`, `POST /api/tasks`, `PATCH /api/tasks/:id` |
| offers | `GET/POST /api/cases/:caseId/offers`, `PATCH /api/offers/:id` |
| fees | `GET/POST /api/cases/:caseId/fees`, `PATCH /api/fees/:id` |
| lodgement | `GET/POST /api/cases/:caseId/lodgement` |
| documents | `GET /api/cases/:caseId/documents`, `POST /api/documents`, `PATCH /api/documents/:id` (Phase 2 placeholder) |
| dashboard | `GET /api/dashboard?role=&userId=` |
| settings | `GET/PATCH /api/config/pipeline`, `GET /api/users`, `POST/PATCH /api/users` |

Server-side side effects to preserve when swapping to a real backend:
- `POST /api/cases` → auto-set `stage: 'inquiry'`, seed a pending document per checklist item.
- `POST /api/cases/:caseId/offers` → move case to `offer-received`.
- `POST /api/cases/:caseId/lodgement` → move case to `visa-lodgement`, set `visaStatus: 'Lodged'`, and create an appointment auto-task if `appointmentDate` is set.
- `PATCH /api/cases/:id/decision` → granted moves to `pre-departure`; refused moves to `visa-decision`, archives the refusal reason, and creates a "review refusal" auto-task.
- `POST /api/activity` → update the case `lastContact`.

## 4. Architecture rules
1. No `fetch` outside `src/services/apiClient.js`.
2. All data access is async.
3. Swap to real backend = remove MSW + set `VITE_API_BASE_URL`. Nothing in `features/*` changes.
4. Feature-first folders.
5. No hardcoded design values in components — Tailwind utility classes mapped to tokens only. Square corners (`rounded-none`); IBM Blue (`bg-primary`) only for primary CTAs, links, CTA banner, focus.
6. Components presentational. Data in hooks. Logic in services.
7. JS + JSDoc typedefs. No TypeScript.
8. localStorage = mock persistence.
9. Lazy-load routes.
10. Semantic HTML, labels, focus rings, keyboard-usable.

## 5. Data model (JSDoc)
- **User** `{ id, name, email, role: 'admin' | 'counsellor', status: 'active' | 'deactivated' }`
- **Student** `{ id, name, phone, email?, targetCountry, leadSource: 'walk-in'|'whatsapp'|'referral'|'facebook'|'other', createdBy, createdAt }`
- **Case** `{ id, studentId, counsellorId, country, intake, stage, nextAction, deadline, blocker, lastContact, visaStatus: 'Lodged'|'Under Review'|'Decision Pending'|'Decided'|null, visaOutcome: 'granted'|'refused'|null, refusalCategory, refusalDetail }`
- **Activity** `{ id, caseId, type: 'note'|'call'|'email'|'meeting', text, countryRecommended, courseRecommended, intake, authorId, createdAt }`
- **Task** `{ id, caseId, assigneeId, title, dueDate, done, autoCreated }`
- **Offer** `{ id, caseId, university, offerType: 'conditional'|'unconditional', acceptanceDeadline, conditionalRequirements, status: 'pending'|'accepted'|'expired'|'declined', createdAt }`
- **Fee** `{ id, caseId, amount, paymentMethod, paymentDate, receiptNumber, notes, createdBy, createdAt, voided, voidReason }`
- **Lodgement** `{ id, caseId, submissionDate, embassyRefNumber, appointmentDate, createdBy, createdAt }`
- **Document** `{ id, caseId, type, status: 'pending'|'received'|'verified'|'rejected', fileName }` (Phase 2 placeholder)

## 6. Folder layout
```
src/
├── main.jsx               # entry; starts MSW in dev
├── App.jsx                # providers + router
├── styles/{tokens.css, index.css}
├── config/pipeline.js     # stages + checklist (editable)
├── routes/                # one file per page
├── layouts/               # AppLayout, Sidebar, Topbar, SearchBar
├── components/ui/         # shared primitives
├── features/<name>/       # auth, students, cases, activity, tasks,
│   ├── <name>Service.js   #   offers, fees, lodgements, documents,
│   ├── <name>.types.js    #   dashboard, users
│   ├── hooks/
│   └── components/
├── services/apiClient.js  # the ONLY fetch site
├── mocks/{db.js, handlers.js, browser.js, seed.js}
└── lib/{date.js, cn.js, theme.js}
```

## 7. Where things go
| Creating… | Goes in… |
|---|---|
| A page route | `src/routes/XxxPage.jsx` |
| A feature-specific component | `src/features/<feature>/components/` |
| A reusable primitive | `src/components/ui/` |
| Data fetching for a feature | `src/features/<feature>/<feature>Service.js` |
| A hook wrapping a service | `src/features/<feature>/hooks/` |
| A typedef | `src/features/<feature>/<name>.types.js` |
| `fetch` | only `src/services/apiClient.js` |
| Mock/seed | `src/mocks/` |
| Pipeline stages / checklist | `src/config/pipeline.js` |
| Colors/fonts/spacing values | tokens in `src/styles/tokens.css` (defined in `DESIGN.md`) |

## 8. Definition of done
- All modules in §2 pass the acceptance criteria in `prd.md` §7.
- No `fetch` outside `apiClient.js`; no hex / px in `features/**`, `routes/**`, `components/**`.
- App runs from seed, survives refresh, demos both admin and counsellor flows end-to-end (`prd.md` §8).
- README documents the mock→real flip.
