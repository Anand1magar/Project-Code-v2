import { useState } from 'react';
import Input from '../../../components/ui/Input.jsx';
import Select from '../../../components/ui/Select.jsx';
import Button from '../../../components/ui/Button.jsx';

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Netherlands', 'New Zealand', 'Singapore', 'France'];

export default function CaseForm({ students, counsellors, initial, onCancel, onSubmit, submitLabel = 'Create case' }) {
  const [form, setForm] = useState(() => ({
    studentId: students[0]?.id ?? '',
    counsellorId: counsellors[0]?.id ?? '',
    country: 'USA',
    intake: 'Fall 2026',
    nextAction: '',
    deadline: '',
    ...initial,
  }));
  const [busy, setBusy] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try { await onSubmit(form); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
      <div className="grid gap-md md:grid-cols-2">
        <Select label="Student" value={form.studentId} onChange={(e) => set('studentId', e.target.value)}>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <Select label="Assigned counsellor" value={form.counsellorId} onChange={(e) => set('counsellorId', e.target.value)}>
          {counsellors.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
      </div>
      <div className="grid gap-md md:grid-cols-2">
        <Select label="Target country" value={form.country} onChange={(e) => set('country', e.target.value)}>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Input label="Intake" value={form.intake} onChange={(e) => set('intake', e.target.value)} />
      </div>
      <Input label="Next action" value={form.nextAction} onChange={(e) => set('nextAction', e.target.value)} placeholder="e.g. Draft SOP" />
      <Input type="date" label="Deadline" value={form.deadline ? form.deadline.slice(0, 10) : ''} onChange={(e) => set('deadline', e.target.value ? new Date(e.target.value).toISOString() : '')} />
      <div className="flex justify-end gap-sm">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={busy}>{submitLabel}</Button>
      </div>
    </form>
  );
}
