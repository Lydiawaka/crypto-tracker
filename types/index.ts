// Base crypto data interface used by multiple components
export interface Crypto {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    total_volume: number;
    market_cap: number;
    // Add other potential fields that might be needed
    circulating_supply?: number;
    total_supply?: number;
    ath?: number;
    ath_change_percentage?: number;
    ath_date?: string;
    atl?: number;
    atl_change_percentage?: number;
    atl_date?: string;
    roi?: any;
    last_updated?: string;
  }
  
  // For PriceCard.tsx
  export interface PriceCardProps {
    crypto: Crypto;
    onClick: () => void;
    isSelected: boolean;
  }
  
  // For CryptoTable.tsx
  export interface CryptoTableProps {
    data: Crypto[];
    onSelect: (crypto: Crypto) => void;
  }
  
  // For CryptoChart.tsx
  export interface CryptoChartProps {
    cryptoId: string;
  }
  
  // API response type for chart data
  export interface ChartData {
    prices: [number, number][]; // Array of [timestamp, price] pairs
    market_caps?: [number, number][]; // Array of [timestamp, market_cap] pairs
    total_volumes?: [number, number][]; // Array of [timestamp, total_volume] pairs
  }