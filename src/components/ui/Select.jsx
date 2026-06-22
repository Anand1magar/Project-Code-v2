import { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';

const Select = forwardRef(function Select(
  { label, hint, error, className, id, children, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  return (
    <label htmlFor={selectId} className="flex flex-col gap-xxs">
      {label && <span className="text-body-sm text-ink-muted">{label}</span>}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'h-10 w-full bg-surface-1 px-md text-body text-ink rounded-none border-0 border-b border-hairline-strong',
          error && 'border-b-error',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {hint && !error && <span className="text-caption text-ink-subtle">{hint}</span>}
      {error && <span className="text-caption text-error">{error}</span>}
    </label>
  );
});

export default Select;
