import { create } from "zustand"

interface WalletState {
  address: string | null
  balance: string
  chainId: string | null
  walletType: "keplr" | "leap" | null
  connecting: boolean
  connected: boolean
  connect: (type: "keplr" | "leap") => Promise<void>
  disconnect: () => void
  setBalance: (balance: string) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  balance: "0.00",
  chainId: null,
  walletType: null,
  connecting: false,
  connected: false,

  connect: async (type) => {
    set({ connecting: true })
    try {
      const wallet = window[type]
      if (!wallet) {
        throw new Error(`${type === "keplr" ? "Keplr" : "Leap"} wallet not installed`)
      }
      await wallet.enable("injective-1")
      const offlineSigner = wallet.getOfflineSigner("injective-1")
      const accounts = await offlineSigner.getAccounts()
      set({
        address: accounts[0].address,
        walletType: type,
        chainId: "injective-1",
        connected: true,
        connecting: false,
      })
    } catch (err) {
      set({ connecting: false })
      throw err
    }
  },

  disconnect: () => {
    set({
      address: null,
      balance: "0.00",
      chainId: null,
      walletType: null,
      connected: false,
    })
  },

  setBalance: (balance) => set({ balance }),
}))
