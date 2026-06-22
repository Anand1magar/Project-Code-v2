import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Briefcase, CornerDownLeft } from 'lucide-react';
import { useStudents } from '../features/students/hooks/useStudents.js';
import { useCases } from '../features/cases/hooks/useCases.js';
import { usePipeline } from '../features/cases/hooks/usePipeline.js';
import { cn } from '../lib/cn.js';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const nav = useNavigate();
  const { students } = useStudents();
  const { cases } = useCases();
  const { config } = usePipeline();

  // "/" focuses the search bar
  useEffect(() => {
    function onKey(e) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Click outside closes the panel
  useEffect(() => {
    function onClick(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const stageLabel = useMemo(() => {
    const map = Object.fromEntries((config?.stages ?? []).map((s) => [s.id, s.label]));
    return (id) => map[id] ?? id;
  }, [config]);
  const studentsById = useMemo(
    () => Object.fromEntries(students.map((s) => [s.id, s])),
    [students],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { students: [], cases: [], flat: [] };
    const stMatch = students
      .filter((s) =>
        s.name.toLowerCase().includes(q) ||
        (s.email ?? '').toLowerCase().includes(q) ||
        s.targetCountry.toLowerCase().includes(q),
      )
      .slice(0, 5);
    const caseMatch = cases
      .filter((c) => {
        const s = studentsById[c.studentId];
        return (
          s?.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.intake.toLowerCase().includes(q) ||
          stageLabel(c.stage).toLowerCase().includes(q)
        );
      })
      .slice(0, 5);
    const flat = [
      ...stMatch.map((s) => ({ kind: 'student', id: s.id, to: `/students/${s.id}`, primary: s.name, secondary: `${s.email ? s.email + ' · ' : ''}${s.targetCountry}` })),
      ...caseMatch.map((c) => ({ kind: 'case', id: c.id, to: `/cases/${c.id}`, primary: `${studentsById[c.studentId]?.name ?? 'Case'} · ${c.country}`, secondary: `${c.intake} · ${stageLabel(c.stage)}` })),
    ];
    return { students: stMatch, cases: caseMatch, flat };
  }, [query, students, cases, studentsById, stageLabel]);

  useEffect(() => { setActive(0); }, [query]);

  function go(item) {
    setOpen(false);
    setQuery('');
    nav(item.to);
  }

  function onKeyDown(e) {
    if (!open) return;
    const { flat } = results;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      const item = flat[active];
      if (item) {
        e.preventDefault();
        go(item);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search size={14} strokeWidth={1.5} className="pointer-events-none absolute left-sm top-1/2 -translate-y-1/2 text-ink-subtle" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search students, cases, countries…"
          aria-label="Search"
          className="h-8 w-full bg-surface-1 pl-xl pr-xl text-body-sm text-ink rounded-none border border-transparent focus:border-hairline placeholder:text-ink-subtle"
        />
        <kbd className="pointer-events-none absolute right-sm top-1/2 -translate-y-1/2 text-caption text-ink-subtle">/</kbd>
      </div>

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-40 mt-xxs border border-hairline bg-canvas shadow-none">
          {results.flat.length === 0 ? (
            <div className="px-md py-md text-body-sm text-ink-muted">No matches for “{query}”.</div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {results.students.length > 0 && (
                <Group label="Students" />
              )}
              {results.students.map((s, i) => (
                <Row
                  key={`s-${s.id}`}
                  active={results.flat[active]?.kind === 'student' && results.flat[active]?.id === s.id}
                  icon={<Users size={14} strokeWidth={1.5} className="text-ink-subtle" />}
                  primary={s.name}
                  secondary={`${s.email ? s.email + ' · ' : ''}${s.targetCountry}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go({ to: `/students/${s.id}` })}
                />
              ))}
              {results.cases.length > 0 && <Group label="Cases" />}
              {results.cases.map((c, i) => {
                const flatIdx = results.students.length + i;
                return (
                  <Row
                    key={`c-${c.id}`}
                    active={active === flatIdx}
                    icon={<Briefcase size={14} strokeWidth={1.5} className="text-ink-subtle" />}
                    primary={`${studentsById[c.studentId]?.name ?? 'Case'} · ${c.country}`}
                    secondary={`${c.intake} · ${stageLabel(c.stage)}`}
                    onMouseEnter={() => setActive(flatIdx)}
                    onClick={() => go({ to: `/cases/${c.id}` })}
                  />
                );
              })}
            </ul>
          )}
          <div className="flex items-center justify-between gap-sm border-t border-hairline px-md py-xs text-caption text-ink-subtle">
            <span><CornerDownLeft size={11} strokeWidth={1.5} className="inline -mt-[2px]" /> to open</span>
            <span>esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ label }) {
  return (
    <li className="border-b border-hairline bg-surface-1 px-md py-xxs text-eyebrow text-ink-muted">
      {label}
    </li>
  );
}

function Row({ icon, primary, secondary, active, onClick, onMouseEnter }) {
  return (
    <li
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center gap-sm border-b border-hairline px-md py-sm last:border-b-0',
        active ? 'bg-surface-1' : 'bg-canvas hover:bg-surface-1',
      )}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <div className="truncate text-body-sm text-ink">{primary}</div>
        <div className="truncate text-caption text-ink-subtle">{secondary}</div>
      </div>
    </li>
  );
}
