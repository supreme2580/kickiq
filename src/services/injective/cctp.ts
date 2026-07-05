export interface CCTPTransferParams {
  sourceDomain: number
  destinationDomain: number
  amount: string
  recipient: string
  destinationCaller?: string
}

export interface CCTPQuote {
  sourceAmount: string
  destinationAmount: string
  fee: string
}

const CCTP_CONTRACT_ADDRESS =
  process.env.CCTP_CONTRACT_ADDRESS || "inj1..."

export async function getCCTPQuote(
  sourceDomain: number,
  destinationDomain: number,
  amount: string
): Promise<CCTPQuote> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INJECTIVE_REST_URL}/cctp/v1/quote`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_domain: sourceDomain, destination_domain: destinationDomain, amount }),
    }
  )
  return response.json()
}

export async function initiateCCTPTransfer(params: CCTPTransferParams) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INJECTIVE_REST_URL}/cctp/v1/transfer`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_domain: params.sourceDomain,
        destination_domain: params.destinationDomain,
        amount: params.amount,
        recipient: params.recipient,
      }),
    }
  )
  return response.json()
}

export function buildCCTPMessage(params: CCTPTransferParams) {
  return {
    contractAddress: CCTP_CONTRACT_ADDRESS,
    action: "depositForBurn",
    params: {
      amount: params.amount,
      destinationDomain: params.destinationDomain,
      mintRecipient: params.recipient,
      destinationCaller: params.destinationCaller || "0x0000000000000000000000000000000000000000",
    },
  }
}
