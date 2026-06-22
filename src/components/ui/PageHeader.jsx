import { cn } from '../../lib/cn.js';

export default function PageHeader({ eyebrow, title, description, actions, className }) {
  return (
    <div className={cn('flex flex-col gap-md border-b border-hairline bg-canvas px-xl py-xl md:flex-row md:items-end md:justify-between', className)}>
      <div className="flex flex-col gap-xxs">
        {eyebrow && <span className="text-eyebrow text-ink-muted">{eyebrow}</span>}
        <h1 className="text-display-md font-light text-ink">{title}</h1>
        {description && <p className="text-body-lg text-ink-muted max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex gap-sm">{actions}</div>}
    </div>
  );
}
