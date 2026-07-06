export interface FootballFixture {
  fixture: {
    id: number
    date: string
    status: { short: string; elapsed: number | null }
    venue: { name: string } | null
  }
  league: { id: number; season: number }
  teams: {
    home: { id: number; name: string; logo: string }
    away: { id: number; name: string; logo: string }
  }
  goals: { home: number | null; away: number | null }
  score: {
    halftime: { home: number | null; away: number | null }
    fulltime: { home: number | null; away: number | null }
  }
}

export interface FootballTeam {
  team: {
    id: number
    name: string
    code: string
    country: string
    founded: number
    national: boolean
    logo: string
  }
  venue: { name: string }
}

export interface FootballStanding {
  rank: number
  team: { id: number; name: string; logo: string }
  points: number
  goalsDiff: number
  group: string
  form: string
  status: string
  description: string
  all: {
    played: number
    win: number
    draw: number
    lose: number
    goals: { for: number; against: number }
  }
}

export interface FootballLeague {
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
    standings: FootballStanding[][]
  }
}

export interface FootballPrediction {
  predictions: {
    winner: { id: number | null; name: string | null }
    win_or_draw: boolean
    under_over: string | null
    goals: { home: string | null; away: string | null }
    advice: string | null
  }
  comparison: Record<string, { home: string; away: string }>
  h2h: FootballFixture[]
}
