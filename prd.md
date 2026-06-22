# Visa Vista — Product Requirements Document

**Product:** Visa Vista
**Version:** v2.0 · Updated
**Status:** Draft
**Author:** Anand Magar
**Date:** June 2026
**Audience:** Designers · Developers · Mentors · Stakeholders

---

## Table of Contents

1. What is Visa Vista?
2. The problem we are solving
3. Who uses it
4. What success looks like
5. The 6 core problems and how we solve them
6. What's in the MVP (Sprint 1)
7. Screens — what each one does
8. User flows
9. Roles and permissions
10. User stories
11. What's NOT in the MVP (Phase 2)
12. Open questions

---

## 1. What is Visa Vista?

Visa Vista is a case management tool built specifically for education and visa consultancies in Nepal. It helps consultancy owners and counsellors manage student visa applications from first inquiry all the way through to enrollment — in one shared place instead of scattered across Excel files, WhatsApp groups, and physical folders.

**The single job of the product:**
> Give every student a clear stage, give every counsellor a clear next step, and give the owner a clear view of the whole pipeline — without anyone having to ask anyone.

---

## 2. The Problem We Are Solving

### How it works today (the As-Is)

A typical Nepal consultancy with 5-15 counsellors manages everything through:
- Excel files saved on personal laptops
- WhatsApp messages that get buried
- Physical folders that go missing
- The counsellor's memory as the main source of truth

When a counsellor leaves, all their case history leaves with them. When the owner wants to know how many students are at each stage, they have to ask every counsellor verbally and get different answers. When a visa is refused, no one writes down why — and the same mistake happens again six months later.

### The 6 biggest problems (validated from research)

| # | Problem | Who it costs |
|---|---|---|
| 1 | Leads are lost when the counsellor is busy | Lost revenue |
| 2 | Everything runs on Excel and Windows folders | Lost data and time |
| 3 | Financial documents cause the #1 visa refusal | Failed visas |
| 4 | Fees collected without receipts | Legal compliance risk |
| 5 | Owner has no live view of the pipeline | Lost control |
| 6 | Students don't know what to do next | Poor experience |

---

## 3. Who Uses It

### Persona 1 — Anita (Owner / Admin)

Anita runs a consultancy with 8 counsellors in Kathmandu. She has no visibility into her own business unless she walks around and asks people. She doesn't know how many students are at which stage, which cases are at risk, or what her conversion rate is. She wants to walk in every morning and know exactly what's happening without asking a single person.

**What she needs:**
- A live dashboard showing the whole pipeline
- The ability to read any counsellor's session notes without asking
- Proof of fees collected for compliance
- Visibility into refusal patterns across all cases

### Persona 2 — Bibek (Counsellor)

Bibek manages 25-35 active student cases at any time. He keeps everything in his head, in WhatsApp, and in a personal Excel file. He forgets follow-ups, loses documents, and sometimes doesn't even know a student has already inquired before. He wants to start every day knowing exactly what to do next for each student.

**What he needs:**
- A clear daily task list showing what's overdue and what's due today
- A fast way to log new student inquiries
- A structured place to write session notes so he's protected
- A clear pipeline showing which stage each student is at

### Persona 3 — Sita (Student) — Phase 2 only

Sita is the student going through the visa process. She calls the office 3-4 times a week just to ask "what's happening?" because she has no visibility into her own case. She is not a user in Sprint 1 — she gets her own portal in Phase 2.

---

## 4. What Success Looks Like

### Week 1
- All counsellors have logged in at least once
- At least 50% of new inquiries are being logged in the system instead of WhatsApp

### Month 1
- 80% of active cases have a next action and deadline set
- Counsellors are logging session notes weekly
- Owner is checking the dashboard at least 3 times a week without asking anyone

### Month 3
- Dropped leads reduced by 50%
- Zero missed offer deadlines
- 100% of fees have a digital receipt
- Owner can answer "what is our conversion rate?" from the dashboard alone

### Failure signals
- Counsellors still using WhatsApp for everything and only entering data in the system after the fact
- Session notes being too short to be useful (one word entries)
- Admin dashboard not being opened regularly

---

## 5. The 6 Core Problems and How We Solve Them

