import { NextRequest, NextResponse } from "next/server"
import { footballApi } from "@/services/football/api"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params
    const [resource, ...args] = path

    switch (resource) {
      case "fixtures": {
        const [leagueId, season, status] = args
        const data = await footballApi.getFixtures(Number(leagueId) || 1, Number(season) || 2026, status)
        return NextResponse.json(data)
      }
      case "live": {
        const data = await footballApi.getLiveFixtures()
        return NextResponse.json(data)
      }
      case "standings": {
        const [leagueId, season] = args
        const data = await footballApi.getStandings(Number(leagueId) || 1, Number(season) || 2026)
        return NextResponse.json(data)
      }
      case "teams": {
        const [teamId] = args
        if (teamId) {
          const data = await footballApi.getTeam(Number(teamId))
          return NextResponse.json(data)
        }
        return NextResponse.json({ error: "Team ID required" }, { status: 400 })
      }
      case "predictions": {
        const [fixtureId] = args
        if (fixtureId) {
          const data = await footballApi.getPredictions(Number(fixtureId))
          return NextResponse.json(data)
        }
        return NextResponse.json({ error: "Fixture ID required" }, { status: 400 })
      }
      default:
        return NextResponse.json({ error: "Unknown resource" }, { status: 404 })
    }
  } catch (error) {
    console.error("Football API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
