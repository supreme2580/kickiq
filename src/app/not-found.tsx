import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-2">
        <Link href="/">
          <Button variant="outline">Home</Button>
        </Link>
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