### Problem 1 — Leads are lost when the counsellor is busy

**What happens today:** A student walks in while Bibek is in a session. No one writes the name down. The student leaves and is never followed up with. The consultancy never even knows they came.

**How Visa Vista solves it:**
- **Quick Inquiry Form** — anyone (including the receptionist) can log a new student in under 2 minutes with just name, phone, country, and how they heard about the consultancy
- **Help Desk Access** — the receptionist doesn't need a counsellor to log an inquiry — they have their own simplified access to just the inquiry form
- **Auto Pipeline Placement** — the moment the form is saved, the case automatically appears at Stage 1 in the pipeline — no one needs to manually place it

---

### Problem 2 — Everything runs on Excel and Windows folders

**What happens today:** Student files live in a folder on Bibek's personal laptop named "Sita_docs_final_v2." When Bibek is sick or leaves the job, no one can find anything. Documents get overwritten and old versions are lost.

**How Visa Vista solves it:**
- **Unified Student Record** — one shared profile per student, visible to the whole team, not locked on one laptop
- **Case Activity Timeline** — every note, call, and update on a case is saved permanently in one chronological history — it doesn't disappear if Bibek leaves
- **Version Control** — when a new version of a document is uploaded, the previous version is kept safely and the latest version is shown clearly on top

---

### Problem 3 — Financial documents cause the #1 visa refusal

**What happens today:** The visa application goes to the embassy with an incomplete bank statement that nobody checked. Months of work — counselling, application prep, waiting for the offer — all collapse because of one document gap that could have been caught before submission.

**How Visa Vista solves it:**
- **Document Checklist** — a pre-built list of every required document for each destination country automatically loads when a case is created — nothing is left to memory
- **Document Status Tracker** — each document moves through a clear status: Required → Pending → Received → Verified — the team always knows the exact state of every file
- **AI Document Checker** (Phase 2 / Sprint 2) — reads an uploaded document and flags if something looks wrong or incomplete before a human reviews it

---

### Problem 4 — Fees collected without receipts

**What happens today:** A student pays NPR 25,000 in cash. Bibek accepts it and moves on. No receipt is issued. Following the May 2026 crackdown on undocumented consultancy fees, this creates serious legal risk with zero paper trail.

**How Visa Vista solves it:**
- **Fee Receipt Logger** — every payment is logged with amount, payment method, date, and receipt number at the moment it's collected
- **Timestamped Fee Entries** — every entry is permanently saved with the exact time and who logged it — it cannot be edited or deleted after the fact
- **Compliance Export** — one-click export of all fee records in an audit-ready format if regulators ask

---

### Problem 5 — Owner has no live view of the pipeline

**What happens today:** Anita arrives every morning and has to ask each counsellor verbally: "how many students do you have? which ones are at risk? what's our conversion rate?" She gets different answers every time and has no way to verify them.

**How Visa Vista solves it:**
- **Admin Dashboard** — the moment Anita logs in, she sees the full pipeline: how many cases at each stage, which cases are overdue, recent team activity, and the conversion rate — all from real-time data, no asking required
- **Owner Read Access** — Anita can open any counsellor's case and read their session notes at any time, without asking permission or waiting for a report

---

### Problem 6 — Students don't know what to do next

**What happens today:** After a session with Bibek, Sita walks out with no clear list of what she needs to do next, no idea what documents she owes, and no way to check her case status. She calls the office 3-4 times a week just to ask "what's happening?"

**How Visa Vista solves it (Phase 2):**
- **Student Doc Portal** — Sita logs in to her own simple screen and sees exactly what documents she still needs to submit and what stage her case is at — no calling, no WhatsApp
- **Next-Action Setter (Sprint 1, for counsellors)** — Bibek is required to set a "what's next" and a deadline at the end of every session — so Sita at least leaves every meeting with a clear task

---

## 6. What's in the MVP (Sprint 1)

These are the Quick Win features — high impact, achievable quickly. This is everything that gets built in the first release.

### Inquiry and student records
- Quick Inquiry Form — log a student in under 2 minutes
- Help Desk Access — receptionist can log without counsellor
- Auto Pipeline Placement — case appears at Stage 1 instantly
- Duplicate Detection — prevents the same student being logged twice
- Unified Student Record — one shared profile per student
- Lead Source Tag — records where the inquiry came from

