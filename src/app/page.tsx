"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowUp, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Zap, Loader2, Bot, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { WorldCupIcon } from "@/components/icons/world-cup"
import { PredictionCard } from "@/components/cards/prediction-card"
import { StandingsCard } from "@/components/cards/standings-card"
import { FixtureCard } from "@/components/cards/fixture-card"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { useAppKitAccount } from "@reown/appkit/react"
import { BuyCreditsDialog } from "@/components/credits/buy-dialog"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  components?: React.ReactNode[]
  tools?: string[]
}

interface CardData {
  type: "prediction" | "standings" | "fixture"
  [key: string]: unknown
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

function ModeToggle({ mode, setMode }: { mode: "simple" | "deep"; setMode: (m: "simple" | "deep") => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
      >
        {mode === "simple" ? <Bot className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5 text-primary" />}
        <span className={mode === "deep" ? "text-primary" : ""}>
          {mode === "simple" ? "KickIQ" : "KickIQ Deep"}
        </span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
        {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-44 rounded-lg border border-border bg-popover shadow-lg z-[100] overflow-hidden">
          <button
            onClick={() => { setMode("simple"); setDropdownOpen(false) }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
              mode === "simple"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <Bot className="h-3.5 w-3.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">KickIQ</div>
              <div className="text-[10px] text-muted-foreground/60">Quick answers</div>
            </div>
          </button>
          <button
            onClick={() => { setMode("deep"); setDropdownOpen(false) }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
              mode === "deep"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <Zap className="h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">KickIQ Deep</div>
              <div className="text-[10px] text-muted-foreground/60">Tactical analysis</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
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
  const router = useRouter()
  const { isConnected, address } = useAppKitAccount()
  const initialQuery = searchParams.get("q") || ""
  const conversationIdParam = searchParams.get("c")

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"simple" | "deep">("simple")
  const [paymentStep, setPaymentStep] = useState<"idle" | "paying" | "verifying" | "error">("idle")
  const [pendingDeepMessage, setPendingDeepMessage] = useState<string | null>(null)
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false)
  const [paymentHeaderRef, setPaymentHeaderRef] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [showBuyDialog, setShowBuyDialog] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      fetch("/api/credits", { headers: { "x-wallet-address": address } })
        .then((r) => r.ok ? r.json() : { balance: 0 })
        .then((d) => setCreditBalance(d.balance))
        .catch(() => setCreditBalance(0))
    }
  }, [isConnected, address])
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
  }, [messages, showPaymentPrompt])

