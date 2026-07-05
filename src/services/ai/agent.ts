import OpenAI from "openai"
import { completion, getClient } from "./openai"

interface ToolResult {
  name: string
  result: string
}

const SYSTEM_PROMPT = `You are KickIQ, an AI football assistant for the FIFA World Cup.
You have access to tools that can fetch live football data, match predictions, team statistics, and standings.
Answer questions about matches, teams, predictions, and tournament insights.
Be concise and accurate. When making predictions, cite relevant statistics.`

export async function runAgent(
  userMessage: string,
  tools: Array<{
    name: string
    description: string
    parameters: Record<string, unknown>
    execute: (args: Record<string, unknown>) => Promise<string>
  }>,
  _context?: { matchId?: number; teamId?: number }
) {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userMessage },
  ]

  const toolDefinitions: OpenAI.Chat.Completions.ChatCompletionTool[] = tools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }))

  const client = getClient()
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools: toolDefinitions,
    tool_choice: "auto",
    temperature: 0.7,
    max_tokens: 2048,
  })

  const choice = response.choices[0]
  const toolCalls = choice.message.tool_calls

  if (toolCalls && toolCalls.length > 0) {
    const results: ToolResult[] = []
    for (const tc of toolCalls) {
      if (tc.type !== "function") continue
      const func = tc.function
      const tool = tools.find((t) => t.name === func.name)
      if (tool) {
        const args = JSON.parse(func.arguments)
        const result = await tool.execute(args)
        results.push({ name: func.name, result })
      }
    }

    messages.push(choice.message)
    for (const r of results) {
      const call = toolCalls.find(
        (tc) => tc.type === "function" && tc.function.name === r.name
      )
      if (call) {
        messages.push({
          role: "tool",
          content: r.result,
          tool_call_id: call.id,
        })
      }
    }
  }

  const finalResponse = await completion(messages as any)
  return finalResponse
}
