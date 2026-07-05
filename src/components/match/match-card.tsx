import type { FootballFixture } from "@/services/football/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface MatchCardProps {
  fixture: FootballFixture
  showPrediction?: boolean
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  TBD: { label: "Scheduled", className: "border-border/40 text-muted-foreground" },
  NS: { label: "Scheduled", className: "border-border/40 text-muted-foreground" },
  "1H": { label: "1st Half", className: "border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10" },
  "2H": { label: "2nd Half", className: "border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10" },
  HT: { label: "Half Time", className: "border-yellow-500/30 text-yellow-600 dark:text-yellow-400 bg-yellow-500/10" },
  FT: { label: "FT", className: "border-border/40 text-muted-foreground bg-muted/50" },
  LIVE: { label: "Live", className: "border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10" },
}

export function MatchCard({ fixture }: MatchCardProps) {
  const { fixture: f, teams, goals } = fixture
  const status = STATUS_STYLES[f.status.short] || {
    label: f.status.short,
    className: "border-border/40 text-muted-foreground",
  }
  const isLive = ["LIVE", "1H", "2H"].includes(f.status.short)

  return (
    <Link href={`/match/${f.id}`}>
      <Card
        className={`group relative overflow-hidden border-border/40 bg-card-premium hover:shadow-premium transition-all duration-300 ${
          isLive ? "ring-1 ring-red-500/20" : ""
        }`}
      >
        {isLive && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 via-red-400 to-red-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        )}
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`text-xs font-medium ${status.className}`}>
              {isLive && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
              {status.label}
            </Badge>
            {f.status.elapsed != null && (
              <span className="text-xs tabular-nums text-muted-foreground">{f.status.elapsed}&apos;</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0 text-right">
              <p className={`text-sm font-semibold truncate ${goals.home != null && goals.home > (goals.away ?? 0) ? "text-foreground" : "text-muted-foreground"}`}>
                {teams.home.name}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className={`text-2xl font-bold tabular-nums ${
                goals.home != null ? "text-foreground" : "text-muted-foreground"
              }`}>
                {goals.home ?? "-"}
              </span>
              <span className="text-sm text-muted-foreground/50 font-medium">vs</span>
              <span className={`text-2xl font-bold tabular-nums ${
                goals.away != null ? "text-foreground" : "text-muted-foreground"
              }`}>
                {goals.away ?? "-"}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${goals.away != null && goals.away > (goals.home ?? 0) ? "text-foreground" : "text-muted-foreground"}`}>
                {teams.away.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
