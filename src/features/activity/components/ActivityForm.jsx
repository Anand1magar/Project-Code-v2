import { useState } from 'react';
import Textarea from '../../../components/ui/Textarea.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import { cn } from '../../../lib/cn.js';

const TYPES = [
  { id: 'note',    label: 'Note' },
  { id: 'call',    label: 'Call' },
  { id: 'email',   label: 'Email' },
  { id: 'meeting', label: 'Meeting' },
];

const COUNTRIES = ['Australia', 'UK', 'USA', 'Canada', 'New Zealand', 'Other'];
const INTAKES = ['Feb 2026', 'Jul 2026', 'Sep 2026', 'Jan 2027', 'Feb 2027', 'Jul 2027', 'Sep 2027'];

export default function ActivityForm({ authorId, onCreate }) {
  const [type, setType] = useState('note');
  const [rationale, setRationale] = useState('');
  const [countryRecommended, setCountry] = useState('');
  const [courseRecommended, setCourse] = useState('');
  const [intake, setIntake] = useState('');
  const [busy, setBusy] = useState(false);

  const rationaleValid = rationale.trim().length >= 20;
  const canSubmit = rationaleValid && !busy;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      await onCreate({
        type,
        text: rationale.trim(),
        countryRecommended: countryRecommended || null,
        courseRecommended: courseRecommended.trim() || null,
        intake: intake || null,
        authorId,
      });
      setRationale('');
      setCountry('');
      setCourse('');
      setIntake('');
      setType('note');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-sm border border-hairline bg-canvas p-md">
      <div className="flex flex-wrap items-center gap-xs border-b border-hairline pb-sm">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={cn(
              'rounded-none border-b-2 px-sm py-xxs text-body-sm transition-colors',
              type === t.id
                ? 'border-primary text-ink font-[600]'
                : 'border-transparent text-ink-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-sm md:grid-cols-3">
        <label className="flex flex-col gap-xxs">
          <span className="text-caption text-ink-muted">Country</span>
          <select
            className="h-9 w-full bg-surface-1 px-sm text-body-sm text-ink rounded-none border-0 border-b border-hairline"
            value={countryRecommended}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">— optional —</option>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <Input
          label="Course"
          value={courseRecommended}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="e.g. Bachelor of IT"
        />
        <label className="flex flex-col gap-xxs">
          <span className="text-caption text-ink-muted">Intake</span>
          <select
            className="h-9 w-full bg-surface-1 px-sm text-body-sm text-ink rounded-none border-0 border-b border-hairline"
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
          >
            <option value="">— optional —</option>
            {INTAKES.map((i) => <option key={i}>{i}</option>)}
          </select>
        </label>
      </div>

      <Textarea
        label="Rationale (required, min 20 characters)"
        value={rationale}
        onChange={(e) => setRationale(e.target.value)}
        placeholder="What was discussed, recommended, or decided? Why?"
        rows={3}
      />
      {rationale.length > 0 && !rationaleValid && (
        <p className="text-caption text-error">
          {20 - rationale.trim().length} more character{20 - rationale.trim().length === 1 ? '' : 's'} needed
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={!canSubmit}>Save note</Button>
      </div>
    </form>
  );
}
