'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { CryptoChartProps, ChartData as ApiChartData } from '@/types'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function CryptoChart({ cryptoId }: CryptoChartProps) {
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null)
  const [timeframe, setTimeframe] = useState<string>('7d') // Default to 7 days
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/prices/${cryptoId}/history?days=${timeframe.replace('d', '')}`)
        if (!response.ok) {
          throw new Error('Failed to fetch chart data')
        }
        const data: ApiChartData = await response.json()
        
        // Process data for chart
        const labels = data.prices.map((item: (string | number | Date)[]) => {
          const date = new Date(item[0])
          return date.toLocaleDateString()
        })
        
        const prices = data.prices.map((item: any[]) => item[1])
        
        setChartData({
          labels,
          datasets: [
            {
              label: 'Price (USD)',
              data: prices,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching chart data:', error)
        setLoading(false)
      }
    }

    if (cryptoId) {
      fetchChartData()
    }
  }, [cryptoId, timeframe])

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Price History (${timeframe})`,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: { toLocaleString: () => string }) {
            return '$' + value.toLocaleString()
          }
        }
      }
    }
  }

  return (
    <div>
      <div className="flex mb-4 space-x-2">
        {['24h', '7d', '30d', '90d', '1y'].map((period) => (
          <button
            key={period}
            className={`px-3 py-1 rounded ${
              timeframe === period 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setTimeframe(period)}
          >
            {period}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : chartData ? (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <div className="text-center py-10">No chart data available</div>
      )}
    </div>
  )
}