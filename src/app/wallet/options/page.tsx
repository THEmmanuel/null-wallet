"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Banknote, Coins, Bitcoin, ArrowDownLeft } from "lucide-react";

const options = [
  {
    title: "Buy",
    description: "Purchase digital assets using multiple payment methods",
    icon: CreditCard,
    href: "/wallet/buy",
    methods: ["Credit Card", "Bank Transfer", "Crypto"],
  },
  {
    title: "Sell",
    description: "Convert your digital assets to fiat currency",
    icon: Banknote,
    href: "/wallet/sell",
    methods: ["Bank Transfer", "PayPal", "Crypto"],
  },
  {
    title: "Receive",
    description: "Get your wallet address to receive funds",
    icon: ArrowDownLeft,
    href: "/wallet/receive",
    methods: ["QR Code", "Address"],
  },
];

export default function WalletOptionsPage() {
  const router = useRouter();

  const handleOptionClick = (href: string) => {
    router.push(href);
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

        <h1 className="text-2xl font-bold mb-6">Wallet Options</h1>

        <div className="grid gap-6">
          {options.map((option) => (
            <button
              key={option.title}
              onClick={() => handleOptionClick(option.href)}
              className="w-full text-left bg-card rounded-lg p-6 shadow-sm border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{option.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {option.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.methods.map((method) => (
                      <span
                        key={method}
                        className="px-2 py-1 text-xs rounded-full bg-muted"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 