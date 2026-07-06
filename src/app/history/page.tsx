"use client"

import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
        <MessageSquare className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold">Chat History</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Your conversation history will appear here. Sign in to persist chats across sessions.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Start a new chat
      </Link>
    </div>
  )
}
