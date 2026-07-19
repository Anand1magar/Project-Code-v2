import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Badge from '../components/ui/Badge.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import { cn } from '../lib/cn.js';
import { formatDate, isOverdue } from '../lib/date.js';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useCase } from '../features/cases/hooks/useCase.js';
import { usePipeline } from '../features/cases/hooks/usePipeline.js';
import { useStudent } from '../features/students/hooks/useStudent.js';
import { useUsers } from '../features/users/hooks/useUsers.js';
import { useDocuments } from '../features/documents/hooks/useDocuments.js';
import { useTasks } from '../features/tasks/hooks/useTasks.js';
import { useActivity } from '../features/activity/hooks/useActivity.js';
import { useOffers } from '../features/offers/hooks/useOffers.js';
import { useFees } from '../features/fees/hooks/useFees.js';
import { useLodgement } from '../features/lodgements/hooks/useLodgement.js';
import { lodgementsService } from '../features/lodgements/lodgementsService.js';
import DocumentChecklist from '../features/documents/components/DocumentChecklist.jsx';
import TaskList from '../features/tasks/components/TaskList.jsx';
import TaskForm from '../features/tasks/components/TaskForm.jsx';
import ActivityTimeline from '../features/activity/components/ActivityTimeline.jsx';
import ActivityForm from '../features/activity/components/ActivityForm.jsx';
import OfferLogForm from '../features/offers/components/OfferLogForm.jsx';
import FeeReceiptLogger from '../features/fees/components/FeeReceiptLogger.jsx';
import LodgementForm from '../features/lodgements/components/LodgementForm.jsx';
import Toast from '../components/ui/Toast.jsx';

const TABS = [
  { id: 'activity',   label: 'Activity' },
  { id: 'documents',  label: 'Documents' },
  { id: 'tasks',      label: 'Tasks' },
  { id: 'offer',      label: 'Offer' },
  { id: 'fee',        label: 'Fee' },
  { id: 'lodgement',  label: 'Lodgement' },
];

const VISA_STATUSES = ['Lodged', 'Under Review', 'Decision Pending', 'Decided'];

