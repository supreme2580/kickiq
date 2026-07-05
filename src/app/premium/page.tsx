"use client"

import { Zap, Bot, Shield, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

const FEATURES = [
  {
    title: "Advanced AI Reports",
    description: "Deep tactical analysis for every match — formations, pressing patterns, and weaknesses.",
    icon: Bot,
  },
  {
    title: "Match Simulations",
    description: "AI-powered match simulations showing likely outcomes and key scenarios.",
    icon: TrendingUp,
  },
  {
    title: "Tactical Breakdowns",
    description: "Professional-grade tactical analysis of team strategies and formations.",
    icon: Shield,
  },
]

const BENEFITS = [
  "Unlimited AI predictions",
  "Deep tactical analysis per match",
  "Match simulations with probability trees",
  "Exclusive premium insights feed",
  "Cross-chain USDC payments via Injective",
  "Support future development",
]

export default function PremiumPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          Powered by Injective
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Premium Insights
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Unlock advanced AI analysis powered by Injective x402 and USDC CCTP.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <feature.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold">What's Included</h2>
          <ul className="space-y-2.5">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold">0.50 USDC</p>
            <p className="text-sm text-muted-foreground">per analysis</p>
          </div>
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Connect Wallet <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-muted-foreground">
            Pay with USDC via Injective x402 or CCTP
          </p>
        </div>
      </div>
    </div>
  )
}
