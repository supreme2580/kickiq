import { NextRequest, NextResponse } from "next/server"
import { createPaymentRequest, verifyPayment } from "@/services/injective/x402"

export async function POST(req: NextRequest) {
  try {
    const { amount, denom } = await req.json()
    const result = await createPaymentRequest(amount, denom || "usdc")
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 })
  }
}
