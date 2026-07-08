"use client"

import { useState, useRef, useEffect } from "react"
import { Zap, Loader2, Check, ExternalLink, Coins, ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { createWalletClient, custom, createPublicClient, getAddress, padHex, http } from "viem"
import { injectiveTestnet, sepolia } from "viem/chains"
import { useAccount } from "wagmi"
import { useAppKit } from "@reown/appkit/react"
import { INJECTIVE_RPC_URL } from "@/lib/constants"

export const creditBundlePrices = [
  { credits: 50, amount: "5000000", usd: "5" },
  { credits: 100, amount: "9000000", usd: "9" },
  { credits: 250, amount: "20000000", usd: "20" },
]

const USDC_SEPOLIA = getAddress("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238")
const CCTP_TOKEN_MESSENGER = getAddress("0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA")
const CCTP_MESSAGE_TRANSMITTER = getAddress("0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275")
const CCTP_SEPOLIA_DOMAIN = 0
const INJECTIVE_TESTNET_DOMAIN = 29

const CCTP_ABI = [
  {
    name: "depositForBurn",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "destinationDomain", type: "uint32" },
      { name: "mintRecipient", type: "bytes32" },
      { name: "burnToken", type: "address" },
      { name: "destinationCaller", type: "bytes32" },
      { name: "maxFee", type: "uint256" },
      { name: "minFinalityThreshold", type: "uint32" },
    ],
    outputs: [{ name: "depositNonce", type: "uint64" }],
  },
] as const

