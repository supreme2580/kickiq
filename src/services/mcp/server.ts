import { mcpToolRegistry } from "./tools"
import { footballApi } from "@/services/football/api"

export interface MCPRequest {
  tool: string
  arguments: Record<string, unknown>
}

export interface MCPResponse {
  success: boolean
  data?: string
  error?: string
}

export async function handleMCPRequest(request: MCPRequest): Promise<MCPResponse> {
  const tool = mcpToolRegistry.find((t) => t.name === request.tool)
  if (!tool) {
    return { success: false, error: `Unknown tool: ${request.tool}` }
  }
  try {
    const result = await tool.handler(request.arguments)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getContextForMatch(matchId: number) {
  const match = await footballApi.getFixtureById(matchId)
  if (!match) return null
  return {
    matchId,
    homeTeam: match.teams.home.name,
    awayTeam: match.teams.away.name,
    score: `${match.goals.home ?? 0} - ${match.goals.away ?? 0}`,
    status: match.fixture.status.short,
    date: match.fixture.date,
  }
}

export async function getRichContext(query: string) {
  const lower = query.toLowerCase()
  const parts: string[] = []

  if (lower.includes("live") || lower.includes("score")) {
    const live = await mcpToolRegistry.find((t) => t.name === "get_live_scores")!.handler({})
    parts.push("=== Live Scores ===\n" + live)
  }

  if (lower.includes("standing") || lower.includes("table") || lower.includes("rank")) {
    const standings = await mcpToolRegistry.find((t) => t.name === "get_standings")!.handler({})
    parts.push("=== Standings ===\n" + standings)
  }

  if (lower.includes("fixture") || lower.includes("match") || lower.includes("upcoming")) {
    const fixtures = await mcpToolRegistry.find((t) => t.name === "get_fixtures")!.handler({})
    parts.push("=== Fixtures ===\n" + fixtures)
  }

  return parts.join("\n\n")
}
