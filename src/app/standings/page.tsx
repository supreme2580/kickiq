import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"

const MOCK_STANDINGS = [
  {
    group: "Group A",
    teams: [
      { pos: 1, name: "Brazil", played: 3, won: 3, drawn: 0, lost: 0, gf: 9, ga: 2, gd: 7, pts: 9, form: "WWWW" },
      { pos: 2, name: "Netherlands", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 2, gd: 3, pts: 6, form: "WLWW" },
      { pos: 3, name: "Senegal", played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3, form: "LWLW" },
      { pos: 4, name: "Cameroon", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 9, gd: -8, pts: 0, form: "LLLL" },
    ],
  },
  {
    group: "Group B",
    teams: [
      { pos: 1, name: "Spain", played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, pts: 7, form: "WDWW" },
      { pos: 2, name: "France", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, gd: 2, pts: 6, form: "WLWW" },
      { pos: 3, name: "Portugal", played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, pts: 4, form: "DWLW" },
      { pos: 4, name: "Uruguay", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, pts: 0, form: "LLLL" },
    ],
  },
]

export default function StandingsPage() {
  return (
    <div className="container py-8 space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Standings</h1>
        <p className="text-muted-foreground mt-1">World Cup group standings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {MOCK_STANDINGS.map((group) => (
          <Card key={group.group} className="border-border/40 bg-card-premium shadow-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-primary" />
                {group.group}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b border-border/40">
                    <th className="text-left py-2.5 w-8 font-medium">#</th>
                    <th className="text-left py-2.5 font-medium">Team</th>
                    <th className="text-center py-2.5 w-8 font-medium">P</th>
                    <th className="text-center py-2.5 w-8 font-medium">W</th>
                    <th className="text-center py-2.5 w-8 font-medium">D</th>
                    <th className="text-center py-2.5 w-8 font-medium">L</th>
                    <th className="text-center py-2.5 w-10 font-medium">GD</th>
                    <th className="text-right py-2.5 w-10 font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map((team, i) => (
                    <tr key={team.name} className="border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className={`py-3 font-bold ${
                        team.pos <= 2 ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {team.pos}
                      </td>
                      <td className="py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {team.name}
                          {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">Leader</span>}
                        </div>
                      </td>
                      <td className="py-3 text-center tabular-nums">{team.played}</td>
                      <td className="py-3 text-center tabular-nums text-green-600 dark:text-green-400 font-medium">{team.won}</td>
                      <td className="py-3 text-center tabular-nums text-yellow-500 font-medium">{team.drawn}</td>
                      <td className="py-3 text-center tabular-nums text-red-500 font-medium">{team.lost}</td>
                      <td className="py-3 text-center tabular-nums font-medium">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                      <td className="py-3 text-right font-bold tabular-nums">{team.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
