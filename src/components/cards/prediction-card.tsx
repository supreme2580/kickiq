import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface PredictionCardProps {
  homeTeam: string
  awayTeam: string
  homeWin: number
  awayWin: number
  confidence: string
  link: string
}

export function PredictionCard({ homeTeam, awayTeam, homeWin, awayWin, confidence, link }: PredictionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="text-xs text-muted-foreground font-medium">Win Probability</div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium flex-1 text-right">{homeTeam}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tabular-nums">{homeWin}%</span>
          <span className="text-xs text-muted-foreground">vs</span>
          <span className="text-lg font-bold tabular-nums">{awayWin}%</span>
        </div>
        <span className="text-sm font-medium flex-1">{awayTeam}</span>
      </div>

      <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
        <div className="bg-foreground transition-all" style={{ width: `${homeWin}%` }} />
        <div className="bg-muted-foreground/30 transition-all" style={{ width: `${100 - homeWin - awayWin}%` }} />
        <div className="bg-muted-foreground/50 transition-all" style={{ width: `${awayWin}%` }} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Confidence: {confidence}</span>
        <Link
          href={link}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Analyze Match <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
