# PRD — Ask Visa Vista
## AI Chat Assistant · Visa Vista · Feature PRD

**Feature name:** Ask Visa Vista
**Status:** Draft v1.0
**Author:** Anand Magar
**Date:** June 2026
**Sprint:** Sprint 2 / Sprint 3
**Belongs to:** Global — accessible from every screen

---

## 1. What is this feature?

Ask Visa Vista is a natural language chat assistant built into the app. Instead of navigating through menus and filters to find information, the Admin or Counsellor simply types a question — in plain English — and gets a direct answer pulled from their real case data.

It is not a general AI chatbot. It only knows about this consultancy's actual data — students, cases, fees, documents, refusals. It cannot make things up because every answer comes from the real database, not from AI imagination.

**The single job of this feature:**
> Let anyone on the team ask any question about their cases and get a real, accurate answer in seconds — without opening a single filter or report.

---

## 2. The Problem This Solves

### For the Admin (Anita)

Anita currently has to:
- Open the dashboard to check pipeline counts
- Click into the pipeline to filter by stage
- Open individual cases to find specific information
- Ask counsellors verbally for anything the dashboard doesn't show

Most of the time she just wants a quick answer to a simple question like "how many students do we have for Australia this intake?" — but getting that answer requires multiple clicks and navigation steps.

### For the Counsellor (Bibek)

Bibek currently has to:
- Open each case individually to check document status
- Scroll through checklists to find what's missing
- Remember which students have upcoming deadlines
- Check his task list separately from his case list

He wants to ask "which of my students still haven't submitted their bank statement?" and get the answer immediately.

### What changes with Ask Visa Vista

```
Before:  Anita opens Dashboard → clicks pipeline →
         filters by country → counts manually → 3 minutes

After:   Anita types "How many Australia cases this intake?"
         → gets answer in 3 seconds
```

---

## 3. Who Uses This Feature

**Admin (Anita)**
Uses it for business intelligence questions — pipeline health, team performance, refusal patterns, conversion rates. Asks broader questions across all counsellors and all cases.

**Counsellor (Bibek)**
Uses it for daily work questions — which students need follow-up, what documents are missing, what's overdue. Asks narrower questions about their own assigned cases only.
 
**Role boundary:** The assistant respects the same permissions as the rest of the app. A counsellor asking "how many cases does Bibek have?" only sees their own data. An admin asking the same question sees the real number. The AI cannot bypass the role permissions already built into the system.

---

## 4. How It Works (Plain Language)

### The simple version

```
1. User types a question in the chat
2. The system looks up the real answer in the database
3. The answer is shown in plain language
```

The AI does not guess or make up data. It reads the real case records and formats the answer in a human sentence.

### The technical version (for developers, simple)

This is called RAG — Retrieval Augmented Generation:

```
User asks: "Which cases are overdue?"
        ↓
System runs a database query:
SELECT * FROM cases WHERE deadline < today
        ↓
Result: 3 cases (Sunita Lama, Kamala Rai, Bibek Shrestha)
        ↓
System gives this data to the AI model:
"Here are the overdue cases: [real data].
 Answer the user's question in plain language."
        ↓
AI responds: "You have 3 overdue cases —
 Sunita Lama (USA), Kamala Rai (New Zealand),
 and Bibek Shrestha (Canada)."
```

The AI's only job is to turn real database results into a natural sentence. It never invents case names or numbers.

### Model choice

For lookup and summary questions (most questions): **Gemini Flash-Lite or DeepSeek** — extremely cheap, under $2/month for a 5-person team asking 50 questions a day.

For complex reasoning (recommendations, pattern analysis): **Sonnet-class model** — used sparingly, only when needed.

---

## 5. Where It Lives in the App

### Primary location — Floating button, bottom right corner (every screen)

A small floating button in the bottom-right corner of every screen. It looks like a chat bubble icon. Clicking it opens a slide-in panel from the right side — 380px wide, full height — that sits on top of the current screen without navigating away.

```
┌────────────────────────────────────────────┐
│                                            │
│   Current screen (Dashboard / Pipeline)   │
│                                            │
│                          ┌──────────────┐  │
│                          │ Ask Visa     │  │
│                          │ Vista        │  │
│                          │              │  │
│                          │ [chat area]  │  │
│                          │              │  │
│                          │ [input box]  │  │
│                          └──────────────┘  │
│                                    [💬]    │
└────────────────────────────────────────────┘
```

