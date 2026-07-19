import { ArrowRight } from 'lucide-react';
import FlowScreenTile from './FlowScreenTile.jsx';

export default function FlowSection({ index, flow }) {
  return (
    <section className="border-b border-hairline pb-xl">
      <div className="mb-md">
        <div className="text-eyebrow text-ink-muted">{index}. {flow.title}</div>
        <p className="mt-xxs text-body-sm text-ink-muted">{flow.description}</p>
      </div>
      <div className="flex items-center gap-md overflow-x-auto pb-sm">
        {flow.screens.map((screen) => (
          <div key={screen.path} className="flex items-center gap-md shrink-0">
            <FlowScreenTile label={screen.label} path={screen.path} />
            {screen.caption && (
              <div className="flex w-24 shrink-0 flex-col items-center gap-xxs text-center">
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
