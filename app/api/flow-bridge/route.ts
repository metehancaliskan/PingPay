import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionHash, userAddress, amount } = body;

    // Here you can add your business logic after successful payment
    // For example: update database, send confirmation email, etc.
    
    console.log('Flow Bridge API called after successful payment:', {
      transactionHash,
      userAddress,
      amount,
      timestamp: new Date().toISOString()
    });

    // Simulate API response
    const response = {
      success: true,
      message: 'Flow bridge transaction processed successfully',
      data: {
        transactionHash,
        userAddress,
        amount,
        bridgeRoute: 'Flow → Base',
        timestamp: new Date().toISOString(),
        apiAccessGranted: true,
        features: [
          'Real-time bridge status',
          'Transaction history',
          'Advanced analytics',
          'Priority support'
        ]
      }
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Flow Bridge API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process bridge transaction' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Flow Bridge API endpoint',
    description: 'This endpoint is called after successful Flow → Base bridge transactions',
    status: 'active'
  });
} 