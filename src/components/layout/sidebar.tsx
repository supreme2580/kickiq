"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Search, MessageSquare, Settings, LogOut, Menu, Trophy, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const CHAT_HISTORY = [
  { id: "1", title: "Brazil vs Argentina prediction", date: "Today" },
  { id: "2", title: "World Cup knockout stage analysis", date: "Yesterday" },
  { id: "3", title: "Compare Mbappé and Messi", date: "Yesterday" },
  { id: "4", title: "Group A standings", date: "3 days ago" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = CHAT_HISTORY.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groups = [
    { label: "Today", items: filteredHistory.filter((c) => c.date === "Today") },
    { label: "Yesterday", items: filteredHistory.filter((c) => c.date === "Yesterday") },
    { label: "Older", items: filteredHistory.filter((c) => c.date !== "Today" && c.date !== "Yesterday") },
  ]

  const nav = (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-3">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New chat</span>
        </Link>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full h-9 rounded-lg border border-border bg-transparent pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/40 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-4">
        {groups.map((group) =>
          group.items.length > 0 ? (
            <div key={group.label}>
              <p className="px-2 text-xs text-muted-foreground font-medium mb-1">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors group"
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate text-left flex-1">{chat.title}</span>
                    <Trash2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>

      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/premium"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Trophy className="h-4 w-4" />
          <span>Premium</span>
        </Link>
        <Link
          href="/about"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>About KickIQ</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar shrink-0">
        {nav}
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-12 border-b border-border bg-background px-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            {nav}
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 ml-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
            <Trophy className="h-3 w-3 text-background" />
          </div>
          <span className="font-semibold text-sm">KickIQ</span>
        </Link>
      </div>

      <div className="md:hidden h-12" />
    </>
  )
}
