"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Bot, User, ArrowUp, Copy, RotateCcw, ChevronDown, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PredictionCard } from "@/components/cards/prediction-card"
import { StandingTable } from "@/components/cards/standing-table"
import { MatchCard } from "@/components/cards/match-card"
import { PlayerCard } from "@/components/cards/player-card"

interface Message {
  role: "user" | "assistant"
  content: string
  components?: React.ReactNode[]
}

const SUGGESTED_PROMPTS = [
  "Who will win today?",
  "Show today's fixtures",
  "Compare Brazil vs Argentina",
  "Predict the World Cup winner",
  "Show Group A standings",
]

export default function ChatPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi, I'm your AI football assistant. Ask me about matches, predictions, standings, or anything World Cup.",
    },
  ])
  const [input, setInput] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + "px"
    }
  }, [input])

  // Auto-scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle scroll visibility
  function handleScroll() {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle initial query
  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery)
    }
  }, [])

  async function handleSend(message?: string) {
    const text = (message || input).trim()
    if (!text || loading) return

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

      const components: React.ReactNode[] = []
      const content = data.response || data.content || ""

      if (content.toLowerCase().includes("prediction") || content.toLowerCase().includes("win")) {
        components.push(
          <PredictionCard
            key="pred"
            homeTeam="Spain"
            awayTeam="Brazil"
            homeWin={58}
            awayWin={42}
            confidence="High"
            matchLink="/match/1"
          />
        )
      }
      if (content.toLowerCase().includes("standing") || content.toLowerCase().includes("group")) {
        components.push(
          <StandingTable
            key="stand"
            group="Group A"
            teams={[
              { pos: 1, name: "Spain", pts: 9, played: 3, won: 3, drawn: 0, lost: 0, gd: 7 },
              { pos: 2, name: "Japan", pts: 6, played: 3, won: 2, drawn: 0, lost: 1, gd: 3 },
              { pos: 3, name: "Mexico", pts: 3, played: 3, won: 1, drawn: 0, lost: 2, gd: -2 },
              { pos: 4, name: "Morocco", pts: 0, played: 3, won: 0, drawn: 0, lost: 3, gd: -8 },
            ]}
            link="/standings"
          />
        )
      }
      if (content.toLowerCase().includes("fixture") || content.toLowerCase().includes("today") || content.toLowerCase().includes("match")) {
        components.push(
          <MatchCard
            key="fixture"
            homeTeam="Spain"
            awayTeam="Brazil"
            date="Today"
            time="20:00 UTC"
            stage="Quarter Final"
            link="/match/1"
          />
        )
      }
      if (content.toLowerCase().includes("mbapp") || content.toLowerCase().includes("player")) {
        components.push(
          <div key="players" className="grid grid-cols-2 gap-3">
            <PlayerCard name="Kylian Mbappé" team="France" goals={5} assists={3} minutes={540} link="/team/1" />
            <PlayerCard name="Lionel Messi" team="Argentina" goals={4} assists={5} minutes={510} link="/team/2" />
          </div>
        )
      }

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

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] md:h-screen">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
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
                {msg.role === "assistant" && i === 0 && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Assistant</span>
                  </div>
                )}
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
                    {msg.components.map((comp) => comp)}
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

          {messages.length === 1 && !initialQuery && (
            <div className="space-y-2 pt-4">
              <p className="text-xs text-muted-foreground font-medium px-1">Suggested</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
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
            className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shadow-lg"
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
          <p className="text-[11px] text-muted-foreground/50 text-center mt-2">
            KickIQ can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
