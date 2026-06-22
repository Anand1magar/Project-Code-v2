import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import Spinner from './components/ui/Spinner.jsx';

const LoginPage         = lazy(() => import('./routes/LoginPage.jsx'));
const DashboardPage     = lazy(() => import('./routes/DashboardPage.jsx'));
const StudentsPage      = lazy(() => import('./routes/StudentsPage.jsx'));
const StudentDetailPage = lazy(() => import('./routes/StudentDetailPage.jsx'));
const PipelinePage      = lazy(() => import('./routes/PipelinePage.jsx'));
const CaseDetailPage    = lazy(() => import('./routes/CaseDetailPage.jsx'));
const TasksPage         = lazy(() => import('./routes/TasksPage.jsx'));
const SettingsPage      = lazy(() => import('./routes/SettingsPage.jsx'));
const StudentPortalPage  = lazy(() => import('./routes/StudentPortalPage.jsx'));
const DesignSystemPage   = lazy(() => import('./routes/DesignSystemPage.jsx'));

function RequireAuth({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function FullScreenSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<FullScreenSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="students/:id" element={<StudentDetailPage />} />
            <Route path="pipeline" element={<PipelinePage />} />
            <Route path="cases/:id" element={<CaseDetailPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="portal"         element={<StudentPortalPage />} />
            <Route path="design-system" element={<DesignSystemPage />} />
            <Route
              path="settings"
              element={
                <RequireAdmin>
                  <SettingsPage />
                </RequireAdmin>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
