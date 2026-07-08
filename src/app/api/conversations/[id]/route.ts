import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Conversation } from "@/models"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = req.headers.get("x-wallet-address")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  await connectDB()

  const conv = await Conversation.findById(id).lean()
  if (!conv || conv.walletAddress !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({
    id: conv._id.toString(),
    title: conv.title,
    messages: conv.messages,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
  })
}
