import { cn } from '../../lib/cn.js';

export function Table({ className, children }) {
  return (
    <div className={cn('w-full border border-hairline bg-canvas overflow-x-auto', className)}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="border-b border-hairline bg-surface-1 text-body-sm text-ink-muted">
      <tr>{children}</tr>
    </thead>
  );
}

export function TH({ children, className, ...rest }) {
  return (
    <th
      scope="col"
      className={cn('px-md py-sm text-left font-[600] tracking-carbon', className)}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TR({ children, className, onClick, ...rest }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-hairline last:border-b-0 text-body-sm text-ink',
        onClick && 'cursor-pointer hover:bg-surface-1',
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TD({ children, className, ...rest }) {
  return (
    <td className={cn('px-md py-sm align-middle', className)} {...rest}>
      {children}
    </td>
  );
}
