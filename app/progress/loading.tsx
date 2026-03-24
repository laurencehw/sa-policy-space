export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-7 w-72 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-xl animate-pulse md:col-span-2" />
      </div>
    </div>
  );
}
