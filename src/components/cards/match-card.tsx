import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface MatchCardProps {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  stage: string
  link: string
}

export function MatchCard({ homeTeam, awayTeam, date, time, stage, link }: MatchCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{date}</span>
        <span>{stage}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{homeTeam}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">vs</span>
        </div>
        <span className="text-sm font-medium">{awayTeam}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{time}</span>
        <Link
          href={link}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Live Stats <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
