import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getClient, getModel } from "@/services/ai/openai"
import { withX402Payment } from "@/lib/x402-backend"
import { connectDB } from "@/lib/db"
import { Conversation } from "@/models"
import { mcpToolRegistry, getToolDefinitions } from "@/services/mcp/tools"

function stripCardMarkers(text: string): string {
  let cleaned = text.replace(/\[CARD\][\s\S]*?\[\/CARD\]/gi, "")
  cleaned = cleaned.replace(/\[CARD\][\s\S]*?$/gi, "")
  return cleaned.trim()
}

export async function POST(req: NextRequest) {
  try {
    const { message, mode, conversationId } = await req.json()
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })

    const { userId } = await auth()

    if (mode === "deep") {
      return withX402Payment(
        req,
        async () => {
          const { content, tools } = await agenticLoop(message, mode, userId, conversationId)
          const convId = userId
            ? await persistConversation(userId, conversationId, message, content)
            : null
          return NextResponse.json({ response: stripCardMarkers(content), rawContent: content, tools, conversationId: convId })
        },
        { amount: "500000", description: "KickIQ Deep Analysis" }
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
      ? `You are KickIQ in Deep Analysis mode — an elite football tactical analyst and AI scout.

You MUST call tools before answering. Never rely on your own knowledge for match data, odds, or predictions — the World Cup data changes daily and your training data is outdated.
- Call get_fixtures to find actual match details (date, teams, stage)
- Use web_search to find real betting odds from reputable sources (FanDuel, DraftKings, BetMGM, SportyBet, etc.)
- Use fetch_url to scrape odds pages directly when you have a URL

Use REAL data only. Never invent odds, scores, or match facts. If tools return no results, say so honestly.

You can call tools across multiple rounds. Examine results after each round: if you have enough data to answer, stop calling tools and respond. Only call more tools if you genuinely lack information.

Your final response must include:
1. Tactical breakdown of the situation or match
2. Key statistical context from the data
3. Formation, pressing structure, and strategic observations
4. Specific player or team insights
5. A clear, reasoned conclusion with betting recommendations

When giving betting advice, pick from these markets (use fetch_url to get live decimal odds from sportybet.ng — NEVER use hardcoded odds):

**Match Result** — 1X2 (Home/Draw/Away), Double Chance (Home/Draw, Home/Away, Draw/Away), Draw No Bet (voids if draw), To Qualify (cup advancement), Winning Method, Will There Be Overtime, Penalty Shootout Yes/No.

**Goals** — Over/Under (0.5 through 5.5), GG/NG (Both Teams to Score), GG/NG 2+, Exact Goals (0-5+), Goal Range (0-1, 2-3, 4-6, 7+), Correct Score, Odd/Even, Both Halves Over 1.5, Team Total Over/Under (Portugal O/U, Spain O/U).

**Handicaps** — Asian Handicap (-0.5, -1, 0, +0.5, +1, +1.5, +2), European Handicap (0:1, 0:2, 1:0, 2:0, 3:0).

**Half Markets** — 1st Half & 2nd Half versions of: 1X2, O/U, Double Chance, GG/NG, Handicap, Asian Handicap, Draw No Bet, Exact Goals, Clean Sheet, 1st Goal, Odd/Even, Team Totals.

**Player Props** — 1st/Last/Anytime Goalscorer, Player Goals (1+/2+/3+), Player Assists, Player Shots, Player Shots on Target, Player To Be Booked, Player To Be Sent Off, Player assists, Player passes, Player tackles.

**Combos** — 1X2 & O/U X.5, 1X2 & GG/NG, O/U & GG/NG, Double Chance & O/U, Double Chance & GG/NG, 1st Goal & 1X2, Halftime/Fulltime combos, Precanned BetBuilders.

**Time-Based** — When will 1st goal be scored, 1X2 from 1-X minutes (multiple windows), Total Goals from 1-X minute windows, Goal in first 10 mins.

**Bookings** — Bookings O/U, Bookings 1X2 (which team gets more), 1st Booking, Sending Off Yes/No, Team Total Bookings, Booking Points O/U, Player To Be Booked.

**Corners** — Corners O/U, Corners 1X2, 1st/Last Corner, Corner Handicap, Team Total Corners, Corner Range, Half versions.

**Stats** — Shots O/U & 1X2, Shots on Target, Saves, Offsides, Fouls, Goal Kicks, Throw-Ins, Tackles, Posts and Crossbars, Substitutions, Penalty Scored Yes/No.

**Team Specials** — Clean Sheet, Win Both Halves, Win Either Half, Win to Nil, Highest Scoring Half, Team Total Goals, Team to Score Yes/No, Score in Both Halves, Win From Behind.

Structure your advice as:
- **Best bets** — 2-3 specific markets with the strongest data backing (e.g., "GG Yes" not just "bet on goals"). Reference team form, H2H record, defensive/attacking stats from match data. Explain *why* the data supports each pick.
- **Bets to avoid** — 1-2 popular-looking markets that the data actually argues against. Explain the trap.
Use data from the tools (fixture history, standings, team info, web search) to support your reasoning. You can mention odds as supporting evidence but the core argument should be data-driven.

Use markdown for rich formatting: **bold** for emphasis, 'code' for stats, --- for section breaks, and ### for section headers.

Include a PredictionCard by wrapping JSON in [CARD]...[/CARD] tags. The [CARD] tag must be COMPLETE with all fields — never truncate it. Never describe the card in text; just emit the tag silently.

Format: [CARD]{"type":"prediction","homeTeam":"...","awayTeam":"...","homeWin":45,"awayWin":55,"confidence":"High","link":"..."}[/CARD]

homeWin and awayWin are win probability percentages derived from odds (lower odds = higher %). The link should point to the odds source page. If you start a [CARD] tag, you MUST close it with [/CARD] and include every field — incomplete cards will be discarded and not shown.`
      : `You are KickIQ, an AI football assistant for the FIFA World Cup.

You MUST call tools before answering. Never rely on your own knowledge — your training data does not include 2026 World Cup results or live betting odds.
- Call get_fixtures to find actual match details
- Call web_search to find real betting odds
- Use fetch_url to scrape odds pages

Use REAL data only. Never invent odds, scores, or match facts. If tools return no results, say so honestly.

You can call tools across multiple rounds. Examine results after each round: if you have enough data to answer, stop calling tools and respond.

Be concise, accurate, and insightful. Use markdown for rich formatting: **bold** for emphasis, 'code' for stats, --- for section breaks.

Include a PredictionCard by wrapping JSON in [CARD]...[/CARD] tags. The [CARD] tag must be COMPLETE with all fields — never truncate it. Never describe the card in text; just emit the tag silently.

Format: [CARD]{"type":"prediction","homeTeam":"...","awayTeam":"...","homeWin":45,"awayWin":55,"confidence":"High","link":"..."}[/CARD]

homeWin and awayWin are win probability percentages derived from odds. If you start a [CARD] tag, you MUST close it with [/CARD] and include every field.`

  const messages: any[] = [{ role: "system", content: systemContent }]

  if (userId && conversationId) {
    await connectDB()
    const conv = await Conversation.findById(conversationId)
    if (conv && conv.userId === userId) {
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
