"use client"

import Link from "next/link"
import { CalendarDays } from "lucide-react"

const FIXTURES = [
  { id: 1, home: "England", away: "Italy", time: "16:00", date: "Jul 5", venue: "Education City Stadium", stage: "Quarter Final" },
  { id: 2, home: "Belgium", away: "Croatia", time: "18:00", date: "Jul 5", venue: "Al Janoub Stadium", stage: "Quarter Final" },
  { id: 3, home: "Morocco", away: "Japan", time: "21:00", date: "Jul 5", venue: "Lusail Stadium", stage: "Quarter Final" },
  { id: 4, home: "Argentina", away: "Uruguay", time: "16:00", date: "Jul 6", venue: "Ahmed bin Ali Stadium", stage: "Quarter Final" },
  { id: 5, home: "France", away: "Senegal", time: "18:00", date: "Jul 6", venue: "Al Thumama Stadium", stage: "Quarter Final" },
  { id: 6, home: "Portugal", away: "Switzerland", time: "21:00", date: "Jul 6", venue: "Khalifa Stadium", stage: "Quarter Final" },
  { id: 7, home: "Spain", away: "Germany", time: "20:00", date: "Jul 8", venue: "Lusail Stadium", stage: "Semi Final" },
  { id: 8, home: "Brazil", away: "Netherlands", time: "20:00", date: "Jul 9", venue: "Al Bayt Stadium", stage: "Semi Final" },
]

export default function FixturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fixtures</h1>
        <p className="text-muted-foreground mt-1">Upcoming World Cup matches</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIXTURES.map((fixture) => (
          <Link key={fixture.id} href={`/match/${fixture.id}`}>
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3 w-3" />
                  {fixture.date}
                </span>
                <span>{fixture.stage}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium flex-1 text-right">{fixture.home}</span>
                <span className="text-xs text-muted-foreground px-2">vs</span>
                <span className="text-sm font-medium flex-1">{fixture.away}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{fixture.time}</span>
                <span>{fixture.venue}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
