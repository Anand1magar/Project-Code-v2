import { useState } from 'react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

export default function TaskForm({ caseId, assigneeId, onCreated, onCreate }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      const iso = dueDate ? new Date(dueDate).toISOString() : '';
      const created = await onCreate({ caseId, assigneeId, title: title.trim(), dueDate: iso, done: false });
      setTitle('');
      setDueDate('');
      onCreated?.(created);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm md:flex-row md:items-end">
      <div className="flex-1">
        <Input label="New task" placeholder="What needs to happen?" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="md:w-48">
        <Input type="date" label="Due" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy || !title.trim()}>Add task</Button>
    </form>
  );
}
