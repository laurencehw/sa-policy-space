export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-4 w-96 bg-gray-100 rounded" />
      </div>
      <div className="h-[600px] bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
        <div className="text-gray-300 text-sm">Loading dependency graph…</div>
      </div>
    </div>
  )
}
