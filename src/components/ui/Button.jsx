import { cn } from '../../lib/cn.js';

const variants = {
  primary:   'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-pressed',
  secondary: 'bg-ink text-inverse-ink hover:bg-inverse-surface-1',
  tertiary:  'bg-canvas text-primary border border-primary hover:bg-primary hover:text-on-primary',
  ghost:     'bg-transparent text-primary hover:bg-surface-1',
  danger:    'bg-error text-on-primary hover:opacity-90',
};

const sizes = {
  md: 'px-md py-sm text-button',
  sm: 'px-sm py-xxs text-button',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  disabled,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-xs rounded-none transition-colors duration-fast ease-productive disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
