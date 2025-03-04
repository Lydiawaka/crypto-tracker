import Image from 'next/image'
import { CryptoTableProps, Crypto } from '@/types'

export default function CryptoTable({ data, onSelect }: CryptoTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">#</th>
            <th className="py-3 px-6 text-left">Coin</th>
            <th className="py-3 px-6 text-right">Price</th>
            <th className="py-3 px-6 text-right">24h Change</th>
            <th className="py-3 px-6 text-right">24h Volume</th>
            <th className="py-3 px-6 text-right">Market Cap</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 dark:text-gray-300 text-sm">
          {data.map((crypto, index) => {
            const priceChangeClass = crypto.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down'
            
            return (
              <tr 
                key={crypto.id} 
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onSelect(crypto)}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    {crypto.image && (
                      <div className="w-6 h-6 mr-3 relative">
                        <Image 
                          src={crypto.image} 
                          alt={crypto.name} 
                          width={24}
                          height={24}
                        />
                      </div>
                    )}
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-gray-400 ml-2">{crypto.symbol.toUpperCase()}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-right">${crypto.current_price.toLocaleString()}</td>
                <td className={`py-3 px-6 text-right ${priceChangeClass}`}>
                  {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="py-3 px-6 text-right">${crypto.total_volume.toLocaleString()}</td>
                <td className="py-3 px-6 text-right">${crypto.market_cap.toLocaleString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}