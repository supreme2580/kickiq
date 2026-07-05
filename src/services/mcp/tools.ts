import { footballApi } from "@/services/football/api"

export interface MCPTool {
  name: string
  description: string
  parameters: Record<string, unknown>
  handler: (args: Record<string, unknown>) => Promise<string>
}

export async function getFixtures(args: { leagueId?: number; season?: number; status?: string }): Promise<string> {
  const fixtures = await footballApi.getFixtures(
    args.leagueId || 1,
    args.season || 2026,
    args.status
  )
  if (!fixtures.length) return "No fixtures found."
  return fixtures
    .slice(0, 10)
    .map(
      (f) =>
        `${f.teams.home.name} vs ${f.teams.away.name} — ` +
        `${f.goals.home ?? "-"} : ${f.goals.away ?? "-"} (${f.fixture.status.short})`
    )
    .join("\n")
}

export async function getLiveScores(): Promise<string> {
  const fixtures = await footballApi.getLiveFixtures()
  if (!fixtures.length) return "No live matches currently."
  return fixtures
    .map(
      (f) =>
        `⚽ LIVE: ${f.teams.home.name} ${f.goals.home} - ${f.goals.away} ${f.teams.away.name} ` +
        `(${f.fixture.status.elapsed || 0}')`
    )
    .join("\n")
}

export async function getStandings(args: { leagueId?: number; season?: number }): Promise<string> {
  const standingData = await footballApi.getStandings(args.leagueId || 1, args.season || 2026)
  if (!standingData?.league?.standings?.[0]) return "No standings available."
  return standingData.league.standings[0]
    .slice(0, 10)
    .map(
      (s) =>
        `${s.rank}. ${s.team.name} — P:${s.all.played} W:${s.all.win} D:${s.all.draw} L:${s.all.lose} ` +
        `GF:${s.all.goals.for} GA:${s.all.goals.against} GD:${s.goalsDiff} Pts:${s.points}`
    )
    .join("\n")
}

export async function getTeamInfo(args: { teamId: number }): Promise<string> {
  const team = await footballApi.getTeam(args.teamId)
  if (!team) return "Team not found."
  return `${team.team.name} (${team.team.code}) — ${team.team.country}, Founded ${team.team.founded}`
}

export async function getMatchPrediction(args: { fixtureId: number }): Promise<string> {
  const prediction = await footballApi.getPredictions(args.fixtureId)
  if (!prediction) return "No prediction available."
  const p = prediction.predictions
  return [
    `Winner: ${p.winner.name || "Unknown"} (${p.win_or_draw ? "Win or Draw" : "Win only"})`,
    `Advice: ${p.advice || "N/A"}`,
    `Under/Over: ${p.under_over || "N/A"}`,
    `Predicted Score: ${p.goals.home} - ${p.goals.away}`,
  ].join("\n")
}

export const mcpToolRegistry: MCPTool[] = [
  {
    name: "get_fixtures",
    description: "Fetch football fixtures for a given league and season",
    parameters: {
      type: "object",
      properties: {
        leagueId: { type: "number", description: "League/competition ID" },
        season: { type: "number", description: "Season year" },
        status: { type: "string", description: "Filter by status: NS, LIVE, FT, etc." },
      },
    },
    handler: async (args) => getFixtures(args as any),
  },
  {
    name: "get_live_scores",
    description: "Fetch currently live match scores",
    parameters: { type: "object", properties: {} },
    handler: async () => getLiveScores(),
  },
  {
    name: "get_standings",
    description: "Fetch league standings",
    parameters: {
      type: "object",
      properties: {
        leagueId: { type: "number" },
        season: { type: "number" },
      },
    },
    handler: async (args) => getStandings(args as any),
  },
  {
    name: "get_team_info",
    description: "Fetch information about a specific team",
    parameters: {
      type: "object",
      properties: {
        teamId: { type: "number", description: "Team ID" },
      },
      required: ["teamId"],
    },
    handler: async (args) => getTeamInfo(args as any),
  },
  {
    name: "get_match_prediction",
    description: "Fetch AI prediction for a specific match",
    parameters: {
      type: "object",
      properties: {
        fixtureId: { type: "number", description: "Fixture/match ID" },
      },
      required: ["fixtureId"],
    },
    handler: async (args) => getMatchPrediction(args as any),
  },
]
