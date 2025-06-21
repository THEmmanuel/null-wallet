"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Banknote, Bitcoin } from "lucide-react";

const paymentMethods = [
  {
    id: "credit-card",
    name: "Credit Card",
    icon: CreditCard,
    description: "Pay with your credit or debit card",
  },
  {
    id: "bank-transfer",
    name: "Bank Transfer",
    icon: Banknote,
    description: "Direct bank transfer",
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    icon: Bitcoin,
    description: "Pay with Bitcoin or other cryptocurrencies",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: CreditCard,
    description: "Pay securely with PayPal",
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
          <h1 className="text-2xl font-bold mb-6">Buy Digital Assets</h1>

          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-md border bg-background"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {amount && (
                <p className="mt-2 text-sm text-muted-foreground">
                  ≈ {(parseFloat(amount) / 3000).toFixed(6)} ETH
                </p>
              )}
            </div>

            {/* Payment Methods */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
              <div className="grid gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          selectedMethod === method.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <method.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{method.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedMethod || !amount}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 