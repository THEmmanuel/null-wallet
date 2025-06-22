"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Banknote, CreditCard, Bitcoin, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SellPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const payoutMethods = [
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      icon: Banknote,
      description: "Receive funds directly to your bank account",
      fields: ["Account Number", "Routing Number", "Account Type"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/50",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: CreditCard,
      description: "Get paid instantly to your PayPal account",
      fields: ["PayPal Email"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: Bitcoin,
      description: "Receive payment in your preferred cryptocurrency",
      fields: ["Wallet Address", "Network"],
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/50",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Implementation will be added later
    setTimeout(() => {
      setLoading(false);
      router.push("/wallet/success");
    }, 1500);
  };

  const selectedMethodDetails = payoutMethods.find(m => m.id === selectedMethod);

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
            Back to Options
          </button>
        </div>

        <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Sell Your Assets</h1>
            <p className="text-gray-600 dark:text-gray-400">Convert your digital assets to cash</p>
          </div>
        </div>

        <form onSubmit={handleSell} className="space-y-6">
          {/* Asset Details Card */}
          <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Asset Details</h2>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    required
                    className="w-full pl-12 pr-4 py-4 text-xl font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    placeholder="Enter amount to sell"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout Methods */}
          <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Choose Payout Method</h3>
              <div className="space-y-3">
                {payoutMethods.map((method, index) => (
                  <div
                    key={method.id}
                    className="animate-slideUp"
                    style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedMethod === method.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl ${method.bgColor} flex items-center justify-center transition-all duration-200 ${
                          selectedMethod === method.id ? 'scale-110' : ''
                        }`}>
                          <method.icon className={`w-6 h-6 ${method.textColor}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{method.name}</h4>
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
            </CardContent>
          </Card>

          {/* Payment Details Form */}
          {selectedMethod && selectedMethodDetails && (
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  {selectedMethodDetails.name} Details
                </h3>
                <div className="space-y-4">
                  {selectedMethodDetails.fields.map((field) => (
                    <div key={field}>
                      <label
                        htmlFor={field.toLowerCase().replace(" ", "-")}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        {field}
                      </label>
                      <input
                        id={field.toLowerCase().replace(" ", "-")}
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                        placeholder={`Enter your ${field.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="animate-slideUp" style={{ animationDelay: '0.7s' }}>
            <Button
              type="submit"
              disabled={!selectedMethod || loading || !amount}
              className="w-full py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {loading ? "Processing Sale..." : "Sell Now"}
            </Button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="animate-slideUp mt-8" style={{ animationDelay: '0.8s' }}>
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">💰 Instant Payout</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your funds will be transferred within 1-3 business days depending on your selected payout method.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 