**Why floating, not a dedicated page?**
The assistant is most useful when Anita is looking at the dashboard and wants a quick answer without leaving the screen. A dedicated page would break the workflow.

### Secondary location — Dashboard quick-access bar

On the Admin Dashboard, a prominent search-style bar near the top with the placeholder text "Ask anything about your cases..." — for Anita who wants to use it immediately without clicking a floating button.

### Tertiary location — Sidebar link (optional)

A sidebar item called "Ask Visa Vista" for users who prefer navigating through the sidebar. Opens the same chat panel.

---

## 6. Predefined Questions (Starters)

When the user first opens the chat, show a set of suggested questions grouped by category. These remove the blank-page problem — users don't have to think about what to ask first.

---

### For Admin role

**Pipeline and overview**
- "How many active cases do we have right now?"
- "Which stage has the most cases?"
- "How many cases have no next action set?"
- "Show me all cases that are overdue"
- "What is our conversion rate this month?"
- "How many students were enrolled this month?"

**Team performance**
- "Which counsellor has the most active cases?"
- "Who has the most overdue tasks?"
- "Which counsellor logged the most activity this week?"

**Refusals and risk**
- "How many visa refusals do we have in total?"
- "What are the most common refusal reasons?"
- "Which country has the most refusals?"
- "Show me all refused cases for Australia"

**Fees and compliance**
- "How much has been collected in fees this month?"
- "Which cases have no fee logged yet?"
- "Show me all fees collected by Bibek Thapa"

**Documents**
- "Which cases have missing documents?"
- "How many cases are waiting on a bank statement?"
- "Which students haven't submitted their IELTS certificate?"

---

### For Counsellor role (shows only their own data)

**My cases**
- "Which of my cases are overdue?"
- "How many cases am I managing right now?"
- "Which of my students have no next action set?"
- "Show me my cases in the Application stage"

**Documents**
- "Which of my students still have missing documents?"
- "Which students haven't sent their bank statement?"
- "What documents is [student name] still missing?"

**Tasks**
- "What tasks do I have due today?"
- "Which of my tasks are overdue?"
- "What do I need to do for [student name] next?"

**Student-specific**
- "What stage is [student name]'s case at?"
- "When did I last contact [student name]?"
- "What was discussed in the last session with [student name]?"
- "What is [student name]'s IELTS score?"

---

## 7. Follow-up Questions

After the AI gives an answer, it should suggest 2-3 relevant follow-up questions based on what was just answered. This makes the conversation feel natural and helps users dig deeper.

### Follow-up examples

**If user asks: "How many overdue cases do we have?"**
AI answers: "You have 3 overdue cases — Sunita Lama (USA), Kamala Rai (New Zealand), and Bibek Shrestha (Canada)."

Follow-up suggestions:
- "Which counsellor is responsible for these cases?"
- "What are the next actions on these cases?"
- "Open the overdue cases in the pipeline"

---

**If user asks: "What is our conversion rate?"**
AI answers: "Your conversion rate this month is 8% — 1 of 12 active students enrolled."

Follow-up suggestions:
- "Which students enrolled this month?"
- "How does this compare to last month?"
- "Which stage are most cases stuck at?"

---

**If user asks: "Which cases have missing documents?"**
AI answers: "5 cases have missing documents — Roshan Thapa (missing bank statement), Priya Karki (missing IELTS), Kamala Rai (missing GIC proof), Dev Tamang (missing sponsor letter), Meera Poudel (missing NOC)."

Follow-up suggestions:
- "Send a document reminder to all 5 students"
- "Which of these are most urgent?"
- "Open Roshan Thapa's document checklist"

---

**If user asks: "What documents is Sita missing?"**
AI answers: "Sita Rai still needs to submit: Bank Statement, Sponsor Letter, and IELTS Certificate. Her Passport is already Verified."

Follow-up suggestions:
- "Generate a reminder message for Sita"
- "What is Sita's current case stage?"
- "When was the last time Sita was contacted?"

---

**If user asks: "Show me all refused cases for Australia"**
AI answers: "2 Australia cases were refused — Roshan Thapa (refused: financial documents incomplete) and Dev Tamang (refused: English score below requirement)."

Follow-up suggestions:
- "What is the most common refusal reason for Australia?"
- "Open Roshan Thapa's case"
- "How many Australia cases are still active?"

---

## 8. Special Actions (Beyond Text Answers)

For some questions the AI can do more than just answer — it can take an action or open a relevant screen.

