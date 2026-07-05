import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="container py-8 space-y-6 animate-in">
      <Link
        href="/standings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Standings
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brazil</h1>
        <p className="text-muted-foreground mt-1">FIFA Ranking: #5</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Form</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1.5">
              {["W", "W", "W", "D", "W"].map((r, i) => (
                <span
                  key={i}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                    r === "W"
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : r === "D"
                        ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        : "bg-red-500/20 text-red-600 dark:text-red-400"
                  }`}
                >
                  {r}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tournament Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { label: "Played", value: "3" },
              { label: "Wins", value: "3", highlight: true },
              { label: "Goals For", value: "9", highlight: true },
              { label: "Goals Against", value: "2" },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className={`font-semibold tabular-nums ${stat.highlight ? "text-primary" : ""}`}>{stat.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Match</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-lg">vs Netherlands</p>
            <p className="text-muted-foreground">Jul 10, 2026 — 18:00 UTC</p>
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Round of 16</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
