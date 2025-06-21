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

// Network and rate information
const currentNetwork = {
  name: "Ethereum",
  symbol: "ETH",
  rate: 2303.45,
}

// Hardcoded testnet values
const SENDER_WALLET = "0xD22507B380D33a6CD115cAe487ce4FDb19543Ac2"
const SENDER_PRIVATE_KEY = "0xa237bd10fc960e1dec4a11964896008815a77335c659985b1ab59ac47bad3979"

// Helper function to validate Ethereum address
const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export default function SendPage() {
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
    setIsModalOpen(true)
    setTransactionStatus("sending")
    setError("")

    try {
      const response = await axios.post("http://localhost:4444/wallet/send-token", {
        amount: amount,
        receiverWalletAddress: recipientAddress,
        tokenToSend: "eth",
        senderWalletAddress: SENDER_WALLET,
        senderPrivateKey: SENDER_PRIVATE_KEY,
      })

      if (response.data.success) {
        setTransactionStatus("sent")
        setTransactionData({
          from: response.data.data.from,
          to: response.data.data.to,
          value: amount,
          gasPrice: gasPrice.toString(),
          hash: response.data.data.hash,
          timestamp: new Date().toISOString(),
        })

        // Save to session storage for history
        const history = JSON.parse(sessionStorage.getItem("transactionHistory") || "[]")
        history.push({
          type: "send",
          token: "eth",
          amount: amount,
          recipient: recipientAddress,
          timestamp: new Date().toISOString(),
          status: "completed",
          hash: response.data.data.hash,
        })
        sessionStorage.setItem("transactionHistory", JSON.stringify(history))
      } else {
        setTransactionStatus("error")
        setError(response.data.error?.message || "Transaction failed")
      }
    } catch (err: any) {
      setTransactionStatus("error")
      setError(err.response?.data?.error?.message || "Failed to send transaction")
    }
  }

  const isFormValid = isAddressValid && recipientAddress && (amount || usdAmount)

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

        <Card>
          <CardHeader>
            <CardTitle>Send {currentNetwork.symbol}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className={!isAddressValid ? "border-red-500" : ""}
              />
              {!isAddressValid && <p className="text-xs text-red-500">Please enter a valid Ethereum address</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount</Label>
                <Button variant="ghost" size="sm" onClick={handleSwapInputs} className="h-8 px-2">
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
                    className="text-right"
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
                    className="text-right"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">USD</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Transaction Details</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Network</span>
                  <span>{currentNetwork.name}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gas Price</span>
                  <span>{gasPrice} Gwei</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gas Limit</span>
                  <span>{gasLimit}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Gas Fee</Label>
                    <span className="text-xs text-gray-500">
                      Refreshes in {countdown}s
                    </span>
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Gas Fee</span>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-gray-500">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Gas Fee</span>
                      <span>
                        {gasFeeEth.toFixed(6)} {currentNetwork.symbol} (${gasFeeUsd.toFixed(2)})
                        <span className="ml-2 text-xs text-gray-500">
                          {gasPrice.toFixed(2)} Gwei
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between font-medium pt-2 border-t mt-2">
                  <span>Total</span>
                  <div className="text-right">
                    <div>
                      {totalCryptoAmount.toFixed(6)} {currentNetwork.symbol}
                    </div>
                    <div className="text-sm text-gray-500">${totalUsdAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={!isFormValid} onClick={handleSend}>
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
  )
}
