export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse max-w-3xl">
      {/* Toolbar skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="flex gap-3">
          <div className="h-8 w-28 bg-gray-100 rounded-lg" />
          <div className="h-8 w-28 bg-gray-100 rounded-lg" />
          <div className="h-8 w-36 bg-gray-200 rounded-lg" />
        </div>
      </div>
      {/* Bill document skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Gazette header */}
        <div className="p-6 border-b-2 border-gray-200 space-y-4" style={{ backgroundColor: "#fff8f8" }}>
          <div className="flex justify-between">
            <div className="space-y-1">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-100 rounded" />
            </div>
            <div className="space-y-1 text-center">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
              <div className="h-3 w-24 bg-gray-100 rounded ml-auto" />
            </div>
          </div>
          <div className="h-px bg-red-200" />
          <div className="h-6 w-32 bg-red-100 rounded mx-auto" />
          <div className="w-14 h-16 bg-gray-200 rounded-t-full mx-auto" />
          <div className="h-8 w-24 bg-red-200 rounded mx-auto" />
          <div className="h-6 w-3/4 bg-gray-300 rounded mx-auto" />
        </div>
        {/* Bill body */}
        <div className="p-10 space-y-8">
          {/* Long title */}
          <div className="text-center space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-5/6 bg-gray-100 rounded mx-auto" />
          </div>
          {/* Sections */}
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="space-y-3">
              <div className="h-5 w-1/4 bg-gray-200 rounded" />
              <div className="space-y-2 ml-8">
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 rounded" />
                <div className="h-4 w-4/5 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