export default function CaseDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { case: c, loading, update, refresh: refreshCase } = useCase(id);
  const { config } = usePipeline();
  const { student } = useStudent(c?.studentId);
  const { users } = useUsers();
  const { docs, setStatus: setDocStatus, upload: uploadDoc } = useDocuments(id);
  const { tasks, create: createTask, toggle: toggleTask, refresh: refreshTasks } = useTasks({ caseId: id });
  const { entries: activity, create: createActivity } = useActivity(id);
  const { offers, create: createOffer, updateStatus: updateOfferStatus } = useOffers(id);
  const { fees, create: createFee, voidFee } = useFees(id);
  const { lodgement, create: createLodgement, refresh: refreshLodgement } = useLodgement(id);

  // Lets /flow (and any other caller) deep-link straight to a tab via
  // ?tab=documents — falls back to 'activity' when absent or invalid.
  const requestedTab = searchParams.get('tab');
  const [tab, setTab] = useState(
    TABS.some((t) => t.id === requestedTab) ? requestedTab : 'activity',
  );
  const [toast, setToast] = useState('');

  async function handleMetaSave(form) {
    await update(form);
    setToast('Case details saved');
  }

  const usersById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users]);

  const stageLabel = useMemo(() => {
    const map = Object.fromEntries((config?.stages ?? []).map((s) => [s.id, s.label]));
    return (sid) => map[sid] ?? sid;
  }, [config]);

  if (loading || !c || !config) return <div className="p-xl"><Spinner /></div>;

  const overdue = isOverdue(c.deadline) && c.stage !== 'enrolled';

  async function handleStageChange(stage) {
    await update({ stage });
  }

  async function handleVisaStatusChange(visaStatus) {
    await lodgementsService.updateVisaStatus(id, visaStatus);
    await refreshCase();
  }

  async function handleLodge(data) {
    await createLodgement(data);
    await refreshCase();
    await refreshTasks();
  }

  async function handleDecision(data) {
    await lodgementsService.recordDecision(id, data);
    await refreshCase();
    await refreshLodgement();
    await refreshTasks();
  }

  async function handleCreateOffer(data) {
    await createOffer(data);
    await refreshCase();
  }

  async function handleCreateActivity(data) {
    await createActivity(data);
    await refreshCase();
  }

  return (
    <div>
      <PageHeader
        eyebrow={
          <Link to="/pipeline" className="inline-flex items-center gap-xxs hover:text-ink">
            <ArrowLeft size={12} strokeWidth={1.5} /> Pipeline
          </Link>
        }
        title={student?.name ?? 'Case'}
        description={`${c.country} · ${c.intake}`}
        actions={
          <div className="flex items-center gap-sm">
            <select
              className="h-9 rounded-none border border-hairline bg-canvas px-sm text-body-sm text-ink"
              value={c.stage}
              onChange={(e) => handleStageChange(e.target.value)}
            >
              {(config?.stages ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            {c.visaStatus && (
              <select
                className="h-9 rounded-none border border-hairline bg-surface-1 px-sm text-body-sm text-ink-muted"
                value={c.visaStatus}
                onChange={(e) => handleVisaStatusChange(e.target.value)}
                disabled={!!c.visaOutcome}
              >
                {VISA_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            )}
          </div>
        }
      />

      <div className="grid gap-xl p-xl lg:grid-cols-[1fr_280px]">
        {/* Main: tabs */}
        <div>
          {/* Next action + deadline compact row */}
          <NextActionBar c={c} onSave={update} overdue={overdue} />

          {/* Tab strip */}
          <nav className="mt-lg flex gap-md border-b border-hairline">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'px-sm py-md text-body-sm border-b-2 transition-colors duration-fast ease-productive',
                  tab === t.id
                    ? 'border-primary text-ink font-[600]'
                    : 'border-transparent text-ink-muted hover:text-ink',
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="mt-lg">
            {tab === 'activity' && (
              <div className="space-y-md">
                <ActivityForm authorId={currentUser?.id} onCreate={handleCreateActivity} />
                <ActivityTimeline entries={activity} usersById={usersById} />
              </div>
            )}

            {tab === 'documents' && (
              <DocumentChecklist
                docs={docs}
                checklist={config.checklist}
                currentUserId={currentUser?.id}
                studentName={student?.name}
                onUpload={(docId, file) => uploadDoc(docId, file, currentUser?.id)}
                onStatusChange={(docId, status, reason) => setDocStatus(docId, status, reason)}
                onReminder={async (missing) => {
                  await handleCreateActivity({
                    type: 'note',
                    text: `Document reminder sent — still needed: ${missing.map((m) => m.label).join(', ')}.`,
                    authorId: currentUser?.id,
                  });
                }}
              />
            )}

            {tab === 'tasks' && (
              <div className="space-y-md">
                <TaskForm caseId={id} assigneeId={c.counsellorId} onCreate={createTask} />
                <TaskList tasks={tasks} onToggle={toggleTask} showCase={false} />
              </div>
            )}

            {tab === 'offer' && (
              <OfferLogForm
                offers={offers}
                onCreate={handleCreateOffer}
                onUpdateStatus={updateOfferStatus}
              />
            )}

            {tab === 'fee' && (
              <FeeReceiptLogger
                fees={fees}
                currentUserId={currentUser?.id}
                usersById={usersById}
                onCreate={createFee}
                onVoid={voidFee}
              />
            )}

            {tab === 'lodgement' && (
              <LodgementForm
                lodgement={lodgement}
                caseData={c}
                onLodge={handleLodge}
                onDecision={handleDecision}
                onUpdateVisaStatus={handleVisaStatusChange}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-md">
          {/* Student info */}
          <Card>
            <div className="text-eyebrow text-ink-muted">Student</div>
            <div className="mt-xs text-card-title font-light text-ink">{student?.name}</div>
            <dl className="mt-md space-y-xs text-body-sm">
              <Row label="Phone" value={student?.phone} />
              <Row label="Email" value={student?.email} />
              <Row label="Target" value={student?.targetCountry} />
              <Row label="Source" value={student?.leadSource?.replace(/-/g, ' ')} />
              <Row label="Counsellor" value={usersById[c.counsellorId]?.name} />
            </dl>
            {student && (
              <Link to={`/students/${student.id}`} className="mt-md inline-block text-body-sm text-primary hover:underline">
                View student profile →
              </Link>
            )}
          </Card>

          {/* Case meta edit — key forces remount when stage/counsellor changes externally */}
          <Card>
            <div className="text-eyebrow text-ink-muted">Edit case</div>
            <CaseMetaForm
              key={`${c.stage}-${c.counsellorId}-${c.country}-${c.intake}`}
              c={c}
              stages={config.stages}
              counsellors={users.filter((u) => u.role === 'counsellor')}
              onSave={handleMetaSave}
            />
          </Card>

          {/* Visa outcome badge if decided */}
          {c.visaOutcome && (
            <Card>
              <div className="text-eyebrow text-ink-muted">Visa outcome</div>
              <div className={cn(
                'mt-xs text-body-emphasis',
                c.visaOutcome === 'granted' ? 'text-success' : 'text-error',
              )}>
                {c.visaOutcome === 'granted' ? 'Granted' : 'Refused'}
              </div>
              {c.visaOutcome === 'refused' && (
                <div className="mt-xs text-body-sm text-ink-muted">{c.refusalCategory}</div>
              )}
            </Card>
          )}
        </aside>
      </div>

      <Toast message={toast} visible={!!toast} onDone={() => setToast('')} />
    </div>
  );
}

function NextActionBar({ c, onSave, overdue }) {
  const [editing, setEditing] = useState(false);
  const [nextAction, setNextAction] = useState(c.nextAction ?? '');
  const [deadline, setDeadline] = useState(c.deadline ? c.deadline.slice(0, 10) : '');
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await onSave({ nextAction, deadline: deadline ? new Date(deadline).toISOString() : '' });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="flex items-end gap-sm border border-hairline bg-canvas p-md">
        <div className="flex-1">
          <Input
            label="Next action"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="What needs to happen next?"
          />
        </div>
        <div className="w-40">
          <Input
            type="date"
            label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={save} disabled={busy}>Save</Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="w-full text-left border border-hairline bg-canvas p-md hover:bg-surface-1 transition-colors"
    >
      <div className="text-eyebrow text-ink-muted">Next action</div>
      <div className="mt-xxs text-body text-ink">{c.nextAction || 'Not set — click to add'}</div>
      {c.deadline && (
        <div className={cn('mt-xs text-caption', overdue ? 'text-error' : 'text-ink-muted')}>
          {overdue ? '⚠ Overdue · ' : ''}{formatDate(c.deadline)}
          {c.lastContact && ` · Last contact ${formatDate(c.lastContact)}`}
        </div>
      )}
      {c.blocker && (
        <div className="mt-xs text-caption text-warning">⚠ {c.blocker}</div>
      )}
    </button>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-md">
      <dt className="text-ink-muted capitalize">{label}</dt>
      <dd className="text-ink text-right">{value || '—'}</dd>
    </div>
  );
}

const COUNTRIES = ['Australia', 'UK', 'USA', 'Canada', 'New Zealand', 'Other'];
const INTAKES = ['Feb 2026', 'Jul 2026', 'Sep 2026', 'Jan 2027', 'Feb 2027', 'Jul 2027', 'Sep 2027'];

function CaseMetaForm({ c, stages, counsellors, onSave }) {
  const [form, setForm] = useState({
    stage: c.stage,
    counsellorId: c.counsellorId,
    country: c.country ?? '',
    intake: c.intake ?? '',
    blocker: c.blocker ?? '',
  });
  const [busy, setBusy] = useState(false);
  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try { await onSave(form); }
    finally { setBusy(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-sm space-y-md">
      <label className="flex flex-col gap-xxs">
        <span className="text-body-sm text-ink-muted">Stage</span>
        <select
          className="h-9 rounded-none border border-hairline bg-canvas px-sm text-body-sm text-ink"
          value={form.stage}
          onChange={(e) => set('stage', e.target.value)}
        >
          {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-xxs">
        <span className="text-body-sm text-ink-muted">Counsellor</span>
        <select
          className="h-9 rounded-none border border-hairline bg-canvas px-sm text-body-sm text-ink"
          value={form.counsellorId}
          onChange={(e) => set('counsellorId', e.target.value)}
        >
          <option value="">— unassigned —</option>
          {counsellors.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-xxs">
        <span className="text-body-sm text-ink-muted">Target country</span>
        <select
          className="h-9 rounded-none border border-hairline bg-canvas px-sm text-body-sm text-ink"
          value={form.country}
          onChange={(e) => set('country', e.target.value)}
        >
          <option value="">— select —</option>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-xxs">
        <span className="text-body-sm text-ink-muted">Intake</span>
        <select
          className="h-9 rounded-none border border-hairline bg-canvas px-sm text-body-sm text-ink"
          value={form.intake}
          onChange={(e) => set('intake', e.target.value)}
        >
          <option value="">— select —</option>
          {INTAKES.map((i) => <option key={i}>{i}</option>)}
        </select>
      </label>
      <Input
        label="Blocker (optional)"
        value={form.blocker}
        onChange={(e) => set('blocker', e.target.value)}
        placeholder="Anything blocking progress?"
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={busy}>Save changes</Button>
      </div>
    </form>
  );
}
