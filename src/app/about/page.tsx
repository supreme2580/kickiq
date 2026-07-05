"use client"

import Link from "next/link"
import { Trophy } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to chat
      </Link>

      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
            <Trophy className="h-6 w-6 text-background" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">KickIQ</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          AI Copilot for the FIFA World Cup
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          KickIQ is an AI-powered football assistant built for the Injective Global Cup hackathon.
          It combines large language models with real-time football data to provide predictions,
          analysis, and insights for the FIFA World Cup.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Powered by</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• Injective x402 — Pay-per-request AI analysis</li>
            <li>• USDC CCTP — Cross-chain premium subscriptions</li>
            <li>• AI Agent Skills — Specialized match agents</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Built for the Injective Global Cup 2026
        </p>
      </div>
    </div>
  )
}
