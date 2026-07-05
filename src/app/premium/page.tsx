import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PaymentFlow } from "@/components/premium/payment-flow"
import { Bot, Shield, Zap, Sparkles } from "lucide-react"

const PREMIUM_FEATURES = [
  {
    title: "Advanced AI Reports",
    description: "Deep tactical analysis for every match — formations, pressing patterns, and weaknesses.",
    icon: Bot,
    gradient: "from-primary/20 to-transparent",
  },
  {
    title: "Match Simulations",
    description: "AI-powered match simulations showing likely outcomes and key scenarios.",
    icon: Zap,
    gradient: "from-accent/20 to-transparent",
  },
  {
    title: "Tactical Breakdowns",
    description: "Professional-grade tactical analysis of team strategies and formations.",
    icon: Shield,
    gradient: "from-primary/20 to-transparent",
  },
]

export default function PremiumPage() {
  return (
    <div className="container py-8 space-y-8 animate-in">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary gap-1.5 px-4 py-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Injective
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Premium <span className="text-gradient">Insights</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Unlock advanced AI analysis powered by Injective x402 and USDC CCTP.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PREMIUM_FEATURES.map((feature) => (
          <Card key={feature.title} className="group relative overflow-hidden border-border/40 bg-card-premium hover:shadow-premium transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <CardHeader className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent/50 shadow-sm mb-2">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="max-w-md mx-auto">
        <PaymentFlow />
      </div>
    </div>
  )
}
