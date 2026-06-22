import { useState } from 'react';
import CaseCard from './CaseCard.jsx';
import { cn } from '../../../lib/cn.js';

export default function StageColumn({ stage, cases, studentsById, onDropCase }) {
  const [over, setOver] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!over) setOver(true);
  }
  function handleDragLeave() {
    setOver(false);
  }
  function handleDrop(e) {
    e.preventDefault();
    setOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id) onDropCase?.(id, stage.id);
  }

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex w-72 shrink-0 flex-col bg-surface-1 border border-hairline rounded-none',
        over && 'outline outline-2 outline-primary',
      )}
    >
      <header className="flex items-center justify-between border-b border-hairline px-md py-sm bg-canvas">
        <div>
          <div className="text-eyebrow text-ink-muted">{stage.label}</div>
          <div className="text-body-emphasis text-ink">{cases.length}</div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-sm overflow-y-auto p-sm">
        {cases.map((c) => (
          <CaseCard key={c.id} case={c} student={studentsById[c.studentId]} />
        ))}
        {cases.length === 0 && (
          <div className="rounded-none border border-dashed border-hairline p-md text-center text-caption text-ink-subtle">
            Drop a case here
          </div>
        )}
      </div>
    </section>
  );
}
