"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, Trophy, Users, Target, Shield, Zap } from "lucide-react"
import Link from "next/link"

const MOCK_TEAMS: Record<string, {
  name: string
  group: string
  rank: number
  coach: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  topScorers: { name: string; goals: number }[]
  recentForm: string[]
  nextMatch: { opponent: string; date: string; stage: string }
}> = {
  "1": {
    name: "Brazil",
    group: "Group A",
    rank: 1,
    coach: "Dorival Júnior",
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    gf: 9,
    ga: 2,
    topScorers: [
      { name: "Vinícius Jr.", goals: 3 },
      { name: "Rodrygo", goals: 2 },
      { name: "Richarlison", goals: 2 },
    ],
    recentForm: ["W", "W", "W"],
    nextMatch: { opponent: "Netherlands", date: "July 9", stage: "Semi Final" },
  },
}

export default function TeamPage() {
  const params = useParams()
  const team = MOCK_TEAMS[params.id as string] || MOCK_TEAMS["1"]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Link href="/standings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Standings
      </Link>

      <div className="rounded-xl border border-border bg-card p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{team.group}</span>
              <span className="text-border">|</span>
              <span>FIFA Rank: #{team.rank}</span>
              <span className="text-border">|</span>
              <span>Coach: {team.coach}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 text-center">
          {[
            { label: "Played", value: team.played },
            { label: "Won", value: team.won },
            { label: "Drawn", value: team.drawn },
            { label: "Lost", value: team.lost },
            { label: "Points", value: team.won * 3 + team.drawn },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="rounded-lg bg-accent p-3">
            <p className="text-xs text-muted-foreground">Goals For</p>
            <p className="text-xl font-bold">{team.gf}</p>
          </div>
          <div className="rounded-lg bg-accent p-3">
            <p className="text-xs text-muted-foreground">Goals Against</p>
            <p className="text-xl font-bold">{team.ga}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Top Scorers</h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            {team.topScorers.map((player, i) => (
              <div key={player.name} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-medium w-4">{i + 1}</span>
                  <span className="text-sm font-medium">{player.name}</span>
                </div>
                <span className="text-sm font-bold tabular-nums">{player.goals}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recent Form</h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex gap-2">
              {team.recentForm.map((result, i) => (
                <span
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                    result === "W" ? "bg-foreground text-background" : "bg-accent text-muted-foreground"
                  }`}
                >
                  {result}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {team.nextMatch && (
        <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Next Match: {team.name} vs {team.nextMatch.opponent}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{team.nextMatch.date} · {team.nextMatch.stage}</p>
            </div>
          </div>
          <Link
            href="/fixtures"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View →
          </Link>
        </div>
      )}
    </div>
  )
}
