"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Banknote, CreditCard, Bitcoin } from "lucide-react";

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
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: CreditCard,
      description: "Get paid instantly to your PayPal account",
      fields: ["PayPal Email"],
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: Bitcoin,
      description: "Receive payment in your preferred cryptocurrency",
      fields: ["Wallet Address", "Network"],
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <button
          onClick={() => router.back()}
          className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Options
        </button>

        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Sell Your Assets
            </h1>
            <p className="text-muted-foreground">
              Choose how you want to receive your payment
            </p>
          </div>

          <form onSubmit={handleSell} className="space-y-6">
            <div className="p-6 rounded-xl border border-border bg-background/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Asset Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Amount (USD)
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Payout Methods</h3>
              <div className="grid gap-4">
                {payoutMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                        <method.icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-foreground">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedMethod && (
              <div className="p-6 rounded-xl border border-border bg-background/50 space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  {payoutMethods.find(m => m.id === selectedMethod)?.name} Details
                </h3>
                {payoutMethods
                  .find(m => m.id === selectedMethod)
                  ?.fields.map((field) => (
                    <div key={field}>
                      <label
                        htmlFor={field.toLowerCase().replace(" ", "-")}
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {field}
                      </label>
                      <input
                        id={field.toLowerCase().replace(" ", "-")}
                        type="text"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder={`Enter your ${field.toLowerCase()}`}
                      />
                    </div>
                  ))}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedMethod || loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Processing..." : "Sell Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 