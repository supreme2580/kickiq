import { MatchCard } from "@/components/match/match-card"
import { TeamCard } from "@/components/team/team-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Bell, Zap } from "lucide-react"
import Link from "next/link"

const MOCK_FIXTURES = [
  {
    fixture: { id: 1, date: "2026-07-04T18:00:00Z", status: { short: "LIVE", elapsed: 67 }, venue: { name: "Lusail Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 1, name: "Brazil", logo: "" }, away: { id: 2, name: "Argentina", logo: "" } },
    goals: { home: 2, away: 1 },
    score: { halftime: { home: 1, away: 0 }, fulltime: { home: null, away: null } },
  },
  {
    fixture: { id: 2, date: "2026-07-04T21:00:00Z", status: { short: "NS", elapsed: null }, venue: { name: "Al Bayt Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 3, name: "Spain", logo: "" }, away: { id: 4, name: "France", logo: "" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  },
  {
    fixture: { id: 3, date: "2026-07-04T16:00:00Z", status: { short: "FT", elapsed: null }, venue: { name: "Khalifa Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 5, name: "Germany", logo: "" }, away: { id: 6, name: "Portugal", logo: "" } },
    goals: { home: 3, away: 2 },
    score: { halftime: { home: 1, away: 1 }, fulltime: { home: 3, away: 2 } },
  },
  {
    fixture: { id: 7, date: "2026-07-04T17:00:00Z", status: { short: "LIVE", elapsed: 32 }, venue: { name: "Stadium 974" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 13, name: "Netherlands", logo: "" }, away: { id: 14, name: "England", logo: "" } },
    goals: { home: 0, away: 0 },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  },
]

export default function DashboardPage() {
  return (
    <div className="container py-8 space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Today&apos;s World Cup action</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 border-green-500/20 text-green-600 dark:text-green-400 bg-green-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            2 Live
          </Badge>
          <Link href="/fixtures">
            <Badge variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-accent transition-colors">
              View All
            </Badge>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_FIXTURES.slice(0, 4).map((fixture) => (
          <MatchCard key={fixture.fixture.id} fixture={fixture as any} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/40 bg-card-premium shadow-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-primary" />
              Group A Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/40">
              {[
                { pos: 1, name: "Brazil", pts: 9, gd: 7, form: "WWWW" },
                { pos: 2, name: "Netherlands", pts: 6, gd: 3, form: "WLWW" },
                { pos: 3, name: "Senegal", pts: 3, gd: -2, form: "LWLW" },
                { pos: 4, name: "Cameroon", pts: 0, gd: -8, form: "LLLL" },
              ].map((row) => (
                <div key={row.name} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-6 text-center ${
                      row.pos <= 2 ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {row.pos}
                    </span>
                    <span className="font-medium">{row.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                      {row.form.split("").map((r: string, i: number) => (
                        <span key={i} className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                          r === "W" ? "bg-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/20 text-red-600 dark:text-red-400"
                        }`}>
                          {r}
                        </span>
                      ))}
                    </div>
                    <span className="text-muted-foreground tabular-nums">GD: {row.gd > 0 ? `+${row.gd}` : row.gd}</span>
                    <span className="font-bold tabular-nums min-w-[3rem] text-right">{row.pts} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                AI Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 space-y-1">
                <p className="text-xs font-semibold text-primary">Brazil 2 - 1 Argentina (67&apos;)</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Brazil dominating possession (62%). Argentina needs tactical adjustment.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/10 space-y-1">
                <p className="text-xs font-semibold text-accent">Up Next: Spain vs France</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Spain favored (58% win probability).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-primary" />
                Latest Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { time: "67'", event: "Goal! Brazil 2-1 Argentina" },
                { time: "55'", event: "Yellow card - Argentina" },
                { time: "32'", event: "Goal! Netherlands 0-0 England" },
              ].map((update) => (
                <div key={update.time} className="flex gap-2 text-xs">
                  <span className="font-bold text-primary tabular-nums shrink-0">{update.time}</span>
                  <span className="text-muted-foreground">{update.event}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
