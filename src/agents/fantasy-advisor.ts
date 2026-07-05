import { getClient, getModel } from "@/services/ai/openai"

export async function getFantasyPicks(
  fixtures: Array<{
    homeTeam: string
    awayTeam: string
    homeDifficulty: number
    awayDifficulty: number
  }>,
  userTeam?: string[]
) {
  const fixturesText = fixtures
    .map(
      (f) =>
        `${f.homeTeam} vs ${f.awayTeam} (${f.homeTeam} difficulty: ${f.homeDifficulty}/5, ${f.awayTeam} difficulty: ${f.awayDifficulty}/5)`
    )
    .join("\n")

  const prompt = [
    `Upcoming fixtures:`,
    fixturesText,
    ``,
    userTeam && userTeam.length > 0 ? `Current squad: ${userTeam.join(", ")}` : "",
    ``,
    `Provide fantasy football recommendations:`,
    `1. Captain pick (highest ceiling)`,
    `2. Differential pick (low ownership, high reward)`,
    `3. Transfer suggestion`,
    `4. Clean sheet prediction`,
    `Be concise — 4 bullet points.`,
  ]
    .filter(Boolean)
    .join("\n")

  const client = getClient()
  const response = await client.chat.completions.create({
    model: getModel(),
    messages: [
      {
        role: "system",
        content: "You are a fantasy football expert. Give actionable, data-driven advice.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 400,
  })

  return response.choices[0].message.content
}
