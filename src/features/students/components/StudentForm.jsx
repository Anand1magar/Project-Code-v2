import { useState } from 'react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { cn } from '../../../lib/cn.js';

const COUNTRIES = ['Australia', 'UK', 'USA', 'Canada', 'New Zealand', 'Other'];

const LEAD_SOURCES = [
  { id: 'walk-in',  label: 'Walk-in' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'referral', label: 'Referral' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'other',    label: 'Other' },
];

export default function StudentForm({ initial, onCancel, onSubmit, submitLabel = 'Add student', disabled = false }) {
  const [form, setForm] = useState(() => ({
    name: '',
    email: '',
    phone: '',
    targetCountry: 'Australia',
    leadSource: 'walk-in',
    ...initial,
  }));
  const [localBusy, setLocalBusy] = useState(false);
  const isBusy = disabled || localBusy;

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isBusy || !form.name.trim() || !form.phone.trim()) return;
    setLocalBusy(true);
    try {
      await onSubmit(form);
    } finally {
      setLocalBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
      <Input
        label="Full name"
        name="name"
        required
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
      />
      <div className="grid gap-md md:grid-cols-2">
        <Input
          label="Phone"
          name="phone"
          required
          value={form.phone}
          onChange={(e) => set('phone', e.target.value)}
          placeholder="98XXXXXXXX"
        />
        <Input
          label="Email (optional)"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
        />
      </div>

      <label className="flex flex-col gap-xxs">
        <span className="text-body-sm text-ink-muted">Target country</span>
        <select
          className="h-10 w-full bg-surface-1 px-md text-body text-ink rounded-none border-0 border-b border-hairline-strong"
          value={form.targetCountry}
          onChange={(e) => set('targetCountry', e.target.value)}
        >
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      <div>
        <div className="mb-xs text-body-sm text-ink-muted">How did they find us?</div>
        <div className="flex flex-wrap gap-xs">
          {LEAD_SOURCES.map((src) => (
            <button
              key={src.id}
              type="button"
              onClick={() => set('leadSource', src.id)}
              className={cn(
                'rounded-none border px-sm py-xxs text-body-sm transition-colors duration-fast',
                form.leadSource === src.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-hairline bg-canvas text-ink hover:border-primary hover:text-primary',
              )}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-sm pt-xs">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel} disabled={isBusy}>Cancel</Button>}
        <Button type="submit" disabled={isBusy || !form.name.trim() || !form.phone.trim()}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
