import { NavLink } from 'react-router-dom';
import { LayoutGrid, Users, KanbanSquare, CheckSquare, GraduationCap, Layers, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useAskContext } from '../features/ask/AskContext.jsx';
import { cn } from '../lib/cn.js';

const items = [
  { to: '/',          label: 'Dashboard',      icon: LayoutGrid,    end: true },
  { to: '/students',  label: 'Students',       icon: Users },
  { to: '/pipeline',  label: 'Pipeline',       icon: KanbanSquare },
  { to: '/tasks',     label: 'Tasks',          icon: CheckSquare },
  { to: '/portal',    label: 'Student Portal', icon: GraduationCap },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const { open } = useAskContext();
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-hairline bg-canvas">
      <div className="px-md pt-lg pb-md">
        <div className="text-eyebrow text-ink-muted">VisaVista</div>
        <div className="text-card-title font-light tracking-tight text-ink">CRM</div>
      </div>
      <nav className="flex flex-1 flex-col">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-sm px-md py-sm text-body-sm border-l-2 transition-colors duration-fast ease-productive',
                isActive
                  ? 'border-primary bg-surface-1 text-ink font-[600]'
                  : 'border-transparent text-ink-muted hover:bg-surface-1 hover:text-ink',
              )
            }
          >
            <Icon size={18} strokeWidth={1.5} />
            <span>{label}</span>
          </NavLink>
        ))}
        {/* Ask Visa Vista */}
        <button
          type="button"
          onClick={open}
          className="flex items-center gap-sm px-md py-sm text-body-sm border-l-2 border-transparent text-ink-muted hover:bg-surface-1 hover:text-ink transition-colors duration-fast ease-productive w-full"
        >
          <MessageSquare size={18} strokeWidth={1.5} />
          <span>Ask Visa Vista</span>
        </button>

        {/* Design System + Settings pinned to bottom */}
        <div className="mt-auto border-t border-hairline">
          <NavLink
            to="/design-system"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-sm px-md py-sm text-body-sm border-l-2 transition-colors duration-fast ease-productive',
                isActive
                  ? 'border-l-primary bg-surface-1 text-ink font-[600]'
                  : 'border-l-transparent text-ink-muted hover:bg-surface-1 hover:text-ink',
              )
            }
          >
            <Layers size={18} strokeWidth={1.5} />
            <span>Design System</span>
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-sm px-md py-sm text-body-sm border-l-2 border-t border-hairline transition-colors duration-fast ease-productive',
                  isActive
                    ? 'border-l-primary bg-surface-1 text-ink font-[600]'
                    : 'border-l-transparent text-ink-muted hover:bg-surface-1 hover:text-ink',
                )
              }
            >
              <Settings size={18} strokeWidth={1.5} />
              <span>Settings</span>
            </NavLink>
          )}
        </div>
      </nav>
    </aside>
  );
}
