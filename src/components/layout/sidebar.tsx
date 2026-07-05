"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, MessageSquare, Zap, Info, Menu, Trophy, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const NAV_ITEMS = [
  { href: "/", label: "New Chat", icon: Plus },
  { href: "/history", label: "Chat History", icon: MessageSquare },
  { href: "/premium", label: "Premium", icon: Zap },
  { href: "/about", label: "About", icon: Info },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex flex-col h-full">
      <div className="flex items-center h-14 px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
            <Trophy className="h-3.5 w-3.5 text-background" />
          </div>
          <span className="font-semibold text-sm tracking-tight">KickIQ</span>
        </Link>
      </div>

      <div className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          AI Copilot for the World Cup
        </p>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-border bg-sidebar shrink-0">
        {nav}
      </aside>

      {/* Mobile header with menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center h-12 border-b border-border bg-background px-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0">
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

      {/* Spacer for mobile header */}
      <div className="md:hidden h-12" />
    </>
  )
}
