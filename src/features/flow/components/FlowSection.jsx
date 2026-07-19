import { ArrowRight } from 'lucide-react';
import FlowScreenTile from './FlowScreenTile.jsx';

export default function FlowSection({ index, flow }) {
  return (
    <section className="border-b border-hairline pb-xl">
      <div className="mb-md">
        <div className="text-eyebrow text-ink-muted">{index}. {flow.title}</div>
        <p className="mt-xxs text-body-sm text-ink-muted">{flow.description}</p>
      </div>

      {/* Strong region — what problem this flow solves */}
      <div className="mb-lg border-l-2 border-primary bg-surface-1 px-md py-sm">
        <p className="text-body-sm font-[600] text-ink">{flow.problem}</p>
        <ul className="mt-xs space-y-xxs">
          {flow.solves.map((point) => (
            <li key={point} className="text-body-sm text-ink-muted">
              · {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-md overflow-x-auto pb-sm">
        {flow.screens.map((screen) => (
          <div key={screen.path} className="flex items-start gap-md shrink-0">
            <div className="flex flex-col gap-xs">
              <FlowScreenTile label={screen.label} image={screen.image} />
              {screen.branch && (
                <div className="w-[320px] border border-dashed border-hairline-strong bg-canvas px-xs py-xs text-caption text-ink-subtle">
                  {screen.branch}
                </div>
              )}
            </div>
            {screen.caption && (
              <div className="flex w-24 shrink-0 flex-col items-center gap-xxs pt-xxl text-center">
                <ArrowRight size={16} strokeWidth={1.5} className="text-ink-subtle" />
                <span className="text-caption text-ink-subtle">{screen.caption}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
