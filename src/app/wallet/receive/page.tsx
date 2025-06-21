"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Share2, Download } from "lucide-react";
import { useState } from "react";

export default function ReceivePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x1234...5678"; // This would be your actual wallet address

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "My Wallet Address",
        text: `Send funds to: ${walletAddress}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Receive Funds</h1>

          <div className="space-y-6">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  {/* Replace with actual QR code component */}
                  <span className="text-muted-foreground">QR Code</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Address</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={walletAddress}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-md border bg-background"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md border hover:bg-muted"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-500">Address copied!</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border hover:bg-muted"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border hover:bg-muted">
                <Download className="w-5 h-5" />
                Save QR
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 rounded-lg bg-muted/50">
              <h2 className="font-medium mb-2">How to receive funds</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Share your address or QR code with the sender</li>
                <li>Make sure they're sending the correct cryptocurrency</li>
                <li>Wait for the transaction to be confirmed</li>
                <li>Your balance will update automatically</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 