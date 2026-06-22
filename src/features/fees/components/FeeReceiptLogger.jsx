import { useState } from 'react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';
import { formatDate } from '../../../lib/date.js';

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'eSewa', 'Khalti', 'Other'];

function nextReceiptNumber(fees) {
  const nums = fees
    .map((f) => { const m = f.receiptNumber?.match(/(\d+)$/); return m ? parseInt(m[1], 10) : 0; })
    .filter(Boolean);
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `VV-${new Date().getFullYear()}-${String(max + 1).padStart(3, '0')}`;
}

export default function FeeReceiptLogger({ fees, currentUserId, usersById = {}, onCreate, onVoid }) {
  const [open,       setOpen]       = useState(false);
  const [voidingFee, setVoidingFee] = useState(null);   // the full fee object being voided
  const [voidReason, setVoidReason] = useState('');
  const [voidBusy,   setVoidBusy]   = useState(false);
  const [form, setForm] = useState({
    amount: '',
    paymentMethod: 'Cash',
    paymentDate: new Date().toISOString().slice(0, 10),
    receiptNumber: '',
    notes: '',
  });
  const [busy, setBusy] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function openForm() {
    setForm((f) => ({ ...f, receiptNumber: nextReceiptNumber(fees) }));
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.receiptNumber) return;
    setBusy(true);
    try {
      await onCreate({ ...form, amount: Number(form.amount), createdBy: currentUserId });
      setForm({ amount: '', paymentMethod: 'Cash', paymentDate: new Date().toISOString().slice(0, 10), receiptNumber: '', notes: '' });
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  function openVoidModal(fee) {
    setVoidingFee(fee);
    setVoidReason('');
  }

  function closeVoidModal() {
    setVoidingFee(null);
    setVoidReason('');
  }

  async function handleVoidConfirm() {
    if (!voidReason.trim() || !voidingFee) return;
    setVoidBusy(true);
    try {
      await onVoid(voidingFee.id, voidReason.trim());
      closeVoidModal();
    } finally {
      setVoidBusy(false);
    }
  }

  const activeFees = fees.filter((f) => !f.voided);
  const voidedFees = fees.filter((f) => f.voided);
  const total      = activeFees.reduce((s, f) => s + Number(f.amount), 0);

  return (
    <div className="space-y-md">

      {/* ── Fee list ───────────────────────────────────────────────────────── */}
      {fees.length === 0 ? (
        <div className="border border-dashed border-hairline bg-canvas p-lg text-center text-body-sm text-ink-muted">
          Fee entries appear here once logged. Click &ldquo;Log fee&rdquo; on this case.
        </div>
      ) : (
        <div className="space-y-sm">
          <ul className="divide-y divide-hairline border border-hairline bg-canvas">
            {activeFees.map((f) => {
              const loggedBy = usersById[f.createdBy]?.name ?? 'Unknown';
              return (
                <li key={f.id} className="flex items-start justify-between gap-md p-md">
                  <div className="min-w-0">
                    <div className="text-body-emphasis text-ink">
                      NPR {Number(f.amount).toLocaleString()}
                    </div>
                    <div className="mt-xxs text-caption text-ink-muted">
                      {f.paymentMethod} · {formatDate(f.paymentDate)} · {f.receiptNumber}
                    </div>
                    <div className="mt-xxs text-caption text-ink-subtle">
                      Logged by {loggedBy}
                    </div>
                    {f.notes && (
                      <div className="mt-xxs text-body-sm text-ink-muted">{f.notes}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openVoidModal(f)}
                    className="shrink-0 text-caption text-ink-muted hover:text-error transition-colors"
                  >
                    Void
                  </button>
                </li>
              );
            })}
          </ul>

          {voidedFees.length > 0 && (
            <details className="text-body-sm text-ink-muted">
              <summary className="cursor-pointer hover:text-ink">
                {voidedFees.length} voided {voidedFees.length === 1 ? 'entry' : 'entries'}
              </summary>
              <ul className="mt-sm divide-y divide-hairline border border-hairline bg-surface-1">
                {voidedFees.map((f) => (
                  <li key={f.id} className="p-md opacity-50">
                    <div className="text-body-sm line-through text-ink-muted">
                      NPR {Number(f.amount).toLocaleString()} · {f.receiptNumber}
                    </div>
                    <div className="mt-xxs text-caption text-ink-muted">
                      Voided: {f.voidReason}
                    </div>
                    <div className="mt-xxs text-caption text-ink-subtle">
                      Logged by {usersById[f.createdBy]?.name ?? 'Unknown'}
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="flex justify-between border-t border-hairline pt-sm text-body-sm">
            <span className="text-ink-muted">Total collected</span>
            <span className="font-[600] text-ink">NPR {total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* ── Log fee form ───────────────────────────────────────────────────── */}
      {open ? (
        <form onSubmit={handleSubmit} className="space-y-md border border-hairline bg-canvas p-md">
          <div className="text-eyebrow text-ink-muted">Log fee</div>
          <div className="grid gap-md md:grid-cols-2">
            <Input
              label="Amount (NPR)"
              type="number"
              required
              min="1"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="e.g. 25000"
            />
            <Input
              label="Receipt number"
              required
              value={form.receiptNumber}
              onChange={(e) => set('receiptNumber', e.target.value)}
            />
          </div>
          <div className="grid gap-md md:grid-cols-2">
            <label className="flex flex-col gap-xxs">
              <span className="text-body-sm text-ink-muted">Payment method</span>
              <select
                className="h-10 rounded-none border-0 border-b border-hairline bg-surface-1 px-md text-body-sm text-ink"
                value={form.paymentMethod}
                onChange={(e) => set('paymentMethod', e.target.value)}
              >
                {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <Input
              type="date"
              label="Payment date"
              required
              value={form.paymentDate}
              onChange={(e) => set('paymentDate', e.target.value)}
            />
          </div>
          <Input
            label="Notes (optional)"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="e.g. Initial counselling fee"
          />
          <div className="flex justify-end gap-sm">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy || !form.amount || !form.receiptNumber}>
              Log fee
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="tertiary" onClick={openForm}>+ Log fee</Button>
      )}

      {/* ── Void confirmation modal ────────────────────────────────────────── */}
      <Modal
        open={!!voidingFee}
        onClose={closeVoidModal}
        title="Void fee entry"
        footer={
          <>
            <Button variant="ghost" onClick={closeVoidModal} disabled={voidBusy}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleVoidConfirm}
              disabled={voidBusy || !voidReason.trim()}
            >
              {voidBusy ? 'Voiding…' : 'Confirm void'}
            </Button>
          </>
        }
      >
        {voidingFee && (
          <div className="space-y-md">
            {/* Fee summary being voided */}
            <div className="border border-hairline bg-surface-1 px-md py-sm">
              <div className="text-body-emphasis text-ink">
                NPR {Number(voidingFee.amount).toLocaleString()}
              </div>
              <div className="mt-xxs text-caption text-ink-muted">
                {voidingFee.paymentMethod} · {formatDate(voidingFee.paymentDate)} · {voidingFee.receiptNumber}
              </div>
              <div className="mt-xxs text-caption text-ink-subtle">
                Logged by {usersById[voidingFee.createdBy]?.name ?? 'Unknown'}
              </div>
            </div>

            <p className="text-body-sm text-ink-muted">
              This entry cannot be deleted — it will be marked voided with your reason recorded permanently.
            </p>

            <Input
              label="Void reason"
              required
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              placeholder="e.g. Entered wrong amount, duplicate entry"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
