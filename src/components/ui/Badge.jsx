import { cn } from '../../lib/cn.js';

const tones = {
  default: 'bg-surface-2 text-ink',
  info:    'bg-primary text-on-primary',
  success: 'bg-success text-on-primary',
  warning: 'bg-warning text-ink',
  error:   'bg-error text-on-primary',
  muted:   'bg-surface-1 text-ink-muted border border-hairline',
};

export default function Badge({ tone = 'default', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-xs py-[2px] text-caption uppercase tracking-[0.32px] rounded-none',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
