'use client'
import { useState, useEffect } from 'react'
import CryptoTable from './components/CryptoTable'
import CryptoChart from './components/CryptoChart'
import PriceCard from './components/PriceCard'
import { Crypto } from '@/types'
import Navbar from './components/Navbar'
import { RefreshCw } from 'lucide-react'

export default function Home() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/prices')
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data')
      }
      const data: Crypto[] = await response.json()
      setCryptos(data)
      if (!selectedCrypto && data.length > 0) {
        setSelectedCrypto(data[0])
      } else if (selectedCrypto) {
        // Preserve the selected crypto but update its data
        const updatedSelected = data.find(c => c.id === selectedCrypto.id)
        if (updatedSelected) {
          setSelectedCrypto(updatedSelected)
        }
      }
      setLoading(false)
      setRefreshing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Navbar />
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-6">Cryptocurrency Price Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Live prices and charts for the top cryptocurrencies. Data is refreshed every minute.
          </p>
        </div>
        <button 
          onClick={handleRefresh} 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          disabled={refreshing}
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </section>

      {/* Cards for quick price overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cryptos.map(crypto => (
          <PriceCard 
            key={crypto.id} 
            crypto={crypto} 
            onClick={() => setSelectedCrypto(crypto)}
            isSelected={selectedCrypto?.id === crypto.id}
          />
        ))}
      </section>

      {/* Chart for selected crypto */}
      {selectedCrypto && (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()})</h2>
          <CryptoChart cryptoId={selectedCrypto.id} />
        </section>
      )}

      {/* Table with all data */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">All Cryptocurrencies</h2>
        <CryptoTable data={cryptos} onSelect={setSelectedCrypto} />
      </section>
    </div>
  )
}