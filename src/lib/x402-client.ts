import { createWalletClient, custom } from "viem"
import { injective, injectiveTestnet } from "viem/chains"

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
  requirements: PaymentRequirements
): Promise<string> {
  const eth = window.ethereum
  if (!eth) {
    throw new Error("Please install MetaMask or another EVM wallet")
  }

  const chainId = Number(requirements.network.split(":")[1])

  const targetChain = chainId === 1776 ? injective : injectiveTestnet

  const walletClient = createWalletClient({
    chain: targetChain,
    transport: custom(eth),
  })

  await walletClient.switchChain({ id: targetChain.id })

  const [address] = await walletClient.getAddresses()

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

  const domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: `0x${string}`
  } = {
    name: requirements.extra.name as string,
    version: requirements.extra.version as string,
    chainId,
    verifyingContract: requirements.asset as `0x${string}`,
  }

  const message = {
    from: auth.from,
    to: auth.to as `0x${string}`,
    value: auth.value,
    validAfter: auth.validAfter,
    validBefore: auth.validBefore,
    nonce: auth.nonce as `0x${string}`,
  }

  const signature = await walletClient.signTypedData({
    account: address,
    domain,
    types: { TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
    ] },
    primaryType: "TransferWithAuthorization",
    message,
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
