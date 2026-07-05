import { NextRequest, NextResponse } from "next/server"
import { getClient } from "@/services/ai/openai"

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-402-payment")
    if (!authHeader) {
      return NextResponse.json(
        { error: "x402 payment required" },
        { status: 402 }
      )
    }

    const { homeTeam, awayTeam, homeStats, awayStats } = await req.json()

    const prompt = `Provide a premium tactical analysis for ${homeTeam} vs ${awayTeam}.
Include:
1. Formation prediction with reasoning
2. Key tactical battles
3. Pressing structure analysis
4. Set piece threat assessment
5. Weakness exploitation strategy
6. Predicted score with confidence

Home stats: ${JSON.stringify(homeStats)}
Away stats: ${JSON.stringify(awayStats)}`

    const client = getClient()
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a world-class football tactical analyst." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    })

    return NextResponse.json({ analysis: response.choices[0].message.content })
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
