---
sidebar_position: 4
---

# API Integration

This page explains how the Crypto Price Tracker application integrates with the CoinGecko API to fetch cryptocurrency data.

## CoinGecko API

The application uses the [CoinGecko API](https://www.coingecko.com/en/api/documentation) to fetch cryptocurrency data. CoinGecko provides a free tier that allows for a limited number of requests per minute, which is sufficient for this application's demonstration purposes.

## API Endpoint

The main endpoint used is:

```
GET /coins/markets
```

This endpoint returns a list of cryptocurrencies with market data.

### Request Parameters

| Parameter    | Description                                      | Value Used       |
|--------------|--------------------------------------------------|------------------|
| vs_currency  | The target currency of market data               | usd              |
| order        | Sort by field                                    | market_cap_desc  |
| per_page     | Total results per page                           | 100              |
| page         | Page number                                      | 1                |

## Data Fetching Implementation

In the application, data fetching is implemented using React Query, which provides a clean way to fetch, cache, and update data.

```jsx
// Fetch function
const fetchCryptoData = async () => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
  );
  
    throw new Error('Network response was not ok');
  }
  
  return response.json();
};

// React Query hook usage
const { data, error, isLoading, refetch } = useQuery({
  queryKey: ['cryptoData'],
  queryFn: fetchCryptoData,
  staleTime: 60000, // Data considered fresh for 1 minute
});
```

## Error Handling

The application implements robust error handling for API requests:

1. Network errors are caught and displayed to the user
2. API response errors are handled and appropriate messages are shown
3. Loading states are managed to provide feedback during data fetching

## Caching Strategy

React Query automatically caches the fetched data to minimize unnecessary network requests. The configuration used in this application:

- `staleTime: 60000` - Data is considered fresh for 1 minute
- Manual refetching via the "Refresh" button allows users to get the latest data when needed

This approach balances having up-to-date information with minimizing API calls to stay within rate limits.

## Response Data Structure

The API returns an array of cryptocurrency objects with the following structure:

```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    "current_price": 45367.12,
    "market_cap": 886765376122,
    "market_cap_rank": 1,
    "fully_diluted_valuation": 953329372821,
    "total_volume": 22572044960,
    "high_24h": 45800.45,
    "low_24h": 44219.87,
    "price_change_24h": 890.23,
    "price_change_percentage_24h": 2.0012,
    "market_cap_change_24h": 17546952391,
    "market_cap_change_percentage_24h": 2.0167,
    "circulating_supply": 19318118,
    "total_supply": 21000000,
    "max_supply": 21000000,
    "ath": 69045,
    "ath_change_percentage": -34.21736,
    "ath_date": "2021-11-10T14:24:11.849Z",
    "atl": 67.81,
    "atl_change_percentage": 66851.76,
    "atl_date": "2013-07-06T00:00:00.000Z",
    "last_updated": "2023-10-25T08:10:35.951Z"
  },
  // ...more cryptocurrencies
]
```

The application displays a subset of these fields in the user interface, focusing on the most relevant information for users.
