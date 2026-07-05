"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Bot, User, ArrowUp, Copy, RotateCcw, ChevronDown, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { PredictionCard } from "@/components/cards/prediction-card"
import { StandingsCard } from "@/components/cards/standings-card"
import { FixtureCard } from "@/components/cards/fixture-card"

interface Message {
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
  const [hasStarted, setHasStarted] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
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
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery)
    }
  }, [])

  function handleScroll() {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  function generateComponents(content: string): React.ReactNode[] {
    const components: React.ReactNode[] = []
    const lower = content.toLowerCase()

    if (lower.includes("prediction") || lower.includes("win") || lower.includes("probability")) {
      components.push(
        <PredictionCard
          key="pred"
          homeTeam="Spain"
          awayTeam="Brazil"
          homeWin={58}
          awayWin={42}
          confidence="High"
          link="/match/1"
        />
      )
    }
    if (lower.includes("standing") || lower.includes("group") || lower.includes("table")) {
      components.push(
        <StandingsCard
          key="stand"
          group="Group A"
          teams={[
            { pos: 1, name: "Spain", pts: 9 },
            { pos: 2, name: "Japan", pts: 6 },
            { pos: 3, name: "Mexico", pts: 3 },
            { pos: 4, name: "Morocco", pts: 0 },
          ]}
          link="/match/1"
        />
      )
    }
    if (lower.includes("fixture") || lower.includes("today") || lower.includes("match") || lower.includes("schedule")) {
      components.push(
        <div key="fixtures" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FixtureCard home="Spain" away="Brazil" time="20:00 UTC" stage="Quarter Final" link="/match/1" />
          <FixtureCard home="France" away="Germany" time="16:00 UTC" stage="Quarter Final" link="/match/2" />
          <FixtureCard home="Argentina" away="Portugal" time="18:00 UTC" stage="Quarter Final" link="/match/3" />
          <FixtureCard home="England" away="Netherlands" time="21:00 UTC" stage="Quarter Final" link="/match/4" />
        </div>
      )
    }

    return components
  }

  async function handleSend(message?: string) {
    const text = (message || input).trim()
    if (!text || loading) return

    setHasStarted(true)
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: text }])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      const content = data.response || data.content || ""

      const components = generateComponents(content)

      setMessages((prev) => [...prev, { role: "assistant", content, components: components.length > 0 ? components : undefined }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
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

  // Initial state — show the welcome screen
  if (!hasStarted && !initialQuery) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl w-full mx-auto text-center space-y-8"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground">
                AI Copilot for the FIFA World Cup
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                KickIQ
              </h1>
              <p className="text-lg text-muted-foreground">
                Your AI Copilot for Every World Cup Match.
              </p>
            </div>

            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about the World Cup..."
                rows={1}
                className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3.5 pr-12 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/40 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background disabled:opacity-30 transition-opacity"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3.5 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
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

  // Conversation state
  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  msg.role === "assistant"
                    ? "bg-foreground text-background"
                    : "bg-accent text-muted-foreground"
                }`}
              >
                {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div className={`flex flex-col ${msg.role === "user" ? "items-end" : ""} max-w-[85%]`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-card border border-border"
                  }`}
                >
                  {msg.content}
                </div>

                {msg.components && (
                  <div className="mt-3 space-y-3 w-full">
                    {msg.components.map((comp, idx) => (
                      <div key={idx}>{comp}</div>
                    ))}
                  </div>
                )}

                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1 mt-1.5 px-1">
                    <button
                      onClick={() => copyMessage(msg.content)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
                      <RotateCcw className="h-3 w-3" />
                      Regenerate
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "0.15s" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="border-t border-border bg-background">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a match, team, or prediction..."
              rows={1}
              className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-muted-foreground/40 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background disabled:opacity-30 transition-opacity"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground/50 text-center mt-2">
            KickIQ can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
