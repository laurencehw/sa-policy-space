export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-20 bg-gray-100 rounded" />
      <div className="space-y-3">
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-24 bg-gray-100 rounded-full" />
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
        </div>
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-5/6 bg-gray-100 rounded" />
        <div className="h-4 w-4/6 bg-gray-100 rounded" />
      </div>
      <div className="h-px bg-gray-100" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-40 bg-gray-100 rounded-xl" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    </div>
  )
}
