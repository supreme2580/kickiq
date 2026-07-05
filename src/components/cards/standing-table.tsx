import Link from "next/link"
import { ArrowRight, Trophy } from "lucide-react"

interface TeamRow {
  pos: number
  name: string
  pts: number
  played: number
  won: number
  drawn: number
  lost: number
  gd: number
}

interface StandingTableProps {
  group: string
  teams: TeamRow[]
  link: string
}

export function StandingTable({ group, teams, link }: StandingTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{group}</span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center text-xs text-muted-foreground px-2 py-1">
          <span className="w-6">#</span>
          <span className="flex-1">Team</span>
          <span className="w-8 text-center">P</span>
          <span className="w-10 text-right">Pts</span>
        </div>
        {teams.map((team) => (
          <div
            key={team.name}
            className="flex items-center text-sm px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <span className={`w-6 font-medium ${team.pos <= 2 ? "text-foreground" : "text-muted-foreground"}`}>
              {team.pos}
            </span>
            <span className="flex-1 font-medium">{team.name}</span>
            <span className="w-8 text-center text-muted-foreground tabular-nums">{team.played}</span>
            <span className="w-10 text-right font-bold tabular-nums">{team.pts}</span>
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
