import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import { AskProvider } from '../features/ask/AskContext.jsx';
import AskPanel from '../features/ask/components/AskPanel.jsx';
import AskButton from '../features/ask/components/AskButton.jsx';

export default function AppLayout() {
  return (
    <AskProvider>
      <div className="flex h-full bg-canvas">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-surface-1">
            <Outlet />
          </main>
        </div>
        <AskPanel />
        <AskButton />
      </div>
    </AskProvider>
  );
}
