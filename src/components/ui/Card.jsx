import { cn } from '../../lib/cn.js';

export default function Card({ as: Tag = 'div', className, children, padded = true, ...rest }) {
  return (
    <Tag
      className={cn(
        'border border-hairline bg-canvas rounded-none',
        padded && 'p-lg',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
