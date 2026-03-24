'use client'

import { useEffect } from 'react'
import ErrorPage from '@/app/components/error-page'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Documents route error:', error)
  }, [error])

  return <ErrorPage error={error} reset={reset} />
}