const MESSAGE_TRANSMITTER_ABI = [
  {
    name: "receiveMessage",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "message", type: "bytes" },
      { name: "attestation", type: "bytes" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
] as const

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const

interface BuyCreditsDialogProps {
  open: boolean
  onClose: () => void
  onCreditsUpdated?: (newBalance: number) => void
}

type Step = "select" | "bridge" | "approve" | "burn" | "attest" | "mint" | "purchase" | "done" | "error"

export function BuyCreditsDialog({ open, onClose, onCreditsUpdated }: BuyCreditsDialogProps) {
  const [step, setStep] = useState<Step>("select")
  const [selectedBundle, setSelectedBundle] = useState<typeof creditBundlePrices[number] | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [showBridge, setShowBridge] = useState(false)

  const { isConnected } = useAccount()
  const { open: openAppKit } = useAppKit()
  const pendingActionRef = useRef<(() => Promise<void>) | null>(null)

  useEffect(() => {
    if (isConnected && pendingActionRef.current) {
      const action = pendingActionRef.current
      pendingActionRef.current = null
      action()
    }
  }, [isConnected])

  async function handleBuyWithX402(bundle: typeof creditBundlePrices[number]) {
    if (!isConnected) {
      pendingActionRef.current = () => handleBuyWithX402(bundle)
      openAppKit()
      return
    }
    setSelectedBundle(bundle)
    setStep("purchase")
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "purchase", amount: bundle.amount }),
      })

      if (res.status === 402) {
        const body = await res.json()
        const requirements = body.accepts?.[0]
        if (!requirements) throw new Error("No payment requirements")

        if (!window.ethereum) {
          setStep("select")
          setErrorMsg("")
          return
        }
        const { signX402Payment } = await import("@/lib/x402-client")
        const header = await signX402Payment(requirements)

        const retryRes = await fetch("/api/credits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "PAYMENT-SIGNATURE": header,
            "X-PAYMENT": header,
          },
          body: JSON.stringify({ action: "purchase", amount: bundle.amount }),
        })

        if (!retryRes.ok) throw new Error("Payment verification failed")
        const data = await retryRes.json()
        setStep("done")
        onCreditsUpdated?.(data.balance)
        return
      }

      const data = await res.json()
      setStep("done")
      onCreditsUpdated?.(data.balance)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.toLowerCase().includes("metamask") || msg.toLowerCase().includes("wallet")) {
        setStep("select")
        return
      }
      setStep("error")
      setErrorMsg("Purchase failed. Try again.")
    }
  }

  async function handleBridgeAndBuy(bundle: typeof creditBundlePrices[number]) {
    if (!isConnected) {
      pendingActionRef.current = () => handleBridgeAndBuy(bundle)
      openAppKit()
      return
    }
    setSelectedBundle(bundle)
    setStep("bridge")
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected.")
      const e = window.ethereum

      setStep("approve")
      const walletClient = createWalletClient({ chain: sepolia, transport: custom(e) })
      await walletClient.switchChain({ id: sepolia.id })
      const [account] = await walletClient.getAddresses()

      const publicClient = createPublicClient({ chain: sepolia, transport: http() })
      
      // Check USDC balance before proceeding
      const balance = await publicClient.readContract({
        address: USDC_SEPOLIA,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [account],
      })
      const amount = BigInt(bundle.amount)
      if (balance < amount) {
        throw new Error(`Insufficient USDC balance on Sepolia. You need at least ${bundle.usd} USDC.`)
      }

      const allowance = await publicClient.readContract({
        address: USDC_SEPOLIA,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [account, CCTP_TOKEN_MESSENGER],
      })

      if (allowance < amount) {
        setStep("approve")
        const hash = await walletClient.writeContract({
          account,
          address: USDC_SEPOLIA,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [CCTP_TOKEN_MESSENGER, amount],
        })
        await publicClient.waitForTransactionReceipt({ hash })
      }

      setStep("burn")
      const mintRecipient = padHex(account, { size: 32 })
      const burnHash = await walletClient.writeContract({
        account,
        address: CCTP_TOKEN_MESSENGER,
        abi: CCTP_ABI,
        functionName: "depositForBurn",
        args: [amount, INJECTIVE_TESTNET_DOMAIN, mintRecipient, USDC_SEPOLIA, "0x0000000000000000000000000000000000000000000000000000000000000000", BigInt(50000), 1000],
        gas: BigInt(500000),
      })
      await publicClient.waitForTransactionReceipt({ hash: burnHash })

      setStep("attest")
      let attestation: { message: string; attestation: string } | null = null
      let attempts = 0
      while (!attestation && attempts < 120) {
        await new Promise((r) => setTimeout(r, 3000))
        try {
          const attestRes = await fetch(`/api/bridge/attest?txHash=${burnHash}&sourceDomain=${CCTP_SEPOLIA_DOMAIN}`)
          if (attestRes.ok) {
            const body = await attestRes.json()
            const msg = body.messages?.[0]
            if (msg?.status === "complete" && msg?.attestation && msg?.message) {
              attestation = { message: msg.message, attestation: msg.attestation }
            }
          }
        } catch (e) {
          console.error("Attestation polling error:", e)
        }
        attempts++
      }
      if (!attestation) throw new Error("Attestation timeout - Circle's indexer did not find the message hash in time.")


      setStep("mint")
      const injWalletClient = createWalletClient({ chain: injectiveTestnet, transport: custom(e) })
      await injWalletClient.switchChain({ id: injectiveTestnet.id })
      const injPublicClient = createPublicClient({
        chain: injectiveTestnet,
        transport: http(INJECTIVE_RPC_URL),
      })

      const mintHash = await injWalletClient.writeContract({
        account,
        address: CCTP_MESSAGE_TRANSMITTER,
        abi: MESSAGE_TRANSMITTER_ABI,
        functionName: "receiveMessage",
        args: [attestation.message as `0x${string}`, attestation.attestation as `0x${string}`],
      })
      await injPublicClient.waitForTransactionReceipt({ hash: mintHash, timeout: 60_000 })

      setStep("purchase")
      await handleBuyWithX402(bundle)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ""
      if (msg.toLowerCase().includes("metamask") || msg.toLowerCase().includes("wallet")) {
        setStep("select")
        return
      }
      setStep("error")
      setErrorMsg(err instanceof Error ? err.message : "Bridge failed")
    }
  }

  function reset() {
    setStep("select")
    setSelectedBundle(null)
    setErrorMsg("")
    setShowBridge(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose() } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
          <DialogDescription>
            Purchase credits for deep analysis queries. 1 credit = 1 deep query.
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-3 py-2">
            {creditBundlePrices.map((bundle) => (
              <button
                key={bundle.credits}
                onClick={() => setSelectedBundle(bundle)}
                className="w-full flex items-center justify-between rounded-lg border border-border hover:bg-accent/50 transition-colors p-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{bundle.credits} credits</p>
                    <p className="text-xs text-muted-foreground">{bundle.usd} USDC</p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90" />
              </button>
            ))}

            {selectedBundle && (
              <div className="space-y-2 pt-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleBuyWithX402(selectedBundle)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Zap className="h-4 w-4" />
                      Pay {selectedBundle.usd} USDC with x402
                    </button>
                    <button
                      onClick={() => setShowBridge(!showBridge)}
                      className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                    >
                      {showBridge ? "Hide" : "Need to bridge USDC from another chain?"}
                    </button>
                    {showBridge && (
                      <button
                        onClick={() => handleBridgeAndBuy(selectedBundle)}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Bridge from Ethereum & Buy
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => openAppKit()}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Zap className="h-4 w-4" />
                    Connect Wallet
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {step === "approve" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Step 1: Approve USDC</p>
            <p className="text-xs text-muted-foreground text-center">Approving {selectedBundle?.usd} USDC for bridging...</p>
          </div>
        )}

        {step === "burn" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Step 2: Bridge USDC</p>
            <p className="text-xs text-muted-foreground text-center">Burning USDC on Sepolia via CCTP...</p>
          </div>
        )}

        {step === "attest" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Step 3: Waiting for Circle attestation</p>
            <p className="text-xs text-muted-foreground text-center">This usually takes 10-30 seconds...</p>
          </div>
        )}

        {step === "mint" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Step 4: Minting on Injective</p>
            <p className="text-xs text-muted-foreground text-center">Minting USDC on Injective testnet...</p>
          </div>
        )}

        {step === "purchase" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Purchasing {selectedBundle?.credits} credits...</p>
            <p className="text-xs text-muted-foreground text-center">Complete the MetaMask signature to pay.</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm font-medium">{selectedBundle?.credits} credits added!</p>
            <button
              onClick={() => { reset(); onClose() }}
              className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <p className="text-sm font-medium text-red-500">Something went wrong</p>
            <p className="text-xs text-muted-foreground text-center">{errorMsg}</p>
            <button
              onClick={() => setStep("select")}
              className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
