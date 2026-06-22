import { useState } from 'react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { cn } from '../../../lib/cn.js';
import { formatDate } from '../../../lib/date.js';

const REFUSAL_CATEGORIES = [
  'Financial Documents',
  'English Proficiency',
  'Purpose of Study',
  'Genuineness',
  'Sponsor Issues',
  'Other',
];

const VISA_STATUSES = ['Lodged', 'Under Review', 'Decision Pending', 'Decided'];

export default function LodgementForm({ lodgement, caseData, onLodge, onDecision, onUpdateVisaStatus }) {
  const [lodgeOpen, setLodgeOpen] = useState(false);
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [lodgeForm, setLodgeForm] = useState({
    submissionDate: new Date().toISOString().slice(0, 10),
    embassyRefNumber: '',
    appointmentDate: '',
  });

  const [outcome, setOutcome] = useState('');
  const [refusalCategory, setRefusalCategory] = useState(REFUSAL_CATEGORIES[0]);
  const [refusalDetail, setRefusalDetail] = useState('');

  function setL(k, v) { setLodgeForm((f) => ({ ...f, [k]: v })); }

  async function handleLodge(e) {
    e.preventDefault();
    if (!lodgeForm.embassyRefNumber.trim()) return;
    setBusy(true);
    try {
      await onLodge({
        ...lodgeForm,
        submissionDate: new Date(lodgeForm.submissionDate).toISOString(),
        appointmentDate: lodgeForm.appointmentDate
          ? new Date(lodgeForm.appointmentDate).toISOString()
          : null,
      });
      setLodgeOpen(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleDecision(e) {
    e.preventDefault();
    if (!outcome) return;
    if (outcome === 'refused' && refusalDetail.trim().length < 20) return;
    setBusy(true);
    try {
      await onDecision({ outcome, refusalCategory: outcome === 'refused' ? refusalCategory : null, refusalDetail: outcome === 'refused' ? refusalDetail : null });
      setDecisionOpen(false);
      setOutcome('');
      setRefusalDetail('');
    } finally {
      setBusy(false);
    }
  }

  const alreadyDecided = !!caseData?.visaOutcome;

  return (
    <div className="space-y-lg">
      {/* Lodgement info */}
      <div>
        <div className="mb-sm text-eyebrow text-ink-muted">Embassy lodgement</div>
        {lodgement ? (
          <div className="border border-hairline bg-canvas p-md space-y-xs">
            <div className="flex items-center justify-between gap-md">
              <div>
                <div className="text-body-emphasis text-ink">{lodgement.embassyRefNumber}</div>
                <div className="mt-xxs text-body-sm text-ink-muted">
                  Submitted {formatDate(lodgement.submissionDate)}
                </div>
              </div>
              {lodgement.appointmentDate && (
                <div className="text-right">
                  <div className="text-caption text-ink-muted">Appointment</div>
                  <div className="text-body-sm text-ink">{formatDate(lodgement.appointmentDate)}</div>
                </div>
              )}
            </div>
            {caseData?.visaStatus && (
              <div className="flex items-center gap-sm border-t border-hairline pt-sm">
                <span className="text-caption text-ink-muted">Visa status:</span>
                <select
                  className="h-8 bg-surface-1 px-sm text-body-sm text-ink rounded-none border-0 border-b border-hairline"
                  value={caseData.visaStatus ?? ''}
                  onChange={(e) => onUpdateVisaStatus(e.target.value)}
                  disabled={alreadyDecided}
                >
                  {VISA_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
        ) : lodgeOpen ? (
          <form onSubmit={handleLodge} className="border border-hairline bg-canvas p-md space-y-md">
            <div className="grid gap-md md:grid-cols-2">
              <Input
                type="date"
                label="Submission date"
                required
                value={lodgeForm.submissionDate}
                onChange={(e) => setL('submissionDate', e.target.value)}
              />
              <Input
                label="Embassy reference number"
                required
                value={lodgeForm.embassyRefNumber}
                onChange={(e) => setL('embassyRefNumber', e.target.value)}
                placeholder="e.g. UKVI-LON-2026-09812"
              />
            </div>
            <Input
              type="date"
              label="Visa appointment date (optional)"
              value={lodgeForm.appointmentDate}
              onChange={(e) => setL('appointmentDate', e.target.value)}
            />
            <div className="flex justify-end gap-sm">
              <Button type="button" variant="ghost" onClick={() => setLodgeOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={busy || !lodgeForm.embassyRefNumber.trim()}>Log lodgement</Button>
            </div>
          </form>
        ) : (
          <Button variant="tertiary" onClick={() => setLodgeOpen(true)}>+ Log lodgement</Button>
        )}
      </div>

      {/* Visa decision */}
      <div>
        <div className="mb-sm text-eyebrow text-ink-muted">Visa decision</div>
        {alreadyDecided ? (
          <div className={cn(
            'border p-md',
            caseData.visaOutcome === 'granted' ? 'border-success bg-canvas' : 'border-error bg-canvas',
          )}>
            <div className={cn(
              'text-body-emphasis',
              caseData.visaOutcome === 'granted' ? 'text-success' : 'text-error',
            )}>
              Visa {caseData.visaOutcome === 'granted' ? 'Granted' : 'Refused'}
            </div>
            {caseData.visaOutcome === 'refused' && (
              <div className="mt-xs space-y-xxs text-body-sm text-ink-muted">
                <div><span className="text-ink">Category:</span> {caseData.refusalCategory}</div>
                <div><span className="text-ink">Detail:</span> {caseData.refusalDetail}</div>
              </div>
            )}
          </div>
        ) : lodgement && !decisionOpen ? (
          <Button variant="tertiary" onClick={() => setDecisionOpen(true)}>+ Log visa decision</Button>
        ) : lodgement && decisionOpen ? (
          <form onSubmit={handleDecision} className="border border-hairline bg-canvas p-md space-y-md">
            <div>
              <div className="mb-xs text-body-sm text-ink-muted">Outcome</div>
              <div className="flex gap-xs">
                {['granted', 'refused'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOutcome(o)}
                    className={cn(
                      'rounded-none border px-md py-xs text-body-sm capitalize transition-colors',
                      outcome === o
                        ? o === 'granted'
                          ? 'border-success bg-success text-white'
                          : 'border-error bg-error text-white'
                        : 'border-hairline bg-canvas text-ink hover:border-ink',
                    )}
                  >
                    {o === 'granted' ? 'Granted' : 'Refused'}
                  </button>
                ))}
              </div>
            </div>
            {outcome === 'refused' && (
              <>
                <label className="flex flex-col gap-xxs">
                  <span className="text-body-sm text-ink-muted">Refusal category</span>
                  <select
                    className="h-10 bg-surface-1 px-md text-body-sm text-ink rounded-none border-0 border-b border-hairline"
                    value={refusalCategory}
                    onChange={(e) => setRefusalCategory(e.target.value)}
                  >
                    {REFUSAL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <div>
                  <label className="flex flex-col gap-xxs">
                    <span className="text-body-sm text-ink-muted">Refusal detail (min 20 characters)</span>
                    <textarea
                      className="w-full rounded-none border border-hairline bg-surface-1 p-sm text-body-sm text-ink placeholder:text-ink-subtle resize-none"
                      rows={3}
                      value={refusalDetail}
                      onChange={(e) => setRefusalDetail(e.target.value)}
                      placeholder="Describe the specific reason for refusal…"
                    />
                  </label>
                  {refusalDetail.length > 0 && refusalDetail.trim().length < 20 && (
                    <p className="mt-xxs text-caption text-error">
                      {20 - refusalDetail.trim().length} more characters needed
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="flex justify-end gap-sm">
              <Button type="button" variant="ghost" onClick={() => setDecisionOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                disabled={busy || !outcome || (outcome === 'refused' && refusalDetail.trim().length < 20)}
              >
                Log decision
              </Button>
            </div>
          </form>
        ) : !lodgement ? (
          <p className="text-body-sm text-ink-muted">Log lodgement first to record a visa decision.</p>
        ) : null}
      </div>
    </div>
  );
}