### Session and case management
- Session Note Composer — log what was discussed with rationale
- Case Activity Timeline — full case history, never lost
- Owner Read Access — admin reads any session note
- Next-Action Setter — required next step + deadline on every session
- Recommendation Log — structured record of why a country or university was recommended
- Transparent Audit Trail — every change is timestamped, nothing can be quietly changed

### Tasks and reminders
- Today / Upcoming Task View — counsellor's daily task list
- Appointment Auto-Task — reminder fires automatically on visa appointment date
- Refusal Auto-Task — "review refusal reason" task created automatically when a visa is refused

### Offer management
- Offer Log Form — logs offer with acceptance deadline
- Deadline Dashboard Widget — alerts fire 7, 3, and 1 day before deadline

### Fee and compliance
- Fee Receipt Logger — log every payment with receipt number
- Timestamped Fee Entries — immutable, permanent audit trail

### Visa lodgement and decision
- Lodgement Form — logs submission date and embassy reference number
- Visa Status Field — Lodged, Under Review, Decision Pending, Decided
- One-Click Status Update — change status in one click
- Structured Refusal Reason — log refusal category and free-text detail
- Refused Case Filter — filter pipeline to see only refused cases

### Dashboard and overview
- Admin Dashboard — pipeline counts, at-risk cases, team activity
- Conversion Rate Widget — shows inquiry-to-enrolled percentage

### Settings (Admin only)
- Manage Team — invite counsellors, change roles, deactivate accounts
- Pipeline Stage Config — rename and reorder pipeline stages

---

## 7. Screens — What Each One Does

### Login screen
Where everyone enters their email and password to get into the app. On login, the system identifies the role (Admin or Counsellor) and sends them to the right dashboard.

### Admin Dashboard
The first screen Anita sees. Shows the whole business in one view:
- Four stat cards at the top: total active cases, cases at risk (overdue), enrolled this month, conversion rate
- A pipeline snapshot showing how many cases are at each stage
- An at-risk cases list sorted by how many days overdue they are
- A recent activity feed showing what the team did in the last 24 hours

### Counsellor Dashboard
The first screen Bibek sees. Shows his own workload:
- Today's tasks and overdue items
- His assigned cases with stage, next action, and deadline
- A list of cases with no next action (so nothing goes idle)

### Students list
A searchable list of all students. Clicking a student opens their profile. Includes an "Add new student" button that opens the Quick Inquiry Form.

### Add new student (Quick Inquiry Form)
A short form with just 4 required fields: name, phone, target country, and lead source. On submission, the system checks for duplicates and if clear, creates the student profile and places the case at Stage 1 automatically.

### Student profile
Shows all the information about one student — their contact details, target country, and a list of every case they have (one student can apply to multiple countries). Clicking a case opens the Case Detail page.

### Pipeline (Kanban board)
Shows all cases as cards, one column per stage. Each card shows the student name, country, intake date, assigned counsellor, next action, and deadline. Cards with an overdue deadline have a red warning tag. The admin can filter by counsellor, country, intake, or at-risk status.

### Case detail page
The main workspace for one student's visa journey. The header shows the stage, next action, deadline, assigned counsellor, and last contact date. Below the header are six tabs:

**Activity tab** — A chronological timeline of every note, call, and update logged on this case. This is where session notes appear.

**Documents tab** — The document checklist for this case. Each item has a status (Required / Pending / Received / Verified / Rejected). Files are uploaded here. Shows clearly what's still missing.

**Tasks tab** — All tasks tied to this case. Some are created manually, some are auto-created by the system (like the Appointment Auto-Task and Refusal Auto-Task).

**Offer tab** — Where the university offer is logged with the acceptance deadline. Shows alerts if the deadline is approaching.

**Fee tab** — Where every payment collected for this case is logged with amount, method, date, and receipt number.

**Lodgement tab** — Where the visa application details are logged — submission date, embassy reference number, appointment date, and current visa status.

### Tasks page (Counsellor)
Three sections: Overdue (sorted oldest first), Today, and Upcoming. Each task row shows the task title, which case it's linked to, and the due date. Clicking a task opens the linked case.

