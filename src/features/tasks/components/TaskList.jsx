import { Link } from 'react-router-dom';
import { formatDate, isOverdue, isToday } from '../../../lib/date.js';
import Badge from '../../../components/ui/Badge.jsx';
import { cn } from '../../../lib/cn.js';

export default function TaskList({ tasks, casesById, studentsById, onToggle, showCase = true }) {
  if (tasks.length === 0) {
    return (
      <div className="border border-dashed border-hairline bg-canvas p-lg text-center text-body-sm text-ink-muted">
        No tasks.
      </div>
    );
  }
  return (
    <ul className="divide-y divide-hairline border border-hairline bg-canvas">
      {tasks.map((t) => {
        const c = casesById?.[t.caseId];
        const s = c ? studentsById?.[c.studentId] : null;
        const overdue = !t.done && isOverdue(t.dueDate);
        const today = !t.done && isToday(t.dueDate);
        return (
          <li key={t.id} className="flex items-center justify-between gap-md px-md py-sm">
            <div className="flex items-start gap-sm">
              <input
                id={`task-${t.id}`}
                type="checkbox"
                checked={t.done}
                onChange={(e) => onToggle?.(t.id, e.target.checked)}
                className="mt-[3px] h-4 w-4 accent-primary"
              />
              <div>
                <label htmlFor={`task-${t.id}`} className={cn('text-body-sm', t.done ? 'text-ink-subtle line-through' : 'text-ink')}>
                  {t.title}
                </label>
                {showCase && c && (
                  <div className="text-caption text-ink-subtle">
                    <Link to={`/cases/${c.id}`} className="hover:text-primary">
                      {s?.name ?? 'Case'} · {c.country} {c.intake}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-sm">
              {overdue && <Badge tone="error">Overdue</Badge>}
              {today && <Badge tone="warning">Today</Badge>}
              <span className="text-caption text-ink-muted">{t.dueDate ? formatDate(t.dueDate) : '—'}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
