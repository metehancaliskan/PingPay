import { useState } from 'react';
import { parseUnits, formatUnits, createPublicClient, http } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useConfig, useSwitchChain } from 'wagmi';
import { USDC_ABI, USDC_ADDRESSES } from '../ABI/usdc';
import { base } from 'wagmi/chains';

interface PaymentProof {
  signature: string;
  timestamp: number;
  nonce: string;
  transactionHash?: string;
  blockNumber?: Number;
  amount: string;
  token: string;
  from: string;
  recipient: string;
  chainId: number;
}

interface X402Response {
  success: boolean;
  data?: any;
  error?: string;
}

export const useX402Client = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { address, chainId: currentChainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const config = useConfig();

  const callProtectedAPI = async (
    endpoint: string,
    payload: any,
    options: { method?: string } = {}
  ): Promise<X402Response> => {
    const { method = 'POST' } = options;
    
    try {
      setIsLoading(true);
      setError(null);

      // First, try to call the API without payment
      const initialResponse = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // If successful (not 402), return the response
      if (initialResponse.status !== 402) {
        const data = await initialResponse.json();
        setIsLoading(false);
        return { success: true, data };
      }

      // If 402 Payment Required, get payment instructions
      const paymentInstructions = await initialResponse.json();
      console.log('Payment required. Instructions:', paymentInstructions);

      // For now, we'll simulate payment completion
      // In a real implementation, you would:
      // 1. Show payment UI to user
      // 2. Get payment signature from wallet
      // 3. Include payment proof in the retry request

      // Simulate payment proof (replace with actual payment flow)
      const paymentProof = await simulatePayment(paymentInstructions);

      console.log("paymentProof", paymentProof)

      // Retry the request with payment proof
      const paidResponse = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-PAYMENT': JSON.stringify(paymentProof), // Include payment proof
        },
        body: JSON.stringify(payload),
      });

      if (paidResponse.ok) {
        const data = await paidResponse.json();
        setIsLoading(false);
        return { success: true, data };
      } else {
        console.log("paidResponse", paidResponse)
        throw new Error(`API call failed: ${paidResponse.statusText}`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Real USDC payment implementation
  const simulatePayment = async (instructions: any): Promise<PaymentProof> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      // Parse payment instructions from X402 format
      const { 
        asset,           // Token contract address
        payTo,           // Recipient address  
        network,         // Network name (e.g., "base", "ethereum")
        maxAmountRequired, // Maximum amount
        maxTimeoutSeconds // Timeout
      } = instructions.accepts[0];
      
      if (!asset || !payTo) {
        throw new Error('Invalid payment instructions: asset and payTo are required');
      }

      // Map network name to chain ID
      const getChainIdFromNetwork = (network: string): number => {
        switch (network.toLowerCase()) {
          case 'base': return 8453;
          default: return 8453;
        }
      };

      // Get the correct chain config
      const getChainConfig = (chainId: number) => {
        switch (chainId) {
          case 8453: return base;
          default: return base;
        }
      };

      const targetChainId = getChainIdFromNetwork(network);
      const chain = getChainConfig(targetChainId);
      
      // Check if user is on the correct chain
      if (currentChainId !== targetChainId) {
        console.log(`Current chain: ${currentChainId}, Target chain: ${targetChainId}`);
        
        try {
          // Try to switch to the correct chain
          await switchChainAsync({ chainId: targetChainId });
          console.log(`Successfully switched to chain ${targetChainId}`);
          
          // Wait a bit for the chain switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (switchError) {
          console.error('Failed to switch chain:', switchError);
          throw new Error(`Please switch your wallet to ${network} network (Chain ID: ${targetChainId}) to complete the payment`);
        }
      }

      // Use a reasonable amount (e.g., 1 USDC for API access)
      // In a real implementation, this could be determined by the API or user input
      const amountInWei = 10000; // USDC has 6 decimals

      // Create public client to check balance
      const publicClient = createPublicClient({
        chain,
        transport: http()
      });

      // Check user's token balance before proceeding
      const balance = await publicClient.readContract({
        address: asset as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;

      if (balance < BigInt(amountInWei)) {
        throw new Error(`Insufficient token balance. Required: ${amountInWei} tokens, Available: ${formatUnits(balance, 6)} tokens`);
      }

      // Check if network supports EIP-1559
      let transactionType: 'legacy' | 'eip1559' = 'legacy';
      
      try {
        // Try to get the latest block to check if EIP-1559 is supported
        const latestBlock = await publicClient.getBlock({ blockTag: 'latest' });
        if (latestBlock.baseFeePerGas !== null && latestBlock.baseFeePerGas !== undefined) {
          transactionType = 'eip1559';
        }
      } catch (error) {
        console.log('Using legacy transaction type due to EIP-1559 check failure');
        transactionType = 'legacy';
      }

      // Execute token transfer
      const txHash = await writeContractAsync({
        address: asset as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [payTo as `0x${string}`, BigInt(amountInWei)],
        type: transactionType,
      });

      // Wait for transaction confirmation with public client
      let receipt = null;
      let attempts = 0;
      const maxAttempts = Math.min(Math.floor((maxTimeoutSeconds || 300) / 2), 30); // Use timeout from instructions

      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash,
            timeout: 2000, // 2 second timeout per attempt
          });
        } catch {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between attempts
        }
      }

      if (!receipt) {
        // Even if we can't get receipt, the transaction might still be pending
        console.warn('Could not get transaction receipt, but transaction was submitted');
      }

      // Return payment proof with real transaction data
      return {
        signature: txHash, // Use actual transaction hash as signature
        timestamp: Date.now(),
        nonce: (receipt?.blockNumber?.toString() || Date.now().toString()),
        transactionHash: txHash,
        blockNumber: Number(receipt?.blockNumber) || 0,
        amount: amountInWei.toString(),
        token: 'USDC',
        from: address,
        recipient: payTo,
        chainId: targetChainId,
      };

    } catch (error) {
      console.error('SimulatedPayment failed:', error);
      throw new Error(`Simulated Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    callProtectedAPI,
    isLoading,
    error,
  };
}; 