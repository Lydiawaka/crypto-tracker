import { ConverterForm } from "../components/converter-form"
import Navbar from "../components/Navbar"

export const metadata = {
  title: "Converter - Crypto Tracker",
  description: "Convert between cryptocurrencies and fiat currencies",
}

export default function ConverterPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ConverterForm />
    </main>
  )
}
