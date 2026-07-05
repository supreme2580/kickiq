import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Bot } from "lucide-react"

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container py-8 space-y-6 animate-in">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brazil vs Argentina</h1>
          <p className="text-muted-foreground mt-1">World Cup 2026 — Group A</p>
        </div>
        <Badge className="gap-1.5 px-3 py-1.5 border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/10 border-0">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Live
        </Badge>
      </div>

      <Card className="py-12 border-border/40 bg-card-premium shadow-glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02]" />
        <CardContent className="relative flex items-center justify-center gap-8 md:gap-16">
          <div className="text-center space-y-2">
            <p className="text-xl font-bold">Brazil</p>
            <p className="text-5xl md:text-7xl font-bold tabular-nums">2</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-5xl font-bold text-muted-foreground/30">:</p>
            <p className="text-sm text-muted-foreground mt-2 font-medium">67&apos;</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-xl font-bold">Argentina</p>
            <p className="text-5xl md:text-7xl font-bold tabular-nums">1</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Match Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: "Possession", home: "62%", away: "38%" },
              { label: "Shots", home: "14", away: "8" },
              { label: "Shots on Target", home: "6", away: "3" },
              { label: "xG", home: "2.1", away: "0.8" },
              { label: "Corners", home: "7", away: "3" },
              { label: "Fouls", home: "8", away: "12" },
            ].map((stat) => {
              const homeVal = parseInt(stat.home)
              const awayVal = parseInt(stat.away)
              const total = homeVal + awayVal
              const homePct = total > 0 ? (homeVal / total) * 100 : 50
              return (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold tabular-nums">{stat.home}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</span>
                    <span className="font-semibold tabular-nums">{stat.away}</span>
                  </div>
                  <div className="flex h-1.5 rounded-full overflow-hidden bg-muted/50">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/60 transition-all rounded-l-full"
                      style={{ width: `${homePct}%` }}
                    />
                    <div
                      className="bg-gradient-to-l from-accent to-accent/60 transition-all rounded-r-full"
                      style={{ width: `${100 - homePct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Brazil is dominating with 62% possession and creating quality chances
                (2.1 xG). Argentina&apos;s defense is struggling to contain Brazil&apos;s
                attacking transitions.
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Prediction Update</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Brazil: 72%</Badge>
                  <Badge variant="outline" className="border-yellow-500/20 text-yellow-600 dark:text-yellow-400 bg-yellow-500/5">Draw: 15%</Badge>
                  <Badge variant="outline" className="border-accent/20 text-accent bg-accent/5">Argentina: 13%</Badge>
                </div>
              </div>
              <Link href="/premium">
                <Button variant="outline" size="sm" className="gap-2 w-full border-primary/20 hover:bg-primary/5">
                  <Bot className="h-4 w-4" />
                  Unlock Premium Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Match Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { time: "55'", event: "🔴 Yellow Card", team: "Argentina" },
                { time: "42'", event: "⚽ Goal", team: "Brazil - Neymar" },
                { time: "28'", event: "⚽ Goal", team: "Argentina - Messi" },
                { time: "12'", event: "⚽ Goal", team: "Brazil - Vinicius Jr" },
              ].map((evt) => (
                <div key={evt.time} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 text-sm">
                  <span className="font-bold tabular-nums text-primary text-xs">{evt.time}</span>
                  <span className="text-muted-foreground">{evt.event}</span>
                  <span className="ml-auto text-xs font-medium">{evt.team}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
