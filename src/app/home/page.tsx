"use client"

import { useState } from "react"
import { EthereumBalanceCard } from '../../components/ui/ethereum-balance-card'
import { WalletHeader } from "../../components/ui/wallet-header"
import { WalletBalance } from "../../components/ui/wallet-balance"
import { EclipseIcon, Globe, Landmark, Send, ArrowDownUp, CreditCard, History, Plus, TrendingUp } from "lucide-react"
import { FloatingDockDemo } from "@/components/ui/floating-dock-demo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useChain } from "@/contexts/ChainContext"

export default function Home() {
	const { currentNetwork, networks, tokens, switchNetwork } = useChain()

	const handleNetworkChange = (networkId: string) => {
		switchNetwork(networkId)
	}

	// Get token icon based on token type
	const getTokenIcon = (tokenType: string, tokenSymbol: string) => {
		switch (tokenType) {
			case 'native':
				if (tokenSymbol === 'ETH') return <EclipseIcon className="h-6 w-6" />
				if (tokenSymbol === 'MATIC') return <Landmark className="h-6 w-6" />
				if (tokenSymbol === 'BNB') return <Globe className="h-6 w-6" />
				return <EclipseIcon className="h-6 w-6" />
			case 'erc20':
				return <EclipseIcon className="h-6 w-6" />
			case 'nullnet':
				return <EclipseIcon className="h-6 w-6" />
			default:
				return <EclipseIcon className="h-6 w-6" />
		}
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
			case 'GOLD': return 'yellow'
			case 'SILVER': return 'gray'
			case 'PLATINUM': return 'gray'
			case 'DIAMOND': return 'blue'
			default: return 'gray'
		}
	}

	const quickActions = [
		{ icon: <Send className="h-5 w-5" />, label: "Send", href: "/wallet/send", color: "bg-blue-500 hover:bg-blue-600" },
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

					{/* Main Balance Card */}
					<div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
						<WalletBalance totalBalance={4694} />
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
							<div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
								<TrendingUp className="h-4 w-4" />
								<span>+2.34%</span>
							</div>
						</div>
						
						<div className="space-y-3">
							{tokens.length > 0 ? (
								tokens.map((token, index) => {
									const tokenColor = getTokenColor(token.symbol)
									const tokenIcon = getTokenIcon(token.type, token.symbol)
									
									return (
										<Link key={token.symbol} href="/wallet" className="block">
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
																<p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{token.type}</p>
															</div>
														</div>
														<div className="text-right">
															<p className="font-semibold text-gray-900 dark:text-gray-100">
																0.00 {token.symbol}
															</p>
															<p className="text-sm text-gray-500 dark:text-gray-400">
																$0.00
															</p>
															{token.contractAddress && (
																<p className="text-xs text-gray-400 dark:text-gray-500">
																	{token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}
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
								<div className="text-center py-8 text-gray-600 dark:text-gray-400">
									<p className="mb-2">No tokens available on {currentNetwork.name}</p>
									<p className="text-sm">Switch to a different network to see available tokens</p>
								</div>
							)}
						</div>
					</div>

					{/* Add New Asset Button */}
					<div className="animate-slideUp" style={{ animationDelay: '0.7s' }}>
						<Link href="/wallet/options">
							<Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-transparent hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer">
								<CardContent className="p-6 text-center">
									<div className="flex flex-col items-center space-y-2">
										<div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
											<Plus className="h-6 w-6 text-gray-600 dark:text-gray-400" />
										</div>
										<div>
											<p className="font-medium text-gray-700 dark:text-gray-300">Add New Asset</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">Explore more cryptocurrencies</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</Link>
					</div>
				</div>
			</main>
		</div>
	)
}