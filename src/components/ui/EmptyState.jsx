import { Inbox } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export default function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-sm border border-dashed border-hairline bg-canvas p-xxl text-center', className)}>
      <Icon size={28} strokeWidth={1.25} className="text-ink-subtle" />
      <div>
        <div className="text-subhead font-light text-ink">{title}</div>
        {description && <div className="text-body-sm text-ink-muted mt-xxs">{description}</div>}
      </div>
      {action && <div className="mt-xs">{action}</div>}
    </div>
  );
}
