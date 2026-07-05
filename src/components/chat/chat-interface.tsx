"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Send, User, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI football assistant. Ask me about matches, predictions, standings, or anything World Cup!",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[600px] border-border/40 bg-card/50 backdrop-blur-sm shadow-glass">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent/50 flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "bg-muted/80 backdrop-blur-sm"
                }`}
              >
                {msg.role === "assistant" && msg === messages[0] && (
                  <Sparkles className="h-3.5 w-3.5 text-primary inline-block mr-1.5 -mt-0.5" />
                )}
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-muted-foreground/30 to-muted-foreground/10 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent/50 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted/80 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-sm">
                <span className="inline-flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <CardContent className="border-t border-border/40 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a match, team, or prediction..."
            disabled={loading}
            className="bg-muted/50 border-border/40 focus-visible:ring-primary/30 rounded-xl"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
