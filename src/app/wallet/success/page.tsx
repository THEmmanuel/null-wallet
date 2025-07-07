"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, ExternalLink, Copy } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  // Get transaction details from URL parameters
  const txHash = searchParams.get('txHash') || '';
  const amount = searchParams.get('amount') || '0';
  const token = searchParams.get('token') || '';
  const to = searchParams.get('to') || '';
  const chain = searchParams.get('chain') || '';

  // Determine block explorer URL based on chain
  const getBlockExplorerUrl = (hash: string, chain: string) => {
    const explorers: Record<string, string> = {
      'Ethereum': `https://etherscan.io/tx/${hash}`,
      'Sepolia': `https://sepolia.etherscan.io/tx/${hash}`,
      'Polygon': `https://polygonscan.com/tx/${hash}`,
      'Mumbai': `https://mumbai.polygonscan.com/tx/${hash}`,
      'Binance Smart Chain': `https://bscscan.com/tx/${hash}`,
      'BSC Testnet': `https://testnet.bscscan.com/tx/${hash}`,
      'Flow EVM Testnet': `https://evm-testnet.flowscan.io/tx/${hash}`,
    };
    return explorers[chain] || '#';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md mx-auto">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-slideUp">
            <CardContent className="p-8">
              {/* Success Icon */}
              <div className="flex justify-center mb-6 animate-bounceIn">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
                Transaction Successful!
              </h1>
              
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                Your transaction has been submitted to the blockchain
              </p>

              {/* Transaction Details */}
              <div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {amount} {token.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">To</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {shortenAddress(to)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Network</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {chain}
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Hash</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(txHash)}
                        className="h-7 px-2"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <p className="text-xs font-mono text-gray-900 dark:text-gray-100 mt-1 break-all">
                      {shortenAddress(txHash)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <a
                  href={getBlockExplorerUrl(txHash, chain)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Block Explorer
                  </Button>
                </a>
                
                <Button
                  variant="outline"
                  onClick={() => router.push("/wallet")}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
} 