export async function predictMatch(
  homeTeam: string,
  awayTeam: string,
  homeStats: Record<string, number | string>,
  awayStats: Record<string, number | string>,
  h2h: Array<{ homeScore: number; awayScore: number }>
) {
  const recentH2h = h2h.slice(-5)
  const homeWins = recentH2h.filter((m) => m.homeScore > m.awayScore).length
  const awayWins = recentH2h.filter((m) => m.awayScore > m.homeScore).length
  const draws = recentH2h.length - homeWins - awayWins
  const homeWinRate = recentH2h.length > 0 ? homeWins / recentH2h.length : 0.33

  const homeForm = Number(homeStats.form) || 50
  const awayForm = Number(awayStats.form) || 50
  const formFactor = (homeForm - awayForm) / 100
  const baseProb = 0.33 + homeWinRate * 0.34 + formFactor * 0.33
  const homeProb = Math.min(Math.max(baseProb, 0.1), 0.9)
  const awayProb = 1 - homeProb - 0.1
  const drawProb = 0.1

  const expectedGoals = homeProb * 2.5 + 0.5

  const winner = homeProb > awayProb ? homeTeam : awayProb > homeProb ? awayTeam : "Draw"

  const keyFactors = []
  if (homeForm > awayForm + 10) keyFactors.push(`${homeTeam} in better recent form`)
  if (homeWins > awayWins) keyFactors.push(`${homeTeam} dominant in recent head-to-head`)
  if (expectedGoals > 2.5) keyFactors.push("High-scoring match expected")

  return {
    winner,
    homeWinProbability: Math.round(homeProb * 100),
    awayWinProbability: Math.round(awayProb * 100),
    drawProbability: Math.round(drawProb * 100),
    expectedScore: {
      home: Math.round(expectedGoals),
      away: Math.round(expectedGoals * (awayProb / homeProb) * 0.8),
    },
    confidence: Math.round((Math.abs(homeProb - awayProb) * 0.5 + 0.5) * 100),
    keyFactors: keyFactors.length > 0 ? keyFactors : ["Closely matched teams"],
    analysis: `Based on recent form and head-to-head record, ${winner} is favored to win. ` +
      `Win probability: ${winner === homeTeam ? Math.round(homeProb * 100) : Math.round(awayProb * 100)}%.`,
  }
}
