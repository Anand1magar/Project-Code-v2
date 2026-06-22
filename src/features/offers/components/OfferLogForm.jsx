import { useState } from 'react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { cn } from '../../../lib/cn.js';
import { formatDate } from '../../../lib/date.js';

const OFFER_TYPES = [
  { id: 'conditional',   label: 'Conditional' },
  { id: 'unconditional', label: 'Unconditional' },
];

const STATUS_LABELS = {
  pending:  { text: 'Pending acceptance', tone: 'text-ink-muted' },
  accepted: { text: 'Accepted',           tone: 'text-success' },
  expired:  { text: 'Expired',            tone: 'text-error' },
  declined: { text: 'Declined',           tone: 'text-ink-muted' },
};

export default function OfferLogForm({ offers, onCreate, onUpdateStatus }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ university: '', offerType: 'conditional', acceptanceDeadline: '', conditionalRequirements: '' });
  const [busy, setBusy] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.university.trim() || !form.acceptanceDeadline) return;
    setBusy(true);
    try {
      await onCreate({
        ...form,
        acceptanceDeadline: new Date(form.acceptanceDeadline).toISOString(),
      });
      setForm({ university: '', offerType: 'conditional', acceptanceDeadline: '', conditionalRequirements: '' });
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-md">
      {offers.length === 0 ? (
        <div className="border border-dashed border-hairline bg-canvas p-lg text-center text-body-sm text-ink-muted">
          Offer entries appear here once logged. Click "Log offer" to add one.
        </div>
      ) : (
        <ul className="divide-y divide-hairline border border-hairline bg-canvas">
          {offers.map((o) => {
            const status = STATUS_LABELS[o.status] ?? STATUS_LABELS.pending;
            const deadline = new Date(o.acceptanceDeadline);
            const isOverdue = deadline < new Date() && o.status === 'pending';
            return (
              <li key={o.id} className="p-md">
                <div className="flex items-start justify-between gap-md">
                  <div className="min-w-0">
                    <div className="text-body-emphasis text-ink">{o.university}</div>
                    <div className="mt-xxs flex flex-wrap gap-xs text-caption text-ink-muted">
                      <span className="capitalize">{o.offerType}</span>
                      <span>·</span>
                      <span className={isOverdue ? 'text-error' : ''}>
                        Deadline: {formatDate(o.acceptanceDeadline)}
                        {isOverdue && ' (Expired)'}
                      </span>
                    </div>
                    {o.conditionalRequirements && (
                      <div className="mt-xs text-body-sm text-ink-muted">
                        Conditions: {o.conditionalRequirements}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-xs shrink-0">
                    <span className={cn('text-body-sm font-[600]', status.tone)}>{status.text}</span>
                    {o.status === 'pending' && (
                      <div className="flex gap-xs">
                        <button
                          onClick={() => onUpdateStatus(o.id, 'accepted')}
                          className="text-caption text-primary hover:underline"
                        >
                          Mark accepted
                        </button>
                        <span className="text-caption text-ink-subtle">·</span>
                        <button
                          onClick={() => onUpdateStatus(o.id, 'declined')}
                          className="text-caption text-ink-muted hover:text-error"
                        >
                          Declined
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {open ? (
        <form onSubmit={handleSubmit} className="border border-hairline bg-canvas p-md space-y-md">
          <div className="text-eyebrow text-ink-muted">Log offer</div>
          <Input
            label="University name"
            required
            value={form.university}
            onChange={(e) => set('university', e.target.value)}
          />
          <div className="grid gap-md md:grid-cols-2">
            <div>
              <div className="mb-xs text-body-sm text-ink-muted">Offer type</div>
              <div className="flex gap-xs">
                {OFFER_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => set('offerType', t.id)}
                    className={cn(
                      'rounded-none border px-sm py-xxs text-body-sm transition-colors',
                      form.offerType === t.id
                        ? 'border-primary bg-primary text-white'
                        : 'border-hairline bg-canvas text-ink hover:border-primary',
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <Input
              type="date"
              label="Acceptance deadline"
              required
              value={form.acceptanceDeadline}
              onChange={(e) => set('acceptanceDeadline', e.target.value)}
            />
          </div>
          {form.offerType === 'conditional' && (
            <Input
              label="Conditions (optional)"
              value={form.conditionalRequirements}
              onChange={(e) => set('conditionalRequirements', e.target.value)}
              placeholder="e.g. IELTS 6.5 required before enrollment"
            />
          )}
          <div className="flex justify-end gap-sm">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>Log offer</Button>
          </div>
        </form>
      ) : (
        <Button variant="tertiary" onClick={() => setOpen(true)}>+ Log offer</Button>
      )}
    </div>
  );
}
