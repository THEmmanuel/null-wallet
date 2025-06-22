"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowDownLeft, Send, ShoppingCart, ChevronLeft, ChevronRight, ChevronDown, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletAddress } from '../../components/ui/wallet-address';
import { formatDistanceToNow } from "date-fns"
import { useChain } from "@/contexts/ChainContext"
import { ChainSwitcherModal } from "@/components/ui/chain-switcher-modal"
import { useRouter, useSearchParams } from 'next/navigation';
import { BottomNav } from '../../components/ui/bottom-nav';
import { getWalletAddressForChain } from '@/utils/wallet-helpers';
import { fetchTokenUSDBalance, TOKEN_CONFIGS } from '@/services/token-balance-api';

// Sample transaction data
const transactions = [
	{
		id: "tx1",
		hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
		type: "send",
		symbol: "ETH",
		amount: 0.5,
		usdAmount: 1151.73,
		address: "0x1a2b3c4d5e6f7g8h9i0j",
		timestamp: new Date(2023, 4, 15, 14, 30),
		status: "Confirmed",
		gasUsed: 0.002,
		gasPrice: 25,
	},
	{
		id: "tx2",
		hash: "0xabcdef1234567890abcdef1234567890abcdef12",
		type: "receive",
		symbol: "ETH",
		amount: 1.2,
		usdAmount: 2764.14,
		address: "0xabcdef1234567890abcdef",
		timestamp: new Date(2023, 4, 14, 9, 45),
		status: "Confirmed",
		gasUsed: 0.0015,
		gasPrice: 20,
	},
	{
		id: "tx3",
		hash: "0x9876543210fedcba9876543210fedcba98765432",
		type: "send",
		symbol: "ETH",
		amount: 0.25,
		usdAmount: 575.86,
		address: "0x9876543210fedcba9876543",
		timestamp: new Date(2023, 4, 12, 18, 20),
		status: "Confirmed",
		gasUsed: 0.0018,
		gasPrice: 22,
	},
]

// Helper function to shorten address
const shortenAddress = (address: string) => {
	return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Helper function to format date
const formatDate = (date: Date) => {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	})
}

// Helper function to format time
const formatTime = (date: Date) => {
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	})
}

interface Transaction {
	timeStamp: string
	hash: string
	from: string
	to: string
	value: string
	gasPrice: string
	gasUsed: string
	isError: string
	tokenSymbol?: string
	tokenName?: string
	tokenDecimal?: string
	contractAddress?: string
	type?: string
}

