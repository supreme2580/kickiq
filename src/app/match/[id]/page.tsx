"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bot } from "lucide-react"

export default function MatchPage() {
  const params = useParams()

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
        <Bot className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold">Match Details</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Ask KickIQ about match ID {params.id} in the chat for live data, odds, and analysis.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to chat
      </Link>
    </div>
  )
}
