import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/cn.js';

/**
 * @param {{ message: string, visible: boolean, onDone: () => void }} props
 */
export default function Toast({ message, visible, onDone }) {
  const timer = useRef(null);

  useEffect(() => {
    if (!visible) return;
    timer.current = setTimeout(() => onDone?.(), 3000);
    return () => clearTimeout(timer.current);
  }, [visible, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-lg right-lg z-50 flex items-center gap-sm bg-inverse-canvas px-md py-sm text-inverse-ink text-body-sm transition-all duration-moderate ease-productive',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-3 opacity-0 pointer-events-none',
      )}
    >
      <CheckCircle2 size={16} strokeWidth={1.5} className="shrink-0 text-success" />
      {message}
    </div>
  );
}
