import type { FootballFixture, FootballTeam, FootballLeague, FootballPrediction } from "./types"

const GITHUB_RAW = "https://raw.githubusercontent.com/openfootball/worldcup.json/master"
const WC_YEARS = [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026]

interface OFMatch {
  round: string
  date: string
  time: string
  team1: string
  team2: string
  score?: { ft: [number | null, number | null]; ht: [number | null, number | null] }
  goals1?: { name: string; minute: string }[]
  goals2?: { name: string; minute: string }[]
  group: string
  ground?: string
  num?: number
}

interface OFData {
  name: string
  matches: OFMatch[]
}

function simpleHash(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

function fixtureId(m: OFMatch): number {
  return simpleHash(`${m.team1}|${m.team2}|${m.date}`) % 1000000
}

function getStatus(m: OFMatch): { short: string; elapsed: number | null } {
  if (!m.score?.ft) return { short: "NS", elapsed: null }
  const ft = m.score.ft
  if (ft[0] === null || ft[1] === null) return { short: "NS", elapsed: null }
  return { short: "FT", elapsed: null }
}

function toApiFixture(m: OFMatch, season: number): FootballFixture {
  const status = getStatus(m)
  const ft = m.score?.ft ?? [null, null]
  const ht = m.score?.ht ?? [null, null]
  return {
    fixture: {
      id: fixtureId(m),
      date: `${m.date}T${m.time || "00:00:00"}Z`,
      status,
      venue: { name: m.ground || "" },
    },
    league: { id: 1, season },
    teams: {
      home: { id: simpleHash(m.team1), name: m.team1, logo: "" },
      away: { id: simpleHash(m.team2), name: m.team2, logo: "" },
    },
    goals: { home: ft[0], away: ft[1] },
    score: {
      halftime: { home: ht[0], away: ht[1] },
      fulltime: { home: ft[0], away: ft[1] },
    },
  }
}

const cache: { [key: string]: OFData } = {}

async function fetchSeason(season: number): Promise<OFData> {
  const key = String(season)
  if (cache[key]) return cache[key]
  const url = `${GITHUB_RAW}/${season}/worldcup.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch World Cup data for ${season}`)
  const data: OFData = await res.json()
  cache[key] = data
  return data
}

function computeStandings(matches: OFMatch[]) {
  const teams: {
    [name: string]: {
      played: number
      won: number
      drawn: number
      lost: number
      goalsFor: number
      goalsAgainst: number
      group: string
    }
  } = {}

  for (const m of matches) {
    const ft = m.score?.ft
    if (!ft || ft[0] === null || ft[1] === null) continue

    for (const t of [m.team1, m.team2]) {
      if (!teams[t]) {
        teams[t] = { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, group: m.group }
      }
      teams[t].group = m.group
    }

    teams[m.team1].played++
    teams[m.team2].played++
    teams[m.team1].goalsFor += ft[0]
    teams[m.team1].goalsAgainst += ft[1]
    teams[m.team2].goalsFor += ft[1]
    teams[m.team2].goalsAgainst += ft[0]

    if (ft[0] > ft[1]) {
      teams[m.team1].won++
      teams[m.team2].lost++
    } else if (ft[0] < ft[1]) {
      teams[m.team2].won++
      teams[m.team1].lost++
    } else {
      teams[m.team1].drawn++
      teams[m.team2].drawn++
    }
  }

  return Object.entries(teams).map(([name, t]) => ({
    rank: 0,
    team: { id: simpleHash(name), name, logo: "" },
    points: t.won * 3 + t.drawn,
    goalsDiff: t.goalsFor - t.goalsAgainst,
    group: t.group,
    form: "",
    status: "",
    description: "",
    all: {
      played: t.played,
      win: t.won,
      draw: t.drawn,
      lose: t.lost,
      goals: { for: t.goalsFor, against: t.goalsAgainst },
    },
  }))
}

export const openfootballApi: {
  getFixtures: (leagueId?: number, season?: number, status?: string) => Promise<FootballFixture[]>
  getLiveFixtures: () => Promise<FootballFixture[]>
  getFixtureById: (id: number) => Promise<FootballFixture | null>
  getTeam: (id: number) => Promise<FootballTeam | null>
  getStandings: (leagueId?: number, season?: number) => Promise<FootballLeague | null>
  getPredictions: (fixtureId: number) => Promise<FootballPrediction | null>
  searchTeams: (name: string) => Promise<FootballTeam[]>
} = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getFixtures(leagueId: number = 1, season: number = 2026, status?: string): Promise<FootballFixture[]> {
    const data = await fetchSeason(season)
    let matches = data.matches
    if (status === "NS") matches = matches.filter((m) => getStatus(m).short === "NS")
    else if (status === "FT") matches = matches.filter((m) => getStatus(m).short === "FT")
    else if (status === "LIVE") matches = []
    return matches.map((m) => toApiFixture(m, season))
  },

  async getLiveFixtures(): Promise<FootballFixture[]> {
    return []
  },

  async getFixtureById(id: number): Promise<FootballFixture | null> {
    for (const season of WC_YEARS) {
      try {
        const data = await fetchSeason(season)
        const m = data.matches.find((m) => fixtureId(m) === id)
        if (m) return toApiFixture(m, season)
      } catch {}
    }
    return null
  },

  async getTeam(id: number): Promise<FootballTeam | null> {
    for (const season of WC_YEARS) {
      try {
        const data = await fetchSeason(season)
        const names = new Set<string>()
        for (const m of data.matches) {
          const hid = simpleHash(m.team1)
          const aid = simpleHash(m.team2)
          if (hid === id) names.add(m.team1)
          if (aid === id) names.add(m.team2)
        }
        if (names.size > 0) {
          const name = [...names][0]
          return {
            team: { id, name, code: name.substring(0, 3).toUpperCase(), country: name, founded: 0, national: true, logo: "" },
            venue: { name: "" },
          } as FootballTeam
        }
      } catch {}
    }
    return null
  },

  async getStandings(leagueId: number = 1, season: number = 2026): Promise<FootballLeague | null> {
    const data = await fetchSeason(season)
    const standings = computeStandings(data.matches)

    const groups = new Map<string, typeof standings>()
    for (const s of standings) {
      if (!groups.has(s.group)) groups.set(s.group, [])
      groups.get(s.group)!.push(s)
    }

    for (const [, groupStandings] of groups) {
      groupStandings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.goalsDiff !== a.goalsDiff) return b.goalsDiff - a.goalsDiff
        return b.all.goals.for - a.all.goals.for
      })
      groupStandings.forEach((s, i) => { s.rank = i + 1 })
    }

    return {
      league: {
        id: leagueId,
        name: "FIFA World Cup",
        country: "World",
        logo: "",
        flag: "",
        season,
        standings: [standings],
      },
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPredictions(_fixtureId: number): Promise<FootballPrediction | null> {
    return null
  },

  async searchTeams(name: string): Promise<FootballTeam[]> {
    const allNames = new Set<string>()
    for (const season of WC_YEARS) {
      try {
        const data = await fetchSeason(season)
        for (const m of data.matches) {
          allNames.add(m.team1)
          allNames.add(m.team2)
        }
      } catch {}
    }
    const lower = name.toLowerCase()
    const matches = [...allNames].filter((n) => n.toLowerCase().includes(lower))
    return matches.slice(0, 5).map((n) => ({
      team: { id: simpleHash(n), name: n, code: n.substring(0, 3).toUpperCase(), country: n, founded: 0, national: true, logo: "" },
      venue: { name: "" },
    }))
  },
}
