import { create } from "zustand"
import type { FootballFixture } from "@/services/football/types"

interface MatchesState {
  liveMatches: FootballFixture[]
  upcomingMatches: FootballFixture[]
  finishedMatches: FootballFixture[]
  loading: boolean
  error: string | null
  setLiveMatches: (matches: FootballFixture[]) => void
  setUpcomingMatches: (matches: FootballFixture[]) => void
  setFinishedMatches: (matches: FootballFixture[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useMatchesStore = create<MatchesState>((set) => ({
  liveMatches: [],
  upcomingMatches: [],
  finishedMatches: [],
  loading: false,
  error: null,

  setLiveMatches: (matches) => set({ liveMatches: matches }),
  setUpcomingMatches: (matches) => set({ upcomingMatches: matches }),
  setFinishedMatches: (matches) => set({ finishedMatches: matches }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
