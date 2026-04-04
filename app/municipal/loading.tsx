export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-56 bg-gray-200 rounded" />
      <div className="h-4 w-96 bg-gray-100 rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-36 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-50 rounded-lg" />
    </div>
  );
}
