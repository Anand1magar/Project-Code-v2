import { forwardRef } from 'react';
import { cn } from '../../lib/cn.js';

const Input = forwardRef(function Input(
  { label, hint, error, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-xxs">
      {label && <span className="text-body-sm text-ink-muted">{label}</span>}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-10 w-full bg-surface-1 px-md text-body text-ink rounded-none border-0 border-b border-hairline-strong placeholder:text-ink-subtle',
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

export default Input;
