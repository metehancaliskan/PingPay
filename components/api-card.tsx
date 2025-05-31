"use client"

import { useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface ApiCardProps {
  title: string
  description: string
  price: string
  network: string
  endpoint: string
  isWalletConnected: boolean
  sampleResponse: any
}

export function ApiCard({
  title,
  description,
  price,
  network,
  endpoint,
  isWalletConnected,
  sampleResponse,
}: ApiCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [showResponse, setShowResponse] = useState(false)

  const handlePayAndAccess = async () => {
    if (!isWalletConnected) return

    setIsLoading(true)

    // Simulate payment process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPaid(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowResponse(true)
    setIsLoading(false)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#00FFE0]/10 to-[#F8FF80]/10">
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge variant="outline" className="bg-white">
            {network}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Price per request</div>
          <div className="font-medium">${price} USD</div>
        </div>
        <div className="mb-4 text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1 py-0.5">{endpoint}</code>
        </div>

        {showResponse && (
          <div className="mb-4 mt-6 overflow-hidden rounded-md border">
            <div className="bg-muted px-3 py-1 text-sm font-medium">Response</div>
            <pre className="overflow-x-auto bg-black p-4 text-xs text-white">
              {JSON.stringify(sampleResponse, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4">
        <Button
          onClick={handlePayAndAccess}
          disabled={!isWalletConnected || isLoading || isPaid}
          className={isPaid ? "bg-green-500 hover:bg-green-600" : "bg-[#00FFE0] text-black hover:bg-[#00FFE0]/90"}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isPaid ? "Accessing API..." : "Processing Payment..."}
            </>
          ) : isPaid ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Paid
            </>
          ) : (
            <>
              Pay & Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {!isWalletConnected && (
          <Alert variant="destructive" className="border-yellow-500 text-yellow-800">
            <AlertTitle className="text-sm font-medium">Wallet not connected</AlertTitle>
            <AlertDescription className="text-xs">Please connect your wallet to access this API.</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  )
}
