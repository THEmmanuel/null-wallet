"use client";

import { useEffect, useState } from "react";
import { Loader2, X, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TransactionStatus = "sending" | "pending" | "sent" | "error";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: TransactionStatus;
  transactionData?: {
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    hash: string;
    timestamp: string;
  };
  error?: string;
}

// Helper function to truncate addresses
const truncateAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to copy text to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};

export function TransactionModal({
  isOpen,
  onClose,
  status,
  transactionData,
  error,
}: TransactionModalProps) {
  const [progress, setProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === "sending") {
      setProgress(33);
    } else if (status === "pending") {
      setProgress(66);
    } else if (status === "sent") {
      setProgress(100);
    } else {
      setProgress(0);
    }
  }, [status]);

  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">
            {status === "sending"
              ? "Sending Transaction"
              : status === "pending"
              ? "Transaction Pending"
              : status === "sent"
              ? "Transaction Submitted"
              : "Transaction Failed"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {status === "sending"
                    ? "Sending"
                    : status === "pending"
                    ? "Pending"
                    : status === "sent"
                    ? "Submitted"
                    : "Error"}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
              />
            </div>
          </div>

          {/* Loading Spinner */}
          {(status === "sending" || status === "pending") && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}

          {/* Transaction Details */}
          {transactionData && status === "sent" && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">From</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{truncateAddress(transactionData.from)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy(transactionData.from, "from")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">To</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{truncateAddress(transactionData.to)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy(transactionData.to, "to")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span>{transactionData.value} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gas Price</span>
                <span>{transactionData.gasPrice} Gwei</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{truncateAddress(transactionData.hash)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy(transactionData.hash, "hash")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timestamp</span>
                <span>{new Date(transactionData.timestamp).toLocaleString()}</span>
              </div>

              {/* Etherscan Link */}
              <div className="pt-4 border-t mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`https://sepolia.etherscan.io/tx/${transactionData.hash}`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Etherscan
                </Button>
              </div>
            </div>
          )}

          {/* Copy Success Message */}
          {copySuccess && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md text-sm">
              {copySuccess === "from" && "Sender address copied!"}
              {copySuccess === "to" && "Recipient address copied!"}
              {copySuccess === "hash" && "Transaction hash copied!"}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button
            className="w-full"
            variant={status === "sent" ? "default" : "secondary"}
            onClick={onClose}
          >
            {status === "sent" ? "Done" : "Close"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 