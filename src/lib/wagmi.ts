import { http, createConfig } from "wagmi"
import { injectiveTestnet, sepolia } from "wagmi/chains"

export const wagmiConfig = createConfig({
  chains: [injectiveTestnet, sepolia],
  transports: {
    [injectiveTestnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
})
