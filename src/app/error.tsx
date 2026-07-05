"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try Again</Button>
        <Link href="/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
