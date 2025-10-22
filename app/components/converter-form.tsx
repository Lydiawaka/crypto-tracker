"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "KES", name: "Kenyan Shilling" },
  { code: "BTC", name: "Bitcoin" },
  { code: "ETH", name: "Ethereum" },
]

export function ConverterForm() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("BTC")
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCrypto = (code: string) => ["BTC", "ETH"].includes(code)

  const convert = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Handle Crypto ↔ Fiat or Crypto ↔ Crypto using Coinbase
      if (isCrypto(fromCurrency) || isCrypto(toCurrency)) {
        const cryptoCurrency = isCrypto(fromCurrency) ? fromCurrency : toCurrency
        const otherCurrency = cryptoCurrency === fromCurrency ? toCurrency : fromCurrency
        
        const response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${cryptoCurrency}`
        )
        const data = await response.json()

        if (!data.data || !data.data.rates) {
          throw new Error("Invalid response from Coinbase API")
        }

        if (!data.data.rates[otherCurrency]) {
          throw new Error("Conversion rate not available for selected currencies.")
        }

        const rate = parseFloat(data.data.rates[otherCurrency])
        
        if (cryptoCurrency === fromCurrency) {
          setResult(parseFloat(amount) * rate)
        } else {
          setResult(parseFloat(amount) / rate)
        }
        return
      }

      // Handle Fiat ↔ Fiat using Exchangerate.host
      const response = await fetch(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      )
      const data = await response.json()

      if (data.success) {
        setResult(data.result)
      } else {
        setError("Conversion failed. Please try again.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    convert()
  }, [amount, fromCurrency, toCurrency])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 sm:px-6 md:px-8">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 md:p-10 shadow-lg border border-border rounded-2xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
          Currency Converter
        </h1>

        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm md:text-base font-medium text-foreground mb-2">
              Amount
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              className="w-full text-sm md:text-base"
            />
          </div>

          {/* Currency Selection (From & To side by side on medium+ screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Currency */}
            <div>
              <label className="block text-sm md:text-base font-medium text-foreground mb-2">
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* To Currency */}
            <div>
              <label className="block text-sm md:text-base font-medium text-foreground mb-2">
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          {result !== null && (
            <Card className="p-4 sm:p-5 bg-secondary/50 border-primary/20 mt-4">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Conversion Result</p>
              <p className="text-lg sm:text-2xl font-bold text-primary break-words">
                {result.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                {amount} {fromCurrency} = {result.toFixed(8)} {toCurrency}
              </p>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Card className="p-4 bg-destructive/10 border-destructive/20 mt-4">
              <p className="text-sm text-destructive">{error}</p>
            </Card>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
