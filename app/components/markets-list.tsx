"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface Coin {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

export function MarketsList() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const fetchCoins = async () => {
    try {
      setError(null)
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&sparkline=false",
      )
      if (!response.ok) throw new Error("Failed to fetch coins")
      const data = await response.json()
      setCoins(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoins()
    const interval = setInterval(fetchCoins, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cryptocurrencies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md">
          <p className="text-destructive font-semibold mb-2">Error</p>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={fetchCoins}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4">
        <Input
          placeholder="Search by name or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCoins.map((coin) => (
          <Card key={coin.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{coin.name}</h3>
                <p className="text-sm text-muted-foreground uppercase">{coin.symbol}</p>
              </div>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded ${
                  coin.price_change_percentage_24h >= 0
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-lg font-bold text-primary">
                  $
                  {coin.current_price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Market Cap</p>
                <p className="text-sm text-foreground">${(coin.market_cap / 1e9).toFixed(2)}B</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCoins.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No coins found matching your search.</p>
        </div>
      )}
    </div>
  )
}
