import { getClient, getModel } from "@/services/ai/openai"

export async function summarizeMatch(
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  events: string[],
  stats: Array<{ type: string; value: string | number | null }>
) {
  const eventsText = events.length > 0 ? events.join("\n") : "No detailed events available."
  const statsText = stats.slice(0, 8).map((s) => `- ${s.type}: ${s.value}`).join("\n")

  const prompt = [
    `Match: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
    ``,
    `Key Events:`,
    eventsText,
    ``,
    `Statistics:`,
    statsText,
    ``,
    `Provide a 150-word match summary including:`,
    `1. How the match unfolded`,
    `2. Key moments (goals, cards, saves)`,
    `3. Performance assessment of both teams`,
    `4. Man of the match mention`,
  ].join("\n")

  const client = getClient()
  const response = await client.chat.completions.create({
    model: getModel(),
    messages: [
      { role: "system", content: "You are a football match commentator. Summarize matches concisely and vividly." },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
    max_tokens: 400,
  })

  return response.choices[0].message.content
}
