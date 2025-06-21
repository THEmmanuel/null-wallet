"use client";

import { useEffect, useState } from "react"
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ETHWalletPage() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [balance, setBalance] = useState<string>("0.00")

  useEffect(() => {
    // Get wallet address from session storage
    const address = sessionStorage.getItem("userWalletAddress")
    if (address) {
      setWalletAddress(address)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">ETH Wallet</h1>
        
        <div className="mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Wallet Address</div>
          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded break-all">
            {walletAddress || "Loading..."}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Balance</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {balance} ETH
          </div>
        </div>

        <Link 
          href="/wallet/send"
          className="flex items-center justify-between w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          <span>Send Token</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
} 