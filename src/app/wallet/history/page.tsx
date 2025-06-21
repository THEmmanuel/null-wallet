"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"

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

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const walletAddress = sessionStorage.getItem("userWalletAddress")
        if (!walletAddress) {
          setError("Wallet address not found")
          setLoading(false)
          return
        }

        const response = await fetch(`/api/transactions?address=${walletAddress}`)
        const data = await response.json()
        
        if (data.status === "1") {
          setTransactions(data.result)
        } else {
          setError("Failed to fetch transactions")
        }
      } catch (err) {
        setError("Error fetching transactions")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

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
                  {transactions.map((tx) => (
                    <tr key={tx.hash} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatDistanceToNow(new Date(parseInt(tx.timeStamp) * 1000), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {tx.from.toLowerCase() === sessionStorage.getItem("userWalletAddress")?.toLowerCase() ? "Sent" : "Received"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatValue(tx.value)} ETH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatGasPrice(tx.gasPrice)} Gwei
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.isError === "1" 
                            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" 
                            : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        }`}>
                          {tx.isError === "1" ? "Failed" : "Success"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 