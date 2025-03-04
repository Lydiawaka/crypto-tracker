import { NextResponse } from 'next/server'
import { Crypto } from '@/types'

// List of cryptocurrencies to track
const CRYPTO_IDS = [
  'bitcoin',
  'ethereum',
  'ripple',
  'cardano',
  'solana',
  'polkadot',
  'dogecoin'
];

export async function GET() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'Accept': 'application/json',
          // Add your API key if you have one
          // 'x-cg-api-key': process.env.COINGECKO_API_KEY as string
        },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }

    const data: Crypto[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cryptocurrency prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}