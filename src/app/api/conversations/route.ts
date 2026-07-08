import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Conversation } from "@/models"

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-wallet-address")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const conversations = await Conversation.find({ walletAddress: userId })
    .select("title createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .lean()

  return NextResponse.json(
    conversations.map((c) => ({
      id: c._id.toString(),
      title: c.title,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))
  )
}

export async function DELETE(req: NextRequest) {
  const userId = req.headers.get("x-wallet-address")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
  }

  await connectDB()
  const conv = await Conversation.findById(id)
  if (!conv || conv.walletAddress !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await Conversation.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
