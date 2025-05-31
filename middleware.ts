import { paymentMiddleware } from 'x402-next';

// Configure the payment middleware
export const middleware = paymentMiddleware(
  "0xA6A0bB8309b0123f63DA911d91a4e076B466C0A5", // TODO: Replace with your receiving wallet address 
  {  // Route configurations for protected endpoints
    '/api/protected': {
      price: '$0.01',
      network: "base",
      config: {
        description: 'Access to protected API endpoint'
      }
    },
    '/api/flow-bridge': {
      price: '$0.01',
      network: "base", 
      config: {
        description: 'Access to Flow bridge API'
      }
    },
    '/api/rootstock-bridge': {
      price: '$0.01',
      network: "base",
      config: {
        description: 'Access to Rootstock bridge API' 
      }
    }
  }
);

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/protected/:path*',
    '/api/flow-bridge/:path*',
    '/api/rootstock-bridge/:path*',
  ]
}; 