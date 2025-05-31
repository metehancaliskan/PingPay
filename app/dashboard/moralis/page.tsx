"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"
import { EndpointCard } from "@/components/endpoint-card"

export default function MoralisPage() {
  const endpoints = [
    {
      id: "get-nfts",
      title: "Get NFTs by Wallet",
      description: "Get all NFTs owned by a specific wallet address",
      method: "GET",
      endpoint: "/{address}/nft",
      price: "0.02",
      sampleResponse: {
        total: 2,
        page: 0,
        page_size: 100,
        result: [
          {
            token_address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
            token_id: "1",
            name: "Bored Ape #1",
            symbol: "BAYC",
            metadata: {
              name: "Bored Ape #1",
              image: "ipfs://QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ",
            },
          },
        ],
      },
    },
    {
      id: "get-token-price",
      title: "Get Token Price",
      description: "Get current price of any ERC-20 token",
      method: "GET",
      endpoint: "/erc20/{address}/price",
      price: "0.01",
      sampleResponse: {
        tokenName: "Ethereum",
        tokenSymbol: "ETH",
        tokenLogo:
          "https://logo.moralis.io/0x1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_3495a35b1b655a8b2e8e0c6e5b8b5b5b.png",
        tokenDecimals: "18",
        nativePrice: {
          value: "1000000000000000000",
          decimals: 18,
          name: "Ether",
          symbol: "ETH",
        },
        usdPrice: 2345.67,
      },
    },
    {
      id: "get-wallet-history",
      title: "Get Wallet History",
      description: "Get transaction history for a wallet address",
      method: "GET",
      endpoint: "/{address}",
      price: "0.015",
      sampleResponse: {
        total: 100,
        page: 0,
        page_size: 25,
        result: [
          {
            hash: "0x123...",
            nonce: "1",
            transaction_index: "0",
            from_address: "0x742d35cc6634c0532925a3b8d4c9db96",
            to_address: "0x8ba1f109551bd432803012645haca136aaae5e61",
            value: "1000000000000000000",
            gas: "21000",
            gas_price: "20000000000",
            block_timestamp: "2023-05-15T14:30:00.000Z",
          },
        ],
      },
    },
    {
      id: "get-token-metadata",
      title: "Get Token Metadata",
      description: "Get metadata for any ERC-20 token contract",
      method: "GET",
      endpoint: "/erc20/metadata",
      price: "0.01",
      sampleResponse: [
        {
          address: "0xa0b86a33e6441e6e80d0c4c6c7527d72",
          name: "USD Coin",
          symbol: "USDC",
          decimals: "6",
          logo: "https://logo.moralis.io/0x1_0xa0b86a33e6441e6e80d0c4c6c7527d72_3495a35b1b655a8b2e8e0c6e5b8b5b5b.png",
        },
      ],
    },
    {
      id: "get-nft-metadata",
      title: "Get NFT Metadata",
      description: "Get metadata for a specific NFT by contract and token ID",
      method: "GET",
      endpoint: "/nft/{address}/{token_id}",
      price: "0.02",
      sampleResponse: {
        token_address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        token_id: "1",
        name: "Bored Ape #1",
        symbol: "BAYC",
        metadata: {
          name: "Bored Ape #1",
          description: "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs",
          image: "ipfs://QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ",
          attributes: [
            { trait_type: "Background", value: "Blue" },
            { trait_type: "Eyes", value: "Bloodshot" },
          ],
        },
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
          <div className="text-4xl">⚡</div>
          <div>
            <h1 className="text-3xl font-bold">Moralis API</h1>
            <p className="text-muted-foreground">Complete Web3 development platform with NFT and token APIs</p>
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