  useEffect(() => {
    if (initialQuery) handleSend(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  useEffect(() => {
    if (!conversationIdParam) return
    const headers: Record<string, string> = {}
    if (address) headers["x-wallet-address"] = address
    fetch(`/api/conversations/${conversationIdParam}`, { headers })
      .then((r) => {
        if (!r.ok) throw new Error("Not found")
        return r.json()
      })
      .then((data) => {
        setConversationId(data.id)
        const loaded: Message[] = (data.messages || []).map((m: { role: string; content: string }) => ({
          id: nextId(),
          role: m.role,
          content: m.role === "assistant" ? stripCardMarkers(m.content) : m.content,
          components: m.role === "assistant" ? generateComponents(m.content) : [],
        }))
        setMessages(loaded)
      })
      .catch(() => {
        setConversationId(null)
        setMessages([])
      })
  }, [conversationIdParam, address])

  function generateComponents(content: string): React.ReactNode[] {
    const cardRegex = /\[CARD\]([\s\S]*?)\[\/CARD\]/gi
    const nodes: React.ReactNode[] = []
    let match
    while ((match = cardRegex.exec(content)) !== null) {
      try {
        const data: CardData = JSON.parse(match[1])
        switch (data.type) {
          case "prediction":
            nodes.push(
              <PredictionCard
                key={`pred-${nodes.length}`}
                homeTeam={data.homeTeam as string}
                awayTeam={data.awayTeam as string}
                homeWin={data.homeWin as number}
                awayWin={data.awayWin as number}
                confidence={data.confidence as string}
                link={data.link as string}
              />
            )
            break
          case "standings":
            nodes.push(
              <StandingsCard
                key={`stand-${nodes.length}`}
                group={data.group as string}
                teams={data.teams as { pos: number; name: string; pts: number }[]}
                link={data.link as string}
              />
            )
            break
          case "fixture":
            nodes.push(
              <FixtureCard
                key={`fix-${nodes.length}`}
                home={data.home as string}
                away={data.away as string}
                time={data.time as string}
                stage={data.stage as string}
                link={data.link as string}
              />
            )
            break
        }
      } catch {
        continue
      }
    }
    return nodes
  }

  function stripCardMarkers(text: string): string {
    let cleaned = text.replace(/\[CARD\][\s\S]*?\[\/CARD\]/gi, "")
    cleaned = cleaned.replace(/\[CARD\][\s\S]*?$/gi, "")
    return cleaned.trim()
  }

  async function performAPICall(text: string) {
    setLoading(true)
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (address) headers["x-wallet-address"] = address
      if (mode === "deep") {
        headers["x-402-payment"] = "verified"
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: text,
          mode,
          conversationId: isConnected && conversationId ? conversationId : null,
        }),
      })
      const data = await res.json()
      const rawContent = data.rawContent || data.response || data.content || ""
      const displayContent = stripCardMarkers(rawContent)

      if (data.conversationId && isConnected) {
        setConversationId(data.conversationId)
        if (data.conversationId !== conversationIdParam) {
          router.replace(`/?c=${data.conversationId}`, { scroll: false })
        }
      }

      const components = generateComponents(rawContent)
      const newMsgId = nextId()
      const hasTools = Array.isArray(data.tools) && data.tools.length > 0

      if (hasTools) {
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "assistant", content: "", tools: data.tools },
        ])
      }

      setMessages((prev) => {
        const filtered = hasTools ? prev.slice(0, -1) : prev
        return [
          ...filtered,
          { id: newMsgId, role: "assistant", content: displayContent, components: components.length ? components : undefined, tools: hasTools ? data.tools : undefined },
        ]
      })
    } catch {
      const errorContent = "Sorry, I encountered an error. Please try again."
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: errorContent }])
    } finally {
      setLoading(false)
    }
  }

  async function handleSend(message?: string) {
    const text = (message || input).trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: text }])
    setInput("")

    if (mode === "deep") {
      if (creditBalance && creditBalance > 0) {
        setLoading(true)
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-wallet-address": address || "",
              "x-pay-method": "credits",
            },
            body: JSON.stringify({
              message: text,
              mode: "deep",
              conversationId: isConnected && conversationId ? conversationId : null,
            }),
          })
          if (res.ok) {
            const data = await res.json()
            if (data.remainingCredits !== undefined) setCreditBalance(data.remainingCredits)
            const rawContent = data.rawContent || data.response || data.content || ""
            const displayContent = stripCardMarkers(rawContent)
            if (data.conversationId && isConnected) {
              setConversationId(data.conversationId)
              if (data.conversationId !== conversationIdParam) {
                router.replace(`/?c=${data.conversationId}`, { scroll: false })
              }
            }
            const components = generateComponents(rawContent)
            const newMsgId = nextId()
            const hasTools = Array.isArray(data.tools) && data.tools.length > 0
            if (hasTools) {
              setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: "", tools: data.tools }])
            }
            setMessages((prev) => {
              const filtered = hasTools ? prev.slice(0, -1) : prev
              return [...filtered, { id: newMsgId, role: "assistant", content: displayContent, components: components.length ? components : undefined, tools: hasTools ? data.tools : undefined }]
            })
            setLoading(false)
            return
          }
        } catch {}
        setLoading(false)
      }
      setPendingDeepMessage(text)
      setShowPaymentPrompt(true)
      return
    }

    await performAPICall(text)
  }

  async function handlePayment() {
    if (!pendingDeepMessage) return

    setPaymentStep("paying")
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-wallet-address": address || "" },
        body: JSON.stringify({
          message: pendingDeepMessage,
          mode: "deep",
          conversationId: isConnected && conversationId ? conversationId : null,
        }),
      })

      const body = await res.json()
      const requirements = body.accepts?.[0]
      if (!requirements) {
        setPaymentStep("error")
        return
      }

      setPaymentStep("verifying")

      const { signX402Payment } = await import("@/lib/x402-client")
      const header = await signX402Payment(requirements)
      setPaymentHeaderRef(header)
      await sendSignedPayment(header)
    } catch {
      setPaymentStep("error")
    }
  }

  async function sendSignedPayment(header: string) {
    if (!pendingDeepMessage) return

    setLoading(true)
    try {
      const retryRes = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address || "",
          "PAYMENT-SIGNATURE": header,
          "X-PAYMENT": header,
        },
        body: JSON.stringify({
          message: pendingDeepMessage,
          mode: "deep",
          conversationId: isConnected && conversationId ? conversationId : null,
        }),
      })

      if (retryRes.ok) {
        const data = await retryRes.json()
        setShowPaymentPrompt(false)
        setPaymentStep("idle")
        const rawContent = data.rawContent || data.response || data.content || ""
        const displayContent = stripCardMarkers(rawContent)

        if (data.conversationId && isConnected) {
          setConversationId(data.conversationId)
          router.replace(`/?c=${data.conversationId}`, { scroll: false })
        }

        const components = generateComponents(rawContent)
        const newMsgId = nextId()
        const hasTools = Array.isArray(data.tools) && data.tools.length > 0

        if (hasTools) {
          setMessages((prev) => [
            ...prev,
            { id: nextId(), role: "assistant", content: "", tools: data.tools },
          ])
        }

        setMessages((prev) => {
          const filtered = hasTools ? prev.slice(0, -1) : prev
          return [
            ...filtered,
            { id: newMsgId, role: "assistant", content: displayContent, components: components.length ? components : undefined, tools: hasTools ? data.tools : undefined },
          ]
        })

        setPendingDeepMessage(null)
      } else {
        setPaymentStep("error")
      }
    } catch {
      setPaymentStep("error")
    } finally {
      setLoading(false)
    }
  }

  async function handleRetryPayment() {
    if (paymentHeaderRef) {
      setPaymentStep("verifying")
      await sendSignedPayment(paymentHeaderRef)
    } else {
      setPaymentStep("idle")
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function copyMessage(id: string, content: string) {
    navigator.clipboard.writeText(content)
    setCopiedMsgId(id)
    setTimeout(() => setCopiedMsgId(null), 3000)
  }

  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null)

  if (messages.length === 0 && !loading) {
    return (
      <>
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

            {creditBalance !== null && (
              <div className="flex items-center justify-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground">
                  <Zap className="h-3 w-3 text-primary" />
                  <span>{creditBalance} credits</span>
                </div>
                <button
                  onClick={() => setShowBuyDialog(true)}
                  className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  Buy
                </button>
              </div>
            )}

            <div className="relative">
              <div className="relative bg-card border border-border rounded-xl shadow-sm focus-within:border-muted-foreground/40 transition-colors">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about the World Cup..."
                  rows={1}
                  className="w-full resize-none bg-transparent px-4 py-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
                <div className="flex items-center px-3 pb-1.5">
                  <ModeToggle mode={mode} setMode={setMode} />
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background disabled:opacity-30 transition-opacity hover:opacity-90 cursor-pointer"
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
                  className="px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
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
      <BuyCreditsDialog
        open={showBuyDialog}
        onClose={() => setShowBuyDialog(false)}
        onCreditsUpdated={(b) => setCreditBalance(b)}
      />
    </>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {creditBalance !== null && (
        <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-border">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            <span>{creditBalance} credits</span>
          </div>
          <button
            onClick={() => setShowBuyDialog(true)}
            className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
          >
            Buy
          </button>
        </div>
      )}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 md:py-8">
          <div className="space-y-0.5">
            {messages.map((msg) => (
              <div key={msg.id} className="group flex gap-3 px-1 py-1.5 md:px-4">
                {msg.role === "assistant" ? (
                  <Avatar className="h-7 w-7 rounded-sm mt-0.5">
                    <AvatarFallback className="rounded-sm bg-transparent text-foreground">
                      <WorldCupIcon size={16} />
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
                  {msg.tools && msg.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {[...new Set(msg.tools)].map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/50 text-[10px] text-muted-foreground font-mono"
                        >
                          {t === "get_fixtures" && "📅"}
                          {t === "get_live_scores" && "⚡"}
                          {t === "get_standings" && "📊"}
                          {t === "get_team_info" && "ℹ️"}
                          {t === "get_match_prediction" && "🔮"}
                          {t === "web_search" && "🔍"}
                          {t === "fetch_url" && "🌐"}
                          {t.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  )}

                  <MarkdownRenderer content={msg.content} />

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
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        {copiedMsgId === msg.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {showPaymentPrompt && (
              <div className="flex gap-3 px-1 py-1.5 md:px-4">
                <Avatar className="h-7 w-7 rounded-sm mt-0.5">
                  <AvatarFallback className="rounded-sm bg-transparent text-foreground">
                    <WorldCupIcon size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">KickIQ</p>
                  <div className="text-sm text-foreground space-y-3">
                    <p>
                      This question requires <span className="font-medium text-primary">Deep Analysis</span> mode using AI tactical reasoning.
                    </p>
                    <div className="rounded-lg border border-border bg-card/50 p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Pay per request</span>
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3.5 w-3.5 text-primary" />
                          <span className="text-sm font-semibold">0.10 USDC</span>
                        </div>
                      </div>
                      <button
                        onClick={handlePayment}
                        disabled={paymentStep === "paying" || paymentStep === "verifying"}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground text-background py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                      >
                        {paymentStep === "idle" && (
                          <>
                            <Zap className="h-4 w-4" />
                            Pay with x402
                          </>
                        )}
                        {paymentStep === "paying" && (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing Payment...
                          </>
                        )}
                        {paymentStep === "verifying" && (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        )}
                      </button>
                      {paymentStep === "error" && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-red-500">Payment failed. Please try again.</span>
                          <button
                            onClick={handleRetryPayment}
                            className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex gap-3 px-1 py-1.5 md:px-4">
                <Avatar className="h-7 w-7 rounded-sm mt-0.5">
                  <AvatarFallback className="rounded-sm bg-transparent text-foreground">
                    <WorldCupIcon size={16} />
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

      <BuyCreditsDialog
        open={showBuyDialog}
        onClose={() => setShowBuyDialog(false)}
        onCreditsUpdated={(b) => setCreditBalance(b)}
      />
      <div className="bg-background">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <div className="relative bg-card border border-border rounded-xl shadow-sm focus-within:border-muted-foreground/40 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a match, team, or prediction..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none max-h-[200px]"
            />
            <div className="flex items-center px-3 pb-1.5">
               <ModeToggle mode={mode} setMode={setMode} />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="absolute right-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background disabled:opacity-30 transition-opacity hover:opacity-90 cursor-pointer"
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
