import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface TeamCardProps {
  id: number
  name: string
  logo?: string
  code?: string
  country?: string
  position?: number
  points?: number
  form?: string
}

export function TeamCard({ id, name, logo, code, country, position, points, form }: TeamCardProps) {
  return (
    <Link href={`/team/${id}`}>
      <Card className="group border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-premium transition-all duration-300">
        <CardContent className="p-4 flex items-center gap-4">
          {position && (
            <span className="text-2xl font-bold text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors min-w-[2rem]">
              {position}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate group-hover:text-primary transition-colors">{name}</p>
            {country && <p className="text-xs text-muted-foreground">{country}</p>}
          </div>
          <div className="flex items-center gap-2">
            {points != null && (
              <Badge variant="secondary" className="text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                {points} pts
              </Badge>
            )}
            {form && (
              <div className="flex gap-0.5">
                {form.split("").map((result, i) => (
                  <span
                    key={i}
                    className={`inline-block w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                      result === "W"
                        ? "bg-green-500/20 text-green-600 dark:text-green-400"
                        : result === "D"
                          ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                          : "bg-red-500/20 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
