import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('w-full bg-canvas border border-hairline rounded-none', widths[size])}
      >
        <div className="flex items-center justify-between border-b border-hairline px-lg py-md">
          <h2 className="text-card-title text-ink font-light">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-muted hover:text-ink"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="px-lg py-md">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-sm border-t border-hairline px-lg py-md">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
