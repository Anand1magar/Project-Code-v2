// Real seeded demo data used throughout (see src/mocks/seed.js):
// - Case c1  (Roshan Thapa,  Australia) — inquiry stage, just started
// - Case c4  (Anita Gurung,  Canada)    — application stage, has an overdue task
// - Case c6  (Kamala Rai,    New Zealand) — financials stage, has a blocker
// - Case c10 (Meera Poudel,  Australia) — enrolled, visa granted, docs mostly verified
//
// Each screen's `caption` describes the action that leads to the *next*
// screen — the last screen in a flow has none. A screen may also carry a
// `branch`: a short text-only note describing an alternate path the flow
// can take from that point, without a separate live screen for it.
//
// `path` is the real app route the screen represents — it's the source of
// truth `scripts/capture-flow-screens.mjs` navigates to when (re)generating
// `image`, a static PNG under public/flow-screens/ that FlowScreenTile
// actually renders. Screens are pre-rendered images (not live iframes) so
// this page can be captured into design tools (e.g. Figma's HTML-capture
// plugins), which can't reach inside an iframe's own document. Run
// `npm run flow:capture` after any UI or seed-data change that would alter
// what these screens look like.
export const FLOWS = [
  {
    id: 'add-student',
    title: 'Add a Student',
    description: 'From an empty list to a live case record.',
    problem: 'Leads currently live in someone\'s WhatsApp or a notebook — easy to lose, impossible to search, no record of who owns what.',
    solves: [
      'Captures a new lead in under 2 minutes, with where they came from',
      'Catches duplicate students automatically by phone or email',
      'Auto-creates a case so nothing sits unassigned',
    ],
    screens: [
      { label: 'Students list', path: '/students', image: '/flow-screens/students-list.png', caption: 'Clicks "Add student"' },
      {
        label: 'Add student form',
        path: '/students?open=new',
        image: '/flow-screens/students-add-form.png',
        caption: 'Fills form → "Add student"',
        branch: 'If the phone or email matches an existing student, this is blocked instead — a "Student already exists" modal offers to open that record or create a new one anyway.',
      },
      { label: 'Case Detail (auto-created)', path: '/cases/c1', image: '/flow-screens/case-c1-activity.png', caption: 'Scrolls to Documents' },
      { label: 'Case Detail — Documents', path: '/cases/c1?tab=documents', image: '/flow-screens/case-c1-documents.png' },
    ],
  },
  {
    id: 'case-pipeline',
    title: 'Case Pipeline',
    description: 'Scanning the pipeline and comparing cases at different stages.',
    problem: 'No single view of where every student actually is — counsellors track it in their heads, admins have no visibility.',
    solves: [
      'One kanban board for the whole pipeline, from inquiry to enrolled',
      'Every case shows its next action, deadline, and owner at a glance',
      'Move a case forward with a click — no spreadsheet to update',
    ],
    screens: [
      { label: 'Pipeline (Kanban)', path: '/pipeline', image: '/flow-screens/pipeline-kanban.png', caption: 'Opens an early-stage case' },
      { label: 'Case Detail — Inquiry stage', path: '/cases/c1', image: '/flow-screens/case-c1-activity.png', caption: "Compare a case further along" },
      { label: 'Case Detail — Financials stage', path: '/cases/c6', image: '/flow-screens/case-c6-financials.png', caption: "Compare a case that's finished" },
      { label: 'Case Detail — Enrolled', path: '/cases/c10', image: '/flow-screens/case-c10-enrolled.png' },
    ],
  },
  {
    id: 'document-checklist',
    title: 'Document Checklist',
    description: 'Checking what documents are still needed, and comparing an early case to a finished one.',
    problem: 'Missing paperwork is the #1 cause of delayed applications — and nobody notices until it\'s urgent.',
    solves: [
      'A fixed checklist per case (passport, IELTS, SOP, financials, and more)',
      'Shows exactly what\'s pending, received, or verified at a glance',
      'Verifying a document can automatically close out a follow-up task',
    ],
    screens: [
      { label: 'Case Detail — Activity', path: '/cases/c1', image: '/flow-screens/case-c1-activity.png', caption: 'Clicks the Documents tab' },
      { label: 'Documents — just started', path: '/cases/c1?tab=documents', image: '/flow-screens/case-c1-documents.png', caption: "Compare a case that's nearly done" },
      { label: 'Documents — mostly verified', path: '/cases/c10?tab=documents', image: '/flow-screens/case-c10-documents.png' },
    ],
  },
  {
    id: 'task-tracking',
    title: 'Task & Deadline Tracking',
    description: 'Seeing what\'s due, and opening the case behind it.',
    problem: 'Follow-ups get forgotten when they\'re not written down somewhere the whole team can see.',
    solves: [
      'One list of everything due today, overdue, or upcoming',
      'Tasks are tied to a real case and a real deadline, not a sticky note',
      'Marking a task done keeps the whole team\'s picture up to date',
    ],
    screens: [
      { label: 'Tasks page', path: '/tasks', image: '/flow-screens/tasks-page.png', caption: "Opens an overdue case's Tasks tab" },
      { label: 'Case Detail — Tasks', path: '/cases/c4?tab=tasks', image: '/flow-screens/case-c4-tasks.png' },
    ],
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard & Analytics',
    description: 'The admin\'s home screen, and where it drills into next.',
    problem: 'The admin has to ask around to know how the business is actually doing this week.',
    solves: [
      'Live pipeline snapshot, conversion rate, and at-risk cases in one screen',
      'Drills straight into Pipeline or Settings from the same view',
      'No spreadsheet exports, no waiting on someone else\'s report',
    ],
    screens: [
      { label: 'Dashboard', path: '/', image: '/flow-screens/dashboard.png', caption: 'Drills into the Pipeline' },
      { label: 'Pipeline', path: '/pipeline', image: '/flow-screens/pipeline-kanban.png', caption: 'Or into Settings for team management' },
      { label: 'Settings', path: '/settings', image: '/flow-screens/settings.png' },
    ],
  },
  {
    id: 'ask-visa-vista',
    title: 'Ask Visa Vista (AI Chat)',
    description: 'Asking a plain-language question from anywhere in the app.',
    problem: 'Getting a simple answer — "how many Australia cases this month?" — means opening three screens and counting by hand.',
    solves: [
      'Ask in plain English, get a real answer pulled from actual case data',
      'Works from anywhere in the app via the floating button or ⌘K',
      'Answers can link straight back to the case or screen they came from',
    ],
    screens: [
      { label: 'Dashboard', path: '/', image: '/flow-screens/dashboard.png', caption: 'Clicks Ask (or presses ⌘K) and asks a question' },
      { label: 'Ask panel — instant answer', path: '/?ask=How%20many%20active%20cases%20do%20we%20have%20right%20now%3F', image: '/flow-screens/dashboard-ask-answer.png', caption: 'Works from any screen, not just Dashboard' },
      { label: 'Ask panel — from Pipeline', path: '/pipeline?ask=Which%20cases%20have%20missing%20documents%3F', image: '/flow-screens/pipeline-ask-answer.png' },
    ],
  },
];
