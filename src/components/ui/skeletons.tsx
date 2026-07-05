import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function MatchCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "justify-end"}`}>
                <Skeleton className={`h-16 rounded-lg ${i % 2 === 0 ? "w-3/4" : "w-1/2"}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
