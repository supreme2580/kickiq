
interface FixtureCardProps {
  home: string
  away: string
  time: string
  stage: string
  link?: string
}

export function FixtureCard({ home, away, time, stage, link }: FixtureCardProps) {
  const inner = (
    <div className="rounded-xl border border-border bg-card p-3.5 space-y-2 hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{stage}</span>
        <span>{time}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{home}</span>
        <span className="text-xs text-muted-foreground">vs</span>
        <span className="text-sm font-medium">{away}</span>
      </div>
    </div>
  )

  return link ? <a href={link} target="_blank" rel="noreferrer">{inner}</a> : inner
}
