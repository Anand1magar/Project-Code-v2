import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';
import SearchBar from './SearchBar.jsx';

export default function Topbar() {
  const { currentUser, logout } = useAuth();
  const nav = useNavigate();
  async function handleLogout() {
    await logout();
    nav('/login', { replace: true });
  }
  return (
    <header className="flex h-12 items-center gap-md border-b border-hairline bg-canvas px-md">
      <div className="hidden md:flex shrink-0 items-center gap-xs">
        <span className="text-body-emphasis text-ink">VisaVista</span>
        <span className="text-caption text-ink-subtle">CRM</span>
      </div>
      <div className="flex-1 min-w-0">
        <SearchBar />
      </div>
      <div className="flex shrink-0 items-center gap-sm">
        <ThemeToggle />
        <div className="hidden sm:block text-right">
          <div className="text-body-sm text-ink leading-none">{currentUser?.name}</div>
          <div className="text-caption text-ink-subtle capitalize">{currentUser?.role}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-xxs text-body-sm text-ink-muted hover:text-ink"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
