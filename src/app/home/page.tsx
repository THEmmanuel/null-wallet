"use client"

import { useState } from "react"
import { EthereumBalanceCard } from '../../components/ui/ethereum-balance-card'
import { WalletHeader } from "../../components/ui/wallet-header"
import { WalletBalance } from "../../components/ui/wallet-balance"
import { EclipseIcon, Globe, Landmark } from "lucide-react"
import { FloatingDockDemo } from "@/components/ui/floating-dock-demo"
import Link from "next/link"


// Network definitions with icons
const networks = [
	{ id: "nullnet", name: "NullNet", icon: <EclipseIcon className="h-4 w-4 text-blue-600" /> },
	{ id: "ethereum", name: "Ethereum", icon: <EclipseIcon className="h-4 w-4 text-blue-600" /> },
	{ id: "polygon", name: "Polygon", icon: <Landmark className="h-4 w-4 text-purple-600" /> },
	{ id: "bsc", name: "BSC", icon: <Globe className="h-4 w-4 text-yellow-600" /> },
]

export default function Home() {
	const [currentNetwork, setCurrentNetwork] = useState(networks[0])

	const handleNetworkChange = (networkId: string) => {
		const network = networks.find((n) => n.id === networkId)
		if (network) {
			setCurrentNetwork(network)
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
			<div className="w-full max-w-md">
				<WalletHeader currentNetwork={currentNetwork} networks={networks} onNetworkChange={handleNetworkChange} />
				<WalletBalance totalBalance={3250} />
				<div className="space-y-4"> {/* Adds 5px (1.5rem) vertical spacing */}
					<Link href="/wallet">
						<EthereumBalanceCard balance={1.2} usdValue={2764} />
					</Link>

					<Link href="/wallet">
						<EthereumBalanceCard balance={1.2} usdValue={2764} />
					</Link>

					<Link href="/wallet">
						<EthereumBalanceCard balance={1.2} usdValue={2764} />
					</Link>
				</div>
			</div>

			<FloatingDockDemo />
		</main>
	)
}
