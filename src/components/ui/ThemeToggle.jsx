import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { resolveTheme, setTheme } from '../../lib/theme.js';
import { cn } from '../../lib/cn.js';

export default function ThemeToggle({ className }) {
  const [theme, setLocal] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') ?? resolveTheme()
      : 'light',
  );

  useEffect(() => {
    const onChange = () => setLocal(document.documentElement.getAttribute('data-theme'));
    const mo = new MutationObserver(onChange);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setLocal(next);
  }

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink rounded-none border border-transparent hover:border-hairline transition-colors duration-fast ease-productive',
        className,
      )}
    >
      {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
    </button>
  );
}
