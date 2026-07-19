// Real seeded demo data used throughout: student "Roshan Thapa" / case "c1"
// (see src/mocks/seed.js). Each screen's `caption` describes the action
// that leads to the *next* screen — the last screen in a flow has none.
export const FLOWS = [
  {
    id: 'login',
    title: 'Login',
    description: 'Signing in and landing on the dashboard.',
    screens: [
      { label: 'Sign in', path: '/login', caption: 'Selects a profile → Continue' },
      { label: 'Dashboard', path: '/' },
    ],
  },
  {
    id: 'add-student',
    title: 'Add a Student',
    description: 'From an empty list to a live case record.',
    screens: [
      { label: 'Students list', path: '/students', caption: 'Clicks "Add student"' },
      { label: 'Add student form', path: '/students?open=new', caption: 'Fills form → "Add student"' },
      { label: 'Case Detail (auto-created)', path: '/cases/c1' },
    ],
  },
  {
    id: 'case-pipeline',
    title: 'Case Pipeline',
    description: 'Scanning the pipeline and opening a case.',
    screens: [
      { label: 'Pipeline (Kanban)', path: '/pipeline', caption: 'Clicks a case card' },
      { label: 'Case Detail', path: '/cases/c1' },
    ],
  },
  {
    id: 'document-checklist',
    title: 'Document Checklist',
    description: 'Checking what documents are still needed.',
    screens: [
      { label: 'Case Detail — Activity', path: '/cases/c1', caption: 'Clicks the Documents tab' },
      { label: 'Case Detail — Documents', path: '/cases/c1?tab=documents' },
    ],
  },
];
