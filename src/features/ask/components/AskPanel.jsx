import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, MessageSquare } from 'lucide-react';
import { useAskContext } from '../AskContext.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';
import { sendAskQuery } from '../askService.js';
import { cn } from '../../../lib/cn.js';

const ADMIN_STARTERS = [
  'How many active cases do we have right now?',
  'Which stage has the most cases?',
  'How many visa refusals do we have in total?',
  'Which cases have missing documents?',
];

const COUNSELLOR_STARTERS = [
  'Which of my cases are overdue?',
  'What tasks do I have due today?',
  'Which of my students still have missing documents?',
  'How many cases am I managing right now?',
];

let _msgId = 0;
const nextId = () => `msg_${++_msgId}`;

export default function AskPanel() {
  const { isOpen, close } = useAskContext();
  const { currentUser, isAdmin } = useAuth();
  const nav = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const starters = isAdmin ? ADMIN_STARTERS : COUNSELLOR_STARTERS;
  const firstName = currentUser?.name?.split(' ')[0] ?? 'there';

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const send = useCallback(
    async (text) => {
      const query = text.trim();
      if (!query || loading) return;

      const userMsg = { id: nextId(), role: 'user', text: query };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      try {
        const res = await sendAskQuery({
          query,
          userId: currentUser?.id ?? '',
          role: currentUser?.role ?? 'counsellor',
        });
        const assistantMsg = {
          id: nextId(),
          role: 'assistant',
          text: res.answer,
          followUps: res.followUps ?? [],
          actions: res.actions ?? [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            text: "I couldn't fetch an answer right now. Please try again.",
            followUps: [],
            actions: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, currentUser],
  );

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  function handleAction(path) {
    nav(path);
    close();
  }

  return (
    <>
      {/* Backdrop — closes on click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={close}
          aria-hidden
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[380px] flex-col border-l border-hairline bg-canvas',
          'transition-transform duration-moderate ease-productive',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-label="Ask Visa Vista"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-hairline px-md py-sm">
          <div className="flex items-center gap-sm">
            <MessageSquare size={16} strokeWidth={1.5} className="text-primary" />
            <div>
              <div className="text-body-emphasis text-ink">Ask Visa Vista</div>
              <div className="text-caption text-ink-muted">Ask anything about your cases</div>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="mt-xxs text-ink-muted hover:text-ink"
            aria-label="Close"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Chat area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-md py-md">
          {messages.length === 0 ? (
            <EmptyState
              firstName={firstName}
              starters={starters}
              onSelect={send}
            />
          ) : (
            <div className="space-y-md">
              {messages.map((msg) =>
                msg.role === 'user' ? (
                  <UserBubble key={msg.id} text={msg.text} />
                ) : (
                  <AssistantBubble
                    key={msg.id}
                    msg={msg}
                    onFollowUp={send}
                    onAction={handleAction}
                  />
                ),
              )}
              {loading && <LoadingDots />}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex shrink-0 items-center gap-sm border-t border-hairline px-md py-sm"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={loading}
            className="flex-1 bg-surface-1 px-sm py-xs text-body-sm text-ink rounded-none border border-transparent focus:border-hairline placeholder:text-ink-subtle outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-on-primary rounded-none hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-fast ease-productive"
            aria-label="Send"
          >
            <Send size={14} strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </>
  );
}

function EmptyState({ firstName, starters, onSelect }) {
  return (
    <div className="flex flex-col gap-lg">
      <p className="text-body-sm text-ink">
        Hi {firstName}, what would you like to know?
      </p>
      <div className="flex flex-col gap-xs">
        <div className="text-caption text-ink-muted">Suggested questions</div>
        {starters.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className="w-full text-left border border-hairline bg-canvas px-sm py-xs text-body-sm text-ink hover:bg-surface-1 transition-colors duration-fast ease-productive rounded-none"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-primary px-sm py-xs text-body-sm text-on-primary rounded-none">
        {text}
      </div>
    </div>
  );
}

function AssistantBubble({ msg, onFollowUp, onAction }) {
  return (
    <div className="flex flex-col gap-xs">
      <div className="max-w-[90%] border border-hairline bg-canvas px-sm py-xs text-body-sm text-ink rounded-none whitespace-pre-wrap">
        {msg.text}
      </div>

      {msg.actions?.length > 0 && (
        <div className="flex flex-wrap gap-xs">
          {msg.actions.map((action) => (
            <button
              key={action.path}
              type="button"
              onClick={() => onAction(action.path)}
              className="border border-primary px-sm py-xxs text-caption text-primary hover:bg-primary hover:text-on-primary transition-colors duration-fast ease-productive rounded-none"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {msg.followUps?.length > 0 && (
        <div className="flex flex-wrap gap-xs">
          {msg.followUps.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onFollowUp(q)}
              className="border border-hairline bg-surface-1 px-xs py-xxs text-caption text-ink-muted hover:bg-surface-2 hover:text-ink transition-colors duration-fast ease-productive rounded-none"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-xs px-sm py-xs">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-ink-muted animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
