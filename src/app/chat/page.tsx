import { ChatInterface } from "@/components/chat/chat-interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Lock, Zap } from "lucide-react"

const EXAMPLE_QUESTIONS = [
  "Who will win Brazil vs Argentina?",
  "Compare Spain and France.",
  "Show top scorers this tournament.",
  "Predict the semifinalists.",
  "What's the latest group standings?",
]

export default function ChatPage() {
  return (
    <div className="container py-8 animate-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Ask anything about the World Cup — predictions, analysis, standings, and more.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
          <div className="space-y-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Example Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <p
                    key={q}
                    className="p-2.5 rounded-lg bg-muted/50 hover:bg-muted/80 cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
                  >
                    &ldquo;{q}&rdquo;
                  </p>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-primary" />
                  Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  Unlock advanced tactical analysis and match simulations with Injective x402.
                </p>
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Lock className="h-3 w-3" />
                  <span>0.50 USDC per analysis</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
