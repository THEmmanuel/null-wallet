"use client";

import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

const transactions = [
  {
    id: 1,
    type: "send",
    amount: "0.5 ETH",
    date: "2024-03-20",
    status: "completed",
    address: "0x1234...5678",
  },
  {
    id: 2,
    type: "receive",
    amount: "1.2 ETH",
    date: "2024-03-19",
    status: "completed",
    address: "0x8765...4321",
  },
  {
    id: 3,
    type: "send",
    amount: "0.3 ETH",
    date: "2024-03-18",
    status: "pending",
    address: "0x9876...1234",
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
        
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-card rounded-lg p-4 shadow-sm border border-border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "send"
                        ? "bg-red-100 dark:bg-red-900/20"
                        : "bg-green-100 dark:bg-green-900/20"
                    }`}
                  >
                    {transaction.type === "send" ? (
                      <ArrowUpRight
                        className={`w-5 h-5 ${
                          transaction.type === "send"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      />
                    ) : (
                      <ArrowDownLeft
                        className={`w-5 h-5 ${
                          transaction.type === "send"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {transaction.type === "send" ? "Sent" : "Received"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.address}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      transaction.type === "send"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.type === "send" ? "-" : "+"}
                    {transaction.amount}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{transaction.date}</span>
                  </div>
                </div>
              </div>
              {transaction.status === "pending" && (
                <div className="mt-2 text-sm text-yellow-500">
                  Transaction pending
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 