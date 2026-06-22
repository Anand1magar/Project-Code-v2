const KEY = 'visavista:theme';

export function getStoredTheme() {
  return localStorage.getItem(KEY);
}

export function resolveTheme() {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

export function toggleTheme(current) {
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}
