import { useRef, useState } from 'react';
import {
  AlertCircle, Check, CheckCircle2, ChevronDown, ChevronUp,
  Clock, Copy, Download, Eye, FileQuestion, FileText,
  History, Upload, XCircle,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge.jsx';
import Button from '../../../components/ui/Button.jsx';
import { cn } from '../../../lib/cn.js';
import { formatDate } from '../../../lib/date.js';
import FilePreviewModal from './FilePreviewModal.jsx';

// ─── Status catalogue ────────────────────────────────────────────────────────

const STATUSES = [
  { id: 'pending',  label: 'Pending',  tone: 'warning'  },
  { id: 'received', label: 'Received', tone: 'info'     },
  { id: 'verified', label: 'Verified', tone: 'success'  },
  { id: 'rejected', label: 'Rejected', tone: 'error'    },
];
const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.id, s]));

// Dot colour per status (left edge indicator)
const DOT_CLASS = {
  pending:  'bg-warning',
  received: 'bg-primary',
  verified: 'bg-success',
  rejected: 'bg-error',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(n) {
  if (!n) return '';
  if (n < 1024)              return `${n} B`;
  if (n < 1024 * 1024)       return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

// ─── UploadZone (drag-and-drop + click) ──────────────────────────────────────

function UploadZone({ onFile, busy }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  function trigger() { inputRef.current?.click(); }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = '';
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload file"
      className={cn(
        'flex flex-col items-center justify-center gap-xs border border-dashed py-lg transition-colors cursor-pointer select-none',
        dragging
          ? 'border-primary bg-surface-1 text-primary'
          : 'border-hairline-strong bg-canvas text-ink-muted hover:bg-surface-1 hover:text-ink',
        busy && 'pointer-events-none opacity-50',
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={trigger}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') trigger(); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.docx"
        className="hidden"
        disabled={busy}
        onChange={handleChange}
      />
      <Upload size={22} strokeWidth={1.5} />
      <span className="text-body-sm font-[500]">
        {dragging ? 'Drop to upload' : 'Drag & drop or click to browse'}
      </span>
      <span className="text-caption text-ink-subtle">PDF · JPG · PNG · DOCX · max 10 MB</span>
    </div>
  );
}

// ─── FileCard ─────────────────────────────────────────────────────────────────

function FileCard({ doc, onPreview, isLatest, versionNumber }) {
  return (
    <div className="flex items-start justify-between gap-md bg-canvas border border-hairline p-md">
      <div className="flex items-start gap-sm min-w-0">
        <FileText size={20} strokeWidth={1.5} className="shrink-0 text-primary mt-[2px]" />
        <div className="min-w-0">
          <div className="text-body-sm text-ink font-[600] truncate">{doc.fileName}</div>
          <div className="mt-xxs text-caption text-ink-muted">
            {formatBytes(doc.fileSize)}
            {doc.uploadedAt && ` · ${formatDate(doc.uploadedAt)}`}
          </div>
          {isLatest && versionNumber > 1 && (
            <Badge tone="success" className="mt-xxs">
              Latest · v{versionNumber}
            </Badge>
          )}
        </div>
      </div>
      {doc.fileData && (
        <Button size="sm" variant="tertiary" onClick={() => onPreview(doc)}>
          <Eye size={13} strokeWidth={1.5} /> Preview
        </Button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * @param {{
 *   docs: object[],
 *   checklist: {id: string, label: string}[],
 *   currentUserId: string,
 *   studentName: string,
 *   onUpload: (docId: string, file: File) => Promise<void>,
 *   onStatusChange: (docId: string, status: string, reason?: string) => Promise<void>,
 *   onReminder: (missing: {id:string,label:string}[]) => Promise<void>,
 * }} props
 */
export default function DocumentChecklist({
  docs,
  checklist,
  currentUserId,
  studentName,
  onUpload,
  onStatusChange,
  onReminder,
}) {
  const [expanded,       setExpanded]       = useState(null);
  const [showUpload,     setShowUpload]      = useState({});   // docId → bool (replace-version toggle)
  const [showVersions,   setShowVersions]   = useState({});   // docId → bool
  const [rejectNote,     setRejectNote]     = useState('');
  const [previewDoc,     setPreviewDoc]     = useState(null);
  const [reminderCopied, setReminderCopied] = useState(false);
  const [uploadError,    setUploadError]    = useState('');
  const [busy,           setBusy]           = useState(false);

  // ── derive ordered list ──────────────────────────────────────────────────
  const byType  = Object.fromEntries(docs.map((d) => [d.type, d]));
  const ordered = checklist.map((item) => byType[item.id]).filter(Boolean);
  const extras  = docs.filter((d) => !checklist.some((c) => c.id === d.type));
  const allDocs = [...ordered, ...extras];

  // Docs that still need action
  const missing = checklist.filter((item) => {
    const d = byType[item.id];
    return !d || ['pending', 'rejected'].includes(d.status);
  });

  // ── expand / collapse ────────────────────────────────────────────────────
  function toggle(docId) {
    if (expanded === docId) {
      setExpanded(null);
    } else {
      setExpanded(docId);
      setRejectNote('');
      setUploadError('');
    }
  }

  // ── reminder ─────────────────────────────────────────────────────────────
  function buildReminderText() {
    const name = studentName || 'there';
    const list = missing.map((m, i) => `${i + 1}. ${m.label}`).join('\n');
    return (
      `Hi ${name},\n\n` +
      `We still need the following documents from you:\n${list}\n\n` +
      `Please send these as soon as possible.\n\n` +
      `Thank you,\nVisa Vista Team`
    );
  }

  async function handleSendReminder() {
    try {
      await navigator.clipboard.writeText(buildReminderText());
      setReminderCopied(true);
      setTimeout(() => setReminderCopied(false), 2500);
    } catch { /* clipboard may not be available in all contexts */ }
    await onReminder?.(missing);
  }

  // ── file upload ──────────────────────────────────────────────────────────
  async function handleFile(docId, file) {
    setUploadError('');
    setBusy(true);
    try {
      await onUpload?.(docId, file);
      setShowUpload((p) => ({ ...p, [docId]: false }));
      setExpanded(null);
    } catch (err) {
      setUploadError(err.message ?? 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  // ── status change ────────────────────────────────────────────────────────
  async function handleStatusChange(docId, status) {
    setBusy(true);
    try { await onStatusChange?.(docId, status); }
    finally { setBusy(false); }
  }

  // ── reject with reason ───────────────────────────────────────────────────
  async function handleReject(docId) {
    if (!rejectNote.trim()) return;
    setBusy(true);
    try {
      await onStatusChange?.(docId, 'rejected', rejectNote.trim());
      setRejectNote('');
      setExpanded(null);
    } finally {
      setBusy(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-md">

      {/* ── Missing docs panel ────────────────────────────────────────────── */}
      {missing.length > 0 ? (
        <div className="border border-hairline bg-canvas p-md">
          <div className="flex items-start justify-between gap-md">
            <div className="flex items-start gap-sm">
              <AlertCircle size={18} strokeWidth={1.5} className="mt-[2px] shrink-0 text-warning" />
              <div>
                <div className="text-body-emphasis text-ink">
                  {missing.length} item{missing.length === 1 ? '' : 's'} still needed
                </div>
                <div className="mt-xxs flex flex-wrap gap-xs">
                  {missing.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="text-caption text-ink-muted underline hover:text-ink"
                      onClick={() => toggle(byType[m.id]?.id ?? m.id)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button size="sm" variant="tertiary" onClick={handleSendReminder} disabled={busy}>
              {reminderCopied
                ? <><Check size={14} strokeWidth={1.5} /> Copied!</>
                : <><Copy size={14} strokeWidth={1.5} /> Copy reminder</>
              }
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-sm border border-success bg-canvas p-md">
          <CheckCircle2 size={16} strokeWidth={1.5} className="text-success" />
          <span className="text-body-sm text-success">All documents collected</span>
        </div>
      )}

      {/* ── Checklist rows ────────────────────────────────────────────────── */}
      <ul className="divide-y divide-hairline border border-hairline bg-canvas">
        {allDocs.map((d) => {
          const meta          = checklist.find((c) => c.id === d.type);
          const label         = meta?.label ?? d.type;
          const status        = STATUS_MAP[d.status] ?? STATUS_MAP.pending;
          const isOpen        = expanded === d.id;
          const hasFile       = !!d.fileData;
          const showingUpload = !!showUpload[d.id];
          const showingVers   = !!showVersions[d.id];
          const versionCount  = d.versions?.length ?? 0;
          const versionNumber = versionCount + 1;

          return (
            <li key={d.id}>

              {/* ── Row header (click to expand) ──────────────────────────── */}
              <button
                type="button"
                className="flex w-full items-center justify-between gap-md px-md py-sm text-left hover:bg-surface-1 transition-colors duration-fast"
                onClick={() => toggle(d.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-sm min-w-0">
                  <span
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-none',
                      DOT_CLASS[d.status] ?? 'bg-surface-2',
                    )}
                  />
                  <div className="min-w-0">
                    <span className="text-body-sm text-ink">{label}</span>
                    {hasFile && !isOpen && (
                      <div className="text-caption text-ink-subtle truncate">
                        {d.fileName}{versionCount > 0 && ` · v${versionNumber}`}
                      </div>
                    )}
                    {d.status === 'rejected' && d.rejectionReason && !isOpen && (
                      <div className="text-caption text-error truncate">{d.rejectionReason}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-xs shrink-0">
                  <Badge tone={status.tone}>{status.label}</Badge>
                  {isOpen
                    ? <ChevronUp   size={14} strokeWidth={1.5} className="text-ink-subtle" />
                    : <ChevronDown size={14} strokeWidth={1.5} className="text-ink-subtle" />
                  }
                </div>
              </button>

              {/* ── Expanded panel ────────────────────────────────────────── */}
              {isOpen && (
                <div className="space-y-md border-t border-hairline bg-surface-1 px-md py-md">

                  {/* Rejection reason banner */}
                  {d.status === 'rejected' && d.rejectionReason && (
                    <div className="flex items-start gap-xs border border-error bg-canvas px-md py-sm">
                      <XCircle size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-error" />
                      <div>
                        <div className="text-caption font-[600] text-error">Rejected</div>
                        <div className="text-caption text-ink-muted">{d.rejectionReason}</div>
                      </div>
                    </div>
                  )}

                  {/* Current file card */}
                  {hasFile && (
                    <div className="space-y-xs">
                      <FileCard
                        doc={d}
                        onPreview={setPreviewDoc}
                        isLatest
                        versionNumber={versionNumber}
                      />
                      {!showingUpload && (
                        <button
                          type="button"
                          className="text-caption text-ink-muted underline hover:text-ink"
                          onClick={() => setShowUpload((p) => ({ ...p, [d.id]: true }))}
                        >
                          Upload new version
                        </button>
                      )}
                    </div>
                  )}

                  {/* Upload zone */}
                  {(!hasFile || showingUpload) && (
                    <div className="space-y-xs">
                      {showingUpload && (
                        <div className="text-caption text-ink-muted">
                          Uploading a new version will keep the current file in version history.
                        </div>
                      )}
                      <UploadZone
                        busy={busy}
                        onFile={(file) => handleFile(d.id, file)}
                      />
                      {uploadError && (
                        <p className="text-caption text-error">{uploadError}</p>
                      )}
                      {showingUpload && (
                        <button
                          type="button"
                          className="text-caption text-ink-muted underline hover:text-ink"
                          onClick={() => {
                            setShowUpload((p) => ({ ...p, [d.id]: false }));
                            setUploadError('');
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}

                  {/* ── Status controls ───────────────────────────────────── */}
                  <div className="space-y-xs">

                    {/* Verify + reject (only when Received) */}
                    {d.status === 'received' && (
                      <>
                        <div className="flex flex-wrap items-center gap-xs">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(d.id, 'verified')}
                            disabled={busy}
                          >
                            <CheckCircle2 size={13} strokeWidth={1.5} /> Mark verified
                          </Button>
                          <span className="text-caption text-ink-subtle">or reject below</span>
                        </div>

                        <div className="flex gap-xs">
                          <input
                            className="h-9 flex-1 rounded-none border border-hairline bg-canvas px-sm text-body-sm text-ink placeholder:text-ink-subtle"
                            placeholder="Rejection reason (required)"
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(d.id)}
                            disabled={busy || !rejectNote.trim()}
                          >
                            Reject
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Manual status dropdown — always visible */}
                    <div className="flex items-center gap-xs pt-xs">
                      <span className="text-caption text-ink-muted whitespace-nowrap">Set status:</span>
                      <select
                        className="h-9 flex-1 rounded-none border border-hairline bg-canvas px-sm text-body-sm text-ink"
                        value={d.status}
                        disabled={busy}
                        onChange={(e) => handleStatusChange(d.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ── Version history ───────────────────────────────────── */}
                  {versionCount > 0 && (
                    <div>
                      <button
                        type="button"
                        className="flex items-center gap-xs text-caption text-ink-muted hover:text-ink transition-colors"
                        onClick={() =>
                          setShowVersions((p) => ({ ...p, [d.id]: !showingVers }))
                        }
                      >
                        <History size={13} strokeWidth={1.5} />
                        {showingVers ? 'Hide' : 'Show'} version history
                        ({versionCount} previous {versionCount === 1 ? 'version' : 'versions'})
                      </button>

                      {showingVers && (
                        <ul className="mt-xs divide-y divide-hairline border border-hairline bg-canvas">
                          {d.versions.map((v, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between gap-md px-md py-sm"
                            >
                              <div className="min-w-0">
                                <div className="text-caption text-ink truncate">{v.fileName}</div>
                                <div className="text-caption text-ink-subtle">
                                  {formatBytes(v.fileSize)}
                                  {v.uploadedAt && ` · ${formatDate(v.uploadedAt)}`}
                                </div>
                              </div>
                              {v.fileData && (
                                <button
                                  type="button"
                                  className="shrink-0 text-caption text-primary underline hover:no-underline"
                                  onClick={() =>
                                    setPreviewDoc({
                                      fileName: v.fileName,
                                      fileData: v.fileData,
                                      fileType: v.fileType,
                                    })
                                  }
                                >
                                  View
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* ── File preview modal ────────────────────────────────────────────── */}
      <FilePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
}
