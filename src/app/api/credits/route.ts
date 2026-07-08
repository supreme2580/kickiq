import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { CreditAccount } from "@/models"
import { withX402Payment } from "@/lib/x402-backend"

export const CREDIT_BUNDLES = [
  { credits: 50, amount: "5000000", label: "50 credits" },
  { credits: 100, amount: "9000000", label: "100 credits" },
  { credits: 250, amount: "20000000", label: "250 credits" },
] as const

function getBundleByAmount(amount: string) {
  return CREDIT_BUNDLES.find((b) => b.amount === amount)
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-wallet-address")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()
  const account = await CreditAccount.findOne({ walletAddress: userId })
  return NextResponse.json({ balance: account?.balance ?? 0 })
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-wallet-address")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const action = body.action as string

  if (action === "spend") {
    await connectDB()
    const account = await CreditAccount.findOne({ walletAddress: userId })
    if (!account || account.balance < 1) {
      return NextResponse.json({ success: false, error: "Insufficient credits" }, { status: 402 })
    }
    account.balance -= 1
    await account.save()
    return NextResponse.json({ success: true, remaining: account.balance })
  }

  if (action === "purchase") {
    const bundle = getBundleByAmount(body.amount)
    if (!bundle) {
      return NextResponse.json({ error: "Invalid bundle amount" }, { status: 400 })
    }

    return withX402Payment(
      req,
      async () => {
        await connectDB()
        const account = await CreditAccount.findOneAndUpdate(
          { walletAddress: userId },
          { $inc: { balance: bundle.credits, totalPurchased: bundle.credits } },
          { upsert: true, new: true }
        )
        return NextResponse.json({ success: true, balance: account.balance })
      },
      { amount: bundle.amount, description: `KickIQ ${bundle.label}` }
    )
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
