# Multi-Wallet Integration Guide

## Overview
The frontend now supports multiple wallets per user, with automatic wallet selection based on the selected blockchain network.

## Key Changes

### 1. Session Management
- User wallets are now stored in both IndexedDB and sessionStorage
- The system automatically selects the appropriate wallet based on the current chain

### 2. Wallet Selection Logic
- **Ethereum Wallet**: Used for all EVM chains (Ethereum, Polygon, BSC, and their testnets)
- **NullNet Wallet**: Used exclusively for the NullNet chain

## New Utilities and Hooks

### `src/utils/wallet-helpers.ts`
Helper functions for wallet management:
```typescript
// Get wallet for a specific chain
getWalletForChain(chainId: string): WalletData | null

// Get wallet address for a specific chain
getWalletAddressForChain(chainId: string): string | null

// Update current wallet in sessionStorage
updateCurrentWallet(chainId: string): void
```

### `src/hooks/use-wallet.ts`
React hook for accessing wallet data:
```typescript
const { 
  currentWallet,    // Current wallet object
  walletAddress,    // Current wallet address
  walletKey,        // Current wallet private key
  walletName,       // Current wallet name
  allWallets,       // All user wallets
  isNullNet,        // Is current chain NullNet?
  isLoading 
} = useWallet();
```

### `src/hooks/use-balances.ts`
Updated to automatically use the correct wallet:
```typescript
const { balances, isLoading, error } = useBalances();
// No need to pass wallet address anymore!
```

## Usage Examples

### Getting Current Wallet Address
```typescript
import { useWallet } from '@/hooks/use-wallet';

function MyComponent() {
  const { walletAddress, isNullNet } = useWallet();
  
  return (
    <div>
      <p>Current Wallet: {walletAddress}</p>
      <p>Chain Type: {isNullNet ? 'NullNet' : 'EVM'}</p>
    </div>
  );
}
```

### Sending Transactions
```typescript
import { getWalletForChain } from '@/utils/wallet-helpers';

const wallet = getWalletForChain(chainId);
const response = await fetch('/wallet/send-token', {
  method: 'POST',
  body: JSON.stringify({
    senderWalletAddress: wallet.walletAddress,
    senderPrivateKey: wallet.walletKey,
    // ... other params
  })
});
```

### Chain Switching
When users switch chains, the wallet is automatically updated:
1. ChainContext updates the current network
2. `updateCurrentWallet()` is called automatically
3. All components using `useWallet()` re-render with new wallet data

## API Integration

The frontend now uses the wallet API examples from `src/services/wallet-api-example.ts`:

```typescript
// Get token balance
const balance = await getTokenBalance(userData, 'GOLD', 'nullnet');

// Get all balances
const balances = await getAllTokenBalances(userData, 'nullnet');

// Send tokens
const result = await sendToken(
  userData,
  '10',
  'null_ReceiverAddress',
  'GOLD',
  'nullnet'
);
```

## Migration Notes

If you have existing code that uses `sessionStorage.getItem('userWalletAddress')`, update it to:
```typescript
// Old way
const address = sessionStorage.getItem('userWalletAddress');

// New way
import { getWalletAddressForChain } from '@/utils/wallet-helpers';
const address = getWalletAddressForChain(currentNetwork.id);
```

## Testing

To test the multi-wallet functionality:
1. Create a new account - you'll get both Ethereum and NullNet wallets
2. Switch to NullNet chain - the NullNet wallet will be used automatically
3. Switch back to Ethereum - the Ethereum wallet will be used
4. Check the receive page - it shows the correct address for each chain

## Troubleshooting

### "No wallet found" errors
- Make sure user data includes both wallets
- Check that wallets are stored in sessionStorage: `JSON.parse(sessionStorage.getItem('userWallets'))`

### Wrong wallet being used
- Verify the chain ID is correct
- Check wallet names match exactly: "Ethereum Wallet" and "NullNet Wallet"

### Balance not updating
- Ensure the wallet address changes when switching chains
- Check network requests are using the correct wallet address 