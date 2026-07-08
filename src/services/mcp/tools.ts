import { footballApi } from "@/services/football/api"
import { webSearch, fetchUrl } from "@/services/search"
import type { ChatCompletionTool } from "openai/resources/index.mjs"

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
  if (!fixtures.length) {
    if (args.status === "LIVE") {
      return "No live matches right now. Scheduled/upcoming matches use status='NS'. Completed matches use status='FT'. Call get_fixtures without a status filter to see all matches."
    }
    return "No fixtures found. Try web_search if you're looking for non-World Cup competitions."
  }

  const sorted = [...fixtures].sort((a, b) => {
    if (a.fixture.status.short === "NS" && b.fixture.status.short !== "NS") return -1
    if (a.fixture.status.short !== "NS" && b.fixture.status.short === "NS") return 1
    return 0
  })

  return sorted
    .map(
      (f) =>
        `${f.teams.home.name} vs ${f.teams.away.name} — ` +
        `${f.goals.home ?? "-"} : ${f.goals.away ?? "-"} (${f.fixture.status.short})` +
        (f.fixture.status.short === "NS" ? ` [${f.fixture.date.split("T")[0]}]` : "")
    )
    .join("\n")
}

export async function getLiveScores(): Promise<string> {
  const fixtures = await footballApi.getLiveFixtures()
  if (!fixtures.length) return "Live scores are not available from the World Cup data source. Use web_search to find current live scores."
  return fixtures
    .map(
      (f) =>
        `⚽ ${f.teams.home.name} ${f.goals.home} - ${f.goals.away} ${f.teams.away.name} ` +
        `(${f.fixture.status.elapsed || 0}')`
    )
    .join("\n")
}

export async function getStandings(args: { leagueId?: number; season?: number }): Promise<string> {
  const standingData = await footballApi.getStandings(args.leagueId || 1, args.season || 2026)
  if (!standingData?.league?.standings?.[0]) return "No standings available. Try web_search for non-World Cup competitions."
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
  const t = team
  return `${t.team.name} (${t.team.code || "N/A"}) — ${t.team.country || "N/A"}, Founded ${t.team.founded || "N/A"}`
}

export async function getMatchPrediction(args: { fixtureId: number }): Promise<string> {
  const prediction = await footballApi.getPredictions(args.fixtureId)
  if (!prediction) return "Predictions are not available from the World Cup data source. Use web_search to find expert predictions and odds."
  const p = prediction.predictions
  return [
    `Winner: ${p.winner.name || "Unknown"} (${p.win_or_draw ? "Win or Draw" : "Win only"})`,
    `Advice: ${p.advice || "N/A"}`,
    `Under/Over: ${p.under_over || "N/A"}`,
    `Predicted Score: ${p.goals.home} - ${p.goals.away}`,
  ].join("\n")
}

export async function searchTeams(args: { name: string }): Promise<string> {
  const teams = await footballApi.searchTeams(args.name)
  if (!teams.length) return "No teams found matching that name."
  return teams
    .slice(0, 5)
    .map((t) => `${t.team.name} (ID: ${t.team.id}) — ${t.team.country}`)
    .join("\n")
}

export async function webSearchTool(args: { query: string }): Promise<string> {
  return webSearch(args.query)
}

export async function fetchUrlTool(args: { url: string }): Promise<string> {
  return fetchUrl(args.url)
}

export const mcpToolRegistry: MCPTool[] = [
  {
    name: "get_fixtures",
    description: "Fetch upcoming or past FIFA World Cup fixtures for a given season (defaults to World Cup 2026). Use web_search for other leagues.",
    parameters: {
      type: "object",
      properties: {
        leagueId: { type: "number", description: "League/competition ID (default: 1 for World Cup)" },
        season: { type: "number", description: "Season year (default: current year)" },
        status: { type: "string", description: "Filter by status: NS (not started), LIVE, FT (finished), etc." },
      },
    },
    handler: async (args) => getFixtures(args as Parameters<typeof getFixtures>[0]),
  },
  {
    name: "get_live_scores",
    description: "Fetch live match scores. Note: only World Cup matches available; use web_search for other leagues.",
    parameters: { type: "object", properties: {} },
    handler: async () => getLiveScores(),
  },
  {
    name: "get_standings",
    description: "Fetch FIFA World Cup group standings/table. Use web_search for other competitions.",
    parameters: {
      type: "object",
      properties: {
        leagueId: { type: "number", description: "League/competition ID" },
        season: { type: "number" },
      },
    },
    handler: async (args) => getStandings(args as Parameters<typeof getStandings>[0]),
  },
  {
    name: "get_team_info",
    description: "Fetch information about a specific team by team ID or search by name",
    parameters: {
      type: "object",
      properties: {
        teamId: { type: "number", description: "Team ID (if known)" },
        name: { type: "string", description: "Team name to search for (if ID unknown)" },
      },
    },
    handler: async (args) => {
      if (args.teamId) return getTeamInfo(args as Parameters<typeof getTeamInfo>[0])
      if (args.name) return searchTeams({ name: args.name as string })
      return "Provide either a teamId or a team name."
    },
  },
  {
    name: "get_match_prediction",
    description: "Fetch AI prediction for a specific match by fixture ID. You can get fixture IDs from get_fixtures. For betting odds, use web_search instead.",
    parameters: {
      type: "object",
      properties: {
        fixtureId: { type: "number", description: "Fixture/match ID (get this from get_fixtures)" },
      },
      required: ["fixtureId"],
    },
    handler: async (args) => getMatchPrediction(args as Parameters<typeof getMatchPrediction>[0]),
  },
  {
    name: "web_search",
    description: "Search the web for current information. Use this when the football tools don't have the data you need (e.g., non-World Cup leagues, recent news, live updates, player info).",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
      },
      required: ["query"],
    },
    handler: async (args) => webSearchTool(args as Parameters<typeof webSearchTool>[0]),
  },
  {
    name: "fetch_url",
    description: "Fetch and read the content of a specific URL. Use this to get full information from a web page found via web_search.",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "The URL to fetch" },
      },
      required: ["url"],
    },
    handler: async (args) => fetchUrlTool(args as Parameters<typeof fetchUrlTool>[0]),
  },
]

export function getToolDefinitions(): ChatCompletionTool[] {
  return mcpToolRegistry.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters as Record<string, unknown>,
    },
  }))
}
