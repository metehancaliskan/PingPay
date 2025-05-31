"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Service {
  id: string
  title: string
  description: string
  logo: string
  endpoints: number
  network: string
  color: string
}

interface ServiceCardProps {
  service: Service
  isWalletConnected: boolean
}

export function ServiceCard({ service, isWalletConnected }: ServiceCardProps) {
  return (
    <Link href={`/dashboard/${service.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]">
        <CardHeader className={`bg-gradient-to-r ${service.color} transition-all duration-300 group-hover:opacity-80`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{service.logo}</div>
              <div>
                <CardTitle className="group-hover:text-[#00FFE0] transition-colors duration-300">
                  {service.title}
                </CardTitle>
                <Badge variant="outline" className="mt-1 bg-white">
                  {service.network}
                </Badge>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <CardDescription className="mb-4 text-base">{service.description}</CardDescription>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{service.endpoints} endpoints available</span>
            <span className="font-medium text-[#00FFE0]">From $0.01</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
