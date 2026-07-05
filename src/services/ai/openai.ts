import OpenAI from "openai"

let _client: OpenAI | null = null

export function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }
    _client = new OpenAI({ apiKey })
  }
  return _client
}

export async function streamChat(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
) {
  const client = getClient()
  return client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  })
}

export async function completion(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
) {
  const client = getClient()
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.5,
    max_tokens: 1024,
  })
  return response.choices[0].message.content
}
