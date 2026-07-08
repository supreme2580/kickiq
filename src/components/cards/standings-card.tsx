import { ArrowRight } from "lucide-react"

interface StandingsCardProps {
  group: string
  teams: { pos: number; name: string; pts: number }[]
  link?: string
}

export function StandingsCard({ group, teams, link }: StandingsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2 max-w-sm">
      <p className="text-xs font-medium text-foreground">{group}</p>

      <div className="space-y-0.5">
        {teams.map((team) => (
          <div
            key={team.name}
            className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium w-3 text-center ${team.pos <= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                {team.pos}
              </span>
              <span className="text-sm text-foreground">{team.name}</span>
            </div>
            <span className="text-sm font-bold tabular-nums text-foreground">{team.pts}</span>
          </div>
        ))}
      </div>

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
        >
          View full table <ArrowRight className="h-3 w-3" />
        </a>
      )}
    </div>
  )
}
