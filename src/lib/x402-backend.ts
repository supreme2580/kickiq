import { NextRequest, NextResponse } from "next/server"
import {
  InjectiveFacilitator,
  decodePaymentSignatureHeader,
  INJECTIVE_TESTNET_CAIP2,
  INJECTIVE_MAINNET_CAIP2,
} from "@injectivelabs/x402"

const IS_MAINNET = process.env.INJECTIVE_NETWORK === "mainnet"
export const NETWORK = IS_MAINNET ? INJECTIVE_MAINNET_CAIP2 : INJECTIVE_TESTNET_CAIP2

const USDC_TESTNET = "0x0C382e685bbeeFE5d3d9C29e29E341fEE8E84C5d" as const
const USDC_MAINNET = "0xa00C59fF5a080D2b954d0c75e46E22a0c371235a" as const
export const USDC_ADDRESS = (IS_MAINNET ? USDC_MAINNET : USDC_TESTNET) as `0x${string}`
export const CHAIN_ID = IS_MAINNET ? 1776 : 1439

export interface PaymentConfig {
  amount: string
  description: string
}

const PRIVATE_KEY = process.env.X402_PRIVATE_KEY as `0x${string}` | undefined
const RPC_URL = process.env.INJECTIVE_RPC_URL
const PAY_TO = (process.env.NEXT_PUBLIC_PREMIUM_RECIPIENT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`

function getFacilitator() {
  if (!PRIVATE_KEY) return null
  return new InjectiveFacilitator({
    privateKey: PRIVATE_KEY,
    rpcUrl: RPC_URL,
    allowedAssets: [USDC_ADDRESS],
  })
}

function buildRequirements(amount: string) {
  return {
    scheme: "exact" as const,
    network: NETWORK,
    amount,
    asset: USDC_ADDRESS,
    payTo: PAY_TO,
    maxTimeoutSeconds: 60,
    extra: { name: "USDC", version: "2", assetTransferMethod: "eip3009" },
  }
}

function createPaymentRequiredBody(config: PaymentConfig, url: string) {
  return {
    x402Version: 2,
    error: "PAYMENT-SIGNATURE header is required",
    resource: {
      url,
      description: config.description,
      mimeType: "application/json",
    },
    accepts: [buildRequirements(config.amount)],
  }
}

export async function withX402Payment(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: PaymentConfig
): Promise<NextResponse> {
  const paymentHeader = req.headers.get("payment-signature") ?? req.headers.get("x-payment")

  if (!paymentHeader) {
    return NextResponse.json(createPaymentRequiredBody(config, req.url), { status: 402 })
  }

  let paymentPayload
  try {
    paymentPayload = decodePaymentSignatureHeader(paymentHeader)
  } catch {
    return NextResponse.json(createPaymentRequiredBody(config, req.url), { status: 402 })
  }

  const facilitator = getFacilitator()
  if (!facilitator) {
    return NextResponse.json(
      { error: "Payment facilitator not configured (X402_PRIVATE_KEY)" },
      { status: 500 }
    )
  }

  const requirements = buildRequirements(config.amount)
  const facilitatorReq = { paymentPayload, paymentRequirements: requirements }

  const verifyResult = await facilitator.verify(facilitatorReq)
  if (!verifyResult.isValid) {
    return NextResponse.json(
      {
        error: "Payment verification failed",
        reason: verifyResult.invalidReason,
        message: verifyResult.invalidMessage,
      },
      { status: 402 }
    )
  }

  const settleResult = await facilitator.settle(facilitatorReq)
  if (!settleResult.success) {
    return NextResponse.json(
      {
        error: "Payment settlement failed",
        message: settleResult.errorMessage,
      },
      { status: 402 }
    )
  }

  return handler(req)
}
