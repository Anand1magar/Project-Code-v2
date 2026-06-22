import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/cn.js';

export default function PipelineSummary({ byStage, refusedCount = 0 }) {
  const max   = Math.max(...byStage.map((s) => s.count), 1);
  const total = byStage.reduce((sum, s) => sum + s.count, 0);

  return (
    <section aria-label="Pipeline by stage">
      <div className="flex items-baseline justify-between border-b border-hairline pb-sm">
        <span className="text-eyebrow text-ink-muted">By stage</span>
        <span className="text-caption text-ink-subtle">{total} active</span>
      </div>

      <div className="mt-md space-y-[2px]">
        {byStage.map((s) => {
          const pct   = s.count > 0 ? Math.round((s.count / max) * 100) : 0;
          const empty = s.count === 0;

          return (
            <Link
              key={s.stage}
              to={`/pipeline?stage=${s.stage}`}
              className="group flex items-center gap-md rounded-none px-xs py-[6px] hover:bg-surface-1 transition-colors duration-fast"
            >
              <div className="flex-1 min-w-0">
                <div className="mb-[4px] flex items-baseline justify-between gap-sm">
                  <span className={cn(
                    'text-body-sm',
                    empty ? 'text-ink-subtle' : 'text-ink',
                  )}>
                    {s.label}
                  </span>
                  <span className={cn(
                    'text-body-sm tabular-nums shrink-0',
                    empty ? 'text-ink-subtle' : 'text-ink-muted',
                  )}>
                    {s.count}
                  </span>
                </div>
                <div className="h-[4px] w-full bg-surface-2">
                  <div
                    className="h-full bg-primary transition-all duration-moderate ease-productive"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <ArrowRight
                size={13}
                strokeWidth={1.5}
                className="shrink-0 text-ink-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
              />
            </Link>
          );
        })}

        {/* Refused cases shortcut */}
        <Link
          to="/pipeline?filter=refused"
          className="group mt-sm flex items-center gap-md border-l-2 border-l-error px-xs py-[6px] hover:bg-surface-1 transition-colors duration-fast"
        >
          <div className="flex-1 flex items-center justify-between gap-sm">
            <span className="text-body-sm text-error">Refused cases</span>
            <span className="text-body-sm tabular-nums text-error">{refusedCount}</span>
          </div>
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="shrink-0 text-error opacity-0 group-hover:opacity-100 transition-opacity duration-fast"
          />
        </Link>
      </div>
    </section>
  );
}
