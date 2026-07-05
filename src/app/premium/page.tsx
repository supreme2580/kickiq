"use client"

import Link from "next/link"
import { Zap, Bot, TrendingUp, Shield, ArrowRight } from "lucide-react"

const FEATURES = [
  { title: "Advanced AI Reports", description: "Deep tactical analysis for every match — formations, pressing patterns, and weaknesses.", icon: Bot },
  { title: "Match Simulations", description: "AI-powered match simulations showing likely outcomes and key scenarios.", icon: TrendingUp },
  { title: "Tactical Breakdowns", description: "Professional-grade tactical analysis of team strategies and formations.", icon: Shield },
]

export default function PremiumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to chat
      </Link>

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          Powered by Injective
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Premium</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Unlock advanced AI analysis powered by Injective x402 and USDC CCTP.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <feature.icon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">{feature.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4 text-center max-w-sm mx-auto">
        <div className="space-y-1">
          <p className="text-2xl font-bold">0.50 USDC</p>
          <p className="text-sm text-muted-foreground">per analysis</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Connect Wallet <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="text-xs text-muted-foreground">Pay with USDC via Injective x402 or CCTP</p>
      </div>
    </div>
  )
}
