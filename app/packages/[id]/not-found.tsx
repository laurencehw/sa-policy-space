import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div
          className="h-1 w-24 mx-auto mb-8 rounded-full"
          style={{ background: 'linear-gradient(to right, #007A4D, #FFB612)' }}
        />

        <div className="text-6xl font-bold mb-4" style={{ color: '#007A4D' }}>404</div>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">
          Reform package not found
        </h1>
        <p className="text-gray-600 mb-8">
          This reform package doesn&apos;t exist or may have been removed from the database.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/packages"
            className="btn-primary inline-block"
          >
            Browse all packages
          </Link>
          <Link
            href="/"
            className="btn-secondary inline-block"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
