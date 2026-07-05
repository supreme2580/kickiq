import { MatchCard } from "@/components/match/match-card"
import { CalendarDays } from "lucide-react"

const MOCK_FIXTURES_ALL = [
  {
    fixture: { id: 4, date: "2026-07-05T16:00:00Z", status: { short: "NS", elapsed: null }, venue: { name: "Education City Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 7, name: "England", logo: "" }, away: { id: 8, name: "Italy", logo: "" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  },
  {
    fixture: { id: 5, date: "2026-07-05T18:00:00Z", status: { short: "NS", elapsed: null }, venue: { name: "Al Janoub Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 9, name: "Belgium", logo: "" }, away: { id: 10, name: "Croatia", logo: "" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  },
  {
    fixture: { id: 6, date: "2026-07-05T21:00:00Z", status: { short: "NS", elapsed: null }, venue: { name: "Lusail Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 11, name: "Morocco", logo: "" }, away: { id: 12, name: "Japan", logo: "" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  },
  {
    fixture: { id: 8, date: "2026-07-06T16:00:00Z", status: { short: "NS", elapsed: null }, venue: { name: "Ahmed bin Ali Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 15, name: "Argentina", logo: "" }, away: { id: 16, name: "Uruguay", logo: "" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  },
  {
    fixture: { id: 9, date: "2026-07-06T18:00:00Z", status: { short: "NS", elapsed: null }, venue: { name: "Al Thumama Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 17, name: "France", logo: "" }, away: { id: 18, name: "Senegal", logo: "" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  },
  {
    fixture: { id: 10, date: "2026-07-06T21:00:00Z", status: { short: "NS", elapsed: null }, venue: { name: "Khalifa Stadium" } },
    league: { id: 1, season: 2026 },
    teams: { home: { id: 19, name: "Portugal", logo: "" }, away: { id: 20, name: "Switzerland", logo: "" } },
    goals: { home: null, away: null },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  },
]

export default function FixturesPage() {
  return (
    <div className="container py-8 space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fixtures</h1>
        <p className="text-muted-foreground mt-1">Upcoming World Cup matches</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_FIXTURES_ALL.map((fixture) => (
          <MatchCard key={fixture.fixture.id} fixture={fixture as any} />
        ))}
      </div>
    </div>
  )
}
