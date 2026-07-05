"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Settings, ExternalLink } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container py-8 max-w-2xl space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences</p>
      </div>

      <Card className="border-border/40 bg-card-premium shadow-glass">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">Toggle dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">API Configuration</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Set your API keys in <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">.env.local</code> to enable live data
          </p>
          <div className="bg-muted/50 rounded-xl p-4 text-xs space-y-1.5 font-mono border border-border/40">
            <p className="text-primary font-semibold text-[11px] uppercase tracking-wider mb-2">Required Variables</p>
            <p>OPENAI_API_KEY=sk-...</p>
            <p>API_FOOTBALL_KEY=...</p>
            <p className="text-primary font-semibold text-[11px] uppercase tracking-wider mt-3 mb-2">Optional</p>
            <p>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...</p>
            <p>INJECTIVE_RPC_URL=https://injective-rpc.publicnode.com</p>
            <p>NEXT_PUBLIC_X402_FACILITATOR_URL=...</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold">About</h3>
          <div className="text-sm text-muted-foreground space-y-1 leading-relaxed">
            <p><span className="font-medium text-foreground">KickIQ</span> — AI Copilot for the FIFA World Cup</p>
            <p>Built for the Injective Global Cup Hackathon 2026</p>
            <p>Version 1.0.0</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-1.5">
                Dashboard <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="sm" className="gap-1.5">
                AI Chat <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
