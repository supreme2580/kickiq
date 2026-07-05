import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getClient, getModel } from "@/services/ai/openai"
import { getRichContext } from "@/services/mcp/server"
import { withX402Payment } from "@/lib/x402-backend"
import { connectDB } from "@/lib/db"
import { Conversation } from "@/models"

export async function POST(req: NextRequest) {
  try {
    const { message, mode, conversationId } = await req.json()
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })

    const { userId } = await auth()

    if (mode === "deep") {
      return withX402Payment(
        req,
        async () => {
          const content = await getLLMResponse(message, mode)
          const convId = userId
            ? await persistConversation(userId, conversationId, message, content)
            : null
          return NextResponse.json({ response: content, conversationId: convId })
        },
        { amount: "500000", description: "KickIQ Deep Analysis" }
      )
    }

    const content = await getLLMResponse(message, mode)
    const convId = userId
      ? await persistConversation(userId, conversationId, message, content)
      : null
    return NextResponse.json({ response: content, conversationId: convId })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getLLMResponse(message: string, mode: string) {
  const context = await getRichContext(message)
  const client = getClient()
  const systemContent =
    mode === "deep"
      ? `You are KickIQ in Deep Analysis mode — an elite football tactical analyst and AI scout.
Use the provided context to deliver detailed, structured analysis.

Your response must include:
1. Tactical breakdown of the situation or match
2. Key statistical context from the data
3. Formation, pressing structure, and strategic observations
4. Specific player or team insights
5. A clear, reasoned conclusion

Current context:
${context}`
      : `You are KickIQ, an AI football assistant for the FIFA World Cup.
Be concise, accurate, and insightful. Use the provided context when relevant.
Current context:
${context}`

  const response = await client.chat.completions.create({
    model: getModel(),
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: message },
    ],
    temperature: mode === "deep" ? 0.4 : 0.7,
    max_tokens: mode === "deep" ? 1500 : 1024,
  })

  return response.choices[0].message.content ?? ""
}

async function persistConversation(
  userId: string,
  conversationId: string | null,
  userMessage: string,
  assistantResponse: string
) {
  await connectDB()
  const userMsg = { role: "user" as const, content: userMessage }
  const asstMsg = { role: "assistant" as const, content: assistantResponse }

  if (conversationId) {
    const conv = await Conversation.findById(conversationId)
    if (conv && conv.userId === userId) {
      conv.messages.push(userMsg, asstMsg)
      if (conv.title === "New chat" && userMessage.length <= 80) {
        conv.title = userMessage
      }
      await conv.save()
      return conv._id.toString()
    }
  }

  const conv = await Conversation.create({
    userId,
    title: userMessage.length <= 80 ? userMessage : userMessage.slice(0, 80) + "...",
    messages: [userMsg, asstMsg],
  })

  return conv._id.toString()
}
