"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

type TransactionStatus = "idle" | "sending" | "pending" | "sent" | "error";

export function SendTokenForm() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<TransactionStatus>("idle");
  const [error, setError] = useState("");

  // Hardcoded testnet values
  const SENDER_WALLET = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  const SENDER_PRIVATE_KEY = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("sending");

    try {
      const response = await axios.post("/wallet/send-token", {
        amount,
        receiverWalletAddress: recipientAddress,
        tokenToSend: "eth",
        senderWalletAddress: SENDER_WALLET,
        senderPrivateKey: SENDER_PRIVATE_KEY,
      });

      if (response.data.success) {
        setStatus("sent");
        // Save to session storage for history
        const history = JSON.parse(sessionStorage.getItem("transactionHistory") || "[]");
        history.push({
          type: "send",
          token: "eth",
          amount,
          recipient: recipientAddress,
          timestamp: new Date().toISOString(),
          status: "completed"
        });
        sessionStorage.setItem("transactionHistory", JSON.stringify(history));
      } else {
        setStatus("error");
        setError(response.data.error?.message || "Transaction failed");
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.response?.data?.error?.message || "Failed to send transaction");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send ETH</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount (ETH)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="0.0"
            step="0.000000000000000001"
            min="0"
            required
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <button
            type="submit"
            disabled={status === "sending" || status === "pending"}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {status === "sending" || status === "pending" ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                {status === "sending" ? "Sending Transaction..." : "Transaction Pending..."}
              </>
            ) : (
              "Send"
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {status !== "idle" && (
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 dark:text-blue-400 bg-blue-200 dark:bg-blue-900/50">
                    {status === "sending" ? "Sending" : status === "pending" ? "Pending" : status === "sent" ? "Sent" : "Error"}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900/50">
                <div
                  style={{
                    width: status === "sending" ? "33%" : status === "pending" ? "66%" : status === "sent" ? "100%" : "0%",
                  }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-600 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        )}

        {status === "sent" && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Transaction sent successfully!
                </h3>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 