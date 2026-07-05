import { NextRequest, NextResponse } from "next/server"
import { verifyPayment } from "@/services/injective/x402"

export async function GET(req: NextRequest) {
  const txHash = req.nextUrl.searchParams.get("txHash")
  if (!txHash) {
    return NextResponse.json({ error: "txHash required" }, { status: 400 })
  }
  const verified = await verifyPayment(txHash)
  return NextResponse.json({ verified })
}
