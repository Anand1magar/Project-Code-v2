export default function FlowScreenTile({ label, path }) {
  return (
    <div className="flex flex-col gap-xs">
      <div className="text-caption text-ink-muted">{label}</div>
      <div className="relative w-[320px] h-[200px] overflow-hidden border border-hairline bg-canvas rounded-none">
        <iframe
          src={path}
          title={label}
          tabIndex={-1}
          className="absolute left-0 top-0 w-[1280px] h-[800px] origin-top-left scale-[0.25] border-0"
        />
        {/* Click-blocking overlay — tiles are display-only */}
        <div className="absolute inset-0" aria-hidden="true" />
      </div>
    </div>
  );
}
