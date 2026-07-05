"use client"

import { Sparkles, Lock } from "lucide-react"
import Link from "next/link"

const PREDICTIONS = [
  { match: "Brazil vs Argentina", winner: "Brazil", homeWin: 52, awayWin: 24, draw: 24, confidence: 78, score: "2-1" },
  { match: "Spain vs France", winner: "Spain", homeWin: 45, awayWin: 28, draw: 27, confidence: 72, score: "2-1" },
  { match: "Germany vs Portugal", winner: "Portugal", homeWin: 32, awayWin: 40, draw: 28, confidence: 65, score: "1-2", premium: true },
  { match: "Netherlands vs Senegal", winner: "Netherlands", homeWin: 48, awayWin: 25, draw: 27, confidence: 75, score: "2-0" },
  { match: "England vs Italy", winner: "England", homeWin: 44, awayWin: 26, draw: 30, confidence: 70, score: "1-1" },
  { match: "Belgium vs Croatia", winner: "Belgium", homeWin: 41, awayWin: 29, draw: 30, confidence: 68, score: "2-1" },
]

export default function PredictionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Predictions</h1>
        <p className="text-muted-foreground mt-1">AI-powered match predictions</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PREDICTIONS.map((p) => (
          <div
            key={p.match}
            className={`rounded-xl border bg-card p-5 space-y-4 hover:bg-accent/50 transition-colors ${
              p.premium ? "border-muted-foreground/20" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{p.match}</span>
              {p.premium && (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-accent">
                  <Lock className="h-2.5 w-2.5" />
                  Premium
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 text-center">
              <div>
                <p className="text-2xl font-bold tabular-nums">{p.homeWin}%</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Home</p>
              </div>
              <div className="text-xs text-muted-foreground">vs</div>
              <div>
                <p className="text-2xl font-bold tabular-nums">{p.awayWin}%</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Away</p>
              </div>
            </div>

            <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
              <div className="bg-foreground transition-all" style={{ width: `${p.homeWin}%` }} />
              <div className="bg-muted-foreground/30 transition-all" style={{ width: `${p.draw}%` }} />
              <div className="bg-muted-foreground/50 transition-all" style={{ width: `${p.awayWin}%` }} />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Confidence: {p.confidence}%</span>
              <Link href="/match/1" className="hover:text-foreground transition-colors">
                View Match →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
