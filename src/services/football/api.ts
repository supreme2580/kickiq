import axios from "axios"
import { API_FOOTBALL_BASE_URL, API_FOOTBALL_KEY } from "@/lib/constants"
import type {
  FootballFixture,
  FootballTeam,
  FootballLeague,
  FootballStatistics,
  FootballPrediction,
} from "./types"

const client = axios.create({
  baseURL: API_FOOTBALL_BASE_URL,
  headers: {
    "x-rapidapi-key": API_FOOTBALL_KEY,
    "x-rapidapi-host": "v3.football.api-sports.io",
  },
})

export const footballApi = {
  async getFixtures(leagueId: number, season: number, status?: string) {
    const { data } = await client.get<{ response: FootballFixture[] }>("/fixtures", {
      params: { league: leagueId, season, status, timezone: "UTC" },
    })
    return data.response
  },

  async getLiveFixtures() {
    const { data } = await client.get<{ response: FootballFixture[] }>("/fixtures", {
      params: { live: "all" },
    })
    return data.response
  },

  async getFixtureById(id: number) {
    const { data } = await client.get<{ response: FootballFixture[] }>("/fixtures", {
      params: { id },
    })
    return data.response[0]
  },

  async getTeam(id: number) {
    const { data } = await client.get<{ response: FootballTeam[] }>("/teams", {
      params: { id },
    })
    return data.response[0]
  },

  async getStandings(leagueId: number, season: number) {
    const { data } = await client.get<{ response: FootballLeague[] }>("/standings", {
      params: { league: leagueId, season },
    })
    return data.response[0]
  },

  async getTeamStatistics(teamId: number, leagueId: number, season: number) {
    const { data } = await client.get<{ response: FootballStatistics[] }>(
      "/teams/statistics",
      {
        params: { team: teamId, league: leagueId, season },
      }
    )
    return data.response
  },

  async getPredictions(fixtureId: number) {
    const { data } = await client.get<{ response: FootballPrediction[] }>("/predictions", {
      params: { fixture: fixtureId },
    })
    return data.response[0]
  },

  async searchTeams(name: string) {
    const { data } = await client.get<{ response: FootballTeam[] }>("/teams", {
      params: { search: name },
    })
    return data.response
  },
}
