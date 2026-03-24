export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-7 w-52 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mt-2" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-7 w-24 bg-gray-100 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl h-[480px] animate-pulse" />
    </div>
  );
}
