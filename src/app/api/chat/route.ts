import { NextRequest, NextResponse } from "next/server"
import { getClient } from "@/services/ai/openai"
import { getRichContext } from "@/services/mcp/server"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const context = await getRichContext(message)

    const client = getClient()
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are KickIQ, an AI football assistant for the FIFA World Cup. 
Be concise, accurate, and insightful. Use the provided context when relevant.
Current context:
${context}`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    })

    return NextResponse.json({ response: response.choices[0].message.content })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
