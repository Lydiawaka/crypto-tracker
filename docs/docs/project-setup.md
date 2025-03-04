---
sidebar_position: 2
---

# Project Setup

This guide will help you set up the Crypto Price Tracker project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- Git

## Clone the Repository

```bash
git clone https://github.com/your-github-username/crypto-price-tracker.git
cd crypto-price-tracker
```

## Setting Up the Web Application

Navigate to the web application directory and install dependencies:

```bash
cd web-app
npm install
# or
yarn install
```

## Setting Up the Documentation

Navigate to the documentation directory and install dependencies:

```bash
cd ../docs
npm install
# or
yarn install
```

## Environment Variables

The web application uses environment variables to configure the API endpoint. Create a `.env.local` file in the `web-app` directory with the following content:

```env
NEXT_PUBLIC_API_URL=https://api.coingecko.com/api/v3
```

## API Rate Limits

Note that the CoinGecko API has rate limits for free tier usage. If you plan to make frequent requests or use the application in a production environment, consider:
- Implementing additional caching
- Using a paid API plan
- Switching to an alternative API provider
