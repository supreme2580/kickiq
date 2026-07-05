import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/providers"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

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
    <html lang="en" className={`h-full antialiased ${inter.variable}`} suppressHydrationWarning>
      <body className="h-full">
        <Providers>
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
              <div className="flex-1">
                {children}
              </div>
            </main>
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
