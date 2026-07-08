import OpenAI from "openai"
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs"

let _client: OpenAI | null = null

export function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OLLAMA_API_KEY
    const baseURL = process.env.LLM_BASE_URL
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY or OLLAMA_API_KEY environment variable is not set")
    }
    _client = new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) })
  }
  return _client
}

export function getModel(): string {
  return process.env.LLM_MODEL || "gpt-4o-mini"
}

export async function streamChat(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
) {
  const client = getClient()
  return client.chat.completions.create({
    model: getModel(),
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  })
}

export async function completion(
  messages: ChatCompletionMessageParam[]
) {
  const client = getClient()
  const response = await client.chat.completions.create({
    model: getModel(),
    messages,
    temperature: 0.5,
    max_tokens: 1024,
  })
  return response.choices[0].message.content
}
