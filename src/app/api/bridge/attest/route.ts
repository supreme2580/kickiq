import { NextResponse } from "next/server"

const IRIS_API = process.env.IRIS_API_URL || "https://iris-api-sandbox.circle.com"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const txHash = searchParams.get("txHash")
  const sourceDomain = searchParams.get("sourceDomain")

  if (txHash && sourceDomain !== null) {
    // V2: look up by transaction hash (no manual hash computation needed)
    try {
      const response = await fetch(
        `${IRIS_API}/v2/messages/${sourceDomain}?transactionHash=${txHash}`
      )
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    } catch (error: any) {
      console.error("Proxy error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }

  // V1 (legacy): look up by message hash
  const messageHash = searchParams.get("messageHash")
  if (!messageHash) {
    return NextResponse.json({ error: "txHash+sourceDomain or messageHash is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${IRIS_API}/v1/attestations/${messageHash}`)
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText }, { status: response.status })
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
