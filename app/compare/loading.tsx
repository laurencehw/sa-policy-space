export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-64 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mt-2" />
      </div>
      <div className="card p-4 h-24 animate-pulse" />
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
    </div>
  );
}
