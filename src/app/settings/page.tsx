"use client"

import { useState } from "react"
import { Wallet, Bell, Key, CircleHelp, ChevronRight } from "lucide-react"
import { WalletButton } from "@/components/injective/wallet-button"

const SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: Wallet, label: "Wallet", description: "Connect Keplr or Leap wallet", action: <WalletButton /> },
      { icon: Bell, label: "Notifications", description: "Manage alerts and updates" },
      { icon: Key, label: "API Keys", description: "Configure external API keys" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: CircleHelp, label: "Help & Feedback", description: "Get help or report issues" },
    ],
  },
]

const NOTIFICATION_SETTINGS = [
  { label: "Match reminders", enabled: true },
  { label: "Goal alerts", enabled: true },
  { label: "AI predictions", enabled: false },
  { label: "Premium updates", enabled: false },
]

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATION_SETTINGS)

  function toggleNotification(index: number) {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{section.title}</h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                {item.action || <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notifications</h2>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          {notifications.map((notif, i) => (
            <div key={notif.label} className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-medium">{notif.label}</span>
              <button
                onClick={() => toggleNotification(i)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  notif.enabled ? "bg-foreground" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
                    notif.enabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
