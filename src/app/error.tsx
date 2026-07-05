"use client"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
      <h1 className="text-6xl font-bold text-muted-foreground">!</h1>
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-2">
        <button onClick={reset} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
          Try Again
        </button>
        <a href="/dashboard" className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent/50 transition-colors">
          Dashboard
        </a>
      </div>
    </div>
  )
}
