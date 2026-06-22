import { buildSeed } from './seed.js';

const KEY = 'visavista:db:v2';

function read() {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* fall through */ }
  }
  const seeded = buildSeed();
  localStorage.setItem(KEY, JSON.stringify(seeded));
  return seeded;
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function table(name, prefix) {
  return {
    all() {
      return read()[name];
    },
    find(id) {
      return read()[name].find((r) => r.id === id) ?? null;
    },
    where(predicate) {
      return read()[name].filter(predicate);
    },
    create(data) {
      const state = read();
      const record = { id: uid(prefix), ...data };
      state[name] = [...state[name], record];
      write(state);
      return record;
    },
    update(id, patch) {
      const state = read();
      const idx = state[name].findIndex((r) => r.id === id);
      if (idx === -1) return null;
      state[name][idx] = { ...state[name][idx], ...patch };
      write(state);
      return state[name][idx];
    },
    remove(id) {
      const state = read();
      const before = state[name].length;
      state[name] = state[name].filter((r) => r.id !== id);
      write(state);
      return before !== state[name].length;
    },
  };
}

export const db = {
  users:       table('users', 'u'),
  students:    table('students', 's'),
  cases:       table('cases', 'c'),
  documents:   table('documents', 'd'),
  tasks:       table('tasks', 't'),
  activity:    table('activity', 'a'),
  offers:      table('offers', 'o'),
  fees:        table('fees', 'f'),
  lodgements:  table('lodgements', 'l'),
  config: {
    get() {
      return read().config;
    },
    update(patch) {
      const state = read();
      state.config = { ...state.config, ...patch };
      write(state);
      return state.config;
    },
  },
  reset() {
    localStorage.removeItem(KEY);
    return read();
  },
};

// Fixes known typo strings the user may have typed through the ActivityForm / FeeForm
// during testing. Runs once at startup — surgical patch, does not reset the DB.
const ACTIVITY_FIXES = {
  'this is hte demo rationale':  'Discussed Australia options — student interested in Business at Griffith. Budget NPR 25L, IELTS pending.',
  'this is the demo rationale':  'Discussed Australia options — student interested in Business at Griffith. Budget NPR 25L, IELTS pending.',
  'this is demo or rationale ..':'Recommended Bachelor of IT at Deakin University. Student agreed to start IELTS prep this month.',
  'this is demo or rationale .': 'Recommended Bachelor of IT at Deakin University. Student agreed to start IELTS prep this month.',
};
const FEE_NOTE_FIXES = {
  'this is the send paymetn': 'Second counselling fee payment',
  'inital fee':               'Initial counselling fee',
  'initial fee':              'Initial counselling fee',
};

export function applyDemoFixes() {
  const state = read();
  let changed = false;

  state.activity = state.activity.map((a) => {
    const good = ACTIVITY_FIXES[a.text?.trim().toLowerCase()] ?? ACTIVITY_FIXES[a.text?.trim()];
    if (good) { changed = true; return { ...a, text: good }; }
    return a;
  });

  state.fees = state.fees.map((f) => {
    const good = FEE_NOTE_FIXES[f.notes?.trim().toLowerCase()] ?? FEE_NOTE_FIXES[f.notes?.trim()];
    if (good) { changed = true; return { ...f, notes: good }; }
    return f;
  });

  if (changed) write(state);
}
