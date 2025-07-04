export default function Skeleton({ width = "w-full", height = "h-6", rounded = "rounded-md" }) {
  return (
    <div
      className={`bg-gray-300 animate-pulse ${width} ${height} ${rounded}`}
    />
  );
}
