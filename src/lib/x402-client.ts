interface PaymentRequirements {
  scheme: string
  network: string
  amount: string
  asset: string
  payTo: string
  maxTimeoutSeconds: number
  extra: Record<string, unknown>
}

interface X402PaymentPayload {
  x402Version: 2
  accepted: PaymentRequirements
  payload: {
    signature: string
    authorization: {
      from: string
      to: string
      value: string
      validAfter: string
      validBefore: string
      nonce: string
    }
  }
}

export async function signX402Payment(
  requirements: PaymentRequirements,
  chainId: number
): Promise<string> {
  const eth = (window as any).ethereum
  if (!eth) {
    throw new Error("Please install MetaMask or another EVM wallet")
  }

  const accounts: string[] = await eth.request({ method: "eth_requestAccounts" })
  const address = accounts[0]

  const now = BigInt(Math.floor(Date.now() / 1000))
  const nonceBytes = new Uint8Array(32)
  crypto.getRandomValues(nonceBytes)
  const nonce =
    "0x" + Array.from(nonceBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

  const auth = {
    from: address,
    to: requirements.payTo,
    value: BigInt(requirements.amount),
    validAfter: now - BigInt(10),
    validBefore: now + BigInt(requirements.maxTimeoutSeconds),
    nonce,
  }

  const signature: string = await eth.request({
    method: "eth_signTypedData_v4",
    params: [
      address,
      JSON.stringify({
        domain: {
          name: "USDC",
          version: "2",
          chainId,
          verifyingContract: requirements.asset,
        },
        types: {
          TransferWithAuthorization: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "validAfter", type: "uint256" },
            { name: "validBefore", type: "uint256" },
            { name: "nonce", type: "bytes32" },
          ],
        },
        primaryType: "TransferWithAuthorization",
        message: {
          from: auth.from,
          to: auth.to,
          value: auth.value.toString(),
          validAfter: auth.validAfter.toString(),
          validBefore: auth.validBefore.toString(),
          nonce: auth.nonce,
        },
      }),
    ],
  })

  const payload: X402PaymentPayload = {
    x402Version: 2,
    accepted: requirements,
    payload: {
      signature,
      authorization: {
        from: auth.from,
        to: auth.to,
        value: auth.value.toString(),
        validAfter: auth.validAfter.toString(),
        validBefore: auth.validBefore.toString(),
        nonce: auth.nonce,
      },
    },
  }

  return btoa(JSON.stringify(payload))
}
