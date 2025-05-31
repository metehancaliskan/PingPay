import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'x402 integration test endpoint',
    status: 'active',
    timestamp: new Date().toISOString(),
    description: 'This endpoint tests the x402 payment middleware integration'
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'x402 POST test successful',
    status: 'active',
    timestamp: new Date().toISOString(),
    payment_required: false
  });
} 