export const USDC_ABI = [
  // ERC-20 standard functions
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  }
] as const;

// USDC contract addresses for different networks
export const USDC_ADDRESSES = {
  ethereum: '0xA0b86a33E6441E3B1C15b8Bb2C1DE73E9dE99A0d', // Ethereum Mainnet USDC
  polygon: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // Polygon USDC
  base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
  arbitrum: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8' // Arbitrum USDC
} as const; 