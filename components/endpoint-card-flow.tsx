"use client"

import { useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { useAccount } from "wagmi"
import { formatEther } from "viem"
import Web3 from "web3"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

import { useX402Client } from "@/hooks/useX402Client"

const flowBridgeABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_sharedDecimals",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "_endpoint",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InvalidLocalDecimals",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Path_AlreadyHasCredit",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Path_InsufficientCredit",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Path_UnlimitedCredit",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountLD",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minAmountLD",
        "type": "uint256"
      }
    ],
    "name": "SlippageExceeded",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_InsufficientFare",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_InvalidAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_InvalidPath",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_InvalidTokenDecimals",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_LzTokenUnavailable",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_OutflowFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_Paused",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_RecoverTokenUnsupported",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_ReentrantCall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_SlippageTooHigh",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_Unauthorized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Stargate_UnreceivedTokenNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Transfer_ApproveFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Transfer_TransferFailed",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "feeLib",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "planner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "treasurer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenMessaging",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "creditMessaging",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "lzToken",
            "type": "address"
          }
        ],
        "indexed": false,
        "internalType": "struct StargateBase.AddressConfig",
        "name": "config",
        "type": "tuple"
      }
    ],
    "name": "AddressConfigSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "srcEid",
        "type": "uint32"
      },
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "srcEid",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "amount",
            "type": "uint64"
          }
        ],
        "indexed": false,
        "internalType": "struct Credit[]",
        "name": "credits",
        "type": "tuple[]"
      }
    ],
    "name": "CreditsReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "dstEid",
        "type": "uint32"
      },
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "srcEid",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "amount",
            "type": "uint64"
          }
        ],
        "indexed": false,
        "internalType": "struct Credit[]",
        "name": "credits",
        "type": "tuple[]"
      }
    ],
    "name": "CreditsSent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "dstEid",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "oft",
        "type": "bool"
      }
    ],
    "name": "OFTPathSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "guid",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "srcEid",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "toAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountReceivedLD",
        "type": "uint256"
      }
    ],
    "name": "OFTReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "guid",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "dstEid",
        "type": "uint32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "fromAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountSentLD",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountReceivedLD",
        "type": "uint256"
      }
    ],
    "name": "OFTSent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "paused",
        "type": "bool"
      }
    ],
    "name": "PauseSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PlannerFeeWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "amountSD",
        "type": "uint64"
      }
    ],
    "name": "TreasuryFeeAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "amountSD",
        "type": "uint64"
      }
    ],
    "name": "TreasuryFeeWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "guid",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "index",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "srcEid",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountLD",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "composeMsg",
        "type": "bytes"
      }
    ],
    "name": "UnreceivedTokenCached",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amountLD",
        "type": "uint256"
      }
    ],
    "name": "addTreasuryFee",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "approvalRequired",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endpoint",
    "outputs": [
      {
        "internalType": "contract ILayerZeroEndpointV2",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAddressConfig",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "feeLib",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "planner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "treasurer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenMessaging",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "creditMessaging",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "lzToken",
            "type": "address"
          }
        ],
        "internalType": "struct StargateBase.AddressConfig",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTransferGasLimit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "localEid",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oftVersion",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      },
      {
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "eid",
        "type": "uint32"
      }
    ],
    "name": "paths",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "credit",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "plannerFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "available",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "dstEid",
            "type": "uint32"
          },
          {
            "internalType": "bytes32",
            "name": "to",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "amountLD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minAmountLD",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "extraOptions",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "composeMsg",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "oftCmd",
            "type": "bytes"
          }
        ],
        "internalType": "struct SendParam",
        "name": "_sendParam",
        "type": "tuple"
      }
    ],
    "name": "quoteOFT",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "minAmountLD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxAmountLD",
            "type": "uint256"
          }
        ],
        "internalType": "struct OFTLimit",
        "name": "limit",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "int256",
            "name": "feeAmountLD",
            "type": "int256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "internalType": "struct OFTFeeDetail[]",
        "name": "oftFeeDetails",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amountSentLD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountReceivedLD",
            "type": "uint256"
          }
        ],
        "internalType": "struct OFTReceipt",
        "name": "receipt",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "dstEid",
            "type": "uint32"
          },
          {
            "internalType": "bytes32",
            "name": "to",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "amountLD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minAmountLD",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "extraOptions",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "composeMsg",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "oftCmd",
            "type": "bytes"
          }
        ],
        "internalType": "struct SendParam",
        "name": "_sendParam",
        "type": "tuple"
      },
      {
        "internalType": "bool",
        "name": "_payInLzToken",
        "type": "bool"
      }
    ],
    "name": "quoteSend",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "nativeFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lzTokenFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct MessagingFee",
        "name": "fee",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_srcEid",
        "type": "uint32"
      },
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "srcEid",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "amount",
            "type": "uint64"
          }
        ],
        "internalType": "struct Credit[]",
        "name": "_credits",
        "type": "tuple[]"
      }
    ],
    "name": "receiveCredits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "srcEid",
            "type": "uint32"
          },
          {
            "internalType": "bytes32",
            "name": "sender",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "nonce",
            "type": "uint64"
          }
        ],
        "internalType": "struct Origin",
        "name": "_origin",
        "type": "tuple"
      },
      {
        "internalType": "bytes32",
        "name": "_guid",
        "type": "bytes32"
      },
      {
        "internalType": "uint8",
        "name": "_seatNumber",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "_amountSD",
        "type": "uint64"
      }
    ],
    "name": "receiveTokenBus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "srcEid",
            "type": "uint32"
          },
          {
            "internalType": "bytes32",
            "name": "sender",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "nonce",
            "type": "uint64"
          }
        ],
        "internalType": "struct Origin",
        "name": "_origin",
        "type": "tuple"
      },
      {
        "internalType": "bytes32",
        "name": "_guid",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "_amountSD",
        "type": "uint64"
      },
      {
        "internalType": "bytes",
        "name": "_composeMsg",
        "type": "bytes"
      }
    ],
    "name": "receiveTokenTaxi",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "recoverToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_guid",
        "type": "bytes32"
      },
      {
        "internalType": "uint8",
        "name": "_index",
        "type": "uint8"
      },
      {
        "internalType": "uint32",
        "name": "_srcEid",
        "type": "uint32"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amountLD",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "_composeMsg",
        "type": "bytes"
      }
    ],
    "name": "retryReceiveToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "dstEid",
            "type": "uint32"
          },
          {
            "internalType": "bytes32",
            "name": "to",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "amountLD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minAmountLD",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "extraOptions",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "composeMsg",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "oftCmd",
            "type": "bytes"
          }
        ],
        "internalType": "struct SendParam",
        "name": "_sendParam",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "nativeFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lzTokenFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct MessagingFee",
        "name": "_fee",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_refundAddress",
        "type": "address"
      }
    ],
    "name": "send",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "guid",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "nonce",
            "type": "uint64"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "nativeFee",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lzTokenFee",
                "type": "uint256"
              }
            ],
            "internalType": "struct MessagingFee",
            "name": "fee",
            "type": "tuple"
          }
        ],
        "internalType": "struct MessagingReceipt",
        "name": "msgReceipt",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amountSentLD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountReceivedLD",
            "type": "uint256"
          }
        ],
        "internalType": "struct OFTReceipt",
        "name": "oftReceipt",
        "type": "tuple"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_dstEid",
        "type": "uint32"
      },
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "srcEid",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "amount",
            "type": "uint64"
          },
          {
            "internalType": "uint64",
            "name": "minAmount",
            "type": "uint64"
          }
        ],
        "internalType": "struct TargetCredit[]",
        "name": "_credits",
        "type": "tuple[]"
      }
    ],
    "name": "sendCredits",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "srcEid",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "amount",
            "type": "uint64"
          }
        ],
        "internalType": "struct Credit[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "dstEid",
            "type": "uint32"
          },
          {
            "internalType": "bytes32",
            "name": "to",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "amountLD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minAmountLD",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "extraOptions",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "composeMsg",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "oftCmd",
            "type": "bytes"
          }
        ],
        "internalType": "struct SendParam",
        "name": "_sendParam",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "nativeFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lzTokenFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct MessagingFee",
        "name": "_fee",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "_refundAddress",
        "type": "address"
      }
    ],
    "name": "sendToken",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes32",
            "name": "guid",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "nonce",
            "type": "uint64"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "nativeFee",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "lzTokenFee",
                "type": "uint256"
              }
            ],
            "internalType": "struct MessagingFee",
            "name": "fee",
            "type": "tuple"
          }
        ],
        "internalType": "struct MessagingReceipt",
        "name": "msgReceipt",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amountSentLD",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amountReceivedLD",
            "type": "uint256"
          }
        ],
        "internalType": "struct OFTReceipt",
        "name": "oftReceipt",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint72",
            "name": "ticketId",
            "type": "uint72"
          },
          {
            "internalType": "bytes",
            "name": "passengerBytes",
            "type": "bytes"
          }
        ],
        "internalType": "struct Ticket",
        "name": "ticket",
        "type": "tuple"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "feeLib",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "planner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "treasurer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenMessaging",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "creditMessaging",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "lzToken",
            "type": "address"
          }
        ],
        "internalType": "struct StargateBase.AddressConfig",
        "name": "_config",
        "type": "tuple"
      }
    ],
    "name": "setAddressConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "_dstEid",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "_oft",
        "type": "bool"
      }
    ],
    "name": "setOFTPath",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_paused",
        "type": "bool"
      }
    ],
    "name": "setPause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_gasLimit",
        "type": "uint256"
      }
    ],
    "name": "setTransferGasLimit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sharedDecimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stargateType",
    "outputs": [
      {
        "internalType": "enum StargateType",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "status",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferTokenOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasuryFee",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "guid",
        "type": "bytes32"
      },
      {
        "internalType": "uint8",
        "name": "index",
        "type": "uint8"
      }
    ],
    "name": "unreceivedTokens",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawPlannerFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "_amountSD",
        "type": "uint64"
      }
    ],
    "name": "withdrawTreasuryFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const CONTRACT_ADDRESS = "0xAF54BE5B6eEc24d6BFACf1cce4eaF680A8239398"

