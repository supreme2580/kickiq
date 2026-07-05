import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PredictionCardProps {
  match: string
  winner: string
  homeWin: number
  awayWin: number
  draw: number
  confidence: number
  expectedScore: { home: number; away: number }
  isPremium?: boolean
}

export function PredictionCard({
  match,
  winner,
  homeWin,
  awayWin,
  draw,
  confidence,
  expectedScore,
  isPremium,
}: PredictionCardProps) {
  return (
    <Card className="border-border/40 bg-card-premium hover:shadow-premium transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{match}</CardTitle>
          {isPremium && (
            <Badge variant="default" className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 text-[10px]">
              Premium
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-1 px-3 rounded-lg bg-primary/5 border border-primary/10">
          <span className="text-xs text-muted-foreground">Predicted Winner</span>
          <span className="text-sm font-bold text-gradient">{winner}</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Home</span>
            <span>Draw</span>
            <span>Away</span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden bg-muted/50">
            <div className="bg-gradient-to-r from-primary to-primary/80 transition-all" style={{ width: `${homeWin}%` }} />
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all" style={{ width: `${draw}%` }} />
            <div className="bg-gradient-to-r from-accent to-accent/80 transition-all" style={{ width: `${awayWin}%` }} />
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-primary">{homeWin}%</span>
            <span className="text-yellow-500">{draw}%</span>
            <span className="text-accent">{awayWin}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-lg bg-muted/50 text-center">
            <p className="text-[11px] text-muted-foreground">Expected</p>
            <p className="text-lg font-bold tabular-nums">{expectedScore.home} - {expectedScore.away}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-muted/50 text-center">
            <p className="text-[11px] text-muted-foreground">Confidence</p>
            <p className="text-lg font-bold tabular-nums text-gradient">{confidence}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
