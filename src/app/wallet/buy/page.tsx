"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Banknote, Bitcoin, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const paymentMethods = [
  {
    id: "credit-card",
    name: "Credit Card",
    icon: CreditCard,
    description: "Pay with your credit or debit card",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    icon: Banknote,
    description: "Direct bank transfer",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: Bitcoin,
    description: "Pay with Bitcoin or other cryptocurrencies",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/50",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: CreditCard,
    description: "Pay securely with PayPal",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
    textColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function BuyPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");

  const handleContinue = () => {
    if (selectedMethod === "paypal") {
      // Pass the amount as a query parameter to the PayPal page
      router.push(`/wallet/paypal?amount=${amount}`);
    } else {
      // Handle other payment methods
      console.log("Selected method:", selectedMethod);
    }
  };

  const ethEquivalent = amount ? (parseFloat(amount) / 3000).toFixed(6) : "0.00";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Buy Digital Assets</h1>
            <p className="text-gray-600 dark:text-gray-400">Purchase cryptocurrencies with your preferred payment method</p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Amount Input Section */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  How much would you like to buy?
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {amount && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">You'll receive approximately:</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{ethEquivalent} ETH</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method, index) => (
                    <div
                      key={method.id}
                      className="animate-slideUp"
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <button
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedMethod === method.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-[1.02]"
                            : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${method.bgColor} transition-all duration-200 ${
                            selectedMethod === method.id ? 'scale-110' : ''
                          }`}>
                            <method.icon className={`w-5 h-5 ${method.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{method.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {method.description}
                            </p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                            selectedMethod === method.id
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}>
                            {selectedMethod === method.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Button */}
              <div className="animate-slideUp" style={{ animationDelay: '0.6s' }}>
                <Button
                  onClick={handleContinue}
                  disabled={!selectedMethod || !amount}
                  className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="animate-slideUp mt-8" style={{ animationDelay: '0.7s' }}>
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">🔒 Secure Transaction</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your payment information is encrypted and secure. We never store your payment details.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 