interface Endpoint {
  id: string
  title: string
  description: string
  method: string
  endpoint: string
  price: string
  sampleResponse: any
}

interface EndpointCardProps {
  endpoint: Endpoint
}

export function EndpointCardFlow({ endpoint }: EndpointCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [step, setStep] = useState<'idle' | 'quoting' | 'sending' | 'confirming' | 'complete'>('idle')
  const [quote, setQuote] = useState<any>(null)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const { address, isConnected } = useAccount()
  const x402Client = useX402Client()

  // Get quote from contract (Step 1)§
  const amount = Number(endpoint.price) * 1000000

  // Prepare SendParam for quoteSend function
  const sendParam = address ? {
    dstEid: 30184, // Example destination EID - you'll need to set this correctly
    to: `0x${address.slice(2).padStart(64, '0')}` as `0x${string}`, // Convert address to bytes32
    amountLD: amount,
    minAmountLD: amount * 0.5, // Convert to BigInt after calculation
    extraOptions: "0x" as `0x${string}`,
    composeMsg: "0x" as `0x${string}`,
    oftCmd: "0x" as `0x${string}`
  } : undefined


  const handlePayAndAccess = async () => {
    if (!isConnected || !address || !sendParam) {
      alert("Please connect your wallet first")
      return
    }

    try {
      setIsLoading(true)
      setStep('quoting')

      console.log("Sending quote request...")

      // Step 1: Get fresh quote
      const web3 = new Web3("https://mainnet.evm.nodes.onflow.org")
      console.log("Contract address:", CONTRACT_ADDRESS)

      const flowBridgeContract = new web3.eth.Contract(flowBridgeABI, CONTRACT_ADDRESS)


      console.log("Contract address:", CONTRACT_ADDRESS)

      console.log("SendParam:", sendParam)

      const freshQuote = await flowBridgeContract.methods.quoteSend(sendParam, false).call({ from: address }) as any


      console.log("Fresh quote received:", freshQuote)

      // Step 2: Call the send function with the connected wallet
      setStep('sending')
      
      // For actual transactions, we'll need to use the wallet provider
      const provider = (window as any).ethereum
      
      if (!provider) {
        alert("No wallet provider found for transaction")
        setIsLoading(false)
        setStep('idle')
        return
      }

      const walletWeb3 = new Web3(provider)
      const walletContract = new walletWeb3.eth.Contract(flowBridgeABI as any, CONTRACT_ADDRESS)
      
      const txReceipt = await walletContract.methods.send(
        sendParam,
        freshQuote,
        address
      ).send({
        from: address,
        value: freshQuote?.nativeFee || 0
      })

      setStep('confirming')
      
      console.log("Transaction successful:", txReceipt)

      // Step 3: Call protected API after successful transaction
      console.log("Calling protected API for:", address)
      
      try {
        const apiResult = await x402Client.callProtectedAPI('/api/flow-bridge', {
          transactionHash: txReceipt.transactionHash,
          userAddress: address,
          amount: amount,
          bridgeRoute: 'Flow → Base'
        });

        if (apiResult.success) {
          console.log("Protected API call successful:", apiResult.data);
          setApiResponse(apiResult.data);
        } else {
          console.error("Protected API call failed:", apiResult.error);
        }
      } catch (apiError) {
        console.error("Error calling protected API:", apiError);
      }
      
      setStep('complete')
      setIsPaid(true)
      setShowResponse(true)
      setIsLoading(false)
      alert("Payment successful! API access granted.")

    } catch (error) {
      console.error("Payment failed:", error)
      alert("Payment failed: " + (error instanceof Error ? error.message : "Unknown error"))
      setIsLoading(false)
      setStep('idle')
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-blue-100 text-blue-800"
      case "PUT":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getButtonText = () => {
    switch (step) {
      case 'quoting':
        return "Getting quote..."
      case 'sending':
        return "Confirm in wallet..."
      case 'confirming':
        return "Processing payment..."
      case 'complete':
        return "Paid & Called"
      default:
        return "Pay & Call API"
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#00FFE0]/10 to-[#F8FF80]/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{endpoint.title}</CardTitle>
          <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
        </div>
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Price per request</div>
          <div className="font-medium">${endpoint.price} USD</div>
        </div>
        
        {/* Show quote if available */}
        {quote && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Contract quote (native fee)</div>
            <div className="font-medium">{formatEther(BigInt(quote?.nativeFee || 0))} ETH</div>
          </div>
        )}

        <div className="mb-4 text-sm text-muted-foreground">
          <code className="rounded bg-muted px-1 py-0.5 text-xs">{endpoint.endpoint}</code>
        </div>

        {showResponse && (
          <div className="space-y-4">
            {/* Original endpoint response */}
            <div className="overflow-hidden rounded-md border">
              <div className="bg-muted px-3 py-1 text-sm font-medium">Original API Response</div>
              <pre className="overflow-x-auto bg-black p-4 text-xs text-white">
                {JSON.stringify(endpoint.sampleResponse, null, 2)}
              </pre>
            </div>

            {/* x402 Protected API response */}
            {apiResponse && (
              <div className="overflow-hidden rounded-md border border-green-200">
                <div className="bg-green-50 px-3 py-1 text-sm font-medium text-green-800">
                  Protected API Response (x402)
                </div>
                <pre className="overflow-x-auto bg-green-900 p-4 text-xs text-green-100">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}

            {/* Loading state for API call */}
            {x402Client.isLoading && (
              <div className="flex items-center justify-center p-4 border border-blue-200 rounded-md bg-blue-50">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-sm text-blue-700">Calling protected API...</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4">
        <Button
          onClick={handlePayAndAccess}
          disabled={!isConnected || isLoading || isPaid}
          className={isPaid ? "bg-green-500 hover:bg-green-600" : "bg-[#00FFE0] text-black hover:bg-[#00FFE0]/90"}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getButtonText()}
            </>
          ) : isPaid ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Paid & Called
            </>
          ) : (
            <>
              Pay & Call API
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {!isConnected && (
          <Alert variant="destructive" className="border-yellow-500 text-yellow-800">
            <AlertTitle className="text-sm font-medium">Wallet not connected</AlertTitle>
            <AlertDescription className="text-xs">Please connect your wallet to access this endpoint.</AlertDescription>
          </Alert>
        )}

        {quoteError && (
          <Alert variant="destructive">
            <AlertTitle className="text-sm font-medium">Quote Error</AlertTitle>
            <AlertDescription className="text-xs">{quoteError}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  )
}

