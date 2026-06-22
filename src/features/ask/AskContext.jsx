import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AskContext = createContext(null);

export function AskProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // ⌘K / Ctrl+K opens the Ask panel
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  return (
    <AskContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </AskContext.Provider>
  );
}

export function useAskContext() {
  const ctx = useContext(AskContext);
  if (!ctx) throw new Error('useAskContext must be used inside AskProvider');
  return ctx;
}
