"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EclipseIcon, Globe, Landmark } from "lucide-react";
import { getWalletAddressForChain, updateCurrentWallet } from '@/utils/wallet-helpers';

// Network interface
export interface Network {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactNode;
  rate: number;
  blockExplorer: string;
  chainId?: number;
  rpcUrl?: string;
}

// Token interface
export interface Token {
  symbol: string;
  name: string;
  type: string;
  decimals: number;
  contractAddress?: string;
  chainDecimals?: number;
  balance?: string; // Added balance property
}

// Chain context type
interface ChainContextType {
  currentNetwork: Network;
  networks: Network[];
  tokens: Token[];
  switchNetwork: (networkId: string) => void;
  isLoading: boolean;
  updateCurrentChain: (chainId: string) => Promise<void>;
  getTokensForChain: (chainId: string) => Promise<Token[]>;
}

// Create context
const ChainContext = createContext<ChainContextType | undefined>(undefined);

// Icon mapping for different networks
const getNetworkIcon = (chainId: string) => {
  switch (chainId) {
    case 'ethereum':
    case 'sepolia':
      return <EclipseIcon className="h-4 w-4 text-blue-600" />;
    case 'polygon':
    case 'mumbai':
      return <Landmark className="h-4 w-4 text-purple-600" />;
    case 'bsc':
    case 'bscTestnet':
      return <Globe className="h-4 w-4 text-yellow-600" />;
    case 'nullnet':
      return <EclipseIcon className="h-4 w-4 text-indigo-600" />;
    case 'flowTestnet':
      return <EclipseIcon className="h-4 w-4 text-green-600" />;
    default:
      return <EclipseIcon className="h-4 w-4 text-gray-600" />;
  }
};

// Default rates for networks (can be fetched from API later)
const getNetworkRate = (chainId: string) => {
  switch (chainId) {
    case 'ethereum':
    case 'sepolia':
      return 2303;
    case 'polygon':
    case 'mumbai':
      return 0.8;
    case 'bsc':
    case 'bscTestnet':
      return 242;
    case 'nullnet':
      return 0; // For NullNet, prices come from individual assets
    case 'flowTestnet':
      return 1.2; // Example rate for Flow EVM Testnet
    default:
      return 1;
  }
};

