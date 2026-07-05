import { APP_NAME, APP_TAGLINE } from "@/lib/constants"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container py-10">
        <div className="grid sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <p className="font-semibold">{APP_NAME}</p>
            <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pages</p>
            <div className="flex flex-col gap-1.5">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Chat</Link>
              <Link href="/standings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Standings</Link>
              <Link href="/premium" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Premium</Link>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Info</p>
            <div className="flex flex-col gap-1.5">
              <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</Link>
              <p className="text-sm text-muted-foreground">Built for Injective Global Cup 2026</p>
              <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} KickIQ</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
