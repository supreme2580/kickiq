import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface PlayerCardProps {
  name: string
  team: string
  goals: number
  assists: number
  minutes: number
  link: string
}

export function PlayerCard({ name, team, goals, assists, minutes, link }: PlayerCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{team}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold tabular-nums">{goals}</p>
          <p className="text-[10px] text-muted-foreground">Goals</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">{assists}</p>
          <p className="text-[10px] text-muted-foreground">Assists</p>
        </div>
        <div>
          <p className="text-lg font-bold tabular-nums">{minutes}</p>
          <p className="text-[10px] text-muted-foreground">Minutes</p>
        </div>
      </div>

      <Link
        href={link}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        View Player <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
