"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"
import { EndpointCardFlow } from "@/components/endpoint-card-flow"

export default function InfuraPage() {
  const endpoints = [
    {
      id: "eth-get-balance",
      title: "eth_getBalance",
      description: "Returns the balance of the account at the given address",
      method: "POST",
      endpoint: "/v3/mainnet",
      price: "0.01",
      sampleResponse: {
        jsonrpc: "2.0",
        id: 1,
        result: "0x1b1ae4d6e2ef500000",
      },
    },
    {
      id: "eth-block-number",
      title: "eth_blockNumber",
      description: "Returns the number of most recent block",
      method: "POST",
      endpoint: "/v3/mainnet",
      price: "0.01",
      sampleResponse: {
        jsonrpc: "2.0",
        id: 1,
        result: "0x1234567",
      },
    },
    {
      id: "eth-get-transaction",
      title: "eth_getTransactionByHash",
      description: "Returns transaction information by hash",
      method: "POST",
      endpoint: "/v3/mainnet",
      price: "0.015",
      sampleResponse: {
        jsonrpc: "2.0",
        id: 1,
        result: {
          hash: "0x123...",
          blockNumber: "0x1234567",
          from: "0x742d35Cc...",
          to: "0x8ba1f109...",
          value: "0x1b1ae4d6e2ef500000",
          gas: "0x5208",
          gasPrice: "0x4a817c800",
        },
      },
    },
    {
      id: "ipfs-add",
      title: "IPFS Add",
      description: "Add content to IPFS network",
      method: "POST",
      endpoint: "/ipfs/api/v0/add",
      price: "0.02",
      sampleResponse: {
        Name: "example.txt",
        Hash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        Size: "18",
      },
    },
    {
      id: "ipfs-get",
      title: "IPFS Get",
      description: "Retrieve content from IPFS by hash",
      method: "GET",
      endpoint: "/ipfs/{hash}",
      price: "0.01",
      sampleResponse: {
        content: "Hello, IPFS World!",
        hash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
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
          <div className="text-4xl">🌐</div>
          <div>
            <h1 className="text-3xl font-bold">Infura API</h1>
            <p className="text-muted-foreground">Reliable Ethereum and IPFS infrastructure for decentralized apps</p>
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
