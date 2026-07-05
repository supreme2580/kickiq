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
}

declare global {
  interface Window extends KeplrWindow {}
}
