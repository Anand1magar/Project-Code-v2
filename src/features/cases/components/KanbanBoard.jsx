import StageColumn from './StageColumn.jsx';

export default function KanbanBoard({ stages, cases, studentsById, onMove, focusStage, filterMode }) {
  // When filtering to refused cases, only show cases with visaOutcome === 'refused'
  const visibleCases = filterMode === 'refused'
    ? cases.filter((c) => c.visaOutcome === 'refused')
    : cases;

  // When a stage is focused, show only that column
  const visibleStages = focusStage
    ? stages.filter((s) => s.id === focusStage)
    : stages;

  const byStage = visibleStages.reduce((acc, s) => {
    acc[s.id] = visibleCases.filter((c) => c.stage === s.id);
    return acc;
  }, {});

  return (
    <div className="flex gap-md overflow-x-auto p-xl">
      {visibleStages.map((s) => (
        <StageColumn
          key={s.id}
          stage={s}
          cases={byStage[s.id] ?? []}
          studentsById={studentsById}
          onDropCase={onMove}
        />
      ))}
    </div>
  );
}
