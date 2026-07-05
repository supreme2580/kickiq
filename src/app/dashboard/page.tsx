"use client"

import { motion } from "framer-motion"
import { MessageSquare, BarChart3, Trophy, Zap, TrendingUp, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

const LIVE_MATCHES = [
  { home: "Brazil", away: "Argentina", score: "2-1", time: "67'" },
  { home: "Netherlands", away: "England", score: "0-0", time: "32'" },
]

const UPCOMING_MATCHES = [
  { home: "Spain", away: "France", time: "21:00", stage: "Quarter Final" },
  { home: "Germany", away: "Portugal", time: "18:00", stage: "Quarter Final" },
]

const TOP_SCORERS = [
  { name: "Kylian Mbappé", goals: 5, team: "France" },
  { name: "Lionel Messi", goals: 4, team: "Argentina" },
  { name: "Harry Kane", goals: 4, team: "England" },
]

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your World Cup overview</p>
        </div>
        <Link
          href="/chat"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <MessageSquare className="h-4 w-4" />
          Ask AI
        </Link>
      </div>

      {/* Live Matches */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-lg font-semibold">Live Matches</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {LIVE_MATCHES.map((match) => (
            <Link key={match.home} href="/match/1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-5 space-y-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live
                  </span>
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium flex-1 text-right">{match.home}</span>
                  <span className="text-2xl font-bold tabular-nums">{match.score}</span>
                  <span className="text-sm font-medium flex-1">{match.away}</span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Insights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">AI Insights</h2>
          </div>
          <Link href="/chat" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs text-muted-foreground">Brazil 2 - 1 Argentina (67')</p>
            <p className="text-sm leading-relaxed">
              Brazil dominating possession (62%). Argentina needs tactical adjustment.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs text-muted-foreground">Up Next: Spain vs France</p>
            <p className="text-sm leading-relaxed">
              Spain favored (58% win probability).
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs text-muted-foreground">Top Scorer Watch</p>
            <p className="text-sm leading-relaxed">
              Mbappé leads with 5 goals. Could break the record.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Today's Matches</h2>
          </div>
          <Link href="/fixtures" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {UPCOMING_MATCHES.map((match) => (
            <Link key={match.home} href="/fixtures">
              <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{match.home} vs {match.away}</p>
                  <p className="text-xs text-muted-foreground">{match.stage}</p>
                </div>
                <span className="text-xs text-muted-foreground">{match.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Standings & Top Scorers */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Standings</h2>
            </div>
            <Link href="/standings" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="space-y-1">
              <div className="flex items-center text-xs text-muted-foreground px-2 py-1">
                <span className="w-6">#</span>
                <span className="flex-1">Team</span>
                <span className="w-8 text-center">P</span>
                <span className="w-10 text-right">Pts</span>
              </div>
              {[
                { pos: 1, name: "Brazil", pts: 9, p: 3 },
                { pos: 2, name: "Netherlands", pts: 6, p: 3 },
                { pos: 3, name: "Senegal", pts: 3, p: 3 },
                { pos: 4, name: "Cameroon", pts: 0, p: 3 },
              ].map((team) => (
                <div key={team.name} className="flex items-center text-sm px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors">
                  <span className={`w-6 font-medium ${team.pos <= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                    {team.pos}
                  </span>
                  <span className="flex-1 font-medium">{team.name}</span>
                  <span className="w-8 text-center text-muted-foreground tabular-nums">{team.p}</span>
                  <span className="w-10 text-right font-bold tabular-nums">{team.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Top Scorers</h2>
            </div>
            <span className="text-xs text-muted-foreground">Golden Boot race</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="space-y-2">
              {TOP_SCORERS.map((player, i) => (
                <div key={player.name} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-accent/50 transition-colors">
                  <span className="text-xs text-muted-foreground font-medium w-4 text-center">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.team}</p>
                  </div>
                  <span className="text-lg font-bold tabular-nums">{player.goals}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Premium Callout */}
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
            <Zap className="h-5 w-5 text-background" />
          </div>
          <div>
            <p className="text-sm font-medium">Unlock Premium Insights</p>
            <p className="text-xs text-muted-foreground mt-0.5">Deep tactical analysis powered by Injective</p>
          </div>
        </div>
        <Link
          href="/premium"
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Upgrade <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
