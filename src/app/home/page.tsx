"use client"

import { useState, useEffect } from "react"
import { EthereumBalanceCard } from '../../components/ui/ethereum-balance-card'
import { WalletHeader } from "../../components/ui/wallet-header"
import { WalletBalance } from "../../components/ui/wallet-balance"
import { EclipseIcon, Globe, Landmark, Send, ArrowDownUp, CreditCard, History, Plus, TrendingUp, Wallet, Coins, DollarSign, Loader2 } from "lucide-react"
import { FloatingDockDemo } from "@/components/ui/floating-dock-demo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useChain } from "@/contexts/ChainContext"
import { fetchTokenUSDBalance, TOKEN_CONFIGS } from '@/services/token-balance-api'
import { getWalletAddressForChain } from "@/utils/wallet-helpers"

export default function Home() {
	const { currentNetwork, networks, tokens, switchNetwork, isLoading: chainLoading, updateCurrentChain } = useChain()
	const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({})
	const [isLoadingPrices, setIsLoadingPrices] = useState(false)
	const [totalPortfolioValue, setTotalPortfolioValue] = useState(0)

	const handleNetworkChange = (networkId: string) => {
		switchNetwork(networkId)
	}

	// Fetch token prices when tokens or network changes
	useEffect(() => {
		const fetchPrices = async () => {
			if (tokens.length === 0) return
			
			setIsLoadingPrices(true)
			const prices: Record<string, number> = {}
			let portfolioValue = 0
			
			const walletAddress = getWalletAddressForChain(currentNetwork.id)
			
			for (const token of tokens) {
				try {
					// Try to get USD price from backend if supported
					if (walletAddress && TOKEN_CONFIGS[currentNetwork.id]?.[token.symbol]) {
						const tokenData = await fetchTokenUSDBalance(
							walletAddress,
							token.symbol,
							currentNetwork.id
						)
						prices[token.symbol] = tokenData.tokenPrice || 0
						
						// Calculate USD value for this token
						const balance = parseFloat(token.balance || '0')
						portfolioValue += balance * (tokenData.tokenPrice || 0)
					} else {
						// Fallback to network rate for native tokens
						if (token.type === 'native') {
							prices[token.symbol] = currentNetwork.rate
							const balance = parseFloat(token.balance || '0')
							portfolioValue += balance * currentNetwork.rate
						} else {
							prices[token.symbol] = 0
						}
					}
				} catch (error) {
					console.error(`Failed to fetch price for ${token.symbol}:`, error)
					prices[token.symbol] = token.type === 'native' ? currentNetwork.rate : 0
				}
			}
			
			setTokenPrices(prices)
			setTotalPortfolioValue(portfolioValue)
			setIsLoadingPrices(false)
		}
		
		fetchPrices()
	}, [tokens, currentNetwork])

	// Refresh balances when network changes
	useEffect(() => {
		if (!chainLoading) {
			updateCurrentChain(currentNetwork.id)
		}
	}, [currentNetwork.id, chainLoading])

	// Get token icon based on token type and symbol
	const getTokenIcon = (tokenType: string, tokenSymbol: string) => {
		const upperSymbol = tokenSymbol.toUpperCase()
		
		// Native tokens
		if (tokenType === 'native') {
			switch (upperSymbol) {
				case 'ETH': return <EclipseIcon className="h-6 w-6" />
				case 'MATIC': return <Landmark className="h-6 w-6" />
				case 'BNB': return <Globe className="h-6 w-6" />
				default: return <Coins className="h-6 w-6" />
			}
		}
		
		// Stablecoins
		if (['USDT', 'USDC', 'DAI', 'BUSD'].includes(upperSymbol)) {
			return <DollarSign className="h-6 w-6" />
		}
		
		// Other tokens
		return <Coins className="h-6 w-6" />
	}

	// Get token color based on token symbol
	const getTokenColor = (tokenSymbol: string) => {
		switch (tokenSymbol.toUpperCase()) {
			case 'ETH': return 'blue'
			case 'MATIC': return 'purple'
			case 'BNB': return 'yellow'
			case 'USDT': return 'green'
			case 'USDC': return 'blue'
			case 'DAI': return 'orange'
			case 'BUSD': return 'yellow'
			case 'CAKE': return 'orange'
			default: return 'gray'
		}
	}

	// Format balance for display
	const formatBalance = (balance: string | undefined): string => {
		if (!balance) return '0.00'
		const num = parseFloat(balance)
		if (num === 0) return '0.00'
		if (num < 0.0001) return '<0.0001'
		if (num < 1) return num.toFixed(4)
		if (num < 1000) return num.toFixed(2)
		return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
	}

	// Calculate USD value
	const calculateUSDValue = (balance: string | undefined, tokenSymbol: string): number => {
		if (!balance) return 0
		const price = tokenPrices[tokenSymbol] || 0
		return parseFloat(balance) * price
	}

	const quickActions = [
		{ icon: <Send className="h-5 w-5" />, label: "Send", href: `/wallet/send?token=${tokens.find(t => t.type === 'native')?.symbol || ''}`, color: "bg-blue-500 hover:bg-blue-600" },
		{ icon: <ArrowDownUp className="h-5 w-5" />, label: "Swap", href: "/wallet/swap", color: "bg-green-500 hover:bg-green-600" },
		{ icon: <CreditCard className="h-5 w-5" />, label: "Buy", href: "/wallet/buy", color: "bg-purple-500 hover:bg-purple-600" },
		{ icon: <History className="h-5 w-5" />, label: "History", href: "/wallet/history", color: "bg-orange-500 hover:bg-orange-600" },
	]

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
			</div>

			<main className="relative flex min-h-screen flex-col p-4 md:p-6">
				<div className="w-full max-w-md mx-auto space-y-6">
					{/* Header */}
					<div className="animate-fadeIn">
						<WalletHeader currentNetwork={currentNetwork} networks={networks} onNetworkChange={handleNetworkChange} />
					</div>

					{/* Main Balance Card - Show total portfolio value */}
					<div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
						<Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center space-x-2">
										<Wallet className="h-5 w-5" />
										<span className="text-sm opacity-90">Total Portfolio Value</span>
									</div>
									{isLoadingPrices && <Loader2 className="h-4 w-4 animate-spin" />}
								</div>
								<div className="text-3xl font-bold">
									${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</div>
								<div className="text-sm opacity-80 mt-1">
									On {currentNetwork.name}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Quick Actions */}
					<div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
						<Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
							<CardContent className="p-6">
								<h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h3>
								<div className="grid grid-cols-4 gap-3">
									{quickActions.map((action, index) => (
										<Link key={action.label} href={action.href}>
											<Button
												variant="ghost"
												className="h-16 flex-col space-y-2 hover:scale-105 transition-all duration-200 hover:shadow-md"
												style={{ animationDelay: `${0.3 + index * 0.05}s` }}
											>
												<div className={`p-2 rounded-lg text-white ${action.color} transition-colors duration-200`}>
													{action.icon}
												</div>
												<span className="text-xs text-gray-700 dark:text-gray-300">{action.label}</span>
											</Button>
										</Link>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Portfolio Section */}
					<div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Assets on {currentNetwork.name}</h3>
							{tokens.length > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => updateCurrentChain(currentNetwork.id)}
									className="text-sm"
								>
									<Loader2 className={`h-4 w-4 mr-1 ${chainLoading ? 'animate-spin' : ''}`} />
									Refresh
								</Button>
							)}
						</div>
						
						<div className="space-y-3">
							{chainLoading ? (
								<Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
									<CardContent className="p-8 text-center">
										<Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-gray-500" />
										<p className="text-gray-600 dark:text-gray-400">Loading tokens...</p>
									</CardContent>
								</Card>
							) : tokens.length > 0 ? (
								tokens.map((token, index) => {
									const tokenColor = getTokenColor(token.symbol)
									const tokenIcon = getTokenIcon(token.type, token.symbol)
									const balance = formatBalance(token.balance)
									const usdValue = calculateUSDValue(token.balance, token.symbol)
									const price = tokenPrices[token.symbol] || 0
									
									return (
										<Link 
											key={`${token.symbol}-${currentNetwork.id}`} 
											href={`/wallet?token=${token.symbol}`} 
											className="block"
										>
											<Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
												style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
												<CardContent className="p-4">
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-3">
															<div className={`flex h-10 w-10 items-center justify-center rounded-full bg-${tokenColor}-100 dark:bg-${tokenColor}-900/50`}>
																<div className={`text-${tokenColor}-600 dark:text-${tokenColor}-400`}>
																	{tokenIcon}
																</div>
															</div>
															<div>
																<h4 className="font-medium text-gray-900 dark:text-gray-100">{token.name}</h4>
																<p className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</p>
																<p className="text-xs text-gray-400 dark:text-gray-500">
																	{token.type === 'native' ? 'Native Token' : 
																	 token.type === 'erc20' ? 'ERC-20 Token' : 
																	 token.type}
																</p>
															</div>
														</div>
														<div className="text-right">
															<p className="font-semibold text-gray-900 dark:text-gray-100">
																{balance} {token.symbol}
															</p>
															<p className="text-sm text-gray-500 dark:text-gray-400">
																${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
															</p>
															{price > 0 && (
																<p className="text-xs text-gray-400 dark:text-gray-500">
																	@ ${price.toFixed(price < 1 ? 4 : 2)}
																</p>
															)}
														</div>
													</div>
												</CardContent>
											</Card>
										</Link>
									)
								})
							) : (
								<Card className="border-0 shadow-sm bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
									<CardContent className="p-8 text-center">
										<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
											<Coins className="h-8 w-8 text-gray-400" />
										</div>
										<p className="text-gray-600 dark:text-gray-400 mb-2">No tokens available on {currentNetwork.name}</p>
										<p className="text-sm text-gray-500 dark:text-gray-500">Switch to a different network to see available tokens</p>
									</CardContent>
								</Card>
							)}
						</div>
					</div>

					{/* Network Info Card */}
					<div className="animate-slideUp" style={{ animationDelay: '0.6s' }}>
						<Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										{currentNetwork.icon}
										<div>
											<p className="text-sm font-medium text-gray-900 dark:text-gray-100">Current Network</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">{currentNetwork.name}</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
											{tokens.length} Tokens
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Available
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</div>
	)
}