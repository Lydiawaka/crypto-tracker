import { NextRequest, NextResponse } from "next/server"
import { ChartData } from "@/types"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const days = searchParams.get("days") || "7"

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          Accept: "application/json",
        },
        // ✅ Move `next` outside headers — it’s not a header
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`)
    }

    const data: ChartData = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching price history:", error)
    return NextResponse.json(
      { error: "Failed to fetch price history" },
      { status: 500 }
    )
  }
}
