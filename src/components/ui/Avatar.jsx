import { cn } from '../../lib/cn.js';

export default function Avatar({ name, size = 28, className }) {
  const initials = (name ?? '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center bg-ink text-inverse-ink text-caption font-[600] rounded-none',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}
