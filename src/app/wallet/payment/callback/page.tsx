"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Mail, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/services/api";

type TransactionStatus = "loading" | "success" | "failed" | "error";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<TransactionStatus>("loading");
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyTransaction = async () => {
      const reference = searchParams.get("reference") || searchParams.get("trxref");
      
      if (!reference) {
        setStatus("error");
        setErrorMessage("No transaction reference found");
        return;
      }

      try {
        const response = await api.get(`/api/paystack/verify/${reference}`);
        const data = response.data;

        if (data.success && data.data.status === "success") {
          setStatus("success");
          setTransactionDetails(data.data);
        } else if (data.data?.status === "failed") {
          setStatus("failed");
          setTransactionDetails(data.data);
          setErrorMessage(data.data.gateway_response || "Transaction failed");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Unable to verify transaction");
        }
      } catch (error: any) {
        console.error("Error verifying transaction:", error);
        setStatus("error");
        setErrorMessage(error.response?.data?.error || "Failed to verify transaction");
      }
    };

    verifyTransaction();
  }, [searchParams]);

  const handleContinue = () => {
    if (status === "success") {
      router.push("/wallet");
    } else {
      router.push("/wallet/buy");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-slideUp">
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-8">
            {status === "loading" && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Verifying Payment
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we confirm your transaction...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center space-y-6 animate-fadeIn">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <CheckCircle className="h-20 w-20 text-green-500 relative z-10" />
                  </div>
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Payment Successful!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your transaction has been completed successfully
                  </p>
                </div>

                {/* Placeholder Art Section */}
                <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="w-48 h-48 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-lg">
                    <div className="text-white text-center p-4">
                      <Mail className="h-16 w-16 mx-auto mb-2" />
                      <p className="text-sm font-medium">Receipt Sent</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Thanks for your purchase!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your receipt has been sent to your email.
                  </p>
                </div>

                {/* Transaction Details */}
                {transactionDetails && (
                  <div className="text-left space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {transactionDetails.currency} {transactionDetails.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Reference:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                        {transactionDetails.reference?.slice(-8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Channel:</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                        {transactionDetails.channel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <Button
                  onClick={handleContinue}
                  className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Go to Wallet
                </Button>
              </div>
            )}

            {status === "failed" && (
              <div className="text-center space-y-6 animate-fadeIn">
                {/* Failed Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <XCircle className="h-20 w-20 text-red-500 relative z-10" />
                  </div>
                </div>

                {/* Failed Message */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
                    Payment Failed
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {errorMessage || "Your transaction could not be completed"}
                  </p>
                </div>

                {/* Error Details */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    The payment was not successful. Please try again or use a different payment method.
                  </p>
                </div>

                {/* Transaction Details if available */}
                {transactionDetails && (
                  <div className="text-left space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Reference:</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
                        {transactionDetails.reference?.slice(-8)}
                      </span>
                    </div>
                    {transactionDetails.gateway_response && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Reason:</span>
                        <span className="text-sm text-red-600 dark:text-red-400">
                          {transactionDetails.gateway_response}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/wallet/buy")}
                    className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/wallet")}
                    className="w-full py-3 text-base font-semibold rounded-2xl border-2"
                  >
                    Back to Wallet
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="text-center space-y-6 animate-fadeIn">
                {/* Error Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <AlertCircle className="h-20 w-20 text-orange-500 relative z-10" />
                  </div>
                </div>

                {/* Error Message */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    Verification Error
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {errorMessage || "We couldn't verify your transaction"}
                  </p>
                </div>

                {/* Error Details */}
                <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Please contact support if you believe this is an error. Your payment may still be processing.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/wallet")}
                    className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Go to Wallet
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = "mailto:support@nullwallet.com"}
                    className="w-full py-3 text-base font-semibold rounded-2xl border-2"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 