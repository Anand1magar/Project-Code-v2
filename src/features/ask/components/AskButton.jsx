import { MessageSquare } from 'lucide-react';
import { useAskContext } from '../AskContext.jsx';

export default function AskButton() {
  const { isOpen, open } = useAskContext();

  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={open}
      title="Ask Visa Vista (⌘K)"
      aria-label="Open Ask Visa Vista"
      className="fixed bottom-lg right-lg z-50 flex items-center gap-xs border border-hairline bg-primary px-md py-sm text-body-sm text-on-primary shadow-none hover:bg-primary-hover transition-colors duration-fast ease-productive rounded-none"
    >
      <MessageSquare size={16} strokeWidth={1.5} />
      <span>Ask Visa Vista</span>
      <kbd className="ml-xs hidden text-caption opacity-70 sm:inline">⌘K</kbd>
    </button>
  );
}
