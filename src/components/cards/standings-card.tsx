import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface StandingsCardProps {
  group: string
  teams: { pos: number; name: string; pts: number }[]
  link: string
}

export function StandingsCard({ group, teams, link }: StandingsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="text-xs text-muted-foreground font-medium">{group}</div>

      <div className="space-y-1">
        {teams.map((team) => (
          <div
            key={team.name}
            className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium w-4 text-center ${team.pos <= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                {team.pos}
              </span>
              <span className="text-sm font-medium">{team.name}</span>
            </div>
            <span className="text-sm font-bold tabular-nums">{team.pts} pts</span>
          </div>
        ))}
      </div>

      <Link
        href={link}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        View Full Table <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
