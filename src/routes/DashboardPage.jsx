import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useAskContext } from '../features/ask/AskContext.jsx';
import { useDashboard } from '../features/dashboard/hooks/useDashboard.js';
import { useStudents } from '../features/students/hooks/useStudents.js';
import { useUsers } from '../features/users/hooks/useUsers.js';
import DashboardStats from '../features/dashboard/components/DashboardStats.jsx';
import PipelineSummary from '../features/dashboard/components/PipelineSummary.jsx';
import ActivityTimeline from '../features/activity/components/ActivityTimeline.jsx';
import { formatDate, isOverdue, isToday } from '../lib/date.js';

export default function DashboardPage() {
  const { currentUser, isAdmin } = useAuth();
  const role = currentUser?.role ?? 'counsellor';
  const { data, loading } = useDashboard({ role, userId: currentUser?.id });
  const { students } = useStudents();
  const { users } = useUsers();

  const studentsById = useMemo(() => Object.fromEntries(students.map((s) => [s.id, s])), [students]);
  const usersById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);

  if (loading || !data) {
    return <div className="p-xl"><Spinner /></div>;
  }

  if (isAdmin) {
    return <AdminDashboard currentUser={currentUser} data={data} studentsById={studentsById} usersById={usersById} />;
  }
  return <CounsellorDashboard currentUser={currentUser} data={data} studentsById={studentsById} />;
}

function AdminDashboard({ currentUser, data, studentsById, usersById }) {
  const { open } = useAskContext();
  return (
    <div>
      <PageHeader
        eyebrow="Admin overview"
        title={`Hello, ${currentUser?.name?.split(' ')[0] ?? 'there'}.`}
        description="Snapshot across the whole consultancy — every case, every counsellor."
      />

      {/* Ask Visa Vista quick-access bar */}
      <div className="px-xl pt-sm pb-xs">
        <button
          type="button"
          onClick={open}
          className="flex w-full items-center gap-sm border border-hairline bg-canvas px-md py-sm text-body-sm text-ink-muted hover:border-primary hover:text-ink transition-colors duration-fast ease-productive rounded-none"
        >
          <MessageSquare size={14} strokeWidth={1.5} className="shrink-0 text-primary" />
          <span>Ask anything about your cases…</span>
          <kbd className="ml-auto text-caption text-ink-subtle">⌘K</kbd>
        </button>
      </div>

      <div className="grid gap-xl p-xl lg:grid-cols-3">
        <div className="space-y-xl lg:col-span-2">
          <DashboardStats totals={data.totals} />
          <PipelineSummary byStage={data.byStage} refusedCount={data.refusedCount ?? 0} />

          <section>
            <h2 className="mb-sm text-card-title font-light text-ink">At risk</h2>
            {data.atRisk.length === 0 ? (
              <div className="border border-dashed border-hairline bg-canvas p-lg text-center text-body-sm text-ink-muted">
                Nothing overdue. Good rhythm.
              </div>
            ) : (
              <ul className="divide-y divide-hairline border border-hairline bg-canvas">
                {data.atRisk.slice().sort((a, b) => a.deadline < b.deadline ? -1 : 1).map((c) => {
                  const daysOverdue = Math.floor((new Date() - new Date(c.deadline)) / 86400000);
                  return (
                    <li key={c.id} className="flex items-center justify-between gap-md px-md py-sm border-l-2 border-l-error">
                      <div>
                        <Link to={`/cases/${c.id}`} className="text-body-emphasis text-ink hover:text-primary">
                          {studentsById[c.studentId]?.name ?? 'Unknown'} · {c.country}
                        </Link>
                        <div className="text-caption text-ink-muted">{c.nextAction || 'No next action set'}</div>
                      </div>
                      <div className="flex items-center gap-sm shrink-0">
                        <Badge tone="error">⚠ Overdue {daysOverdue}d</Badge>
                        <span className="text-caption text-ink-muted">{formatDate(c.deadline)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside>
          <h2 className="mb-sm text-card-title font-light text-ink">Recent activity</h2>
          <ActivityTimeline entries={data.recent} usersById={usersById} />
        </aside>
      </div>
    </div>
  );
}

function CounsellorDashboard({ currentUser, data, studentsById }) {
  const overdueTasks = (data.tasks ?? []).filter((t) => isOverdue(t.dueDate));
  const todayTasks = (data.tasks ?? []).filter((t) => isToday(t.dueDate));
  const myCases = data.myCases ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="My dashboard"
        title={`Hello, ${currentUser?.name?.split(' ')[0] ?? 'there'}.`}
        description="Your cases and tasks for today."
      />

      <div className="grid gap-xl p-xl lg:grid-cols-3">
        <div className="space-y-xl lg:col-span-2">
          {/* Today's tasks */}
          <section>
            <h2 className="mb-sm text-card-title font-light text-ink">
              Today&apos;s tasks
              {overdueTasks.length > 0 && (
                <Badge tone="error" className="ml-sm">{overdueTasks.length} overdue</Badge>
              )}
            </h2>
            {overdueTasks.length === 0 && todayTasks.length === 0 ? (
              <div className="border border-dashed border-hairline bg-canvas p-lg text-center text-body-sm text-ink-muted">
                All clear for today. Check Upcoming tab for what&apos;s next.
              </div>
            ) : (
              <ul className="divide-y divide-hairline border border-hairline bg-canvas">
                {[...overdueTasks, ...todayTasks].map((t) => (
                  <li key={t.id} className="flex items-center gap-md px-md py-sm">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${isOverdue(t.dueDate) ? 'bg-error' : 'bg-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-body-sm text-ink truncate">{t.title}</div>
                      <Link to={`/cases/${t.caseId}`} className="text-caption text-primary hover:underline">
                        Open case →
                      </Link>
                    </div>
                    <span className="text-caption text-ink-muted shrink-0">{formatDate(t.dueDate)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* My cases */}
          <section>
            <h2 className="mb-sm text-card-title font-light text-ink">My cases ({myCases.length})</h2>
            {myCases.length === 0 ? (
              <div className="border border-dashed border-hairline bg-canvas p-lg text-center text-body-sm text-ink-muted">
                No cases assigned to you yet.
              </div>
            ) : (
              <ul className="divide-y divide-hairline border border-hairline bg-canvas">
                {myCases.map((c) => {
                  const overdue = isOverdue(c.deadline) && c.stage !== 'enrolled';
                  return (
                    <li
                      key={c.id}
                      className={`flex items-center justify-between gap-md px-md py-sm ${overdue ? 'border-l-2 border-l-error' : ''}`}
                    >
                      <div className="min-w-0">
                        <Link to={`/cases/${c.id}`} className="text-body-emphasis text-ink hover:text-primary">
                          {studentsById[c.studentId]?.name ?? 'Unknown'} · {c.country}
                        </Link>
                        <div className="mt-xxs text-caption text-ink-muted">
                          {c.nextAction || 'No next action set'}
                        </div>
                      </div>
                      <div className="flex items-center gap-sm shrink-0">
                        <Badge tone={c.stage === 'enrolled' ? 'success' : 'info'}>
                          {c.stage.replace(/-/g, ' ')}
                        </Badge>
                        {c.deadline && (
                          <span className={`text-caption ${overdue ? 'text-error' : 'text-ink-muted'}`}>
                            {formatDate(c.deadline)}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside>
          <h2 className="mb-sm text-card-title font-light text-ink">Recent activity</h2>
          <ActivityTimeline entries={data.recent} usersById={{}} />
        </aside>
      </div>
    </div>
  );
}
