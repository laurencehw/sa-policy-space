export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl border border-gray-200" />
        ))}
      </div>
    </div>
  )
}
