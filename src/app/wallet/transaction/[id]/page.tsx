"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ExternalLink, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample transaction data (in a real app, this would come from an API or blockchain)
const transactions = [
  {
    id: "tx1",
    hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    type: "send",
    symbol: "ETH",
    amount: 0.5,
    usdAmount: 1151.73,
    from: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    to: "0x1a2b3c4d5e6f7g8h9i0j",
    timestamp: new Date(2023, 4, 15, 14, 30),
    status: "Confirmed",
    gasUsed: 0.002,
    gasPrice: 25,
    blockNumber: 17542032,
    network: "Ethereum",
  },
  {
    id: "tx2",
    hash: "0xabcdef1234567890abcdef1234567890abcdef12",
    type: "receive",
    symbol: "ETH",
    amount: 1.2,
    usdAmount: 2764.14,
    from: "0xabcdef1234567890abcdef",
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    timestamp: new Date(2023, 4, 14, 9, 45),
    status: "Confirmed",
    gasUsed: 0.0015,
    gasPrice: 20,
    blockNumber: 17541892,
    network: "Ethereum",
  },
  {
    id: "tx3",
    hash: "0x9876543210fedcba9876543210fedcba98765432",
    type: "send",
    symbol: "ETH",
    amount: 0.25,
    usdAmount: 575.86,
    from: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    to: "0x9876543210fedcba9876543",
    timestamp: new Date(2023, 4, 12, 18, 20),
    status: "Confirmed",
    gasUsed: 0.0018,
    gasPrice: 22,
    blockNumber: 17540123,
    network: "Ethereum",
  },
]

// Helper function to format date
const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

// Helper function to format time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

// Helper function to shorten hash/address
const shortenHash = (hash: string) => {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export default function TransactionPage() {
  const params = useParams()
  interface Transaction {
    id: string
    hash: string
    type: string
    symbol: string
    amount: number
    usdAmount: number
    from: string
    to: string
    timestamp: Date
    status: string
    gasUsed: number
    gasPrice: number
    blockNumber: number
    network: string
  }

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  // Removed unused 'copied' state

  useEffect(() => {
    // Find the transaction by ID
    const tx = transactions.find((t) => t.id === params.id)
    if (tx) {
      setTransaction(tx)
    }
  }, [params.id])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Removed unused 'copied' logic
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  if (!transaction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Transaction not found</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/wallet">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Wallet
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              Transaction Details
              <div
                className={`ml-2 flex items-center ${
                  transaction.status === "Confirmed" ? "text-green-500" : "text-yellow-500"
                }`}
              >
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{transaction.status}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Transaction Hash</p>
                <div className="flex items-center">
                  <p className="font-mono text-sm mr-2">{shortenHash(transaction.hash)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.hash)}
                    className="h-6 w-6"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Network</p>
                  <p className="font-medium">{transaction.network}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Block</p>
                  <p className="font-medium">{transaction.blockNumber}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {formatDate(transaction.timestamp)} at {formatTime(transaction.timestamp)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">From</p>
                <div className="flex items-center">
                  <p className="font-mono text-sm mr-2">{shortenHash(transaction.from)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.from)}
                    className="h-6 w-6"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">To</p>
                <div className="flex items-center">
                  <p className="font-mono text-sm mr-2">{shortenHash(transaction.to)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(transaction.to)}
                    className="h-6 w-6"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">
                    {transaction.amount} {transaction.symbol}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="font-medium">${transaction.usdAmount.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Gas Fee</p>
                  <p className="font-medium">
                    {transaction.gasUsed} {transaction.symbol}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Gas Price</p>
                  <p className="font-medium">{transaction.gasPrice} Gwei</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
