import { useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Select from '../components/ui/Select.jsx';
import { useTasks } from '../features/tasks/hooks/useTasks.js';
import { useCases } from '../features/cases/hooks/useCases.js';
import { useStudents } from '../features/students/hooks/useStudents.js';
import { useUsers } from '../features/users/hooks/useUsers.js';
import TaskList from '../features/tasks/components/TaskList.jsx';
import { isOverdue, isToday } from '../lib/date.js';

export default function TasksPage() {
  // Foundation pass: admin view — every task, filterable by assignee.
  const { users } = useUsers();
  const [assigneeId, setAssigneeId] = useState('');

  const params = assigneeId ? { assigneeId } : {};
  const { tasks, loading, toggle } = useTasks(params);
  const { cases } = useCases();
  const { students } = useStudents();
  const casesById = useMemo(() => Object.fromEntries(cases.map((c) => [c.id, c])), [cases]);
  const studentsById = useMemo(() => Object.fromEntries(students.map((s) => [s.id, s])), [students]);

  const overdue = tasks.filter((t) => !t.done && isOverdue(t.dueDate));
  const today   = tasks.filter((t) => !t.done && isToday(t.dueDate));
  const upcoming = tasks.filter((t) => !t.done && !isOverdue(t.dueDate) && !isToday(t.dueDate));
  const done = tasks.filter((t) => t.done);

  return (
    <div>
      <PageHeader
        eyebrow="Tasks"
        title="All tasks"
        description="Every open and completed task across the team."
        actions={
          <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="h-10">
            <option value="">All assignees</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
        }
      />

      <div className="space-y-xl p-xl">
        {loading ? <Spinner /> : (
          <>
            <Section title={`Overdue (${overdue.length})`}>
              <TaskList tasks={overdue} casesById={casesById} studentsById={studentsById} onToggle={toggle} />
            </Section>
            <Section title={`Today (${today.length})`}>
              <TaskList tasks={today} casesById={casesById} studentsById={studentsById} onToggle={toggle} />
            </Section>
            <Section title={`Upcoming (${upcoming.length})`}>
              <TaskList tasks={upcoming} casesById={casesById} studentsById={studentsById} onToggle={toggle} />
            </Section>
            <Section title={`Done (${done.length})`}>
              <TaskList tasks={done} casesById={casesById} studentsById={studentsById} onToggle={toggle} />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-sm text-card-title font-light text-ink">{title}</h2>
      {children}
    </section>
  );
}
