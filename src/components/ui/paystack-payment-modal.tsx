"use client";

import { useState } from "react";
import { X, ExternalLink, Copy, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaystackPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentLink: string;
  reference: string;
  amount: string;
  onProceed: () => void;
}

export function PaystackPaymentModal({
  isOpen,
  onClose,
  paymentLink,
  reference,
  amount,
  onProceed,
}: PaystackPaymentModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm animate-slideUp">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Paystack Payment
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Security Badge */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold">Secure Payment Gateway</span>
            </div>
          </div>

          {/* Amount Display */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">${amount}</p>
          </div>

          {/* Payment Link Section */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Click below to proceed to Paystack secure payment page
            </p>
            
            <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Payment Link:</p>
              <div className="flex items-center gap-2">
                <p className="flex-1 text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
                  {paymentLink}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={handleCopy}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Reference Display */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Reference: {reference}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onProceed}
              className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Proceed to Payment
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full py-4 text-lg font-semibold rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Cancel
            </Button>
          </div>

          {/* Copy Success Message */}
          {copySuccess && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md text-sm shadow-lg animate-slideUp">
              Payment link copied!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 