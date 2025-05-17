"use client"

import { useState } from "react"
import Link from "next/link"
import { EclipseIcon, Globe, Landmark, ArrowUpRight, ArrowDownLeft, Send, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WalletAddress } from '../../components/ui/wallet-address';

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

export default function WalletPage() {
	const [currentNetwork, setCurrentNetwork] = useState(networks[0])
	const [balance] = useState(1.7) // ETH balance
	const walletAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // Example wallet address

	const handleNetworkChange = (networkId: string) => {
		const network = networks.find((n) => n.id === networkId)
		if (network) {
			setCurrentNetwork(network)
		}
	}

	// Calculate USD value based on current network rate
	const usdBalance = balance * currentNetwork.rate

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
								{balance} {currentNetwork.symbol}
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

							<div className="flex flex-col items-center">
								<Button variant="ghost" size="icon" className="h-12 w-12 rounded-full mb-2">
									<ArrowDownLeft className="h-5 w-5" />
								</Button>
								<span className="text-sm">Receive</span>
							</div>

							<div className="flex flex-col items-center">
								<Button variant="ghost" size="icon" className="h-12 w-12 rounded-full mb-2">
									<ShoppingCart className="h-5 w-5" />
								</Button>
								<span className="text-sm">Buy/Sell</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Wallet Address */}
				<WalletAddress address={walletAddress} />

				{/* Transaction History */}
				<h2 className="text-xl font-bold mb-4">Transaction History</h2>

				{transactions.map((tx) => (
					<Link href={`/wallet/transaction/${tx.id}`} key={tx.id}>
						<Card
							className={`mb-4 ${tx.type === "send" ? "bg-red-50/70 dark:bg-red-950/20" : "bg-green-50/70 dark:bg-green-950/20"
								} hover:shadow-md transition-shadow`}
						>
							<CardContent className="p-4">
								<div className="flex items-center">
									<div className="mr-4">
										<div
											className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === "send" ? "bg-red-100" : "bg-green-100"
												}`}
										>
											{tx.type === "send" ? (
												<ArrowUpRight className="h-5 w-5 text-red-600" />
											) : (
												<ArrowDownLeft className="h-5 w-5 text-green-600" />
											)}
										</div>
									</div>

									<div className="flex-1">
										<div className="flex justify-between items-start">
											<div>
												<p className="font-medium">
													{tx.type === "send" ? "Sent" : "Received"} {tx.symbol}
												</p>
												<p className="text-sm text-gray-500">
													{tx.type === "send" ? "To: " : "From: "}
													{shortenAddress(tx.address)}
												</p>
											</div>

											<div className="text-right">
												<p className={`font-medium ${tx.type === "send" ? "text-red-600" : "text-green-600"}`}>
													{tx.type === "send" ? "-" : "+"}
													{tx.amount} {tx.symbol}
												</p>
												<p className="text-sm text-gray-500">${tx.usdAmount.toLocaleString()}</p>
											</div>
										</div>

										<div className="flex justify-between mt-2">
											<p className="text-xs text-gray-500">{formatDate(tx.timestamp)}</p>
											<p className="text-xs text-gray-500">{formatTime(tx.timestamp)}</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</main>
	)
}
