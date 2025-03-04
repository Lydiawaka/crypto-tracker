---
sidebar_position: 6
---

# Challenges & Solutions

This page documents the challenges faced during the development of the Crypto Price Tracker application and the solutions implemented to address them.

## API Rate Limiting

### Challenge

The CoinGecko API, like many free public APIs, imposes rate limits on requests. Excessive API calls could lead to temporary IP bans or request failures.

### Solution

1. **Implemented caching with React Query**:
   - Set `staleTime` to 60,000ms (1 minute) to reduce unnecessary API calls
   - Data is only refetched when explicitly requested by the user via the "Refresh" button or when the cache expires

2. **Manual refresh control**:
   - Added a dedicated "Refresh" button to give users control over when to update data
   - This approach prevents accidental rapid refreshes that could trigger rate limits

## Responsive Design

### Challenge

Creating a responsive design that works well on both desktop and mobile devices, especially for tabular data that traditionally requires horizontal space.

### Solution

1. **Responsive table design**:
   - Implemented an overflow container for the table on small screens
   - Used flexible units for sizing to adapt to different screen sizes

2. **Responsive layout adjustments**:
   - Stack the search and refresh controls vertically on mobile
   - Arranged them horizontally on desktop

```jsx
<div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <SearchBar onSearch={handleSearch} />
  <button 
    onClick={handleRefresh}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
  >
    Refresh Prices
  </button>
</div>
```

## Error Handling

### Challenge

Providing meaningful feedback to users when API requests fail or when search results are empty.

### Solution

1. **Dedicated error component**:
   - Created an `ErrorDisplay` component to show user-friendly error messages
   - Implemented conditional rendering based on error state

2. **Empty state handling**:
   - Added a specific message when search results return no matches
   - Provided clear feedback to help users refine their search

```jsx
{cryptos.length > 0 ? (
  cryptos.map(crypto => (
    // Cryptocurrency row content
  ))
) : (
  <tr>
    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
      No cryptocurrencies found
    </td>
  </tr>
)}
```

## Data Filtering

### Challenge

Implementing efficient filtering for cryptocurrency data while maintaining a good user experience.

### Solution

1. **Client-side filtering**:
   - Implemented filtering logic on the client side to provide instant feedback
   - Filtered based on both cryptocurrency name and symbol to increase search flexibility

```jsx
const filteredCryptos = data?.filter(crypto => 
  crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
) || [];
```

2. **Default data limitation**:
   - When no search term is provided, only the top 5 cryptocurrencies are displayed
   - This approach improves initial load performance and provides a cleaner interface

```jsx
const displayedCryptos = searchTerm ? filteredCryptos : filteredCryptos.slice(0, 5);
```

## Performance Optimization

### Challenge

Ensuring the application remains performant, especially when dealing with potentially large datasets and frequent updates.

### Solution

1. **Efficient rendering**:
   - Used appropriate React patterns to prevent unnecessary re-renders
   - Implemented list virtualization for larger datasets

2. **Request optimization**:
   - Limited the initial data fetch to 100 cryptocurrencies to reduce payload size
   - Implemented proper caching to reduce network requests

3. **Component structure**:
   - Broke down the UI into smaller, focused components
   - This approach improves both maintainability and rendering performance

## Future Challenges

While the current implementation addresses the immediate requirements, several challenges remain for future development:

1. **Real-time updates**:
   - Implementing WebSocket connections for real-time price updates
   - Balancing real-time data with API rate limits

2. **User preferences**:
   - Saving user preferences for favorite cryptocurrencies
   - Implementing dark/light mode

3. **Additional metrics**:
   - Adding more detailed price charts and historical data
   - Incorporating additional market indicators