// Provider component
export const ChainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentNetwork, setCurrentNetwork] = useState<Network>({
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: <EclipseIcon className="h-4 w-4 text-blue-600" />,
    rate: 2303,
    blockExplorer: 'https://sepolia.etherscan.io'
  });
  const [networks, setNetworks] = useState<Network[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Backend URL
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4444';

  // Fetch supported chains from backend
  const fetchSupportedChains = async () => {
    try {
      const backendUrl = `${BACKEND_URL}/wallet/supported`;
      console.log('🔍 ChainContext: Fetching supported chains from:', backendUrl);
      console.log('🔍 ChainContext: BACKEND_URL env var:', process.env.NEXT_PUBLIC_BACKEND_URL);
      
      const response = await fetch(backendUrl);
      console.log('🔍 ChainContext: Response status:', response.status);
      console.log('🔍 ChainContext: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 ChainContext: HTTP error!', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ ChainContext: Received chains data:', data);
      
      if (data.success && data.data && data.data.chains) {
        const formattedNetworks = data.data.chains.map((chain: any) => ({
          id: chain.id,
          name: chain.name,
          symbol: chain.nativeCurrency?.symbol || 'ETH',
          icon: getNetworkIcon(chain.id),
          rate: getNetworkRate(chain.id),
          blockExplorer: chain.blockExplorer || '#',
          chainId: chain.chainId,
          rpcUrl: chain.rpcUrl
        }));
        
        console.log('✅ ChainContext: Formatted networks:', formattedNetworks);
        console.log('✅ ChainContext: Setting', formattedNetworks.length, 'networks');
        setNetworks(formattedNetworks);
        
        // Set current network from localStorage or default to first network
        const savedNetworkId = localStorage.getItem('selectedNetwork');
        if (savedNetworkId) {
          const savedNetwork = formattedNetworks.find((n: Network) => n.id === savedNetworkId);
          if (savedNetwork) {
            setCurrentNetwork(savedNetwork);
            console.log('✅ ChainContext: Restored saved network:', savedNetwork);
          }
        } else if (formattedNetworks.length > 0) {
          setCurrentNetwork(formattedNetworks[0]);
          console.log('✅ ChainContext: Using first network as default:', formattedNetworks[0]);
        }
      } else {
        console.error('🚨 ChainContext: Invalid response format:', data);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('🚨 ChainContext: Error fetching supported chains:', error);
      console.log('🔄 ChainContext: Falling back to default networks...');
      
      // Fallback to default networks
      const defaultNetworks = [
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          icon: <EclipseIcon className="h-4 w-4 text-blue-600" />,
          rate: 2303,
          blockExplorer: 'https://sepolia.etherscan.io'
        },
        {
          id: 'polygon',
          name: 'Polygon',
          symbol: 'MATIC',
          icon: <Landmark className="h-4 w-4 text-purple-600" />,
          rate: 0.8,
          blockExplorer: 'https://mumbai.polygonscan.com'
        },
        {
          id: 'bsc',
          name: 'BSC',
          symbol: 'BNB',
          icon: <Globe className="h-4 w-4 text-yellow-600" />,
          rate: 242,
          blockExplorer: 'https://bscscan.com'
        },
        {
          id: 'nullnet',
          name: 'NullNet',
          symbol: 'NULL',
          icon: <EclipseIcon className="h-4 w-4 text-indigo-600" />,
          rate: 1,
          blockExplorer: '#'
        },
        {
          id: 'flowTestnet',
          name: 'Flow EVM Testnet',
          symbol: 'FLOW',
          icon: <EclipseIcon className="h-4 w-4 text-green-600" />,
          rate: 1.2,
          blockExplorer: 'https://evm-testnet.flowscan.io'
        }
      ];
      console.log('🔄 ChainContext: Using fallback networks:', defaultNetworks);
      setNetworks(defaultNetworks);
      setCurrentNetwork(defaultNetworks[0]);
    }
  };

  // Fetch tokens for a specific chain
  const getTokensForChain = async (chainId: string): Promise<Token[]> => {
    try {
      console.log('Fetching tokens for chain:', chainId);

      // Token metadata endpoint
      const tokensEndpoint = `${BACKEND_URL}/wallet/chains/${chainId}/tokens`;

      // Fetch token metadata first
      const tokensRes = await fetch(tokensEndpoint);
      const tokensData = await tokensRes.json();

      if (!tokensData.success) {
        console.warn('No token meta found for chain:', chainId);
        return [];
      }

      const tokenMeta: Token[] = tokensData.data.tokens;

      // Get the appropriate wallet address for the chain
      const walletAddress = getWalletAddressForChain(chainId);

      if (!walletAddress) {
        console.log('No wallet address for chain – returning token metadata only.');
        return tokenMeta;
      }

      const balancesRes = await fetch(
        `${BACKEND_URL}/wallet/balances/${chainId}/${walletAddress}`
      );
      const balancesData = await balancesRes.json();

      if (!balancesData.success) {
        console.warn(
          'Failed to fetch balances for chain',
          chainId,
          balancesData.error
        );
        return tokenMeta;
      }

      const balancesArray = balancesData.data.balances as any[];

      // merge balances
      const tokensWithBalances = tokenMeta.map((t: any) => {
        const bal = balancesArray.find((b) => b.symbol.toUpperCase() === t.symbol.toUpperCase());
        return {
          ...t,
          balance: bal ? bal.balance : '0',
        };
      });

      return tokensWithBalances;
    } catch (error) {
      console.error(`Error fetching tokens for chain ${chainId}:`, error);
      return [];
    }
  };

  // Update user's current chain on backend
  const updateCurrentChain = async (chainId: string): Promise<void> => {
    try {
      const userId = sessionStorage.getItem('userID');
      if (!userId) {
        console.warn('No user ID found, skipping backend update');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/wallet/user/${userId}/current-chain`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chainId }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Failed to update current chain on backend:', data.error);
      } else {
        console.log('Successfully updated current chain on backend:', chainId);
      }
    } catch (error) {
      console.error('Error updating current chain on backend:', error);
    }
  };

  // Switch network function
  const switchNetwork = async (networkId: string) => {
    console.log('Switching to network:', networkId);
    const network = networks.find(n => n.id === networkId);
    if (network) {
      setIsLoading(true);
      setCurrentNetwork(network);
      localStorage.setItem('selectedNetwork', networkId);
      
      // Update the current wallet in sessionStorage
      updateCurrentWallet(networkId);
      
      // Update backend
      await updateCurrentChain(networkId);
      
      // Fetch tokens for the new chain
      const chainTokens = await getTokensForChain(networkId);
      setTokens(chainTokens);
      
      setIsLoading(false);
      console.log('Network switch completed:', network);
    } else {
      console.error('Network not found:', networkId, 'Available networks:', networks);
    }
  };

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      console.log('🚀 ChainContext: Initializing...');
      console.log('🚀 ChainContext: Environment check:', {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NODE_ENV: process.env.NODE_ENV,
        currentUrl: typeof window !== 'undefined' ? window.location.href : 'server'
      });
      
      setIsLoading(true);
      
      // Force a simple test first  
      try {
        console.log('🧪 ChainContext: Testing fetch capability...');
        const testResponse = await fetch('https://httpbin.org/json');
        const testData = await testResponse.json();
        console.log('🧪 ChainContext: Basic fetch works:', !!testData);
      } catch (testError) {
        console.error('🧪 ChainContext: Basic fetch failed:', testError);
      }
      
      await fetchSupportedChains();
      setIsLoading(false);
      console.log('🚀 ChainContext: initialization completed');
    };
    
    initialize();
  }, []);

  // Fetch tokens when current network changes
  useEffect(() => {
    if (currentNetwork.id) {
      console.log('Current network changed to:', currentNetwork.id);
      getTokensForChain(currentNetwork.id).then(setTokens);
    }
  }, [currentNetwork.id]);

  const value: ChainContextType = {
    currentNetwork,
    networks,
    tokens,
    switchNetwork,
    isLoading,
    updateCurrentChain,
    getTokensForChain,
  };

  return (
    <ChainContext.Provider value={value}>
      {children}
    </ChainContext.Provider>
  );
};

// Hook to use the context
export const useChain = (): ChainContextType => {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error('useChain must be used within a ChainProvider');
  }
  return context;
};

// Export networks for backward compatibility (will be empty until loaded)
export let networks: Network[] = []; 