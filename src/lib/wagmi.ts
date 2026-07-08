import { createAppKit } from "@reown/appkit/react"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { injectiveTestnet, sepolia } from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!

const networks = [injectiveTestnet, sepolia] as const

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  ssr: true,
})

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata: {
    name: "KickIQ",
    description: "AI Copilot for the World Cup",
    url: typeof window !== "undefined" ? window.location.origin : "https://kickiq.com",
    icons: ["/icon.png"],
  },
  features: {
    email: true,
    socials: ["google", "x", "github", "discord", "apple", "facebook", "farcaster"],
    emailShowWallets: true,
  },
  allWallets: "SHOW",
})

export { wagmiAdapter }
export const wagmiConfig = wagmiAdapter.wagmiConfig
