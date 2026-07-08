"use client"

import Link from "next/link"
import { useState } from "react"
import { Zap, Bot, TrendingUp, Shield, ArrowRight, Coins } from "lucide-react"
import { useAppKitAccount } from "@reown/appkit/react"
import { creditBundlePrices, BuyCreditsDialog } from "@/components/credits/buy-dialog"

const FEATURES = [
  { title: "Deep Tactical Analysis", description: "Multi-tool AI analysis combining World Cup data, team form, and betting odds.", icon: Bot },
  { title: "Betting Insights", description: "Data-driven betting recommendations based on real odds and match statistics.", icon: TrendingUp },
  { title: "Smart Predictions", description: "AI evaluates fixtures, standings, and team performance to generate reasoned predictions.", icon: Shield },
]

export default function PremiumPage() {
  const { isConnected } = useAppKitAccount()
  const [showBuy, setShowBuy] = useState(false)

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
        <h1 className="text-4xl font-bold tracking-tight">Deep Analysis Credits</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Buy credits to unlock AI-powered tactical analysis. Pay once, use per query — no recurring subscriptions.
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

      <div className="rounded-xl border border-border bg-card p-6 space-y-6 max-w-md mx-auto">
        <p className="text-sm font-medium text-center">Choose a bundle</p>
        <div className="space-y-3">
          {creditBundlePrices.map((bundle) => (
            <button
              key={bundle.credits}
              onClick={() => {
                if (!isConnected) return
                setShowBuy(true)
              }}
              disabled={!isConnected}
              className="w-full flex items-center justify-between rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition-colors p-4 disabled:opacity-40 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-semibold">{bundle.credits} credits</p>
                  <p className="text-xs text-muted-foreground">{bundle.usd} USDC</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {!isConnected && (
          <p className="text-xs text-center text-muted-foreground">
            Sign in to purchase credits
          </p>
        )}

        {isConnected && (
          <p className="text-xs text-center text-muted-foreground">
            Pay with USDC on Injective via x402. Bridge USDC from another chain during checkout.
          </p>
        )}
      </div>

      <div className="text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground underline">
          Already have credits? Start chatting →
        </Link>
      </div>

      {showBuy && <BuyCreditsDialog open={showBuy} onClose={() => setShowBuy(false)} />}
    </div>
  )
}
