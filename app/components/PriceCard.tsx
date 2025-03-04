import Image from 'next/image'
import { PriceCardProps } from '@/types'

export default function PriceCard({ crypto, onClick, isSelected }: PriceCardProps) {
  const priceChangeClass = crypto.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down'
  
  return (
    <div 
      className={`crypto-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        {crypto.image && (
          <div className="w-8 h-8 mr-3 relative">
            <Image 
              src={crypto.image} 
              alt={crypto.name} 
              width={32}
              height={32}
            />
          </div>
        )}
        <div>
          <h3 className="font-bold">{crypto.symbol.toUpperCase()}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{crypto.name}</p>
        </div>
      </div>
      
      <div className="mt-2">
        <p className="text-xl font-bold">${crypto.current_price.toLocaleString()}</p>
        <p className={`text-sm ${priceChangeClass}`}>
          {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'} 
          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
        </p>
      </div>
    </div>
  )
}