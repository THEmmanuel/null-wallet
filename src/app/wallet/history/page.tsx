"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Send, ArrowDownLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useChain } from "@/contexts/ChainContext"
import { getWalletAddressForChain } from "@/utils/wallet-helpers"

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

export default function HistoryPage() {
  const router = useRouter()
  const { currentNetwork } = useChain()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTransactions = async () => {
      const walletAddress = getWalletAddressForChain(currentNetwork.id)
      if (!walletAddress) {
        setError("No wallet found for current network")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/transactions?address=${walletAddress}&chain=${currentNetwork.id}`)
        const data = await response.json()
        
        if (data.success) {
          setTransactions(data.transactions || [])
        } else {
          setError(data.error || "Failed to fetch transactions")
        }
      } catch (err) {
        setError("Failed to load transactions")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [currentNetwork.id])

  const formatValue = (value: string) => {
    return (parseInt(value) / 1e18).toFixed(6)
  }

  const formatGasPrice = (gasPrice: string) => {
    return (parseInt(gasPrice) / 1e9).toFixed(2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Transaction History</h1>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No transactions found
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gas Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hash</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((tx) => {
                    const walletAddress = getWalletAddressForChain(currentNetwork.id)
                    const isSent = tx.from.toLowerCase() === walletAddress?.toLowerCase()
                    return (
                      <Card
                        key={tx.hash}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatDistanceToNow(new Date(parseInt(tx.timeStamp) * 1000), { addSuffix: true })}
                          </CardTitle>
                          <CardContent className="text-sm text-gray-500 dark:text-gray-400">
                            {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                          </CardContent>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {isSent ? "Sent" : "Received"}
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {formatValue(tx.value)} ETH
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {formatGasPrice(tx.gasPrice)} Gwei
                          </p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {tx.isError === "1" ? "Failed" : "Success"}
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 