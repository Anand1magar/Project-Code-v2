export default function Spinner({ size = 20 }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="inline-block animate-spin border-2 border-hairline border-t-primary rounded-full"
      style={{ width: size, height: size }}
    />
  );
}
