import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9f9f9]">
      <header className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/pingpaylogo.png" alt="PingPay Logo" width={32} height={32} />
          <span className="text-xl font-bold">PingPay</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:text-teal-500">
            Dashboard
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-teal-500">
            Docs
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-teal-500">
            About
          </Link>
        </nav>
      </header>
      <main className="container flex-1">
        <section className="flex flex-col items-center justify-center py-24 text-center md:py-32">
          <div className="mb-8 h-64 w-64">
            <Image src="/pingpaylogo.png" alt="PingPay Logo" width={1028} height={1028} />
          </div>
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">Ping. Pay. Access.</h1>
          <p className="mb-8 max-w-[42rem] text-xl text-muted-foreground">
            Micro-payment gateway for API services utilizing x402.
          </p>
          <Button asChild size="lg" className="bg-[#00FFE0] text-black hover:bg-[#00FFE0]/90">
            <Link href="/dashboard">
              Try the Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
        <section className="py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              title="Pay-Per-Request"
              description="No subscriptions. Pay only for the API calls you make."
              icon={<div className="rounded-full bg-[#F8FF80] p-3">💸</div>}
            />
            <FeatureCard
              title="Multichain Support"
              description="Use stablecoins from Flow or Rootstock networks."
              icon={<div className="rounded-full bg-[#F8FF80] p-3">⛓️</div>}
            />
            <FeatureCard
              title="Developer Friendly"
              description="Simple integration with any API service."
              icon={<div className="rounded-full bg-[#F8FF80] p-3">👩‍💻</div>}
            />
          </div>
        </section>
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

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
