"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, Search, MessageSquare, Settings, LogOut, Menu, Trophy, Trash2, PanelLeftClose, PanelLeft } from "lucide-react"
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = CHAT_HISTORY.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groups = [
    { label: "Today", items: filteredHistory.filter((c) => c.date === "Today") },
    { label: "Yesterday", items: filteredHistory.filter((c) => c.date === "Yesterday") },
    { label: "Older", items: filteredHistory.filter((c) => c.date !== "Today" && c.date !== "Yesterday") },
  ]

  // Full sidebar content (used in both expanded desktop and mobile sheet)
  const fullSidebar = (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-3">
        <Link
          href="/"
          onClick={() => { setSidebarOpen(false); setMobileOpen(false) }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Plus className="h-4 w-4 shrink-0" />
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
                    onClick={() => { setSidebarOpen(false); setMobileOpen(false) }}
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
          onClick={() => { setSidebarOpen(false); setMobileOpen(false) }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Trophy className="h-4 w-4 shrink-0" />
          <span>Premium</span>
        </Link>
        <Link
          href="/about"
          onClick={() => { setSidebarOpen(false); setMobileOpen(false) }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>About KickIQ</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )

  const iconOnly = (
    <div className="flex flex-col h-full items-center py-3 px-2 space-y-3">
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
      <div className="flex-1 flex flex-col items-center gap-1">
        {CHAT_HISTORY.slice(0, 3).map((chat) => (
          <button
            key={chat.id}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 pt-3 border-t border-border w-full">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop: collapsed sidebar (icons only) */}
      <aside className="hidden md:flex flex-col border-r border-border bg-sidebar shrink-0 w-14">
        {iconOnly}
      </aside>

      {/* Desktop: expanded overlay sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="hidden md:block fixed inset-0 z-40 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-64 flex-col border-r border-border bg-sidebar shadow-xl animate-in">
            <div className="flex items-center justify-end p-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            {fullSidebar}
          </aside>
        </>
      )}

      {/* Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-12 border-b border-border bg-background px-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <div className="flex items-center justify-end p-2 border-b border-border">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            {fullSidebar}
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
