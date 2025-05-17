"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WalletAddressProps {
	address: string
}

export function WalletAddress({ address }: WalletAddressProps) {
	const [copied, setCopied] = useState(false)

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(address)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("Failed to copy: ", err)
		}
	}

	// Format address to show first 10 and last 8 characters
	const formattedAddress = `${address.substring(0, 10)}...${address.substring(address.length - 8)}`

	return (
		<Card className="mb-6 bg-gray-50 dark:bg-gray-900">
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-500 mb-1">Wallet Address</p>
						<p className="font-mono text-sm">{formattedAddress}</p>
					</div>
					<Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
						{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
