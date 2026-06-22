import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle, CheckCircle2, ChevronRight, Circle,
  Clock, Eye, FileText, GraduationCap, XCircle,
} from 'lucide-react';
import Spinner from '../components/ui/Spinner.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useStudents } from '../features/students/hooks/useStudents.js';
import { useStudent } from '../features/students/hooks/useStudent.js';
import { useCases } from '../features/cases/hooks/useCases.js';
import { useDocuments } from '../features/documents/hooks/useDocuments.js';
import { useOffers } from '../features/offers/hooks/useOffers.js';
import { usePipeline } from '../features/cases/hooks/usePipeline.js';
import { useUsers } from '../features/users/hooks/useUsers.js';
import { formatDate, isOverdue } from '../lib/date.js';
import { cn } from '../lib/cn.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_DOC = {
  required: { label: 'Needed',   tone: 'muted',    done: false },
  pending:  { label: 'Pending',  tone: 'warning',  done: false },
  received: { label: 'Received', tone: 'info',     done: true  },
  verified: { label: 'Verified', tone: 'success',  done: true  },
  rejected: { label: 'Rejected', tone: 'error',    done: false },
};

// ─── Top-level page ───────────────────────────────────────────────────────────

export default function StudentPortalPage() {
  const { students, loading: studentsLoading } = useStudents();
  const [studentId, setStudentId] = useState('');

  const effectiveId = studentId || students[0]?.id || '';

  return (
    <div className="min-h-full bg-surface-1">

      {/* ── Preview banner ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-md border-b border-hairline bg-inverse-canvas px-xl py-sm">
        <div className="flex items-center gap-sm text-inverse-ink">
          <Eye size={14} strokeWidth={1.5} className="shrink-0" />
          <span className="text-body-sm">
            Student portal preview — this is exactly what the student sees when they log in
          </span>
        </div>
        {studentsLoading ? null : (
          <select
            className="h-8 rounded-none border border-inverse-ink-muted bg-inverse-surface-1 px-sm text-body-sm text-inverse-ink"
            value={effectiveId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Portal content ─────────────────────────────────────────────── */}
      {effectiveId
        ? <PortalView studentId={effectiveId} />
        : <div className="flex h-64 items-center justify-center text-body-sm text-ink-muted">No students in the system yet.</div>
      }
    </div>
  );
}

// ─── PortalView — the full student view for one student ───────────────────────

function PortalView({ studentId }) {
  const { student, loading: sLoading } = useStudent(studentId);
  const { cases, loading: cLoading }   = useCases({ studentId });
  const { config }                     = usePipeline();
  const { users }                      = useUsers();

  const [activeCaseId, setActiveCaseId] = useState(null);

  const usersById = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users],
  );

  if (sLoading || cLoading || !config) {
    return <div className="p-xl"><Spinner /></div>;
  }

  const activeCases = cases.filter((c) => c.stage !== 'dropped');
  const activeCase  = activeCases.find((c) => c.id === activeCaseId) ?? activeCases[0];

  if (!student) return null;

  const counsellor = usersById[activeCase?.counsellorId];

  return (
    <div className="mx-auto max-w-4xl px-xl py-xxl space-y-xl">

      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <div>
        <p className="text-eyebrow text-ink-muted">Student portal</p>
        <h1 className="mt-xxs text-display-md font-light text-ink">
          Hello, {student.name.split(' ')[0]}.
        </h1>
        <p className="mt-xs text-body text-ink-muted">
          Here's where your application stands and what you need to do next.
        </p>
      </div>

      {/* ── Case tabs (if multiple cases) ─────────────────────────────── */}
      {activeCases.length > 1 && (
        <div className="flex gap-xs border-b border-hairline">
          {activeCases.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCaseId(c.id)}
              className={cn(
                'px-md py-sm text-body-sm border-b-2 transition-colors duration-fast',
                c.id === activeCase?.id
                  ? 'border-primary text-ink font-[600]'
                  : 'border-transparent text-ink-muted hover:text-ink',
              )}
            >
              {c.country}
            </button>
          ))}
        </div>
      )}

      {activeCase
        ? <CasePortal activeCase={activeCase} student={student} config={config} counsellor={counsellor} />
        : (
          <div className="border border-dashed border-hairline bg-canvas p-xl text-center text-body-sm text-ink-muted">
            No active cases yet. Your counsellor will add one when your application begins.
          </div>
        )
      }
    </div>
  );
}

// ─── CasePortal — everything for one case ────────────────────────────────────

