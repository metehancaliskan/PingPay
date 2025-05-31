"use client";
import "@rainbow-me/rainbowkit/styles.css";

import React from "react";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { base, baseSepolia, flowMainnet, rootstock } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { http } from "viem";

// Configure chains with explicit RPC endpoints
const config = getDefaultConfig({
  appName: "PingPay",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "your-project-id",
  chains: [base, baseSepolia, flowMainnet, rootstock],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [flowMainnet.id]: http('https://mainnet.evm.nodes.onflow.org'),
    [rootstock.id]: http('https://public-node.rsk.co'),
  },
  ssr: true,
});

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

const Web3Provider = ({ children }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions
          coolMode={false}
          locale="en-US"
          modalSize="compact"
          appInfo={{
            appName: "PingPay",
          }}
          theme={
            resolvedTheme === "dark"
              ? darkTheme({
                  accentColor: "hsl(var(--primary))",
                  accentColorForeground: "hsl(var(--primary-foreground))",
                  borderRadius: "large",
                  overlayBlur: "small",
                })
              : lightTheme({
                  accentColor: "hsl(var(--primary))",
                  accentColorForeground: "hsl(var(--primary-foreground))",
                  borderRadius: "large",
                  overlayBlur: "small",
                })
          }
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
