"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, MessageSquare, Settings, Trash2, PanelLeft, PanelLeftClose, Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WorldCupIcon } from "@/components/icons/world-cup"
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react"

interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export function Sidebar() {
  const router = useRouter()
  const { isConnected, address } = useAppKitAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isConnected || !address) {
      setConversations([])
      return
    }

    setLoading(true)

    function fetchConversations() {
      return fetch("/api/conversations", { headers: { "x-wallet-address": address ?? "" } })
        .then((r) => r.json())
        .then((data) => {
          setConversations(Array.isArray(data) ? data : [])
        })
        .catch(() => {})
    }

    fetchConversations().finally(() => setLoading(false))
    const interval = setInterval(fetchConversations, 5000)
    return () => clearInterval(interval)
  }, [isConnected, address])

  const filteredHistory = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function groupLabel(date: string) {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString()
  }

  const sorted = [...filteredHistory].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  const groups = [
    { label: "Today", items: sorted.filter((c) => groupLabel(c.updatedAt) === "Today") },
    { label: "Yesterday", items: sorted.filter((c) => groupLabel(c.updatedAt) === "Yesterday") },
    {
      label: "Previous 7 days",
      items: sorted.filter(
        (c) => groupLabel(c.updatedAt) !== "Today" && groupLabel(c.updatedAt) !== "Yesterday"
      ),
    },
  ]

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (address) headers["x-wallet-address"] = address
    await fetch("/api/conversations", {
      method: "DELETE",
      headers,
      body: JSON.stringify({ id }),
    })
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }

  function closeSidebar() {
    setSidebarOpen(false)
    setMobileOpen(false)
  }

  const fullSidebar = (
    <div className="flex flex-col h-full overflow-hidden">
        <div className="p-2 space-y-2">
        <Link
          href="/"
          onClick={closeSidebar}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>New chat</span>
        </Link>
        {isConnected && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full h-8 rounded-lg border border-border bg-transparent pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/40 transition-colors"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-4">
        {!isConnected ? (
          <div className="px-2 py-8 text-center">
            <p className="text-xs text-muted-foreground">Sign in to save your chat history</p>
          </div>
        ) : loading ? (
          <div className="px-2 py-8 text-center">
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        ) : (
          groups.map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.label}>
                  <p className="px-2 text-xs text-muted-foreground font-medium mb-1">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.slice(0, 20).map((chat) => (
                      <Link
                        key={chat.id}
                        href={`/?c=${chat.id}`}
                        onClick={closeSidebar}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors group cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate text-left flex-1 min-w-0">{chat.title}</span>
                        <button
                          onClick={(e) => handleDelete(e, chat.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              )
          )
        )}
      </div>

      <div className="p-2 border-t border-border space-y-0.5">
        <Link
          href="/premium"
          onClick={closeSidebar}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Premium</span>
        </Link>
        <Link
          href="/about"
          onClick={closeSidebar}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>About KickIQ</span>
        </Link>
         {isConnected ? (
            <button
              onClick={async () => {
                await disconnect()
                router.push("/")
              }}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={() => open()}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign in</span>
            </button>
        )}
      </div>

      <div className="p-2 border-t border-border">
        <button
          onClick={() => setSidebarOpen(false)}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <PanelLeftClose className="h-4 w-4 shrink-0" />
          <span>Close sidebar</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden md:flex flex-col border-r border-border bg-sidebar shrink-0 w-14 z-30 overflow-hidden">
        <div className="flex flex-col h-full items-center py-3 px-2 space-y-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -176 }}
              animate={{ x: 0 }}
              exit={{ x: -176 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-44 border-r border-border bg-sidebar shadow-xl overflow-hidden"
            >
              {fullSidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-12 border-b border-border bg-background px-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-44 p-0 bg-sidebar">
            <div className="flex items-center justify-end p-2 border-b border-border">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            {fullSidebar}
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 ml-2">
          <div className="flex h-6 w-6 items-center justify-center">
            <WorldCupIcon size={16} className="text-foreground" />
          </div>
          <span className="font-semibold text-sm">KickIQ</span>
        </Link>
      </div>

      <div className="md:hidden h-12" />
    </>
  )
}
