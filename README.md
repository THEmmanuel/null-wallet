# Hackathon features summary
During the PL Genesis Hackathon, I integrated FLOW EVM Testnet.
Deployed a gas sponsorship contract here: https://evm-testnet.flowscan.io/tx/0x89ed7d13188bbf3a2f4eed19b017a58afd8ebd7f31a46af5a42b7613e3f00871
Can be enabled with the useGasSpomsorship flag in the API call to true for non-native tokens
Plus so much more feature adds

Null Wallet is a Wallet As A Service and Derivative Asset Layer (Proposed)
NullNet is a Proposed Post Quantum Ready Chain Built on Kinetic Keys SDK: https://www.npmjs.com/package/@ayxdele/kinetic-keys
Supports Token Based Auth: Test with: edf35a08f024fa69263938e37b1550a0095241569aa6435dd4d66e28aa2d457d (Choose Token based Auth on sign in or create a new account and refresh the page)

API reference for Wallet As A Service: https://nullwalletapi.onrender.com/api-docs/
Backend Repo: https://github.com/THEmmanuel/NullWalletAPi
Includes GasSponsorship.sol

# Chain Switching Functionality Guide

## Overview

The frontend now supports dynamic chain switching across all wallet operations. When you switch networks, the app automatically updates:

- Balance display for the selected chain
- Transaction history for the selected chain  
- Send/receive operations on the selected chain
- Block explorer links for transactions
- Network-specific UI elements and instructions

## Supported Networks

- **Ethereum** - ETH transactions on Ethereum
- **Sepolia** - ETH transactions on Ethereum testnet
- **Polygon** - MATIC transactions on Polygon
- **Mumbai** - MATIC transactions on Polygon testnet
- **BSC** - BNB transactions on Binance Smart Chain
- **BSC Testnet** - BNB transactions on BSC testnet
- **NullNet** - NULLX transactions on the NullNet blockchain (Sim)
- **Flow EVM Testnet** - FLOW transactions on Flow EVM testnet

## Environment Setup

Create a `.env.local` file in the `null-wallet-ts` directory with:

```bash
# Backend API Configuration
BACKEND_URL=http://localhost:4444

# External API Keys
ETHERSCAN_KEY=your_etherscan_api_key_here

# PayPal Configuration (if using PayPal features)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

## How It Works

### 1. Chain Context Management
- **ChainProvider**: Wraps the entire app to provide chain state
- **useChain()**: Hook to access current network and switch networks
- **Persistence**: Selected network is saved to localStorage

### 2. Dynamic API Routing
- **Balance API**: Routes to backend based on selected chain
- **Transactions API**: Fetches chain-specific transaction history
- **Backwards Compatible**: Falls back to Etherscan for unsupported chains

### 3. Real-time Updates
- **Network Switch**: Automatically refetches balance and transactions
- **Loading States**: Shows chain-specific loading messages
- **Error Handling**: Network-aware error messages

## Key Features

### Wallet Page
- Network dropdown with icons and rates
- Chain-specific balance fetching
- Network-aware transaction history
- Block explorer links for each chain
- Loading states during network switches

### Send Page
- Sends tokens on the selected network
- Network-specific gas calculations
- Chain-aware transaction confirmation
- Proper chainId parameter for backend

### Receive Page  
- Shows wallet address for current network
- Network-specific instructions
- Chain-aware QR codes and sharing
- Special notes for different networks

## Technical Implementation

### Context Structure
```typescript
interface ChainContextType {
  currentNetwork: Network;
  setCurrentNetwork: (network: Network) => void;
  switchNetwork: (networkId: string) => void;
  isLoading: boolean;
}
```

### Network Configuration
```typescript
interface Network {
  id: string;
  name: string;
  icon: React.ReactNode;
  symbol: string;
  rate: number;
  chainId?: string;
  blockExplorer?: string;
}
```

### API Integration
- **GET /api/balance?address={address}&chain={chain}**
- **GET /api/transactions?address={address}&chain={chain}&page={page}&offset={offset}**
- **POST /wallet/send-token** (with chainId parameter)

## Backend Integration

The frontend routes to these backend endpoints:

- `/wallet/balance/{chain}/{address}` - Get balance for specific chain
- `/wallet/transactions/{chain}/{address}` - Get transactions for specific chain
- `/wallet/send-token` - Send tokens (requires chainId parameter)

## Usage Examples

### Switching Networks
```typescript
const { currentNetwork, switchNetwork } = useChain();

// Switch to NullNet
switchNetwork('nullnet');

// Switch to Ethereum  
switchNetwork('ethereum');
```

### Getting Chain-Aware Data
```typescript
// Balance will automatically update for current network
const balance = await fetch(`/api/balance?address=${address}&chain=${currentNetwork.id}`);

// Transactions will be filtered by current network
const transactions = await fetch(`/api/transactions?address=${address}&chain=${currentNetwork.id}`);
```

### Network-Specific UI
```typescript
// Show network-specific messages
{currentNetwork.id === 'nullnet' && (
  <div className="text-purple-600">
    You're on the NullNet blockchain
  </div>
)}

// Use network-specific block explorer
<a href={`${currentNetwork.blockExplorer}/tx/${txHash}`}>
  View Transaction
</a>
```

## User Experience

1. **Select Network**: Use the dropdown in the wallet page
2. **Auto-Refresh**: Balance and transactions update automatically
3. **Loading States**: Clear feedback during network switches
4. **Persistence**: Network selection survives page reloads
5. **Error Handling**: Clear messages for network-specific issues

## Testing

1. Switch between different networks in the wallet
2. Verify balance updates for each chain
3. Check transaction history changes per network
4. Test sending tokens on different chains
5. Confirm receive page shows correct network info

## Troubleshooting

### Balance Not Loading
- Check if backend is running on port 4444
- Verify BACKEND_URL in environment variables
- Ensure the selected chain is supported by backend

### Transactions Not Showing
- Confirm wallet address has transactions on selected chain
- Check backend transaction endpoint for the specific chain
- Verify block explorer links work for the network

### Send Transaction Fails
- Ensure sufficient balance on the selected network
- Check if chainId is properly passed to backend
- Verify private key and wallet address are correct

This implementation provides a seamless multi-chain experience where users can easily switch between networks and have all wallet operations automatically adapt to the selected chain. 



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

