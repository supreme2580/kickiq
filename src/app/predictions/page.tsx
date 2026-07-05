import { PredictionCard } from "@/components/predictions/prediction-card"
import { Sparkles } from "lucide-react"

const MOCK_PREDICTIONS = [
  {
    match: "Brazil vs Argentina",
    winner: "Brazil",
    homeWin: 52,
    awayWin: 24,
    draw: 24,
    confidence: 78,
    expectedScore: { home: 2, away: 1 },
  },
  {
    match: "Spain vs France",
    winner: "Spain",
    homeWin: 45,
    awayWin: 28,
    draw: 27,
    confidence: 72,
    expectedScore: { home: 2, away: 1 },
  },
  {
    match: "Germany vs Portugal",
    winner: "Portugal",
    homeWin: 32,
    awayWin: 40,
    draw: 28,
    confidence: 65,
    expectedScore: { home: 1, away: 2 },
    isPremium: true,
  },
  {
    match: "Netherlands vs Senegal",
    winner: "Netherlands",
    homeWin: 48,
    awayWin: 25,
    draw: 27,
    confidence: 75,
    expectedScore: { home: 2, away: 0 },
  },
  {
    match: "England vs Italy",
    winner: "England",
    homeWin: 44,
    awayWin: 26,
    draw: 30,
    confidence: 70,
    expectedScore: { home: 1, away: 1 },
  },
  {
    match: "Belgium vs Croatia",
    winner: "Belgium",
    homeWin: 41,
    awayWin: 29,
    draw: 30,
    confidence: 68,
    expectedScore: { home: 2, away: 1 },
  },
]

export default function PredictionsPage() {
  return (
    <div className="container py-8 space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Predictions</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered match predictions for World Cup fixtures
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_PREDICTIONS.map((p) => (
          <PredictionCard key={p.match} {...p} />
        ))}
      </div>
    </div>
  )
}
