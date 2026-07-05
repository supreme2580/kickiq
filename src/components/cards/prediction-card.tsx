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
  const draw = 100 - homeWin - awayWin
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 max-w-sm">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">Win Probability</span>
        <span className="text-muted-foreground">Confidence: {confidence}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-right">
          <p className="text-lg font-bold tabular-nums">{homeWin}%</p>
          <p className="text-xs text-muted-foreground">{homeTeam}</p>
        </div>
        <span className="text-xs text-muted-foreground">vs</span>
        <div className="flex-1">
          <p className="text-lg font-bold tabular-nums">{awayWin}%</p>
          <p className="text-xs text-muted-foreground">{awayTeam}</p>
        </div>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden flex">
        <div className="bg-foreground transition-all" style={{ width: `${homeWin}%` }} />
        {draw > 0 && <div className="bg-muted-foreground/30 transition-all" style={{ width: `${draw}%` }} />}
        <div className="bg-muted-foreground/50 transition-all" style={{ width: `${awayWin}%` }} />
      </div>

      <Link
        href={link}
        className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
      >
        Match details <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
