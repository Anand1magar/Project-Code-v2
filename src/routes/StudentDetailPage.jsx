import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useStudent } from '../features/students/hooks/useStudent.js';
import { useCases } from '../features/cases/hooks/useCases.js';
import { usePipeline } from '../features/cases/hooks/usePipeline.js';
import StudentForm from '../features/students/components/StudentForm.jsx';
import { formatDate } from '../lib/date.js';

export default function StudentDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { student, loading, update, remove } = useStudent(id);
  const { cases } = useCases({ studentId: id });
  const { config } = usePipeline();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const stageLabel = useMemo(() => {
    const map = Object.fromEntries((config?.stages ?? []).map((s) => [s.id, s.label]));
    return (id) => map[id] ?? id;
  }, [config]);

  if (loading || !student) return <div className="p-xl"><Spinner /></div>;

  async function handleSave(patch) {
    await update(patch);
    setEditOpen(false);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await remove();
      nav('/students', { replace: true });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={
          <Link to="/students" className="inline-flex items-center gap-xxs hover:text-ink">
            <ArrowLeft size={12} strokeWidth={1.5} /> Students
          </Link>
        }
        title={student.name}
        description={`${student.targetCountry} · ${student.leadSource?.replace(/-/g, ' ')}`}
        actions={
          <div className="flex items-center gap-sm">
            <Button variant="tertiary" onClick={() => setEditOpen(true)}>
              <Pencil size={14} strokeWidth={1.5} /> Edit
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={14} strokeWidth={1.5} /> Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-xl p-xl lg:grid-cols-3">
        <Card>
          <div className="text-eyebrow text-ink-muted">Contact</div>
          <dl className="mt-sm space-y-xs text-body-sm">
            <Row label="Email" value={student.email} />
            <Row label="Phone" value={student.phone} />
            <Row label="Target" value={student.targetCountry} />
            <Row label="Source" value={student.leadSource?.replace(/-/g, ' ')} />
            <Row label="Added" value={formatDate(student.createdAt)} />
          </dl>
        </Card>

        <div className="lg:col-span-2">
          <h2 className="mb-sm text-card-title font-light text-ink">Cases ({cases.length})</h2>
          {cases.length === 0 ? (
            <div className="border border-dashed border-hairline bg-canvas p-lg text-center text-body-sm text-ink-muted">
              No cases for this student yet.
            </div>
          ) : (
            <ul className="divide-y divide-hairline border border-hairline bg-canvas">
              {cases.map((c) => (
                <li key={c.id} className="px-md py-sm">
                  <Link to={`/cases/${c.id}`} className="flex items-center justify-between gap-md">
                    <div>
                      <div className="text-body-emphasis text-ink">{c.country} · {c.intake}</div>
                      <div className="text-caption text-ink-muted">{c.nextAction || 'No next action'}</div>
                    </div>
                    <Badge tone="muted">{stageLabel(c.stage)}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit student">
        <StudentForm initial={student} onCancel={() => setEditOpen(false)} onSubmit={handleSave} submitLabel="Save changes" />
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete student"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }
      >
        <p className="text-body-sm text-ink">
          Delete <strong>{student.name}</strong>
          {cases.length > 0 && ` and ${cases.length} case${cases.length !== 1 ? 's' : ''}`}?
          This can't be undone — all linked documents, tasks, notes, fees, offers, and lodgements go with it.
        </p>
      </Modal>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-md">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-ink text-right">{value || '—'}</dd>
    </div>
  );
}
