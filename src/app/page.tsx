"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Bot, Shield, Zap, Trophy, Sparkles, BarChart3 } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container relative py-24 md:py-36 text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary font-medium">
              <Sparkles className="h-4 w-4" />
              Built for the Injective Global Cup 2026
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
              Your AI Copilot for{" "}
              <span className="text-gradient">Every World Cup Match</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Predictions, live scores, standings, and premium AI insights —
              powered by Injective&apos;s x402, CCTP, and Agent Skills.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 h-12 px-8 text-base shadow-premium">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base border-primary/20 hover:bg-primary/5">
                Try AI Chat
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto pt-8">
            {[
              { label: "Live Scores", value: "Real-time" },
              { label: "AI Predictions", value: "90%+ accuracy" },
              { label: "Teams", value: "32 nations" },
              { label: "Premium Insights", value: "Injective x402" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/40">
                <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="border-t border-border/40 py-20">
        <div className="container space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Powered by <span className="text-gradient">Injective</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every premium feature is secured by Injective&apos;s newest technologies.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Zap,
                title: "x402 — Premium Access",
                desc: "Pay-per-request AI analysis. Unlock tactical breakdowns, match simulations, and advanced predictions with USDC.",
                gradient: "from-primary/20 to-transparent",
              },
              {
                icon: Shield,
                title: "USDC CCTP — Cross-Chain",
                desc: "Seamless premium subscriptions via cross-chain USDC transfers using Circle's CCTP protocol.",
                gradient: "from-accent/20 to-transparent",
              },
              {
                icon: Bot,
                title: "Agent Skills — AI Agents",
                desc: "Specialized agents for match prediction, tactical analysis, game summaries, and fantasy advice.",
                gradient: "from-primary/20 to-transparent",
              },
            ].map((feature, i) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="group relative overflow-hidden border-border/40 bg-card-premium hover:shadow-premium transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardContent className="relative p-6 space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent/50 shadow-sm">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border/40 py-20 bg-gradient-to-b from-background to-primary/[0.02]">
        <div className="container space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything <span className="text-gradient">World Cup</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              One intelligent assistant for every aspect of the tournament.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { icon: Trophy, label: "Live Scores", desc: "Real-time match updates with stats" },
              { icon: BarChart3, label: "AI Predictions", desc: "Win probability & tactical analysis" },
              { icon: Shield, label: "Standings", desc: "Group tables & knockout brackets" },
              { icon: Sparkles, label: "Team Comparison", desc: "Form, head-to-head & stats" },
            ].map((item) => (
              <motion.div key={item.label} variants={itemVariants}>
                <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 h-12 px-8">
                Explore Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
