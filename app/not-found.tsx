import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div
          className="h-1 w-24 mx-auto mb-8 rounded-full"
          style={{ background: 'linear-gradient(to right, #007A4D, #FFB612)' }}
        />

        <div className="text-6xl font-bold text-[#007A4D] mb-4">404</div>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link href="/" className="btn-primary inline-block">
          Go home
        </Link>
      </div>
    </div>
  )
}
