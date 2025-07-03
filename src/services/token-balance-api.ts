export interface TokenBalanceResponse {
  balance: string;
  tokenPrice: number;
  usdBalance: number;
  marketCap?: number;
  volume24h?: number;
  priceChange24h?: number;
}

export interface TokenConfig {
  symbol: string;
  contractAddress: string | null;
  chain: string;
}

// Token configurations based on the backend tokens.js
export const TOKEN_CONFIGS: Record<string, Record<string, TokenConfig>> = {
  ethereum: {
    ETH: { symbol: 'ethereum', contractAddress: null, chain: 'ethereum' },
    USDT: { symbol: 'tether', contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', chain: 'ethereum' },
    USDC: { symbol: 'usd-coin', contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', chain: 'ethereum' },
    DAI: { symbol: 'dai', contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F', chain: 'ethereum' }
  },
  sepolia: {
    ETH: { symbol: 'ethereum', contractAddress: null, chain: 'sepolia' },
    USDT: { symbol: 'tether', contractAddress: '0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5', chain: 'sepolia' },
    USDC: { symbol: 'usd-coin', contractAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', chain: 'sepolia' }
  },
  polygon: {
    MATIC: { symbol: 'matic-network', contractAddress: null, chain: 'polygon' },
    USDT: { symbol: 'tether', contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', chain: 'polygon' },
    USDC: { symbol: 'usd-coin', contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', chain: 'polygon' },
    DAI: { symbol: 'dai', contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', chain: 'polygon' }
  },
  mumbai: {
    MATIC: { symbol: 'matic-network', contractAddress: null, chain: 'mumbai' },
    USDT: { symbol: 'tether', contractAddress: '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832', chain: 'mumbai' },
    USDC: { symbol: 'usd-coin', contractAddress: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747', chain: 'mumbai' }
  },
  bsc: {
    BNB: { symbol: 'binancecoin', contractAddress: null, chain: 'bsc' },
    USDT: { symbol: 'tether', contractAddress: '0x55d398326f99059fF775485246999027B3197955', chain: 'bsc' },
    BUSD: { symbol: 'binance-usd', contractAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', chain: 'bsc' },
    CAKE: { symbol: 'pancakeswap-token', contractAddress: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', chain: 'bsc' }
  },
  bscTestnet: {
    BNB: { symbol: 'binancecoin', contractAddress: null, chain: 'bscTestnet' },
    USDT: { symbol: 'tether', contractAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', chain: 'bscTestnet' },
    BUSD: { symbol: 'binance-usd', contractAddress: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7', chain: 'bscTestnet' }
  },
  flowTestnet: {
    FLOW: { symbol: 'flow', contractAddress: null, chain: 'flowTestnet' },
    USDT: { symbol: 'tether', contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3', chain: 'flowTestnet' },
    USDC: { symbol: 'usd-coin', contractAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', chain: 'flowTestnet' }
  }
};

export async function fetchTokenUSDBalance(
  walletAddress: string,
  tokenSymbol: string,
  chainId: string
): Promise<TokenBalanceResponse> {
  const tokenConfig = TOKEN_CONFIGS[chainId]?.[tokenSymbol];
  
  if (!tokenConfig) {
    throw new Error(`Token ${tokenSymbol} not supported on chain ${chainId}`);
  }

  const contractAddress = tokenConfig.contractAddress || 'null';
  const coingeckoId = tokenConfig.symbol;

  const response = await fetch(
    `/api/token-balance?address=${walletAddress}&token=${coingeckoId}&chain=${chainId}&contractAddress=${contractAddress}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch token balance: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to get token balance');
  }

  return data;
}

export function getSupportedTokensForChain(chainId: string): string[] {
  return Object.keys(TOKEN_CONFIGS[chainId] || {});
} 