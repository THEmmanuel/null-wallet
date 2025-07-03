"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { ArrowLeft, ArrowRightLeft, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TransactionModal } from "@/components/ui/transaction-modal"
import { useChain } from "@/contexts/ChainContext"
import { getWalletForChain } from "@/utils/wallet-helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchTokenUSDBalance, TOKEN_CONFIGS } from '@/services/token-balance-api';

// Helper function to validate Ethereum address
const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

interface TokenInfo {
  symbol: string;
  name: string;
  balance: string;
  price: number;
  contractAddress?: string;
}

export default function SendPage() {
  const { currentNetwork, tokens, getTokensForChain } = useChain()
  const router = useRouter();
  const searchParams = useSearchParams();
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [usdAmount, setUsdAmount] = useState("")
  const [activeInput, setActiveInput] = useState<"crypto" | "fiat">("crypto")
  const [gasPrice, setGasPrice] = useState(25) // Gwei
  const [gasLimit] = useState(21000) // Standard transfer, will update based on token type
  const [isAddressValid, setIsAddressValid] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"sending" | "pending" | "sent" | "error">("sending")
  const [transactionData, setTransactionData] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(30)
  const [isSending, setIsSending] = useState(false);
  
  // Token selection state
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null);
  const [availableTokens, setAvailableTokens] = useState<TokenInfo[]>([]);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({});
  
  // Get token from URL params
  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam && availableTokens.length > 0) {
      const token = availableTokens.find(t => t.symbol === tokenParam)
      if (token) {
        setSelectedToken(token)
      }
    }
  }, [searchParams, availableTokens])

  // Fetch available tokens and their balances
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const chainTokens = await getTokensForChain(currentNetwork.id);
        const tokenList: TokenInfo[] = [];
        const prices: Record<string, number> = {};
        
        // Get prices for each token
        for (const token of chainTokens) {
          let price = 0;
          
          // Try to get USD price from backend
          if (TOKEN_CONFIGS[currentNetwork.id]?.[token.symbol]) {
            try {
              const wallet = getWalletForChain(currentNetwork.id);
              if (wallet) {
                const tokenData = await fetchTokenUSDBalance(
                  wallet.walletAddress,
                  token.symbol,
                  currentNetwork.id
                );
                price = tokenData.tokenPrice || 0;
              }
            } catch (err) {
              console.error(`Failed to fetch price for ${token.symbol}:`, err);
            }
          }
          
          // Fallback to network rate for native tokens
          if (price === 0 && token.type === 'native') {
            price = currentNetwork.rate;
          }
          
          prices[token.symbol] = price;
          
          tokenList.push({
            symbol: token.symbol,
            name: token.name,
            balance: token.balance || '0',
            price: price,
            contractAddress: token.contractAddress
          });
        }
        
        setTokenPrices(prices);
        setAvailableTokens(tokenList);
        
        // Set default token (native token of the chain)
        const nativeToken = tokenList.find(t => !t.contractAddress);
        if (nativeToken) {
          setSelectedToken(nativeToken);
        } else if (tokenList.length > 0) {
          setSelectedToken(tokenList[0]);
        }
      } catch (error) {
        console.error("Error loading tokens:", error);
      }
    };
    
    loadTokens();
  }, [currentNetwork, getTokensForChain]);

  const fetchGasFees = async () => {
    try {
      // For now, use hardcoded values. In production, fetch from appropriate gas oracle
      // based on the current network
      setGasPrice(25); // Default gas price
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gas fees:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGasFees();
    const interval = setInterval(fetchGasFees, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [currentNetwork]);

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

  // Get current token price
  const currentTokenPrice = selectedToken?.price || 0;

  // Calculate gas fee in native token
  const gasFeeEth = (gasPrice * gasLimit) / 1e9
  const gasFeeUsd = gasFeeEth * currentNetwork.rate // Gas is always paid in native token

  // Calculate total amount
  const cryptoAmount =
    activeInput === "crypto" ? Number.parseFloat(amount) || 0 : Number.parseFloat(usdAmount) / currentTokenPrice || 0
  
  // Only add gas fee if sending native token
  const totalCryptoAmount = selectedToken && !selectedToken.contractAddress 
    ? cryptoAmount + gasFeeEth 
    : cryptoAmount;
  
  const totalUsdAmount = (cryptoAmount * currentTokenPrice) + gasFeeUsd;

  // Update the other input when one changes
  useEffect(() => {
    if (activeInput === "crypto" && amount && currentTokenPrice > 0) {
      const amountNum = Number.parseFloat(amount)
      if (!isNaN(amountNum)) {
        setUsdAmount((amountNum * currentTokenPrice).toFixed(2))
      }
    } else if (activeInput === "fiat" && usdAmount && currentTokenPrice > 0) {
      const usdAmountNum = Number.parseFloat(usdAmount)
      if (!isNaN(usdAmountNum)) {
        setAmount((usdAmountNum / currentTokenPrice).toFixed(6))
      }
    }
  }, [amount, usdAmount, activeInput, currentTokenPrice])

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
    if (!selectedToken) {
      setError("Please select a token");
      return;
    }
    
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
        tokenToSend: selectedToken.symbol.toLowerCase(),
        senderWalletAddress: wallet.walletAddress,
        senderPrivateKey: wallet.walletKey,
        chainId: currentNetwork.id
      };

      console.log("[Frontend] Sending transaction with params:", {
        ...requestBody,
        senderPrivateKey: "***hidden***"
      });

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4444';
      const response = await fetch(`${backendUrl}/wallet/send-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        console.error("[Frontend] Error parsing backend response:", jsonErr);
        throw new Error("Invalid backend response");
      }

      console.log("[Frontend] Backend response:", result);

      if (response.ok && result.success) {
        console.log("[Frontend] Transaction successful:", result);
        // Redirect to success page with transaction details
        const params = new URLSearchParams({
          txHash: result.data.transactionHash || result.data.hash,
          amount: amount,
          token: selectedToken.symbol,
          to: recipientAddress,
          chain: currentNetwork.name
        });
        router.push(`/wallet/success?${params.toString()}`);
      } else {
        console.error("[Frontend] Transaction failed:", result);
        throw new Error(result.error || result.details || 'Transaction failed');
      }
    } catch (error) {
      console.error("[Frontend] Transaction error:", error);
      setError(error instanceof Error ? error.message : "Failed to send transaction");
    } finally {
      setIsSending(false);
    }
  };

  const isFormValid = isAddressValid && recipientAddress && (amount || usdAmount) && selectedToken

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
                Send Tokens
              </CardTitle>
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                {currentNetwork.icon}
                <span className="font-medium">{currentNetwork.name}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Token Selection */}
              <div className="space-y-2">
                <Label htmlFor="token" className="text-gray-700 dark:text-gray-300 font-medium">Select Token</Label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                    className="w-full justify-between bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600"
                  >
                    {selectedToken ? (
                      <div className="flex items-center justify-between w-full">
                        <span>{selectedToken.name} ({selectedToken.symbol})</span>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Balance: {parseFloat(selectedToken.balance).toFixed(4)}</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    ) : (
                      <span>Select a token</span>
                    )}
                  </Button>
                  
                  {showTokenDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      {availableTokens.map((token) => (
                        <button
                          key={token.symbol}
                          onClick={() => {
                            setSelectedToken(token);
                            setShowTokenDropdown(false);
                            // Reset amounts when token changes
                            setAmount("");
                            setUsdAmount("");
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{token.name}</div>
                              <div className="text-sm text-gray-500">{token.symbol}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{parseFloat(token.balance).toFixed(4)}</div>
                              <div className="text-xs text-gray-500">${token.price.toFixed(2)}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

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
                      placeholder={`0 ${selectedToken?.symbol || ''}`}
                      value={amount}
                      onChange={(e) => handleCryptoAmountChange(e.target.value)}
                      className="text-right bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{selectedToken?.symbol || 'Token'}</p>
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
                
                {selectedToken && currentTokenPrice > 0 && (
                  <p className="text-xs text-gray-500 text-center">
                    1 {selectedToken.symbol} = ${currentTokenPrice.toFixed(2)} USD
                  </p>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Transaction Details */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Transaction Details</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Network</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{currentNetwork.name}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Token</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {selectedToken?.name || 'Not selected'}
                    </span>
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
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between font-medium pt-3 border-t border-gray-200 dark:border-gray-700 text-lg">
                    <span className="text-gray-900 dark:text-gray-100">Total</span>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-gray-100">
                        {totalCryptoAmount.toFixed(6)} {selectedToken?.symbol || ''}
                        {selectedToken && !selectedToken.contractAddress && (
                          <span className="text-sm text-gray-500 ml-1">(incl. gas)</span>
                        )}
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
                disabled={!isFormValid || isSending} 
                onClick={handleSend}
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Sending Transaction...
                  </>
                ) : (
                  'Send Transaction'
                )}
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
