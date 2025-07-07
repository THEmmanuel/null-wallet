"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChain } from "@/contexts/ChainContext";
import { getWalletAddressForChain } from "@/utils/wallet-helpers";

export default function ReceivePage() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const { currentNetwork } = useChain();

  useEffect(() => {
    const address = getWalletAddressForChain(currentNetwork.id);
    setWalletAddress(address || "N/A");
  }, [currentNetwork.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrData = JSON.stringify({
    address: walletAddress,
    network: currentNetwork.name,
    chainId: currentNetwork.id,
    text: `Send ${currentNetwork.symbol} to: ${walletAddress} on ${currentNetwork.name}`,
  });

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
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="pl-0 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Receive Card */}
          <div className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="text-center pb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Receive {currentNetwork.symbol}
              </h2>
              <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                {currentNetwork.icon}
                <span className="text-lg font-medium">{currentNetwork.name}</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    {/* Replace with actual QR code component */}
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-300 rounded-lg mb-2 mx-auto"></div>
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-3 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <div className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Wallet Address</div>
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    value={walletAddress}
                    readOnly
                    className="flex-1 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="icon"
                    className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 dark:text-green-400 animate-fadeIn">
                    ✓ Address copied to clipboard!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                <Button
                  onClick={() => navigator.share({
                    title: `My ${currentNetwork.name} Wallet Address`,
                    text: `Send ${currentNetwork.symbol} to: ${walletAddress} on ${currentNetwork.name}`,
                  })}
                  variant="outline"
                  className="flex-1 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Share
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-200"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Save QR
                </Button>
              </div>

              {/* Instructions */}
              <div className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
                <div className="border-0 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 backdrop-blur-sm">
                  <div className="p-4">
                    <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                      How to receive {currentNetwork.symbol}
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li>Share your address or QR code with the sender</li>
                      <li>Make sure they're sending {currentNetwork.symbol} on the {currentNetwork.name} network</li>
                      <li>Wait for the transaction to be confirmed on {currentNetwork.name}</li>
                      <li>Your {currentNetwork.symbol} balance will update automatically</li>
                    </ol>
                    
                    {currentNetwork.id === "nullnet" && (
                      <div className="mt-4 p-3 rounded-lg bg-purple-100/80 dark:bg-purple-900/30 backdrop-blur-sm">
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          <strong>Note:</strong> This is the NullNet blockchain. Make sure the sender is using NullNet-compatible wallets.
                        </p>
                      </div>
                    )}
                    
                    {currentNetwork.id === "ethereum" && (
                      <div className="mt-4 p-3 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Note:</strong> This address works for ETH and ERC-20 tokens on Ethereum.
                        </p>
                      </div>
                    )}

                    {currentNetwork.id === "polygon" && (
                      <div className="mt-4 p-3 rounded-lg bg-purple-100/80 dark:bg-purple-900/30 backdrop-blur-sm">
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          <strong>Note:</strong> This address works for MATIC and Polygon-based tokens.
                        </p>
                      </div>
                    )}

                    {currentNetwork.id === "bsc" && (
                      <div className="mt-4 p-3 rounded-lg bg-yellow-100/80 dark:bg-yellow-900/30 backdrop-blur-sm">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Note:</strong> This address works for BNB and BSC-based tokens.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 