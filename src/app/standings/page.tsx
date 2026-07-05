"use client"

import { ChevronDown } from "lucide-react"

const STANDINGS = [
  {
    group: "Group A",
    teams: [
      { pos: 1, name: "Brazil", p: 3, w: 3, d: 0, l: 0, gf: 9, ga: 2, gd: 7, pts: 9 },
      { pos: 2, name: "Netherlands", p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 2, gd: 3, pts: 6 },
      { pos: 3, name: "Senegal", p: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3 },
      { pos: 4, name: "Cameroon", p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 9, gd: -8, pts: 0 },
    ],
  },
  {
    group: "Group B",
    teams: [
      { pos: 1, name: "Spain", p: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7 },
      { pos: 2, name: "France", p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6 },
      { pos: 3, name: "Portugal", p: 3, w: 1, d: 1, l: 1, gf: 4, ga: 4, gd: 0, pts: 4 },
      { pos: 4, name: "Uruguay", p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 7, gd: -6, pts: 0 },
    ],
  },
  {
    group: "Group C",
    teams: [
      { pos: 1, name: "Argentina", p: 3, w: 3, d: 0, l: 0, gf: 8, ga: 1, gd: 7, pts: 9 },
      { pos: 2, name: "England", p: 3, w: 2, d: 0, l: 1, gf: 6, ga: 3, gd: 3, pts: 6 },
      { pos: 3, name: "Mexico", p: 3, w: 1, d: 0, l: 2, gf: 2, ga: 5, gd: -3, pts: 3 },
      { pos: 4, name: "Japan", p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 8, gd: -7, pts: 0 },
    ],
  },
  {
    group: "Group D",
    teams: [
      { pos: 1, name: "Germany", p: 3, w: 2, d: 1, l: 0, gf: 7, ga: 3, gd: 4, pts: 7 },
      { pos: 2, name: "Belgium", p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 4, gd: 1, pts: 6 },
      { pos: 3, name: "Croatia", p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, gd: 0, pts: 4 },
      { pos: 4, name: "Morocco", p: 3, w: 0, d: 0, l: 3, gf: 2, ga: 7, gd: -5, pts: 0 },
    ],
  },
]

export default function StandingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Standings</h1>
        <p className="text-muted-foreground mt-1">World Cup group tables</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {STANDINGS.map((group) => (
          <div key={group.group} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold">{group.group}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-left px-4 py-3 font-medium w-6">#</th>
                    <th className="text-left px-4 py-3 font-medium">Team</th>
                    <th className="text-center px-3 py-3 font-medium">P</th>
                    <th className="text-center px-3 py-3 font-medium">W</th>
                    <th className="text-center px-3 py-3 font-medium">D</th>
                    <th className="text-center px-3 py-3 font-medium">L</th>
                    <th className="text-center px-3 py-3 font-medium">GD</th>
                    <th className="text-right px-4 py-3 font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.teams.map((team, i) => (
                    <tr key={team.name} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                      <td className={`px-4 py-3 font-medium ${team.pos <= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                        {team.pos}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {team.name}
                          {i === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground font-medium">Leader</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">{team.p}</td>
                      <td className="px-3 py-3 text-center tabular-nums">{team.w}</td>
                      <td className="px-3 py-3 text-center tabular-nums">{team.d}</td>
                      <td className="px-3 py-3 text-center tabular-nums">{team.l}</td>
                      <td className="px-3 py-3 text-center tabular-nums font-medium">{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">{team.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
