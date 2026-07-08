"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, ChevronDown } from "lucide-react"

interface WalletInfo {
  address: string
  balance: string
  chainId: string
}

export function WalletButton() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [connecting, setConnecting] = useState(false)

  async function connectKeplr() {
    setConnecting(true)
    try {
      if (!window.keplr) {
        alert("Please install Keplr wallet extension")
        return
      }
      await window.keplr.enable("injective-1")
      const offlineSigner = window.keplr.getOfflineSigner("injective-1")
      const accounts = await offlineSigner.getAccounts()
      setWallet({
        address: accounts[0].address,
        balance: "0.00",
        chainId: "injective-1",
      })
    } catch (err) {
      console.error("Wallet connection failed:", err)
    } finally {
      setConnecting(false)
    }
  }

  async function connectLeap() {
    setConnecting(true)
    try {
      if (!window.leap) {
        alert("Please install Leap wallet extension")
        return
      }
      await window.leap.enable("injective-1")
      const offlineSigner = window.leap.getOfflineSigner("injective-1")
      const accounts = await offlineSigner.getAccounts()
      setWallet({
        address: accounts[0].address,
        balance: "0.00",
        chainId: "injective-1",
      })
    } catch (err) {
      console.error("Wallet connection failed:", err)
    } finally {
      setConnecting(false)
    }
  }

  function disconnect() {
    setWallet(null)
  }

  if (wallet) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 bg-card/50 hover:bg-accent transition-colors text-sm">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="font-medium">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Injective Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs font-mono text-muted-foreground" disabled>
            {wallet.address}
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="text-xs">
            Balance: {wallet.balance} INJ
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="gap-2 text-red-500">
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm" disabled={connecting} className="gap-2 border-primary/20 hover:bg-primary/5">
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Select Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={connectKeplr} className="gap-2">
          Keplr Wallet
        </DropdownMenuItem>
        <DropdownMenuItem onClick={connectLeap} className="gap-2">
          Leap Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