export default function WalletPage() {
	const { currentNetwork, networks, switchNetwork, isLoading: chainLoading, tokens, getTokensForChain } = useChain()
	const searchParams = useSearchParams()
	const router = useRouter()
	const [selectedToken, setSelectedToken] = useState<string | null>(null)
	const [tokenInfo, setTokenInfo] = useState<any>(null)
	const [balance, setBalance] = useState<string | null>(null)
	const [isLoadingBalance, setIsLoadingBalance] = useState(true)
	const [error, setError] = useState("")
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
	const [txError, setTxError] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [totalTransactions, setTotalTransactions] = useState(0)
	const [showChainModal, setShowChainModal] = useState(false)
	const [showTokenDropdown, setShowTokenDropdown] = useState(false)
	const transactionsPerPage = 4
	const [walletAddress, setWalletAddress] = useState<string>("");
	
	// New state for token balance
	const [tokenBalance, setTokenBalance] = useState<{
		balance: string | null;
		usdBalance: number;
		tokenPrice: number;
	}>({
		balance: null,
		usdBalance: 0,
		tokenPrice: 0
	});
	const [isLoadingTokenBalance, setIsLoadingTokenBalance] = useState(false);

	// Get selected token from URL params
	useEffect(() => {
		const tokenParam = searchParams.get('token')
		if (tokenParam) {
			setSelectedToken(tokenParam)
		} else {
			// Default to native token if no token specified
			const nativeToken = tokens.find(t => t.type === 'native')
			setSelectedToken(nativeToken?.symbol || null)
		}
	}, [searchParams, tokens])

	// Get token info when selected token changes
	useEffect(() => {
		if (selectedToken && tokens.length > 0) {
			const token = tokens.find(t => t.symbol === selectedToken)
			setTokenInfo(token)
		}
	}, [selectedToken, tokens])

	// Update wallet address when network changes
	useEffect(() => {
		const address = getWalletAddressForChain(currentNetwork.id);
		setWalletAddress(address || "N/A");
	}, [currentNetwork.id]);

	const handleNetworkChange = (networkId: string) => {
		switchNetwork(networkId)
		// Reset page to 1 when switching networks
		setCurrentPage(1)
	}

	const handleTokenChange = (tokenSymbol: string) => {
		setSelectedToken(tokenSymbol)
		setShowTokenDropdown(false)
		// Update URL to reflect selected token
		router.push(`/wallet?token=${tokenSymbol}`)
	}

	// Use token balance from backend if available (for supported chains), otherwise calculate locally
	const displayUsdBalance = TOKEN_CONFIGS[currentNetwork.id] && tokenBalance.usdBalance > 0 
		? tokenBalance.usdBalance 
		: (balance ? parseFloat(balance) * tokenBalance.tokenPrice : 0)
	
	const displayTokenPrice = tokenBalance.tokenPrice > 0
		? tokenBalance.tokenPrice
		: currentNetwork.rate

	// Fetch balance for selected token
	useEffect(() => {
		const getBalance = async () => {
			if (!tokenInfo || !walletAddress || walletAddress === "N/A") {
				setIsLoadingBalance(false)
				return
			}

			setIsLoadingBalance(true)
			setBalance(null)
			setError("")

			try {
				const chainId = currentNetwork.id
				
				// For native tokens, use the existing balance endpoint
				if (tokenInfo.type === 'native') {
					const response = await fetch(`/api/balance?address=${walletAddress}&chain=${chainId}`)
					
					if (!response.ok) {
						throw new Error(`Failed to fetch balance: ${response.statusText}`)
					}

					const data = await response.json()
					
					if (data.success && data.balance !== undefined) {
						setBalance(data.balance)
					} else {
						throw new Error(data.error || 'Failed to get balance')
					}
				} else {
					// For ERC20 tokens, we need to fetch from the backend balances endpoint
					const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4444'
					const response = await fetch(`${backendUrl}/wallet/balances/${chainId}/${walletAddress}`)
					
					if (!response.ok) {
						throw new Error(`Failed to fetch balance: ${response.statusText}`)
					}

					const data = await response.json()
					
					if (data.success && data.data.balances) {
						const tokenBalance = data.data.balances.find((b: any) => b.symbol === tokenInfo.symbol)
						setBalance(tokenBalance?.balance || '0')
					} else {
						throw new Error(data.error || 'Failed to get balance')
					}
				}
			} catch (error) {
				console.error('Balance fetch error:', error)
				setError(error instanceof Error ? error.message : 'Failed to fetch balance')
				setBalance('0') 
			} finally {
				setIsLoadingBalance(false)
			}
		}

		getBalance()
	}, [walletAddress, currentNetwork, tokenInfo])

	// Fetch token USD balance
	useEffect(() => {
		const getTokenBalance = async () => {
			if (!walletAddress || walletAddress === "N/A" || !selectedToken) {
				return
			}

			if (!TOKEN_CONFIGS[currentNetwork.id] || !TOKEN_CONFIGS[currentNetwork.id][selectedToken]) {
				// Use default network rate for tokens not in CoinGecko
				setTokenBalance({
					balance: balance,
					usdBalance: 0,
					tokenPrice: tokenInfo?.type === 'native' ? currentNetwork.rate : 0
				})
				return
			}

			setIsLoadingTokenBalance(true)
			try {
				const tokenData = await fetchTokenUSDBalance(
					walletAddress,
					selectedToken,
					currentNetwork.id
				);
				
				setTokenBalance({
					balance: tokenData.balance,
					usdBalance: tokenData.usdBalance || 0,
					tokenPrice: tokenData.tokenPrice || 0
				})
			} catch (error) {
				console.error('Token balance fetch error:', error)
				setTokenBalance({
					balance: '0',
					usdBalance: 0,
					tokenPrice: 0
				})
			} finally {
				setIsLoadingTokenBalance(false)
			}
		}

		getTokenBalance()
	}, [walletAddress, currentNetwork, selectedToken, balance, tokenInfo])

	// Fetch transactions (now supporting both native and ERC20 tokens)
	useEffect(() => {
		const getTransactions = async () => {
			if (!walletAddress || walletAddress === "N/A" || !tokenInfo) {
				return
			}
			
			setIsLoadingTransactions(true)
			try {
				const chainId = currentNetwork.id
				let response;
				
				if (tokenInfo.type === 'native') {
					// Fetch native token transactions
					response = await fetch(`/api/transactions?address=${walletAddress}&chain=${chainId}&page=${currentPage}&offset=${transactionsPerPage}`)
				} else {
					// Fetch ERC20 token transactions
					response = await fetch(`/api/token-transactions?address=${walletAddress}&chain=${chainId}&token=${tokenInfo.symbol}&page=${currentPage}&offset=${transactionsPerPage}`)
				}
				
				if (!response.ok) {
					throw new Error(`Failed to fetch transactions: ${response.statusText}`)
				}

				const data = await response.json()
				
				if (data.success) {
					const formattedTxs = data.transactions.map((tx: any) => ({
						...tx,
						value: tx.value || '0',
						hash: tx.hash || 'N/A',
						from: tx.from || 'N/A',
						to: tx.to || 'N/A',
						timeStamp: tx.timeStamp || tx.timestamp || Date.now().toString(),
						tokenSymbol: tx.tokenSymbol || tokenInfo.symbol,
						tokenDecimal: tx.tokenDecimal || tokenInfo.decimals
					}))
					setTransactions(formattedTxs)
					setTotalTransactions(data.totalCount || 0)
				} else {
					throw new Error(data.error || 'Failed to get transactions')
				}
			} catch (error) {
				console.error('Transactions fetch error:', error)
				setTransactions([])
				setTotalTransactions(0)
			} finally {
				setIsLoadingTransactions(false)
			}
		}

		getTransactions()
	}, [walletAddress, currentPage, currentNetwork, tokenInfo])

	const formatValue = (value: string, decimals?: number) => {
		const decimal = decimals || (tokenInfo?.type === 'native' ? 18 : tokenInfo?.decimals || 18)
		return (parseInt(value) / Math.pow(10, decimal)).toFixed(6)
	}

	const formatGasPrice = (gasPrice: string) => {
		return (parseInt(gasPrice) / 1e9).toFixed(2)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
			</div>

			<main className="relative flex min-h-screen flex-col p-4 md:p-6">
				<div className="w-full max-w-md mx-auto space-y-6">
					{/* Back Button */}
					<div className="animate-fadeIn">
						<Link href="/home">
							<Button 
								variant="ghost" 
								className="pl-0 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all duration-300"
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Portfolio
							</Button>
						</Link>
					</div>

					{/* Enhanced Header */}
					<Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-fadeIn overflow-hidden">
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-4">
								<Button
									variant="outline"
									className="flex items-center space-x-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200"
									onClick={() => setShowChainModal(true)}
								>
									{currentNetwork.icon}
									<span>{currentNetwork.name}</span>
									<span className="text-xs opacity-70">▼</span>
								</Button>

								{/* Token Selector */}
								<div className="relative">
									<Button
										variant="outline"
										onClick={() => setShowTokenDropdown(!showTokenDropdown)}
										className="flex items-center space-x-2 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600"
									>
										<span>{tokenInfo?.symbol || 'Select Token'}</span>
										<ChevronDown className="h-4 w-4" />
									</Button>
									
									{showTokenDropdown && (
										<div className="absolute right-0 z-10 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
											{tokens.map((token) => (
												<button
													key={token.symbol}
													onClick={() => handleTokenChange(token.symbol)}
													className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
												>
													<span>{token.name}</span>
													<span className="text-sm text-gray-500">{token.symbol}</span>
												</button>
											))}
										</div>
									)}
								</div>
							</div>

							<div className="text-center mb-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
								{chainLoading || isLoadingBalance || (TOKEN_CONFIGS[currentNetwork.id] && isLoadingTokenBalance) ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
										<p className="text-gray-600 dark:text-gray-400">
											{chainLoading ? `Switching to ${currentNetwork.name}...` : "Loading balance..."}
										</p>
									</div>
								) : error ? (
									<p className="text-red-600 dark:text-red-400">{error}</p>
								) : (
									<>
										<h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
											{balance} {tokenInfo?.symbol || currentNetwork.symbol}
										</h1>
										<p className="text-xl text-gray-600 dark:text-gray-300">
											${displayUsdBalance.toLocaleString()}
										</p>
										{displayTokenPrice > 0 && (
											<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
												1 {tokenInfo?.symbol} = ${displayTokenPrice.toFixed(displayTokenPrice < 1 ? 4 : 2)}
											</p>
										)}
									</>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex justify-center gap-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
								<Link href={`/wallet/send?token=${selectedToken || ''}`} className="flex flex-col items-center group">
									<Button 
										variant="ghost" 
										size="icon" 
										className="h-14 w-14 rounded-full mb-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/70 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
									>
										<Send className="h-6 w-6" />
									</Button>
									<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Send</span>
								</Link>

								<Link href="/wallet/receive" className="flex flex-col items-center group">
									<Button 
										variant="ghost" 
										size="icon" 
										className="h-14 w-14 rounded-full mb-2 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800/70 text-green-600 dark:text-green-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
									>
										<ArrowDownLeft className="h-6 w-6" />
									</Button>
									<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Receive</span>
								</Link>

								<Link href="/wallet/options" className="flex flex-col items-center group">
									<Button 
										variant="ghost" 
										size="icon" 
										className="h-14 w-14 rounded-full mb-2 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800/70 text-purple-600 dark:text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
									>
										<ShoppingCart className="h-6 w-6" />
									</Button>
									<span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Buy/Sell</span>
								</Link>
							</div>
						</CardContent>
					</Card>

					{/* Wallet Address */}
					<div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
						<WalletAddress address={walletAddress} />
					</div>

					{/* Transaction History */}
					<Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.4s' }}>
						<CardContent className="p-6">
							<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
								{tokenInfo?.type === 'native' ? 'Transaction History' : `${tokenInfo?.symbol} Transactions`}
							</h2>

							{chainLoading || isLoadingTransactions ? (
								<div className="flex items-center justify-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
									<span className="ml-2 text-gray-600 dark:text-gray-400">
										{chainLoading ? `Loading ${currentNetwork.name} transactions...` : "Loading transactions..."}
									</span>
								</div>
							) : transactions.length === 0 ? (
								<div className="text-center py-8 text-gray-600 dark:text-gray-400">
									<p>No {tokenInfo?.symbol} transactions found on {currentNetwork.name}</p>
									{tokenInfo?.type !== 'native' && (
										<p className="text-sm mt-2">
											Ensure block explorer API key is set in backend .env file
										</p>
									)}
								</div>
							) : (
								<>
									<div className="space-y-3">
										{transactions.map((tx: any, index) => (
											<div 
												key={tx.hash} 
												className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm hover:bg-gray-100/80 dark:hover:bg-gray-600/50 transition-all duration-200 animate-slideUp"
												style={{ animationDelay: `${0.5 + index * 0.05}s` }}
											>
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-1">
														<span className={`px-2 py-1 text-xs font-semibold rounded-full ${
															tx.from.toLowerCase() === walletAddress.toLowerCase() 
																? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
																: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
														}`}>
															{tx.from.toLowerCase() === walletAddress.toLowerCase() ? "Sent" : "Received"}
														</span>
														<span className="text-sm text-gray-600 dark:text-gray-400">
															{formatDistanceToNow(new Date(parseInt(tx.timeStamp) * 1000), { addSuffix: true })}
														</span>
													</div>
													<div className="mt-1">
														<a 
															href={`${currentNetwork.blockExplorer}/tx/${tx.hash}`}
															target="_blank"
															rel="noopener noreferrer"
															className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-mono"
														>
															{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
														</a>
													</div>
												</div>
												<div className="text-right">
													<div className="text-sm font-medium text-gray-900 dark:text-white">
														{formatValue(tx.value, tx.tokenDecimal)} {tx.tokenSymbol || tokenInfo?.symbol || currentNetwork.symbol}
													</div>
													<div className="text-xs text-gray-500 dark:text-gray-400">
														Gas: {formatGasPrice(tx.gasPrice)} Gwei
													</div>
												</div>
											</div>
										))}
									</div>

									{/* Pagination */}
									{totalTransactions > 0 && (
										<div className="flex items-center justify-between mt-6 animate-slideUp" style={{ animationDelay: '0.7s' }}>
											<Button
												variant="outline"
												onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
												disabled={currentPage === 1}
												className="flex items-center bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200"
											>
												<ChevronLeft className="w-4 h-4 mr-1" />
												Previous
											</Button>
											<span className="text-sm text-gray-700 dark:text-gray-300">
												Page {currentPage} of {Math.ceil(totalTransactions / transactionsPerPage)}
											</span>
											<Button
												variant="outline"
												onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalTransactions / transactionsPerPage), p + 1))}
												disabled={currentPage === Math.ceil(totalTransactions / transactionsPerPage)}
												className="flex items-center bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200"
											>
												Next
												<ChevronRight className="w-4 h-4 ml-1" />
											</Button>
										</div>
									)}
								</>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
			<ChainSwitcherModal
				isOpen={showChainModal}
				onClose={() => setShowChainModal(false)}
			/>
		</div>
	)
}