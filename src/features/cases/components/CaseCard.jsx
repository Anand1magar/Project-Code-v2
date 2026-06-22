import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Calendar, XCircle } from 'lucide-react';
import { formatDate, fromNow, isOverdue } from '../../../lib/date.js';
import { cn } from '../../../lib/cn.js';

export default function CaseCard({ case: c, student }) {
  const nav = useNavigate();
  const overdue  = isOverdue(c.deadline) && c.stage !== 'enrolled' && c.stage !== 'dropped';
  const refused  = c.visaOutcome === 'refused';

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', c.id);
    e.dataTransfer.effectAllowed = 'move';
  }

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onClick={() => nav(`/cases/${c.id}`)}
      className={cn(
        'border border-hairline bg-canvas p-md rounded-none cursor-pointer transition-colors duration-fast ease-productive hover:bg-surface-1',
        refused  && 'border-l-2 border-l-error',
        !refused && overdue && 'border-l-2 border-l-error',
      )}
    >
      <div className="flex items-start justify-between gap-sm">
        <div className="min-w-0">
          <div className="truncate text-body-emphasis text-ink">{student?.name ?? 'Unknown student'}</div>
          <div className="mt-xxs text-caption text-ink-subtle">{c.country} · {c.intake}</div>
        </div>
      </div>

      {c.nextAction && !refused && (
        <div className="mt-sm text-body-sm text-ink line-clamp-2">{c.nextAction}</div>
      )}

      <div className="mt-sm flex items-center justify-between gap-sm">
        <div className={cn('flex items-center gap-xxs text-caption', overdue ? 'text-error' : 'text-ink-muted')}>
          <Calendar size={12} strokeWidth={1.5} />
          {c.deadline ? formatDate(c.deadline) : 'No deadline'}
        </div>
        <div className="text-caption text-ink-subtle">{fromNow(c.lastContact)}</div>
      </div>

      {/* Blocker — only when not refused (refusal section replaces it) */}
      {c.blocker && !refused && (
        <div className="mt-sm flex items-start gap-xxs border-t border-hairline pt-sm text-caption text-warning">
          <AlertTriangle size={12} strokeWidth={1.5} className="mt-[2px] shrink-0" />
          <span className="text-ink-muted">{c.blocker}</span>
        </div>
      )}

      {/* Refusal reason — visible on any refused card so patterns are scannable */}
      {refused && (
        <div className="mt-sm border-t border-hairline pt-sm space-y-xxs">
          <div className="flex items-center gap-xxs text-caption text-error">
            <XCircle size={12} strokeWidth={1.5} className="shrink-0" />
            <span className="font-[600]">{c.refusalCategory ?? 'Refused'}</span>
          </div>
          {c.refusalDetail && (
            <div className="text-caption text-ink-muted line-clamp-3">{c.refusalDetail}</div>
          )}
        </div>
      )}
    </article>
  );
}
