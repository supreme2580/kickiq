import { NextRequest, NextResponse } from "next/server"
import { getClient, getModel } from "@/services/ai/openai"
import { withX402Payment } from "@/lib/x402-backend"
import { connectDB } from "@/lib/db"
import { Conversation, CreditAccount } from "@/models"
import { mcpToolRegistry, getToolDefinitions } from "@/services/mcp/tools"
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs"

function stripCardMarkers(text: string): string {
  let cleaned = text.replace(/\[CARD\][\s\S]*?\[\/CARD\]/gi, "")
  cleaned = cleaned.replace(/\[CARD\][\s\S]*?$/gi, "")
  return cleaned.trim()
}

export async function POST(req: NextRequest) {
  try {
    const { message, mode, conversationId } = await req.json()
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })

    const userId = req.headers.get("x-wallet-address")

    if (mode === "deep") {
      const payMethod = req.headers.get("x-pay-method")
      if (payMethod === "credits" && userId) {
        await connectDB()
        const account = await CreditAccount.findOne({ walletAddress: userId })
        if (account && account.balance >= 1) {
          account.balance -= 1
          await account.save()
          const { content, tools } = await agenticLoop(message, mode, userId, conversationId)
          const convId = userId
            ? await persistConversation(userId, conversationId, message, content)
            : null
          return NextResponse.json({ response: stripCardMarkers(content), rawContent: content, tools, conversationId: convId, remainingCredits: account.balance })
        }
      }

      return withX402Payment(
        req,
        async () => {
          const { content, tools } = await agenticLoop(message, mode, userId, conversationId)
          const convId = userId
            ? await persistConversation(userId, conversationId, message, content)
            : null
          return NextResponse.json({ response: stripCardMarkers(content), rawContent: content, tools, conversationId: convId })
        },
        { amount: "100000", description: "KickIQ Deep Analysis" }
      )
    }

    const { content, tools } = await agenticLoop(message, mode, userId, conversationId)
    const convId = userId
      ? await persistConversation(userId, conversationId, message, content)
      : null
    return NextResponse.json({ response: stripCardMarkers(content), rawContent: content, tools, conversationId: convId })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function agenticLoop(
  message: string,
  mode: string,
  userId: string | null,
  conversationId: string | null
): Promise<{ content: string; tools: string[] }> {
  const client = getClient()
  const systemContent =
    mode === "deep"
      ? `You are KickIQ Deep — an elite football tactical analyst and AI scout for the 2026 FIFA World Cup.

YOUR PROCESS (follow every time):
1. Call tools FIRST — never answer from memory. Your training data is outdated; 2026 World Cup data changes daily.
2. If the user doesn't specify a date, competition, or time range, ALWAYS use the most recent data from your tools.
3. Cite what you used — mention the source and recency of your data (e.g. "per 2026 World Cup fixtures", "per latest standings").
4. Be honest — if a tool returns nothing useful, say so. Never invent stats, scores, or odds.

Available tools:
- get_fixtures — match schedule, results, and statuses
- get_live_scores — ongoing match scores
- get_standings — group/league tables
- get_team_info / searchTeams — team lookup
- get_match_prediction — AI prediction for a specific fixture
- web_search — current news, player info, non-World Cup leagues
- fetch_url — read full content from a specific URL

Structure your analysis:
1. Tactical breakdown — formation, strategy, key battles
2. Key stats — form, H2H, goals, defense, from tool data
3. Player/team insights — standout performers, weaknesses
4. Betting advice — 2-3 best bets with data-backed reasoning, 1-2 bets to avoid
5. Clear conclusion

Use web_search to find real current odds from reputable sportsbooks. Compare odds across sources. Never use hardcoded or remembered odds.

FORMATTING RULES:
- Use proper markdown tables (| col | col |) for structured data like schedules, stats comparisons.
- Use **bold** for emphasis, \`code\` for stats, --- for section breaks, ### for headers.
- NEVER use LaTeX math notation ($\text{...}$, $$, etc.). Just use plain text or markdown.

Include a PredictionCard by wrapping complete JSON in [CARD]...[/CARD]. Never truncate it. Never describe the card in text.
Format: [CARD]{"type":"prediction","homeTeam":"...","awayTeam":"...","homeWin":45,"awayWin":55,"confidence":"High","link":"..."}[/CARD]
homeWin/awayWin are win probability percentages from odds (lower odds = higher %). link = odds source.`
      : `You are KickIQ — an AI football assistant for the 2026 FIFA World Cup.

YOUR PROCESS (follow every time):
1. Call tools FIRST — never answer from memory. Your training data does not include 2026 World Cup results.
2. If the user doesn't specify a date or time range, ALWAYS use the most recent tool data.
3. Cite your sources. Be honest if tools return nothing. Never invent facts.

Available tools:
- get_fixtures — match schedule, results, statuses
- get_live_scores — live scores
- get_standings — group tables
- get_team_info / searchTeams — team lookup
- get_match_prediction — AI match prediction
- web_search — current news, player info, odds
- fetch_url — read a page from a URL

Answer concisely and accurately.

FORMATTING RULES:
- Use proper markdown tables (| col | col |) for structured data.
- Use **bold** for emphasis, \`code\` for stats.
- NEVER use LaTeX math notation ($\text{...}$, $$, etc.). Use plain text or markdown only.

Include a PredictionCard with complete JSON in [CARD]...[/CARD] (never truncate).
Format: [CARD]{"type":"prediction","homeTeam":"...","awayTeam":"...","homeWin":45,"awayWin":55,"confidence":"High","link":"..."}[/CARD]
homeWin/awayWin from odds. link = odds source.`

  const messages: ChatCompletionMessageParam[] = [{ role: "system", content: systemContent }]

  if (userId && conversationId) {
    await connectDB()
    const conv = await Conversation.findById(conversationId)
    if (conv && conv.walletAddress === userId) {
      for (const m of conv.messages) {
        messages.push({ role: m.role, content: m.content })
      }
    }
  }

  messages.push({ role: "user", content: message })

  const toolsCalled: string[] = []
  const MAX_ITERATIONS = 5

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const isLast = i === MAX_ITERATIONS - 1
    const toolDefs = getToolDefinitions()

    if (isLast && toolsCalled.length > 0) {
      messages.push({
        role: "system",
        content: "Based on the tool results above, provide your final response to the user's question. Do not call any more tools.",
      })
    }

    let toolChoice: "none" | "auto" | "required" = "auto"
    if (isLast) {
      toolChoice = "none"
    } else if (i === 0) {
      toolChoice = "required"
    }

    const response = await client.chat.completions.create({
      model: getModel(),
      messages,
      tools: toolDefs,
      tool_choice: toolChoice,
      temperature: mode === "deep" ? 0.4 : 0.7,
      max_tokens: mode === "deep" ? 2500 : 1024,
    })

    const choice = response.choices[0]
    const content = choice.message.content ?? ""

    if (isLast) {
      return { content: content || "I gathered some information but couldn't produce a complete analysis. Here's what I found.", tools: toolsCalled }
    }

    if (choice.finish_reason !== "tool_calls" || !choice.message.tool_calls) {
      return { content: content || "I don't have enough information to answer that.", tools: toolsCalled }
    }

    messages.push(choice.message)

    for (const tc of choice.message.tool_calls) {
      if (tc.type !== "function") continue
      const tool = mcpToolRegistry.find((t) => t.name === tc.function.name)
      if (!tool) continue
      toolsCalled.push(tc.function.name)
      const args = JSON.parse(tc.function.arguments)
      const result = await tool.handler(args)
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: result,
      })
    }
  }

  return { content: "I gathered some information but couldn't produce a complete analysis.", tools: toolsCalled }
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
    if (conv && conv.walletAddress === userId) {
      conv.messages.push(userMsg, asstMsg)
      if (conv.title === "New chat" && userMessage.length <= 80) {
        conv.title = userMessage
      }
      await conv.save()
      return conv._id.toString()
    }
  }

  const conv = await Conversation.create({
    walletAddress: userId,
    title: userMessage.length <= 80 ? userMessage : userMessage.slice(0, 80) + "...",
    messages: [userMsg, asstMsg],
  })

  return conv._id.toString()
}
