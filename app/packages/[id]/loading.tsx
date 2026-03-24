export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-20 bg-gray-100 rounded" />
      <div className="h-8 w-64 bg-gray-200 rounded" />
      <div className="h-4 w-96 bg-gray-100 rounded" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
