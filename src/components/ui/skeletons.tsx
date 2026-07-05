import { Skeleton } from "@/components/ui/skeleton"

export function MatchCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <Skeleton className="h-4 w-16" />
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            <Skeleton className={`h-16 rounded-2xl ${i % 2 === 0 ? "w-2/3" : "w-1/2"}`} />
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4">
        <Skeleton className="h-12 max-w-3xl mx-auto rounded-2xl" />
      </div>
    </div>
  )
}
