'use client'
import { useState, useEffect } from 'react'
import CryptoTable from './components/CryptoTable'
import CryptoChart from './components/CryptoChart'
import PriceCard from './components/PriceCard'
import { Crypto } from '@/types'
import Navbar from './components/Navbar'
import { RefreshCw, Search } from 'lucide-react'

export default function Home() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [filteredCryptos, setFilteredCryptos] = useState<Crypto[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const response = await fetch('/api/prices')
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data')
      }
      const data: Crypto[] = await response.json()
      setCryptos(data)
      filterCryptos(data, searchQuery)
      
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

  const filterCryptos = (cryptoList: Crypto[], query: string) => {
    if (!query.trim()) {
      setFilteredCryptos(cryptoList)
      return
    }
    
    const lowercaseQuery = query.toLowerCase().trim()
    const filtered = cryptoList.filter(crypto => 
      crypto.name.toLowerCase().includes(lowercaseQuery) || 
      crypto.symbol.toLowerCase().includes(lowercaseQuery)
    )
    
    setFilteredCryptos(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    filterCryptos(cryptos, query)
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
      <section className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cryptocurrency Price Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Live prices and charts for the top cryptocurrencies. Data is refreshed every minute.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search cryptocurrencies..."
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button 
            onClick={handleRefresh} 
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            disabled={refreshing}
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </section>

      {/* Cards for quick price overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredCryptos.length > 0 ? (
          filteredCryptos.map(crypto => (
            <PriceCard 
              key={crypto.id} 
              crypto={crypto} 
              onClick={() => setSelectedCrypto(crypto)}
              isSelected={selectedCrypto?.id === crypto.id}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No cryptocurrencies match your search criteria.
          </div>
        )}
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
        <CryptoTable 
          data={filteredCryptos} 
          onSelect={setSelectedCrypto} 
        />
      </section>
    </div>
  )
}