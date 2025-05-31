"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"
import { EndpointCard } from "@/components/endpoint-card"

export default function DefiLlamaPage() {
  const endpoints = [
    {
      id: "get-protocols",
      title: "Get All Protocols",
      description: "List all DeFi protocols with basic information",
      method: "GET",
      endpoint: "/protocols",
      price: "0.01",
      sampleResponse: [
        {
          id: "1",
          name: "Uniswap",
          symbol: "UNI",
          category: "Dexes",
          tvl: 4234567890.12,
        },
      ],
    },
    {
      id: "get-protocol-tvl",
      title: "Get Protocol TVL",
      description: "Get historical TVL data for a specific protocol",
      method: "GET",
      endpoint: "/protocol/{protocol}",
      price: "0.015",
      sampleResponse: {
        name: "Uniswap",
        symbol: "UNI",
        tvl: [{ date: "1640995200", totalLiquidityUSD: 8234567890.12 }],
      },
    },
    {
      id: "get-chains",
      title: "Get All Chains",
      description: "List all supported blockchain networks",
      method: "GET",
      endpoint: "/chains",
      price: "0.01",
      sampleResponse: [
        {
          name: "Ethereum",
          chainId: "1",
          tvl: 45234567890.12,
          protocols: 1234,
        },
      ],
    },
    {
      id: "get-yields",
      title: "Get Yield Pools",
      description: "Get yield farming opportunities across protocols",
      method: "GET",
      endpoint: "/yields",
      price: "0.02",
      sampleResponse: [
        {
          pool: "0x123...",
          project: "Uniswap",
          symbol: "USDC-ETH",
          apy: 12.34,
          tvlUsd: 1234567.89,
        },
      ],
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
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="mb-8 flex items-center gap-4">
          <div className="text-4xl">🦙</div>
          <div>
            <h1 className="text-3xl font-bold">DefiLlama API</h1>
            <p className="text-muted-foreground">DeFi protocols data, TVL analytics, and yield farming insights</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {endpoints.map((endpoint) => (
            <EndpointCard key={endpoint.id} endpoint={endpoint} isWalletConnected={true} />
          ))}
        </div>
      </main>
    </div>
  )
}
