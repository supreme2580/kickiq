const X402_FACILITATOR_URL = process.env.NEXT_PUBLIC_X402_FACILITATOR_URL || ""

interface X402PaymentResponse {
  success: boolean
  txHash?: string
  error?: string
}

export async function createPaymentRequest(
  amount: string,
  denom: string = "usdc"
): Promise<X402PaymentResponse> {
  try {
    const recipient = process.env.NEXT_PUBLIC_PREMIUM_RECIPIENT_ADDRESS || ""
    const response = await fetch(`${X402_FACILITATOR_URL}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient,
        amount,
        denom,
        memo: "KickIQ Premium Access",
      }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Payment request failed" }
  }
}

export async function verifyPayment(txHash: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${X402_FACILITATOR_URL}/api/payments/${txHash}/verify`
    )
    const data = await response.json()
    return data.verified === true
  } catch {
    return false
  }
}

export function x402Middleware(handler: Function) {
  return async (req: Request) => {
    const authHeader = req.headers.get("x-402-payment")
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "x402 payment required",
          payment_url: `${X402_FACILITATOR_URL}/api/payments/request`,
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      )
    }
    const verified = await verifyPayment(authHeader)
    if (!verified) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired payment" }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      )
    }
    return handler(req)
  }
}
