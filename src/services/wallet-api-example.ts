// Example of how to use the wallet API endpoints with user data

interface UserData {
  _id: string;
  email: string;
  username: string;
  userID: string;
  userWallets: Array<{
    walletName: string;
    walletAddress: string;
    walletKey: string | null;
    walletPhrase: string | null;
    _id: string;
  }>;
  supportedChains: Array<{
    chainId: string;
    chainName: string;
    isEnabled: boolean;
  }>;
  supportedTokens: Array<{
    tokenSymbol: string;
    tokenName: string;
    tokenType: string;
    decimals: number;
    chainData: Array<{
      chainId: string;
      contractAddress: string | null;
      decimals: number;
      isEnabled: boolean;
    }>;
  }>;
  currentChain: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Example: Get token balance for a specific token on a specific chain
export async function getTokenBalance(
  userData: UserData,
  tokenSymbol: string,
  chainId: string
) {
  try {
    // Find the wallet address for the selected chain
    // For Ethereum-based chains, use the Ethereum wallet
    // For NullNet, use the NullNet wallet
    const wallet = userData.userWallets.find(w => {
      if (chainId === 'nullnet') {
        return w.walletName === 'NullNet Wallet';
      }
      return w.walletName === 'Ethereum Wallet';
    });

    if (!wallet) {
      throw new Error('Wallet not found for the selected chain');
    }

    // Find the token in the user's supported tokens
    const token = userData.supportedTokens.find(
      t => t.tokenSymbol === tokenSymbol
    );

    if (!token) {
      throw new Error('Token not found');
    }

    // Find the token's contract address for the selected chain
    const tokenOnChain = token.chainData.find(
      td => td.chainId === chainId
    );

    if (!tokenOnChain) {
      throw new Error(`Token ${tokenSymbol} is not supported on ${chainId}`);
    }

    // For native tokens, use null or the token symbol as contract address
    const contractAddress = tokenOnChain.contractAddress || tokenSymbol;

    // Make the API call
    const response = await fetch(
      `${API_BASE_URL}/wallet/get-token-balance/${wallet.walletAddress}/${contractAddress}/${chainId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch token balance');
    }

    const data = await response.json();
    return data.balance;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw error;
  }
}

// Example: Get all token balances for a wallet on a specific chain
export async function getAllTokenBalances(userData: UserData, chainId: string) {
  try {
    // Find the wallet address for the selected chain
    const wallet = userData.userWallets.find(w => {
      if (chainId === 'nullnet') {
        return w.walletName === 'NullNet Wallet';
      }
      return w.walletName === 'Ethereum Wallet';
    });

    if (!wallet) {
      throw new Error('Wallet not found for the selected chain');
    }

    // Make the API call to get all balances
    const response = await fetch(
      `${API_BASE_URL}/wallet/balances/${chainId}/${wallet.walletAddress}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch balances');
    }

    const data = await response.json();
    return data.data.balances;
  } catch (error) {
    console.error('Error fetching balances:', error);
    throw error;
  }
}

// Example: Send tokens
export async function sendToken(
  userData: UserData,
  amount: string,
  receiverAddress: string,
  tokenSymbol: string,
  chainId: string
) {
  try {
    // Find the wallet for the selected chain
    const wallet = userData.userWallets.find(w => {
      if (chainId === 'nullnet') {
        return w.walletName === 'NullNet Wallet';
      }
      return w.walletName === 'Ethereum Wallet';
    });

    if (!wallet) {
      throw new Error('Wallet not found for the selected chain');
    }

    const response = await fetch(`${API_BASE_URL}/wallet/send-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        receiverWalletAddress: receiverAddress,
        tokenToSend: tokenSymbol,
        senderWalletAddress: wallet.walletAddress,
        senderPrivateKey: wallet.walletKey, // Note: This will be null for NullNet
        chainId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending token:', error);
    throw error;
  }
}

// Example React component usage
/*
import { useEffect, useState } from 'react';
import { getTokenBalance, getAllTokenBalances } from './wallet-api-example';

function WalletBalance({ userData }) {
  const [balance, setBalance] = useState('0');
  const [allBalances, setAllBalances] = useState([]);
  const [selectedChain, setSelectedChain] = useState(userData.currentChain);

  useEffect(() => {
    // Get ETH balance on Ethereum chain
    getTokenBalance(userData, 'ETH', 'ethereum')
      .then(balance => setBalance(balance))
      .catch(console.error);

    // Get all balances for the selected chain
    getAllTokenBalances(userData, selectedChain)
      .then(balances => setAllBalances(balances))
      .catch(console.error);
  }, [userData, selectedChain]);

  return (
    <div>
      <h3>ETH Balance: {balance}</h3>
      <h3>All Balances on {selectedChain}:</h3>
      <ul>
        {allBalances.map((token, index) => (
          <li key={index}>
            {token.symbol}: {token.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}
*/ 