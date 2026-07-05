"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Zap, Shield, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function PaymentFlow() {
  const [step, setStep] = useState<"idle" | "paying" | "verifying" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string>("")

  async function handlePayWithX402() {
    setStep("paying")
    try {
      const res = await fetch("/api/injective/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: "0.50", denom: "usdc" }),
      })
      const data = await res.json()

      if (!data.success) {
        toast.error(data.error || "Payment failed")
        setStep("error")
        return
      }

      setTxHash(data.txHash || "mock_tx_123")
      setStep("verifying")

      const verifyRes = await fetch(`/api/injective/verify?txHash=${data.txHash || "mock_tx_123"}`)
      const verifyData = await verifyRes.json()

      if (verifyData.verified) {
        setStep("success")
        toast.success("Premium unlocked!")
      } else {
        setStep("error")
        toast.error("Payment verification failed")
      }
    } catch {
      setStep("error")
      toast.error("Payment failed. Please try again.")
    }
  }

  async function handleSubscribeCCTP() {
    toast.info("CCTP subscription flow — connect wallet and approve USDC transfer.")
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/40 bg-card-premium shadow-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-lg">
            {step === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : step === "error" ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <Zap className="h-5 w-5 text-primary" />
            )}
            {step === "success"
              ? "Premium Active"
              : step === "error"
                ? "Payment Failed"
                : "x402 Pay-Per-Request"}
          </CardTitle>
          <CardDescription>
            {step === "success"
              ? "You now have access to advanced AI analysis."
              : "Pay 0.50 USDC for a single premium analysis."}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {step !== "success" && (
            <Button
              className="w-full gap-2 h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-sm text-primary-foreground"
              onClick={handlePayWithX402}
              disabled={step === "paying" || step === "verifying"}
            >
              {step === "paying" || step === "verifying" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {step === "paying" ? "Processing Payment..." : step === "verifying" ? "Verifying..." : "Pay 0.50 USDC with x402"}
            </Button>
          )}
          {step === "success" && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Payment confirmed successfully
              </div>
              {txHash && (
                <p className="font-mono text-xs text-muted-foreground truncate">
                  TX: {txHash}
                </p>
              )}
            </div>
          )}
          {step === "error" && (
            <Button variant="outline" className="w-full border-border/40" onClick={() => setStep("idle")}>
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-gradient-to-br from-primary/[0.02] to-accent/[0.02]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            USDC CCTP Subscription
          </CardTitle>
          <CardDescription className="text-xs">
            Subscribe monthly with cross-chain USDC via CCTP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Monthly</span>
              <span className="font-semibold">10 USDC</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Quarterly</span>
              <span className="font-semibold">25 USDC <span className="text-[10px] text-primary font-medium">Save 17%</span></span>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5" onClick={handleSubscribeCCTP}>
            <Shield className="h-4 w-4" />
            Subscribe with CCTP
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
