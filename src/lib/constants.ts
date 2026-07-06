export const APP_NAME = "KickIQ"
export const APP_DESCRIPTION = "Your AI Copilot for Every World Cup Match"
export const APP_TAGLINE = "Smarter Football. Better Insights."

export const INJECTIVE_RPC_URL =
  process.env.INJECTIVE_RPC_URL || "https://injective-rpc.publicnode.com"
export const INJECTIVE_REST_URL =
  process.env.INJECTIVE_REST_URL || "https://injective-api.publicnode.com"

export const WORLD_CUP_COMPETITION_ID = 1
export const WORLD_CUP_SEASON = 2026

export const FEATURES = {
  FREE_PREDICTIONS_PER_DAY: 5,
  PREMIUM_MIN_CONFIDENCE: 0.85,
}

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  CHAT: "/chat",
  MATCH: (id: number) => `/match/${id}`,
  TEAM: (id: number) => `/team/${id}`,
  PREDICTIONS: "/predictions",
  PREMIUM: "/premium",
  STANDINGS: "/standings",
  FIXTURES: "/fixtures",
  SETTINGS: "/settings",
} as const