function CasePortal({ activeCase: c, student, config, counsellor }) {
  const { docs }   = useDocuments(c.id);
  const { offers } = useOffers(c.id);

  const stages     = config?.stages ?? [];
  const stageIndex = stages.findIndex((s) => s.id === c.stage);
  const currentStageLabel = stages[stageIndex]?.label ?? c.stage;

  const pendingOffers = offers.filter((o) => o.status === 'pending');
  const acceptedOffer = offers.find((o) => o.status === 'accepted');

  const checklistById = Object.fromEntries((config?.checklist ?? []).map((i) => [i.id, i]));
  const neededDocs    = docs.filter((d) => !STATUS_DOC[d.status]?.done);
  const receivedDocs  = docs.filter((d) =>  STATUS_DOC[d.status]?.done);

  const deadlineOverdue = isOverdue(c.deadline);

  return (
    <div className="grid gap-xl lg:grid-cols-[220px_1fr]">

      {/* ── Left: Stage tracker ──────────────────────────────────────── */}
      <aside className="space-y-md">
        <div className="text-eyebrow text-ink-muted">Your journey</div>
        <ol className="relative ml-[9px] border-l border-hairline space-y-xs">
          {stages.map((s, i) => {
            const past    = i < stageIndex;
            const current = i === stageIndex;
            const future  = i > stageIndex;
            return (
              <li key={s.id} className="relative flex items-start gap-sm pl-md">
                {/* Dot */}
                <span className={cn(
                  'absolute -left-[9px] top-[3px] flex h-[18px] w-[18px] items-center justify-center bg-surface-1',
                )}>
                  {past && (
                    <CheckCircle2 size={16} strokeWidth={1.5} className="text-success" />
                  )}
                  {current && (
                    <span className="flex h-4 w-4 items-center justify-center bg-primary">
                      <span className="h-1.5 w-1.5 bg-on-primary" />
                    </span>
                  )}
                  {future && (
                    <Circle size={14} strokeWidth={1.5} className="text-ink-subtle" />
                  )}
                </span>
                <span className={cn(
                  'text-body-sm leading-[1.4]',
                  current ? 'font-[600] text-ink' : past ? 'text-ink-muted' : 'text-ink-subtle',
                )}>
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Counsellor card */}
        {counsellor && (
          <div className="border border-hairline bg-canvas p-md space-y-xxs">
            <div className="text-caption text-ink-muted">Your counsellor</div>
            <div className="text-body-sm font-[600] text-ink">{counsellor.name}</div>
            <div className="text-caption text-ink-subtle">{counsellor.email}</div>
          </div>
        )}
      </aside>

      {/* ── Right: Main content ──────────────────────────────────────── */}
      <div className="space-y-xl">

        {/* Current stage callout */}
        <div className={cn(
          'flex items-center justify-between gap-md border-l-4 bg-canvas px-md py-sm',
          c.visaOutcome === 'refused' ? 'border-l-error' : 'border-l-primary',
        )}>
          <div>
            <div className="text-caption text-ink-muted">You are currently at</div>
            <div className="text-subhead font-light text-ink">{currentStageLabel}</div>
            {c.visaOutcome === 'refused' && (
              <div className="mt-xxs text-body-sm text-error">
                Your visa was refused — {c.refusalCategory}. Your counsellor will contact you with next steps.
              </div>
            )}
            {c.visaOutcome === 'granted' && (
              <div className="mt-xxs text-body-sm text-success font-[600]">
                Congratulations — your visa has been granted!
              </div>
            )}
          </div>
          {c.visaOutcome === 'granted'
            ? <Badge tone="success">Visa granted</Badge>
            : c.visaOutcome === 'refused'
            ? <Badge tone="error">Visa refused</Badge>
            : <Badge tone="info">{c.country} · {c.intake || 'Intake TBC'}</Badge>
          }
        </div>

        {/* ── What to do next ────────────────────────────────────────── */}
        <section>
          <h2 className="mb-sm text-body-emphasis text-ink-muted uppercase tracking-[0.32px] text-[11px]">
            What to do next
          </h2>
          {c.nextAction ? (
            <div className={cn(
              'border bg-canvas p-md',
              deadlineOverdue ? 'border-error' : 'border-hairline',
            )}>
              <div className="text-body font-[500] text-ink">{c.nextAction}</div>
              {c.deadline && (
                <div className={cn(
                  'mt-xs flex items-center gap-xs text-body-sm',
                  deadlineOverdue ? 'text-error' : 'text-ink-muted',
                )}>
                  <Clock size={14} strokeWidth={1.5} />
                  {deadlineOverdue ? 'Overdue — ' : 'Due '}
                  {formatDate(c.deadline)}
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-hairline bg-canvas p-md text-body-sm text-ink-muted">
              Your counsellor will update your next step after your next session.
            </div>
          )}
        </section>

        {/* ── University offer ───────────────────────────────────────── */}
        {(acceptedOffer || pendingOffers.length > 0) && (
          <section>
            <h2 className="mb-sm text-body-emphasis text-ink-muted uppercase tracking-[0.32px] text-[11px]">
              University offer
            </h2>
            <div className="space-y-xs">
              {acceptedOffer && (
                <div className="flex items-start justify-between gap-md border border-success bg-canvas p-md">
                  <div>
                    <div className="text-body-emphasis text-ink">{acceptedOffer.university}</div>
                    <div className="mt-xxs text-body-sm text-ink-muted capitalize">{acceptedOffer.offerType} offer · Accepted</div>
                  </div>
                  <Badge tone="success">Accepted</Badge>
                </div>
              )}
              {pendingOffers.map((o) => {
                const daysLeft = Math.ceil((new Date(o.acceptanceDeadline) - new Date()) / 86400000);
                const urgent   = daysLeft <= 3;
                return (
                  <div key={o.id} className={cn('flex items-start justify-between gap-md border bg-canvas p-md', urgent ? 'border-warning' : 'border-hairline')}>
                    <div>
                      <div className="text-body-emphasis text-ink">{o.university}</div>
                      <div className="mt-xxs text-body-sm text-ink-muted capitalize">{o.offerType} offer</div>
                      {o.conditionalRequirements && (
                        <div className="mt-xxs text-caption text-ink-muted">Condition: {o.conditionalRequirements}</div>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <Badge tone={urgent ? 'warning' : 'muted'}>
                        {daysLeft > 0 ? `${daysLeft}d to accept` : 'Deadline passed'}
                      </Badge>
                      <div className="mt-xxs text-caption text-ink-subtle">{formatDate(o.acceptanceDeadline)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Documents still needed ─────────────────────────────────── */}
        <section>
          <h2 className="mb-sm text-body-emphasis text-ink-muted uppercase tracking-[0.32px] text-[11px]">
            Documents we still need from you
            {neededDocs.length > 0 && (
              <span className="ml-xs font-normal normal-case tracking-normal text-error">
                ({neededDocs.length})
              </span>
            )}
          </h2>
          {neededDocs.length === 0 ? (
            <div className="flex items-center gap-sm border border-success bg-canvas p-md">
              <CheckCircle2 size={18} strokeWidth={1.5} className="text-success shrink-0" />
              <span className="text-body-sm text-success">All documents received — great work!</span>
            </div>
          ) : (
            <ul className="divide-y divide-hairline border border-hairline bg-canvas">
              {neededDocs.map((d) => {
                const label    = checklistById[d.type]?.label ?? d.type;
                const rejected = d.status === 'rejected';
                return (
                  <li key={d.id} className={cn('px-md py-sm', rejected && 'bg-surface-1')}>
                    <div className="flex items-start justify-between gap-md">
                      <div className="flex items-start gap-sm min-w-0">
                        {rejected
                          ? <XCircle size={16} strokeWidth={1.5} className="mt-[2px] shrink-0 text-error" />
                          : <AlertCircle size={16} strokeWidth={1.5} className="mt-[2px] shrink-0 text-warning" />
                        }
                        <div className="min-w-0">
                          <div className="text-body-sm font-[500] text-ink">{label}</div>
                          {rejected && d.rejectionReason && (
                            <div className="mt-xxs text-caption text-error">
                              Resubmit required: {d.rejectionReason}
                            </div>
                          )}
                          {!rejected && (
                            <div className="mt-xxs text-caption text-ink-muted">
                              Please send this to your counsellor as soon as possible
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge tone={rejected ? 'error' : 'warning'}>
                        {rejected ? 'Resubmit' : 'Needed'}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Documents received ─────────────────────────────────────── */}
        {receivedDocs.length > 0 && (
          <section>
            <h2 className="mb-sm text-body-emphasis text-ink-muted uppercase tracking-[0.32px] text-[11px]">
              Documents we have from you ({receivedDocs.length})
            </h2>
            <ul className="divide-y divide-hairline border border-hairline bg-canvas">
              {receivedDocs.map((d) => {
                const label    = checklistById[d.type]?.label ?? d.type;
                const verified = d.status === 'verified';
                return (
                  <li key={d.id} className="flex items-center justify-between gap-md px-md py-sm">
                    <div className="flex items-center gap-sm">
                      <CheckCircle2
                        size={16}
                        strokeWidth={1.5}
                        className={verified ? 'text-success' : 'text-primary'}
                      />
                      <span className="text-body-sm text-ink">{label}</span>
                    </div>
                    <Badge tone={verified ? 'success' : 'info'}>
                      {verified ? 'Verified' : 'Received'}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}
