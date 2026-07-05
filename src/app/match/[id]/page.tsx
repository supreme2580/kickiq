"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, Clock, MapPin, Bot, BarChart3, Users, Trophy } from "lucide-react"
import Link from "next/link"

const MOCK_MATCH = {
  id: 1,
  homeTeam: "Spain",
  awayTeam: "Brazil",
  homeScore: 2,
  awayScore: 1,
  status: "FT",
  stage: "Quarter Final",
  venue: "Lusail Stadium",
  date: "July 4, 2026",
  attendance: "88,966",
  possession: { home: 58, away: 42 },
  shots: { home: 14, away: 8 },
  shotsOnTarget: { home: 6, away: 3 },
  corners: { home: 7, away: 4 },
  fouls: { home: 10, away: 14 },
  yellowCards: { home: 2, away: 3 },
  redCards: { home: 0, away: 0 },
  timeline: [
    { minute: 23, event: "Goal", team: "home", description: "Pedri scores from outside the box" },
    { minute: 45, event: "Yellow Card", team: "away", description: "Marquinhos" },
    { minute: 58, event: "Goal", team: "home", description: "Morata header from a corner" },
    { minute: 72, event: "Goal", team: "away", description: "Vinícius Jr. slots it home" },
    { minute: 85, event: "Yellow Card", team: "home", description: "Laporte" },
  ],
}

export default function MatchPage() {
  const params = useParams()
  const match = MOCK_MATCH

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* Match Header */}
      <div className="rounded-xl border border-border bg-card p-8 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Trophy className="h-3 w-3" />
          <span>{match.stage}</span>
          <span className="text-border">|</span>
          <MapPin className="h-3 w-3" />
          <span>{match.venue}</span>
        </div>

        <div className="flex items-center justify-center gap-8 md:gap-16">
          <div className="flex-1 text-right">
            <p className="text-lg md:text-xl font-semibold">{match.homeTeam}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl md:text-7xl font-bold tabular-nums">{match.homeScore}</span>
            <span className="text-xl text-muted-foreground">-</span>
            <span className="text-5xl md:text-7xl font-bold tabular-nums">{match.awayScore}</span>
          </div>
          <div className="flex-1">
            <p className="text-lg md:text-xl font-semibold">{match.awayTeam}</p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {match.date} · {match.attendance} attendance
        </div>
      </div>

      {/* Timeline */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Timeline</h2>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          {match.timeline.map((event, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold tabular-nums ${event.team === "home" ? "text-foreground" : "text-muted-foreground"}`}>
                  {event.minute}'
                </span>
                {i < match.timeline.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
              </div>
              <div className={`text-sm ${event.team === "home" ? "" : "text-right flex-1"}`}>
                <span className={event.event === "Goal" ? "font-semibold" : "text-muted-foreground"}>{event.event}</span>
                <p className="text-xs text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Statistics</h2>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          {[
            { label: "Possession", home: match.possession.home, away: match.possession.away, unit: "%" },
            { label: "Total Shots", home: match.shots.home, away: match.shots.away, unit: "" },
            { label: "Shots on Target", home: match.shotsOnTarget.home, away: match.shotsOnTarget.away, unit: "" },
            { label: "Corners", home: match.corners.home, away: match.corners.away, unit: "" },
            { label: "Fouls", home: match.fouls.home, away: match.fouls.away, unit: "" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">{stat.home}{stat.unit}</span>
                <span className="text-[10px] uppercase tracking-wider">{stat.label}</span>
                <span className="font-medium">{stat.away}{stat.unit}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
                <div className="bg-foreground transition-all" style={{ width: `${(stat.home / (stat.home + stat.away)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Summary */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">AI Summary</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Spain dominated possession (58%) and created more chances throughout the match. Pedri's opener in the 23rd minute set the tone, and Morata's header just before the hour mark doubled the lead. Brazil fought back through Vinícius Jr. in the 72nd minute but couldn't find an equalizer. Spain's defensive organization was key, limiting Brazil to just 3 shots on target.
          </p>
        </div>
      </section>

      {/* Prediction */}
      <section className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Pre-match Prediction</h2>
        </div>
        <p className="text-xs text-muted-foreground">AI predicted: Spain 58% win probability · Confidence: High</p>
      </section>
    </div>
  )
}
