'use client'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div
          className="h-1 w-24 mx-auto mb-8 rounded-full"
          style={{ background: 'linear-gradient(to right, #007A4D, #FFB612)' }}
        />

        <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-[#007A4D]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-8">
          An unexpected error occurred. You can try again or return to the home page.
        </p>

        {error.digest && (
          <p className="text-xs text-gray-400 font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-secondary">
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
