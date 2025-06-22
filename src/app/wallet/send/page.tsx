"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { ArrowLeft, ArrowRightLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TransactionModal } from "@/components/ui/transaction-modal"
import { useChain } from "@/contexts/ChainContext"
import { getWalletForChain } from "@/utils/wallet-helpers";
import { useRouter } from "next/navigation";

// Hardcoded testnet values
const SENDER_WALLET = "0xD22507B380D33a6CD115cAe487ce4FDb19543Ac2"
const SENDER_PRIVATE_KEY = "0xa237bd10fc960e1dec4a11964896008815a77335c659985b1ab59ac47bad3979"

// Helper function to validate Ethereum address
const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export default function SendPage() {
  const { currentNetwork } = useChain()
  const router = useRouter();
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [usdAmount, setUsdAmount] = useState("")
  const [activeInput, setActiveInput] = useState<"crypto" | "fiat">("crypto")
  const [gasPrice, setGasPrice] = useState(25) // Gwei
  const [gasLimit] = useState(21000) // Standard ETH transfer
  const [isAddressValid, setIsAddressValid] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"sending" | "pending" | "sent" | "error">("sending")
  const [transactionData, setTransactionData] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(30)
  const [isSending, setIsSending] = useState(false);
  const [selectedToken, setSelectedToken] = useState(currentNetwork.symbol.toLowerCase());

  const fetchGasFees = async () => {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_KEY}`
      );
      const data = await response.json();
      
      if (data.status === "1") {
        // Update gas price to the standard (proposed) gas price
        setGasPrice(parseInt(data.result.ProposeGasPrice));
      }
    } catch (error) {
      console.error("Error fetching gas fees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGasFees();
    const interval = setInterval(fetchGasFees, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate gas fee in ETH
  const gasFeeEth = (gasPrice * gasLimit) / 1e9
  const gasFeeUsd = gasFeeEth * currentNetwork.rate

  // Calculate total amount
  const cryptoAmount =
    activeInput === "crypto" ? Number.parseFloat(amount) || 0 : Number.parseFloat(usdAmount) / currentNetwork.rate || 0
  const totalCryptoAmount = cryptoAmount + gasFeeEth
  const totalUsdAmount = totalCryptoAmount * currentNetwork.rate

  // Update the other input when one changes
  useEffect(() => {
    if (activeInput === "crypto" && amount) {
      const amountNum = Number.parseFloat(amount)
      if (!isNaN(amountNum)) {
        setUsdAmount((amountNum * currentNetwork.rate).toFixed(2))
      }
    } else if (activeInput === "fiat" && usdAmount) {
      const usdAmountNum = Number.parseFloat(usdAmount)
      if (!isNaN(usdAmountNum)) {
        setAmount((usdAmountNum / currentNetwork.rate).toFixed(6))
      }
    }
  }, [amount, usdAmount, activeInput, currentNetwork.rate])

  // Validate address when it changes
  useEffect(() => {
    if (recipientAddress) {
      setIsAddressValid(isValidEthereumAddress(recipientAddress))
    } else {
      setIsAddressValid(true) // Don't show error when empty
    }
  }, [recipientAddress])

  const handleCryptoAmountChange = (value: string) => {
    setActiveInput("crypto")
    setAmount(value)
  }

  const handleUsdAmountChange = (value: string) => {
    setActiveInput("fiat")
    setUsdAmount(value)
  }

  const handleSwapInputs = () => {
    setActiveInput(activeInput === "crypto" ? "fiat" : "crypto")
  }

  const handleSend = async () => {
    setIsSending(true);
    setError("");

    try {
      // Get the appropriate wallet for the current chain
      const wallet = getWalletForChain(currentNetwork.id);
      if (!wallet) {
        throw new Error("No wallet found for the current network");
      }

      // Prepare the request body
      const requestBody = {
        amount: amount,
        receiverWalletAddress: recipientAddress,
        tokenToSend: selectedToken,
        senderWalletAddress: wallet.walletAddress,
        senderPrivateKey: wallet.walletKey,
        chainId: currentNetwork.id
      };

      console.log("Sending transaction with params:", {
        ...requestBody,
        senderPrivateKey: "***hidden***"
      });

      const response = await fetch('http://localhost:4444/wallet/send-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("Transaction successful:", result);
        // Redirect to success page with transaction details
        const params = new URLSearchParams({
          txHash: result.data.hash,
          amount: amount,
          token: selectedToken,
          to: recipientAddress,
          chain: currentNetwork.name
        });
        router.push(`/wallet/success?${params.toString()}`);
      } else {
        throw new Error(result.error || result.details || 'Transaction failed');
      }
    } catch (error) {
      console.error("Transaction error:", error);
      setError(error instanceof Error ? error.message : "Failed to send transaction");
    } finally {
      setIsSending(false);
    }
  };

  const isFormValid = isAddressValid && recipientAddress && (amount || usdAmount)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <main className="relative flex min-h-screen flex-col p-4 md:p-6">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Back Button */}
          <div className="animate-fadeIn">
            <Link href="/wallet">
              <Button 
                variant="ghost" 
                className="pl-0 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Wallet
              </Button>
            </Link>
          </div>

          {/* Send Card */}
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Send {currentNetwork.symbol}
              </CardTitle>
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                {currentNetwork.icon}
                <span className="font-medium">{currentNetwork.name}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Recipient Address */}
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-gray-700 dark:text-gray-300 font-medium">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className={`bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${!isAddressValid ? "border-red-500 focus:ring-red-500" : ""}`}
                />
                {!isAddressValid && <p className="text-xs text-red-500">Please enter a valid Ethereum address</p>}
              </div>

              {/* Amount Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300 font-medium">Amount</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSwapInputs} 
                    className="h-8 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-1" />
                    Swap
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`0 ${currentNetwork.symbol}`}
                      value={amount}
                      onChange={(e) => handleCryptoAmountChange(e.target.value)}
                      className="text-right bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{currentNetwork.symbol}</p>
                  </div>
                  <div>
                    <Input
                      id="usdAmount"
                      type="number"
                      placeholder="0 USD"
                      value={usdAmount}
                      onChange={(e) => handleUsdAmountChange(e.target.value)}
                      className="text-right bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">USD</p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Transaction Details</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Network</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{currentNetwork.name}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Gas Price</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{gasPrice} Gwei</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Gas Limit</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{gasLimit}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-gray-700 dark:text-gray-300">Gas Fee</Label>
                      <span className="text-xs text-gray-500">
                        Refreshes in {countdown}s
                      </span>
                    </div>
                    {loading ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Gas Fee</span>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                          <span className="text-gray-500">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Gas Fee</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {gasFeeEth.toFixed(6)} {currentNetwork.symbol} (${gasFeeUsd.toFixed(2)})
                          <span className="ml-2 text-xs text-gray-500">
                            {gasPrice.toFixed(2)} Gwei
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between font-medium pt-3 border-t border-gray-200 dark:border-gray-700 text-lg">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-gray-100">
                        {totalCryptoAmount.toFixed(6)} {currentNetwork.symbol}
                      </div>
                      <div className="text-sm text-gray-500">${totalUsdAmount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]" 
                disabled={!isFormValid} 
                onClick={handleSend}
              >
                Send Transaction
              </Button>
            </CardFooter>
          </Card>
        </div>

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          status={transactionStatus}
          transactionData={transactionData}
          error={error}
        />
      </main>
    </div>
  )
}
