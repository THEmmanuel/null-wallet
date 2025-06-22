"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Banknote, Coins, Bitcoin, ArrowDownLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const options = [
  {
    title: "Buy",
    description: "Purchase digital assets using multiple payment methods",
    icon: CreditCard,
    href: "/wallet/buy",
    methods: ["Credit Card", "Bank Transfer", "PayPal"],
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Sell",
    description: "Convert your digital assets to fiat currency",
    icon: Banknote,
    href: "/wallet/sell",
    methods: ["Bank Transfer", "PayPal", "Crypto"],
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/50",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Receive",
    description: "Get your wallet address to receive funds",
    icon: ArrowDownLeft,
    href: "/wallet/receive",
    methods: ["QR Code", "Address", "Share"],
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
    textColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function WalletOptionsPage() {
  const router = useRouter();

  const handleOptionClick = (href: string) => {
    router.push(href);
  };

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Wallet Options</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose how you want to manage your digital assets</p>
          </div>
        </div>

        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={option.title}
              className="animate-slideUp"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <Card 
                className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                onClick={() => handleOptionClick(option.href)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${option.bgColor} transition-all duration-300 group-hover:scale-110`}>
                      <option.icon className={`w-6 h-6 ${option.textColor}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {option.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                        {option.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.methods.map((method) => (
                          <span
                            key={method}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                          >
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 transition-colors duration-200"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Additional helpful section */}
        <div className="animate-slideUp mt-12" style={{ animationDelay: '0.5s' }}>
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Our support team is available 24/7 to help you with any questions
              </p>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">
                Contact Support
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 