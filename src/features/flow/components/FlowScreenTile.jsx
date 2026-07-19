export default function FlowScreenTile({ label, image }) {
  return (
    <div className="flex flex-col gap-xs">
      <div className="text-caption text-ink-muted">{label}</div>
      <div className="w-[320px] h-[200px] overflow-hidden border border-hairline bg-canvas rounded-none">
        <img
          src={image}
          alt={label}
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
