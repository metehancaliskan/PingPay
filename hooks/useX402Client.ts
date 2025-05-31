import { useState } from 'react';

interface PaymentProof {
  signature: string;
  timestamp: number;
  nonce: string;
}

interface X402Response {
  success: boolean;
  data?: any;
  error?: string;
}

export const useX402Client = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(`API call failed: ${paidResponse.statusText}`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Simulate payment process (replace with actual payment implementation)
  const simulatePayment = async (instructions: any): Promise<PaymentProof> => {
    // In a real implementation, this would:
    // 1. Parse payment instructions
    // 2. Create payment transaction
    // 3. Get signature from wallet
    // 4. Return payment proof

    // For now, return a mock payment proof
    return {
      signature: '0x' + '0'.repeat(128), // Mock signature
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7),
    };
  };

  return {
    callProtectedAPI,
    isLoading,
    error,
  };
}; 