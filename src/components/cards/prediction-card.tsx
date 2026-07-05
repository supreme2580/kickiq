import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface PredictionCardProps {
  homeTeam: string
  awayTeam: string
  homeWin: number
  awayWin: number
  confidence: string
  matchLink: string
}

export function PredictionCard({ homeTeam, awayTeam, homeWin, awayWin, confidence, matchLink }: PredictionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{homeTeam}</span>
        <span className="text-xs text-muted-foreground">vs</span>
        <span>{awayTeam}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${homeWin}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{homeWin}%</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Confidence: {confidence}</span>
        <Link
          href={matchLink}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Analyze Match <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
