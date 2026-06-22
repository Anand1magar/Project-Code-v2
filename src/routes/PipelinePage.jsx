import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Badge from '../components/ui/Badge.jsx';
import { useCases } from '../features/cases/hooks/useCases.js';
import { usePipeline } from '../features/cases/hooks/usePipeline.js';
import { useStudents } from '../features/students/hooks/useStudents.js';
import { useUsers } from '../features/users/hooks/useUsers.js';
import KanbanBoard from '../features/cases/components/KanbanBoard.jsx';
import CaseForm from '../features/cases/components/CaseForm.jsx';

export default function PipelinePage() {
  const [searchParams] = useSearchParams();
  const focusStage = searchParams.get('stage');    // e.g. "visa-lodgement"
  const filterMode = searchParams.get('filter');   // e.g. "refused"

  const { config, loading: cfgLoading } = usePipeline();
  const { cases, loading, updateStage, create } = useCases();
  const { students } = useStudents();
  const { users } = useUsers();
  const [modalOpen, setModalOpen] = useState(false);

  const studentsById = useMemo(
    () => Object.fromEntries(students.map((s) => [s.id, s])),
    [students],
  );
  const counsellors = useMemo(() => users.filter((u) => u.role === 'counsellor'), [users]);

  if (cfgLoading || !config) return <div className="p-xl"><Spinner /></div>;

  // Derive the active filter label for the page header chip
  let filterLabel = null;
  if (focusStage) {
    filterLabel = config.stages.find((s) => s.id === focusStage)?.label ?? focusStage;
  } else if (filterMode === 'refused') {
    filterLabel = 'Refused cases';
  }

  async function handleCreate(data) {
    await create(data);
    setModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Pipeline"
        title="Case pipeline"
        description="Every active case across the consultancy. Drag cards between stages to move a case forward."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} strokeWidth={1.5} /> New case
          </Button>
        }
      />

      {/* Filter bar — always visible */}
      <div className="flex items-center gap-sm border-b border-hairline px-xl py-sm">
        <span className="text-caption text-ink-muted">Filter:</span>

        {filterMode === 'refused' ? (
          <>
            <Badge tone="error">Refused cases</Badge>
            <Link
              to="/pipeline"
              className="flex items-center gap-xxs text-caption text-ink-muted hover:text-ink transition-colors"
            >
              <X size={12} strokeWidth={1.5} /> Clear
            </Link>
          </>
        ) : focusStage ? (
          <>
            <Badge tone="info">{filterLabel}</Badge>
            <Link
              to="/pipeline"
              className="flex items-center gap-xxs text-caption text-ink-muted hover:text-ink transition-colors"
            >
              <X size={12} strokeWidth={1.5} /> Clear
            </Link>
          </>
        ) : (
          <Link
            to="/pipeline?filter=refused"
            className="text-caption text-error hover:underline transition-colors"
          >
            Show refused only
          </Link>
        )}
      </div>

      {loading ? (
        <div className="p-xl"><Spinner /></div>
      ) : (
        <KanbanBoard
          stages={config.stages}
          cases={cases}
          studentsById={studentsById}
          onMove={updateStage}
          focusStage={focusStage}
          filterMode={filterMode}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New case">
        <CaseForm
          students={students}
          counsellors={counsellors.length ? counsellors : users}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleCreate}
        />
      </Modal>
    </div>
  );
}
