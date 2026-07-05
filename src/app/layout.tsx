import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Providers } from "@/components/layout/providers"

export const metadata: Metadata = {
  title: "KickIQ — AI Copilot for the World Cup",
  description:
    "AI-powered football assistant for the FIFA World Cup. Get predictions, live scores, standings, and premium AI insights powered by Injective.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
