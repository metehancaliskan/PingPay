"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"
import { ServiceCard } from "@/components/service-card"

export default function DashboardPage() {
  const services = [
    {
      id: "alchemy",
      title: "Alchemy API",
      description: "Powerful blockchain infrastructure and APIs for Web3 development",
      logo: "🔮",
      endpoints: 12,
      network: "Multi-chain",
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      id: "defillama",
      title: "DefiLlama API",
      description: "DeFi protocols data, TVL analytics, and yield farming insights",
      logo: "🦙",
      endpoints: 8,
      network: "DeFi",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: "infura",
      title: "Infura API",
      description: "Reliable Ethereum and IPFS infrastructure for decentralized apps",
      logo: "🌐",
      endpoints: 15,
      network: "Ethereum",
      color: "from-orange-500/20 to-red-500/20",
    },
    {
      id: "moralis",
      title: "Moralis API",
      description: "Complete Web3 development platform with NFT and token APIs",
      logo: "⚡",
      endpoints: 20,
      network: "Multi-chain",
      color: "from-purple-500/20 to-pink-500/20",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#f9f9f9]">
      <header className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#00FFE0] to-[#F8FF80]">
              <div className="absolute h-1/2 w-1/2 rounded-full border-2 border-black opacity-70"></div>
              <div className="absolute h-3/4 w-3/4 rounded-full border border-black opacity-40"></div>
              <div className="absolute h-[85%] w-[85%] rounded-full border-[0.5px] border-black opacity-20"></div>
              <div className="absolute h-2/5 w-[15%] -translate-y-[10%] rotate-[30deg] bg-black"></div>
            </div>
            <span className="text-xl font-bold">PingPay</span>
          </Link>
        </div>
        <ConnectWallet />
      </header>
      <main className="container flex-1 py-8">
        <div className="mb-8 flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        <h1 className="mb-2 text-3xl font-bold">API Services</h1>
        <p className="mb-8 text-muted-foreground">
          Select an API service to explore endpoints and pay per request using the x402 protocol.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} isWalletConnected={true} />
          ))}
        </div>
      </main>
      <footer className="border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 PingPay. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