### Settings — Manage team (Admin only)
A list of all team members with their name, role, and status. Admin can invite new counsellors, change someone's role, or deactivate old accounts.

### Settings — Pipeline stages (Admin only)
A list of the current pipeline stages in order. Admin can rename any stage to match their consultancy's language, and reorder them by drag-and-drop.

---

## 8. User Flows

### Admin daily flow

1. Admin logs in → lands on Admin Dashboard
2. Scans pipeline counts, at-risk cases, and recent activity
3. Clicks "Add student" → fills Quick Inquiry Form → case auto-placed at Stage 1
4. Opens Pipeline → clicks an overdue case → opens Case Detail
5. Reads counsellor's session notes in the Activity tab
6. Checks or updates the next action and deadline
7. Goes to the Offer tab → logs an incoming university offer
8. Goes to the Fee tab → logs a payment collected that day
9. Goes to the Lodgement tab → logs visa submission reference number
10. Logs the visa decision when it arrives (Granted or Refused)
11. If refused → logs refusal reason → system auto-creates a review task
12. Returns to dashboard → checks end-of-day conversion rate and at-risk count
13. Logs out

### Counsellor daily flow

1. Counsellor logs in → lands on Counsellor Dashboard
2. Checks today's tasks and overdue items
3. Opens the first overdue case from the task list
4. Reviews the case history in the Activity tab
5. Logs a new session note — country, course, rationale
6. Sets the next action and deadline (required before saving)
7. Updates the document checklist with any new files received
8. Logs the IELTS/PTE score in the student's profile if it arrived
9. Logs a university offer in the Offer tab if received
10. Logs a payment in the Fee tab if collected
11. Logs visa lodgement details when the application is submitted
12. Updates the visa status as it progresses (Lodged → Under Review → Decided)
13. Logs the decision when it arrives — if refused, logs the reason
14. Moves to the next case in their list

---

## 9. Roles and Permissions

| What you can do | Admin | Counsellor |
|---|---|---|
| See all cases across the whole team | Yes | No — only assigned cases |
| Add a new student | Yes | Yes |
| Log session notes | Yes | Yes |
| Read any counsellor's notes | Yes | No — only their own |
| Move a case to a new stage | Yes | Yes — assigned cases only |
| Log fees and receipts | Yes | Yes — assigned cases only |
| Log lodgement and visa status | Yes | Yes — assigned cases only |
| See the conversion rate widget | Yes | No |
| Invite or remove team members | Yes | No |
| Change pipeline stage names | Yes | No |
| Export compliance report | Yes | No |
| Access Settings section | Yes | No |

---

## 10. User Stories

### US-001 — Quick Inquiry Form
As a Counsellor, I want to log a new student inquiry in under 2 minutes so that no walk-in or WhatsApp lead is ever lost because I was busy.

**Done when:**
- Form has name, phone, target country, and lead source fields
- System checks for a duplicate before saving
- On save, case appears at Stage 1 in the pipeline automatically
- The whole process takes under 90 seconds end-to-end

---

### US-002 — Session Note Composer
As a Counsellor, I want to write what I discussed and recommended in a session so that there is a written, timestamped record if a student disputes what I told them.

**Done when:**
- Note has type (note / call / meeting), country, course, and required rationale field
- Rationale has a minimum of 20 characters — cannot submit empty
- Note is saved with timestamp and author ID
- Admin can read the note immediately after it's saved

---

### US-003 — Next-Action Setter
As a Counsellor, I want to set what happens next and by when so that no case ever sits without a clear plan.

**Done when:**
- Next action and deadline are required fields — session cannot be marked complete without them
- Next action appears on the case header and pipeline card
- Cases with no next action are visually flagged on the dashboard

---

### US-004 — Fee Receipt Logger
As an Admin, I want to log every fee payment with a receipt number so that we have a permanent audit trail for compliance.

**Done when:**
- Form has amount, payment method, date, and receipt number
- Entry is saved with timestamp and the ID of whoever logged it
- Entry cannot be edited or deleted after saving — only voided
- Admin can see all entries across all counsellors

---

### US-005 — Admin Dashboard
As an Admin, I want to see the whole pipeline the moment I log in so that I never have to ask counsellors for a verbal update again.

