"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"
import { EndpointCardFlow } from "@/components/endpoint-card-flow"

export default function AlchemyPage() {
  const endpoints = [
    {
      id: "get-balance",
      title: "Get ETH Balance",
      description: "Get the ETH balance for any Ethereum address",
      method: "GET",
      endpoint: "/v2/eth_getBalance",
      price: "0.01",
      sampleResponse: {
        result: "0x1b1ae4d6e2ef500000",
        balance_eth: "31.337",
        address: "0x742d35Cc6634C0532925a3b8D4C9db96",
      },
    },
    {
      id: "get-nft-metadata",
      title: "Get NFT Metadata",
      description: "Retrieve metadata for any NFT by contract and token ID",
      method: "GET",
      endpoint: "/v2/getNFTMetadata",
      price: "0.02",
      sampleResponse: {
        contract: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        tokenId: "1",
        name: "Bored Ape #1",
        description: "The Bored Ape Yacht Club",
        image: "ipfs://QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ",
        attributes: [
          { trait_type: "Background", value: "Blue" },
          { trait_type: "Eyes", value: "Bloodshot" },
        ],
      },
    },
    {
      id: "get-token-balances",
      title: "Get Token Balances",
      description: "Get all ERC-20 token balances for an address",
      method: "GET",
      endpoint: "/v2/getTokenBalances",
      price: "0.015",
      sampleResponse: {
        address: "0x742d35Cc6634C0532925a3b8D4C9db96",
        tokenBalances: [
          {
            contractAddress: "0xA0b86a33E6441e6e80D0c4C6C7527d72",
            tokenBalance: "0x1b1ae4d6e2ef500000",
            symbol: "USDC",
            name: "USD Coin",
          },
        ],
      },
    },
    {
      id: "get-transaction-receipts",
      title: "Get Transaction Receipts",
      description: "Get transaction receipts for a block",
      method: "GET",
      endpoint: "/v2/getTransactionReceipts",
      price: "0.025",
      sampleResponse: {
        receipts: [
          {
            transactionHash: "0x123...",
            blockNumber: "0x1234567",
            gasUsed: "0x5208",
            status: "0x1",
          },
        ],
      },
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
          <div className="text-4xl">🔮</div>
          <div>
            <h1 className="text-3xl font-bold">Alchemy API</h1>
            <p className="text-muted-foreground">Powerful blockchain infrastructure and APIs for Web3 development</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {endpoints.map((endpoint) => (
            <EndpointCardFlow key={endpoint.id} endpoint={endpoint} />
          ))}
        </div>
      </main>
    </div>
  )
}
