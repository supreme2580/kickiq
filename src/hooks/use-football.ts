import { useQuery } from "@tanstack/react-query"
import { footballApi } from "@/services/football/api"
import type { FootballFixture, FootballLeague } from "@/services/football/types"

export function useLiveFixtures() {
  return useQuery({
    queryKey: ["fixtures", "live"],
    queryFn: () => footballApi.getLiveFixtures(),
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}

export function useFixtures(leagueId = 1, season = 2026, status?: string) {
  return useQuery({
    queryKey: ["fixtures", leagueId, season, status],
    queryFn: () => footballApi.getFixtures(leagueId, season, status),
    staleTime: 60_000,
  })
}

export function useFixture(id: number | null) {
  return useQuery({
    queryKey: ["fixture", id],
    queryFn: () => footballApi.getFixtureById(id!),
    enabled: id != null,
    staleTime: 30_000,
  })
}

export function useStandings(leagueId = 1, season = 2026) {
  return useQuery({
    queryKey: ["standings", leagueId, season],
    queryFn: () => footballApi.getStandings(leagueId, season),
    staleTime: 120_000,
  })
}

export function useTeam(id: number | null) {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => footballApi.getTeam(id!),
    enabled: id != null,
    staleTime: 300_000,
  })
}

export function usePredictions(fixtureId: number | null) {
  return useQuery({
    queryKey: ["prediction", fixtureId],
    queryFn: () => footballApi.getPredictions(fixtureId!),
    enabled: fixtureId != null,
    staleTime: 60_000,
  })
}

export function useSearchTeams(query: string) {
  return useQuery({
    queryKey: ["teams", "search", query],
    queryFn: () => footballApi.searchTeams(query),
    enabled: query.length >= 2,
    staleTime: 300_000,
  })
}
