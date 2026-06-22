import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Modal from '../components/ui/Modal.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuth } from '../features/auth/AuthContext.jsx';
import { useStudents } from '../features/students/hooks/useStudents.js';
import { studentsService } from '../features/students/studentsService.js';
import { casesService } from '../features/cases/casesService.js';
import StudentList from '../features/students/components/StudentList.jsx';
import StudentForm from '../features/students/components/StudentForm.jsx';

export default function StudentsPage() {
  const nav = useNavigate();
  const { currentUser } = useAuth();
  const { students, loading, query, setQuery, create } = useStudents();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function openModal() {
    setModalOpen(true);
    setError('');
    setPendingData(null);
    setDuplicate(null);
  }

  function closeModal() {
    setModalOpen(false);
    setDuplicate(null);
    setPendingData(null);
    setError('');
  }

  async function addStudent(data) {
    setBusy(true);
    setError('');
    try {
      const student = await create({ ...data, createdBy: currentUser?.id ?? '' });
      // Assign case to current user only if they are a counsellor
      const counsellorId = currentUser?.role === 'counsellor' ? (currentUser?.id ?? '') : '';
      const newCase = await casesService.create({
        studentId: student.id,
        counsellorId,
        country: data.targetCountry,
        intake: '',
      });
      closeModal();
      nav(`/cases/${newCase.id}`);
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleFormSubmit(data) {
    setError('');
    // Try duplicate check; if it fails, skip it and proceed
    try {
      const result = await studentsService.checkDuplicate(data.phone, data.email);
      if (result?.match) {
        setPendingData(data);
        setDuplicate(result.match);
        return;
      }
    } catch {
      // duplicate check failed — proceed with creation
    }
    await addStudent(data);
  }

  async function handleCreateAnyway() {
    if (!pendingData) return;
    setDuplicate(null);
    await addStudent(pendingData);
  }

  function handleOpenExisting() {
    if (!duplicate) return;
    closeModal();
    nav(`/students/${duplicate.id}`);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Students"
        title="All students"
        description="Every person with an active or closed case in your pipeline."
        actions={
          <Button onClick={openModal}>
            <Plus size={16} strokeWidth={1.5} /> Add student
          </Button>
        }
      />

      <div className="p-xl">
        <div className="mb-md flex items-center gap-sm">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-sm top-1/2 -translate-y-1/2 text-ink-subtle" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone, or country"
              className="h-10 w-full bg-canvas pl-xl pr-md text-body text-ink rounded-none border border-hairline placeholder:text-ink-subtle"
            />
          </div>
          <div className="text-body-sm text-ink-muted">
            {loading ? <Spinner size={14} /> : `${students.length} student${students.length === 1 ? '' : 's'}`}
          </div>
        </div>

        {loading ? null : students.length === 0 ? (
          <EmptyState
            title="No students yet"
            description="Add your first student to start building a pipeline."
            action={<Button onClick={openModal}>Add student</Button>}
          />
        ) : (
          <StudentList students={students} />
        )}
      </div>

      {/* Add student modal — hidden when duplicate prompt is showing */}
      <Modal open={modalOpen && !duplicate} onClose={closeModal} title="Add student">
        {error && (
          <div className="mb-md border border-error bg-canvas px-md py-sm text-body-sm text-error">
            {error}
          </div>
        )}
        <StudentForm
          onCancel={closeModal}
          onSubmit={handleFormSubmit}
          submitLabel={busy ? 'Adding…' : 'Add student'}
          disabled={busy}
        />
      </Modal>

      {/* Duplicate detected modal */}
      <Modal open={!!duplicate} onClose={() => setDuplicate(null)} title="Student already exists">
        <div className="space-y-md">
          <p className="text-body-sm text-ink">
            A student with this phone or email already exists:
          </p>
          <div className="border border-hairline bg-surface-1 p-md">
            <div className="text-body-emphasis text-ink">{duplicate?.name}</div>
            <div className="mt-xxs text-body-sm text-ink-muted">
              {duplicate?.phone}{duplicate?.email ? ` · ${duplicate.email}` : ''} · {duplicate?.targetCountry}
            </div>
          </div>
          {error && (
            <p className="text-body-sm text-error">{error}</p>
          )}
          <div className="flex justify-end gap-sm pt-xs">
            <Button variant="ghost" onClick={() => setDuplicate(null)}>Cancel</Button>
            <Button variant="tertiary" onClick={handleCreateAnyway} disabled={busy}>
              {busy ? 'Adding…' : 'Create new anyway'}
            </Button>
            <Button onClick={handleOpenExisting}>Open existing record</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
