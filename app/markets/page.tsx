import { MarketsList } from "../components/markets-list"
import Navbar from "../components/Navbar"

export const metadata = {
  title: "Markets - Crypto Tracker",
  description: "Live cryptocurrency prices and market data",
}

export default function MarketsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Live Cryptocurrency Prices</h1>
          <p className="text-muted-foreground">Top 50 cryptocurrencies by market cap. Updates every 60 seconds.</p>
        </div>
        <MarketsList />
      </div>
    </main>
  )
}
