"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUp, Copy, RotateCcw, ThumbsUp, ThumbsDown, Plus, Trophy, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PredictionCard } from "@/components/cards/prediction-card"
import { StandingsCard } from "@/components/cards/standings-card"
import { FixtureCard } from "@/components/cards/fixture-card"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  components?: React.ReactNode[]
}

const SUGGESTED_PROMPTS = [
  "Who will win today's matches?",
  "Show today's fixtures",
  "Compare Argentina vs Brazil",
  "Predict the World Cup winner",
  "Explain the offside rule",
]

let messageId = 0
function nextId() {
  return `msg-${++messageId}`
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + "px"
    }
  }, [input])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  useEffect(() => {
    if (initialQuery) handleSend(initialQuery)
  }, [])

  function generateComponents(content: string): React.ReactNode[] {
    const lower = content.toLowerCase()
    if (lower.includes("prediction") || lower.includes("win") || lower.includes("probability")) {
      return [<PredictionCard key="pred" homeTeam="Spain" awayTeam="Brazil" homeWin={58} awayWin={42} confidence="High" link="/match/1" />]
    }
    if (lower.includes("standing") || lower.includes("group") || lower.includes("table")) {
      return [<StandingsCard key="stand" group="Group A" teams={[{pos:1,name:"Spain",pts:9},{pos:2,name:"Japan",pts:6},{pos:3,name:"Mexico",pts:3},{pos:4,name:"Morocco",pts:0}]} link="/match/1" />]
    }
    if (lower.includes("fixture") || lower.includes("today") || lower.includes("match") || lower.includes("schedule")) {
      return [
        <div key="fixtures" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FixtureCard home="Spain" away="Brazil" time="20:00 UTC" stage="Quarter Final" link="/match/1" />
          <FixtureCard home="France" away="Germany" time="16:00 UTC" stage="Quarter Final" link="/match/2" />
          <FixtureCard home="Argentina" away="Portugal" time="18:00 UTC" stage="Quarter Final" link="/match/3" />
          <FixtureCard home="England" away="Netherlands" time="21:00 UTC" stage="Quarter Final" link="/match/4" />
        </div>,
      ]
    }
    return []
  }

  async function streamResponse(text: string) {
    setStreamingContent("")
    const words = text.split(" ")
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 50))
      setStreamingContent((prev) => prev + words[i] + " ")
    }
  }

  async function handleSend(message?: string) {
    const text = (message || input).trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: text }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      const fullContent = data.response || data.content || ""

      const components = generateComponents(fullContent)
      await streamResponse(fullContent)

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: fullContent, components: components.length ? components : undefined },
      ])
      setStreamingContent("")
    } catch {
      const errorContent = "Sorry, I encountered an error. Please try again."
      await streamResponse(errorContent)
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: errorContent }])
      setStreamingContent("")
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function copyMessage(content: string) {
    navigator.clipboard.writeText(content)
  }

  // ============ WELCOME SCREEN ============
  if (messages.length === 0 && !loading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl mx-auto text-center space-y-6"
          >
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-foreground">KickIQ</h1>
              <p className="text-sm text-muted-foreground">
                AI Copilot for the World Cup
              </p>
            </div>

            <div className="relative">
              <div className="relative bg-card border border-border rounded-xl shadow-sm overflow-hidden focus-within:border-muted-foreground/40 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about the World Cup..."
                  rows={1}
                  className="w-full resize-none bg-transparent px-4 py-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background disabled:opacity-30 transition-opacity hover:opacity-90"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="px-4 pb-3 text-center">
          <p className="text-xs text-muted-foreground/50">
            KickIQ can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    )
  }

  // ============ CONVERSATION ============
  return (
    <div className="flex flex-col h-full bg-background">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 md:py-8">
          <div className="space-y-1">
            {messages.map((msg) => (
              <div key={msg.id} className="group flex gap-3 px-1 py-3 md:px-4">
                {msg.role === "assistant" ? (
                  <Avatar className="h-7 w-7 rounded-sm mt-0.5">
                    <AvatarFallback className="rounded-sm bg-foreground text-background text-xs">
                      <Trophy className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className="h-7 w-7 rounded-sm mt-0.5">
                    <AvatarFallback className="rounded-sm bg-accent text-muted-foreground text-xs">
                      <span className="text-xs font-medium">Y</span>
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {msg.role === "assistant" ? "KickIQ" : "You"}
                  </p>
                  <div className="text-sm leading-7 text-foreground whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {msg.components && (
                    <div className="pt-3 space-y-3">
                      {msg.components.map((comp, idx) => (
                        <div key={idx}>{comp}</div>
                      ))}
                    </div>
                  )}

                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyMessage(msg.content)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {streamingContent && (
              <div className="group flex gap-3 px-1 py-3 md:px-4">
                <Avatar className="h-7 w-7 rounded-sm mt-0.5">
                  <AvatarFallback className="rounded-sm bg-foreground text-background text-xs">
                    <Trophy className="h-3.5 w-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">KickIQ</p>
                  <div className="text-sm leading-7 text-foreground whitespace-pre-wrap">
                    {streamingContent}
                    <span className="inline-block w-2 h-4 bg-foreground/70 animate-pulse ml-0.5 rounded-sm align-middle" />
                  </div>
                </div>
              </div>
            )}

            {/* Loading dots (before streaming starts) */}
            {loading && !streamingContent && (
              <div className="flex gap-3 px-1 py-3 md:px-4">
                <Avatar className="h-7 w-7 rounded-sm mt-0.5">
                  <AvatarFallback className="rounded-sm bg-foreground text-background text-xs">
                    <Trophy className="h-3.5 w-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">KickIQ</p>
                  <div className="flex gap-1 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "0.15s" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <div className="relative bg-card border border-border rounded-xl shadow-sm overflow-hidden focus-within:border-muted-foreground/40 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a match, team, or prediction..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none max-h-[200px]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background disabled:opacity-30 transition-opacity hover:opacity-90"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-center mt-2 text-muted-foreground/50">
            KickIQ can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
