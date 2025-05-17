"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Network and rate information
const currentNetwork = {
  name: "Ethereum",
  symbol: "ETH",
  rate: 2303.45,
}

// Helper function to validate Ethereum address
const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export default function SendPage() {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [usdAmount, setUsdAmount] = useState("")
  const [activeInput, setActiveInput] = useState<"crypto" | "fiat">("crypto")
  const [gasPrice] = useState(25) // Gwei
  const [gasLimit] = useState(21000) // Standard ETH transfer
  const [isAddressValid, setIsAddressValid] = useState(true)

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

  const handleSend = () => {
    // In a real app, this would connect to a wallet provider to send the transaction
    alert(`Transaction initiated: Sending ${cryptoAmount} ${currentNetwork.symbol} to ${recipientAddress}`)
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

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gas Fee</span>
                  <span>
                    {gasFeeEth.toFixed(6)} {currentNetwork.symbol} (${gasFeeUsd.toFixed(2)})
                  </span>
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
    </main>
  )
}