**Done when:**
- Dashboard shows total active cases, at-risk count, enrolled this month, and conversion rate
- Pipeline snapshot shows case counts per stage
- At-risk list shows overdue cases sorted by days overdue
- Data refreshes automatically — no manual refresh needed

---

### US-006 — Structured Refusal Reason
As a Counsellor, I want to log why a visa was refused so that the same mistake never happens again on another case.

**Done when:**
- Refusing a visa requires selecting a category (Financial, Language, Purpose of Study, etc.)
- Free-text detail field is required — minimum 20 characters
- A "review refusal reason" task is auto-created on submission
- Case is added to the Refused Case Filter view automatically

---

### US-007 — Lodgement Form
As a Counsellor, I want to log the embassy reference number when a visa is submitted so that I can find the case instantly if the embassy calls.

**Done when:**
- Form has submission date and reference number (both required)
- Reference number appears on the case header
- Reference number is searchable across all cases in the system

---

### US-008 — Offer Log Form
As a Counsellor, I want to log a university offer with its acceptance deadline so that the offer never expires without anyone noticing.

**Done when:**
- Form has university name, offer type, and acceptance deadline
- Dashboard alerts appear 7, 3, and 1 day before the deadline
- Case is flagged as at-risk if deadline passes without acceptance

---

### US-009 — Owner Read Access
As an Admin, I want to read any counsellor's session notes without asking for permission so that I have full visibility into every case at any time.

**Done when:**
- Admin can open any case and read the full activity timeline
- No extra permission step is required
- Notes from all counsellors are visible to admin

---

### US-010 — Duplicate Detection
As the system, I want to flag when a student already exists before a new record is created so that the same student is never logged twice.

**Done when:**
- System checks phone and email as they are entered in the form
- If a match is found, a modal appears showing the existing record
- User can choose to open the existing record or create a new one anyway

---

## 11. What's NOT in MVP (Phase 2)

These features are real and important — but they require the Sprint 1 system to be stable and populated with real data before they add value.

| Feature | Why deferred |
|---|---|
| Student Doc Portal | Needs its own login system and student-facing interface — separate project |
| Student Online Inquiry Form | Requires a public-facing form and web presence |
| Document upload + version control | Needs file storage infrastructure built first |
| Financial document checklist | Depends on document checklist system (Sprint 2) |
| AI Document Checker | Needs document uploads to exist first |
| WhatsApp integration | Requires third-party API setup and compliance |
| Refusal pattern analytics | Needs 3+ months of real refusal data before patterns are meaningful |
| Recommendation Assistant (AI) | Needs a knowledge base of university requirements to be built and maintained |
| Ask Visa Vista (AI chat) | Needs Sprint 1 data to exist before there's anything to query |
| Reports and analytics | Phase 2 — conversion and team performance reports |
| Pre-departure checklist | Lower urgency than the core pipeline features |

---

## 12. Open Questions

These are things that need answers before the product launches — they cannot be assumed.

1. **Pricing model** — Is it per seat (per counsellor per month) or a flat monthly fee per consultancy? This changes who makes the buying decision. Needs owner interviews.

2. **Data migration** — When a consultancy signs up, do they import existing students from Excel? If yes, what format? If no, how do we handle the transition period where some students are in Visa Vista and some are still in Excel?

3. **Pipeline stages per country** — Australia, UK, USA, and Canada all have slightly different visa processes. Are the 10 default stages right for all countries, or should stages be country-configurable?

4. **Who is the daily user — owner or counsellor?** — If counsellors don't update their cases consistently, the dashboard is useless. What is the minimum counsellor behavior needed for the system to work for the owner? And how do we design for that?

5. **Compliance export format** — What format does the Nepal Department of Commerce actually accept for fee audits? PDF? CSV? Excel? This needs to be confirmed before building the export feature.

6. **Offline use** — Some counsellors are in areas with poor internet. Does the app need to work offline and sync later, or is always-online acceptable?

7. **One student, multiple cases** — If Sita applies for Australia and it gets refused, then tries UK, are these two separate cases on one student profile or one case that gets updated? The data model decision affects reporting significantly.

---

*End of document · Visa Vista PRD v2.0 · June 2026 · Anand Magar*