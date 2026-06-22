import { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';

const Textarea = forwardRef(function Textarea(
  { label, hint, error, className, id, rows = 3, ...rest },
  ref,
) {
  const tid = id ?? rest.name;
  return (
    <label htmlFor={tid} className="flex flex-col gap-xxs">
      {label && <span className="text-body-sm text-ink-muted">{label}</span>}
      <textarea
        ref={ref}
        id={tid}
        rows={rows}
        className={cn(
          'w-full bg-surface-1 p-md text-body text-ink rounded-none border-0 border-b border-hairline-strong placeholder:text-ink-subtle resize-y',
          error && 'border-b-error',
          className,
        )}
        {...rest}
      />
      {hint && !error && <span className="text-caption text-ink-subtle">{hint}</span>}
      {error && <span className="text-caption text-error">{error}</span>}
    </label>
  );
});

export default Textarea;
