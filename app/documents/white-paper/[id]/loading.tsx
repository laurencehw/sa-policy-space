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
      {/* Document skeleton */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Cover page */}
        <div className="p-10 border-b-4 border-gray-200 text-center space-y-4">
          <div className="w-16 h-20 bg-gray-200 rounded-t-full mx-auto" />
          <div className="h-6 w-24 bg-gray-200 rounded-full mx-auto" />
          <div className="h-8 w-2/3 bg-gray-300 rounded mx-auto" />
          <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto" />
          <div className="h-8 w-40 bg-gray-200 rounded-lg mx-auto" />
          <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-5 w-10 bg-gray-300 rounded mx-auto" />
                <div className="h-3 w-14 bg-gray-100 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
        {/* Body */}
        <div className="p-10 space-y-8">
          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="space-y-3">
              <div className="h-5 w-1/3 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-5/6 bg-gray-100 rounded" />
              <div className="h-4 w-4/5 bg-gray-100 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-3/4 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
