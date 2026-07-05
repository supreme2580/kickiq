"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUp, Trophy, BarChart3, Zap, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

const SUGGESTED_PROMPTS = [
  "Who will win today?",
  "Show today's fixtures",
  "Compare Brazil vs Argentina",
  "Predict the World Cup winner",
]

const FEATURES = [
  { icon: MessageSquare, label: "AI Predictions", desc: "Win probabilities & tactical analysis" },
  { icon: BarChart3, label: "Live Standings", desc: "Real-time group tables & stats" },
  { icon: Trophy, label: "Match Coverage", desc: "Every World Cup fixture, live" },
  { icon: Zap, label: "Premium Insights", desc: "Deep AI analysis via Injective" },
]

export default function LandingPage() {
  const [input, setInput] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    router.push(`/chat?q=${encodeURIComponent(input.trim())}`)
  }

  function handlePrompt(prompt: string) {
    router.push(`/chat?q=${encodeURIComponent(prompt)}`)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full mx-auto text-center space-y-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground">
              <Trophy className="h-3 w-3" />
              AI Copilot for the FIFA World Cup
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              KickIQ
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">
              Your AI Copilot for Every World Cup Match.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about the World Cup..."
                className="w-full h-14 px-5 pr-14 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 text-base focus:outline-none focus:border-muted-foreground/40 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background disabled:opacity-30 transition-opacity"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePrompt(prompt)}
                className="px-3.5 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((feature) => (
              <div key={feature.label} className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                    <feature.icon className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="text-sm font-medium">{feature.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
