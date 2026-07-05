import { getClient, getModel } from "@/services/ai/openai"

export async function analyzeTactics(
  homeTeam: string,
  awayTeam: string,
  homeStats: Array<{ type: string; value: string | number | null }>,
  awayStats: Array<{ type: string; value: string | number | null }>
) {
  const statsSummary = [
    `${homeTeam} stats:`,
    ...homeStats.slice(0, 10).map((s) => `- ${s.type}: ${s.value ?? "N/A"}`),
    ``,
    `${awayTeam} stats:`,
    ...awayStats.slice(0, 10).map((s) => `- ${s.type}: ${s.value ?? "N/A"}`),
  ].join("\n")

  const prompt = `You are a football tactical analyst. Analyze the following match between ${homeTeam} and ${awayTeam}.
Provide a tactical breakdown covering:
1. Formation prediction
2. Key tactical battle
3. Pressing style
4. Set piece threat
5. Weakness to exploit

Stats:
${statsSummary}

Keep it concise — 4-5 bullet points max.`

  const client = getClient()
  const response = await client.chat.completions.create({
    model: getModel(),
    messages: [
      { role: "system", content: "You are a tactical football analyst. Be concise and insightful." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 500,
  })

  return response.choices[0].message.content
}