| User asks | AI response type |
|---|---|
| "Open Sita's case" | Navigates directly to Sita Rai's case detail |
| "Show me overdue cases" | Opens pipeline with overdue filter applied |
| "Generate a reminder for Sita" | Opens the consolidated reminder composer pre-filled |
| "What's missing for Sita?" | Opens Sita's document checklist tab |
| "Show refused Australia cases" | Opens pipeline filtered to refused + Australia |

These actions are shown as clickable buttons in the chat response — not just text.

```
AI: "Sita Rai still needs: Bank Statement, Sponsor Letter.
     Her Passport is Verified."

     [Open Sita's documents]  [Send her a reminder]
```

---

## 9. What the Chat Panel Looks Like

**Header**
- Title: "Ask Visa Vista"
- Subtitle: "Ask anything about your cases"
- Close button (X) top right

**Empty state (first open)**
- Welcome message: "Hi Anita, what would you like to know?"
- 3-4 suggested starter questions as clickable chips

**Chat area**
- User messages: right-aligned, blue bubble
- AI responses: left-aligned, white bubble with subtle border
- Follow-up suggestions: small gray chips below each AI response
- Action buttons: blue outlined buttons below relevant responses

**Input area (bottom)**
- Text input with placeholder: "Ask anything..."
- Send button
- Optional: microphone icon for voice input (Phase 2)

**Loading state**
- Three animated dots while the answer is being prepared
- Takes 1-3 seconds maximum for simple lookups

---

## 10. Screens Where It Appears

| Screen | How it appears | Why here |
|---|---|---|
| Dashboard | Floating button + prominent search bar | Admin's home — most likely starting point |
| Pipeline | Floating button | Counsellor scanning cases wants quick answers |
| Students | Floating button | Finding a specific student by asking |
| Case Detail | Floating button | Asking about this specific case |
| Tasks | Floating button | Asking about task priorities |
| Settings | Floating button | Admin may ask about team data |

**On every screen:** The floating button is always present in the bottom-right corner. The keyboard shortcut ⌘K (already in your topbar) should also open it — this is the fastest access path.

---

## 11. Acceptance Criteria

- User can type a question and get an answer in under 3 seconds
- Answers are based only on real case data — no invented information
- Counsellor cannot see data from other counsellors' cases
- Admin can ask about all counsellors and all cases
- Suggested questions appear on first open
- Follow-up suggestions appear after every AI response
- Action buttons navigate to the correct screen when clicked
- Chat history is preserved within the session (clears on logout)
- Works from every screen in the app via the floating button
- ⌘K keyboard shortcut opens the panel

---

## 12. What Is NOT In This Feature

| Out of scope | Why |
|---|---|
| Giving visa advice or legal opinions | AI should never give official visa guidance |
| Editing or updating case data via chat | Read-only in v1 — actions only navigate, never save |
| Voice input | Phase 2 |
| Multi-language (Nepali) | Phase 2 |
| Chat history across sessions | Phase 2 — privacy implications to consider |
| Recommendation Assistant (suggest universities) | Separate feature — needs knowledge base |
| Sending WhatsApp messages via chat | Phase 2 — needs WhatsApp integration |

---

## 13. Open Questions

1. **What happens if the AI is wrong?** — Users need a way to flag an incorrect answer. A small "This doesn't look right" button below each response would help collect feedback and improve accuracy.

2. **How much data context to send?** — For broad questions like "show me all cases," sending the full dataset is expensive. A summary format (counts, not full records) should be used for broad questions, with detail only loaded when a specific student or case is asked about.

3. **Who can see the chat history?** — Can Anita read Bibek's chat history with the assistant? This is a privacy question worth deciding before building.

4. **Language preference** — Some counsellors may prefer to ask in Nepali. Should the assistant respond in the same language the user types in? Technically easy — but worth confirming before launch.

5. **Error handling** — What does the assistant say when it cannot find an answer? Example: "I couldn't find any cases matching that. Try checking the pipeline directly." This copy needs to be written before development.

---

## 14. Success Metrics

| Metric | Target | When |
|---|---|---|
| Questions asked per week per user | 10+ questions | Month 1 |
| Answer accuracy rate (no wrong data) | 99%+ | Ongoing |
| Time to answer | Under 3 seconds | All questions |
| % of users using it weekly | 70%+ | Month 2 |
| Reduction in verbal status updates | Measurable drop | Month 3 |
| Cost per month (AI API) | Under $5 for 5 users | Ongoing |

---

*End of document · Ask Visa Vista PRD · Sprint 2/3 · June 2026 · Anand Magar*