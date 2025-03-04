---
sidebar_position: 5
---

# State Management

This page explains the state management approach used in the Crypto Price Tracker application.

## Overview

The application uses **React Query** as the primary state management solution for server state, complemented by React's built-in **useState** hook for UI state.

## Why React Query?

React Query was chosen over alternatives like Redux, Zustand, or Context API for several reasons:

### 1. Server-State Focus

React Query is specifically designed to handle server state, which is the primary type of state in this application. It provides built-in solutions for:

- Data fetching
- Caching
- Synchronization
- Updates
- Error handling

### 2. Reduced Boilerplate

Compared to Redux, React Query requires significantly less boilerplate code to implement data fetching and caching. This leads to cleaner, more maintainable code.

### 3. Automatic Background Updates

React Query provides automatic background refetching capabilities, keeping data fresh without explicit user actions.

### 4. Devtools Integration

React Query comes with powerful devtools that make debugging easier, allowing developers to inspect queries, cache state, and refetching behavior.

### 5. Optimistic Updates

While not utilized in this version of the application, React Query makes it easy to implement optimistic updates for a more responsive user experience in future enhancements.

## Implementation Details

### React Query Setup

The application sets up React Query with a QueryClient provider at the root level:

```jsx
// app/layout.js
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### Query Configuration

The main query for cryptocurrency data is configured with:

```jsx
const { data, error, isLoading, refetch } = useQuery({
  queryKey: ['cryptoData'],
  queryFn: fetchCryptoData,
  staleTime: 60000, // Data considered fresh for 1 minute
});
```

- `queryKey`: Unique identifier for the query
- `queryFn`: Function that fetches the data
- `staleTime`: Duration in milliseconds that data is considered fresh

### UI State Management

For UI state that doesn't need to be shared across components, React's useState hook is used:

```jsx
const [searchTerm, setSearchTerm] = useState('');
```

This approach keeps the state management simple and appropriate for the application's complexity level.

## Component State Flow

1. The main page component fetches data using React Query
2. Search term state is managed locally in the main component
3. Filtered data is derived from the combination of fetched data and search term
4. Components receive only the props they need, following the principle of data down, actions up

## Benefits of This Approach

1. **Separation of concerns**: Server state and UI state are handled separately
2. **Optimized performance**: Automatic request deduplication and caching
3. **Improved user experience**: Loading and error states are easily managed
4. **Maintainability**: Clear data flow and minimal state management code
5. **Scalability**: The approach can easily scale as the application grows

## Alternatives Considered

### Context API

While React Context is useful for sharing state across components, it lacks the data fetching, caching, and synchronization features that React Query provides. It would require additional logic to handle these aspects.

### Redux

Redux would introduce unnecessary complexity for this application, as most of the state is server data. The boilerplate required for actions, reducers, and selectors would make the codebase more verbose without significant benefits.

### Zustand

Zustand is a good alternative that was considered, but React Query's specialized focus on server state made it a more natural fit for this application's needs.
