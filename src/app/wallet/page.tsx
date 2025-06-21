"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { EclipseIcon, Globe, Landmark, ArrowUpRight, ArrowDownLeft, Send, ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WalletAddress } from '../../components/ui/wallet-address';
import { formatDistanceToNow } from "date-fns"

// Network definitions with icons
const networks = [
	{
		id: "nullnet",
		name: "NullNet",
		icon: <Landmark className="h-4 w-4 text-purple-600" />,
		symbol: "NULLX",
		rate: 0.58,
	},
	{
		id: "ethereum",
		name: "Ethereum",
		icon: <EclipseIcon className="h-4 w-4 text-blue-600" />,
		symbol: "ETH",
		rate: 2303.45,
	},
	{
		id: "polygon",
		name: "Polygon",
		icon: <Landmark className="h-4 w-4 text-purple-600" />,
		symbol: "MATIC",
		rate: 0.58,
	},
	{ id: "bsc", name: "BSC", icon: <Globe className="h-4 w-4 text-yellow-600" />, symbol: "BNB", rate: 234.12 },
]

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
}

export default function WalletPage() {
	const [currentNetwork, setCurrentNetwork] = useState(networks[0])
	const [balance, setBalance] = useState<string>("0.00")
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [transactions, setTransactions] = useState<Transaction[]>([])
	const [txLoading, setTxLoading] = useState(true)
	const [txError, setTxError] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const transactionsPerPage = 5
	const walletAddress = sessionStorage.getItem("userWalletAddress") || "N/A"

	const handleNetworkChange = (networkId: string) => {
		const network = networks.find((n) => n.id === networkId)
		if (network) {
			setCurrentNetwork(network)
		}
	}

	// Calculate USD value based on current network rate
	const usdBalance = parseFloat(balance) * currentNetwork.rate

	useEffect(() => {
		const fetchBalance = async () => {
			try {
				const response = await fetch(`/api/balance?address=${walletAddress}`)
				const data = await response.json()
				
				if (data.status === "1") {
					// Convert wei to ETH (1 ETH = 10^18 wei)
					const balanceInEth = (parseInt(data.result) / 1e18).toFixed(6)
					setBalance(balanceInEth)
				} else {
					setError("Failed to fetch balance")
				}
			} catch (err) {
				setError("Error fetching balance")
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchBalance()
	}, [walletAddress])

	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				setTxLoading(true)
				const response = await fetch(`/api/transactions?address=${walletAddress}&page=${currentPage}&offset=${transactionsPerPage}`)
				const data = await response.json()
				
				if (data.status === "1") {
					setTransactions(data.result)
					// Calculate total pages based on total transactions (assuming 100 is the max from API)
					setTotalPages(Math.ceil(Math.min(100, data.result.length) / transactionsPerPage))
				} else {
					setTxError("Failed to fetch transactions")
				}
			} catch (err) {
				setTxError("Error fetching transactions")
				console.error(err)
			} finally {
				setTxLoading(false)
			}
		}

		fetchTransactions()
	}, [walletAddress, currentPage])

	const formatValue = (value: string) => {
		return (parseInt(value) / 1e18).toFixed(6)
	}

	const formatGasPrice = (gasPrice: string) => {
		return (parseInt(gasPrice) / 1e9).toFixed(2)
	}

	return (
		<main className="flex min-h-screen flex-col items-center p-4 md:p-8">
			<div className="w-full max-w-md">
				{/* Enhanced Header */}
				<Card className="mb-6 overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="flex items-center space-x-2">
										{currentNetwork.icon}
										<span>{currentNetwork.name}</span>
										<span className="text-xs opacity-70">▼</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{networks.map((network) => (
										<DropdownMenuItem
											key={network.id}
											onClick={() => handleNetworkChange(network.id)}
											className="flex items-center space-x-2"
										>
											{network.icon}
											<span>{network.name}</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>

							<div className="text-right">
								<p className="text-sm text-gray-500">
									1 {currentNetwork.symbol} = ${currentNetwork.rate.toLocaleString()}
								</p>
							</div>
						</div>

						<div className="text-center mb-6">
							<h1 className="text-3xl font-bold">
								{loading ? (
									<div className="flex items-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
										<p className="text-gray-600 dark:text-gray-400">Loading balance...</p>
									</div>
								) : error ? (
									<p className="text-red-600 dark:text-red-400">{error}</p>
								) : (
									<p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{balance} {currentNetwork.symbol}</p>
								)}
							</h1>
							<p className="text-gray-500">${usdBalance.toLocaleString()}</p>
						</div>

						{/* Action Buttons */}
						<div className="flex justify-center gap-12">
							<Link href="/wallet/send" className="flex flex-col items-center">
								<Button variant="ghost" size="icon" className="h-12 w-12 rounded-full mb-2">
									<Send className="h-5 w-5" />
								</Button>
								<span className="text-sm">Send</span>
							</Link>

							<Link href="/wallet/receive" className="flex flex-col items-center">
								<div className="flex flex-col items-center">
									<Button variant="ghost" size="icon" className="h-12 w-12 rounded-full mb-2">
										<ArrowDownLeft className="h-5 w-5" />
									</Button>
									<span className="text-sm">Receive</span>
								</div>
							</Link>

							<Link href="/wallet/options" className="flex flex-col items-center">
								<Button variant="ghost" size="icon" className="h-12 w-12 rounded-full mb-2">
									<ShoppingCart className="h-5 w-5" />
								</Button>
								<span className="text-sm">Buy/Sell</span>
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* Wallet Address */}
				<WalletAddress address={walletAddress} />

				{/* Transaction History */}
				<h2 className="text-xl font-bold mb-4">Transaction History</h2>

				{txLoading ? (
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					</div>
				) : txError ? (
					<div className="text-red-600 dark:text-red-400 text-center py-4">{txError}</div>
				) : transactions.length === 0 ? (
					<div className="text-center py-8 text-gray-600 dark:text-gray-400">
						No transactions found
					</div>
				) : (
					<>
						<div className="space-y-4">
							{transactions.map((tx) => (
								<div key={tx.hash} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
									<div className="flex-1">
										<div className="flex items-center space-x-2">
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
												href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
											>
												{tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
											</a>
										</div>
									</div>
									<div className="text-right">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{formatValue(tx.value)} ETH
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">
											Gas: {formatGasPrice(tx.gasPrice)} Gwei
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-between mt-6">
								<button
									onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
									disabled={currentPage === 1}
									className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<ChevronLeft className="w-4 h-4 mr-1" />
									Previous
								</button>
								<span className="text-sm text-gray-700 dark:text-gray-300">
									Page {currentPage} of {totalPages}
								</span>
								<button
									onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
									disabled={currentPage === totalPages}
									className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
									<ChevronRight className="w-4 h-4 ml-1" />
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</main>
	)
}