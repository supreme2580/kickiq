interface KeplrWindow {
  keplr: {
    enable: (chainId: string) => Promise<void>
    getOfflineSigner: (chainId: string) => {
      getAccounts: () => Promise<Array<{ address: string }>>
    }
  }
  leap: {
    enable: (chainId: string) => Promise<void>
    getOfflineSigner: (chainId: string) => {
      getAccounts: () => Promise<Array<{ address: string }>>
    }
  }
  ethereum?: {
    isMetaMask?: boolean
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    on?: (event: string, handler: (...args: unknown[]) => void) => void
    removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends KeplrWindow {}
}

export {}
