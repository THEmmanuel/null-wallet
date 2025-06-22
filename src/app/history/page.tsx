"use client";

import { ArrowUpRight, ArrowDownLeft, Clock, Filter, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const transactions = [
  {
    id: 1,
    type: "send",
    amount: "0.5 ETH",
    usdValue: 1500,
    date: "2024-03-20",
    time: "14:30",
    status: "completed",
    address: "0x1234...5678",
    hash: "0xabcd...ef12",
  },
  {
    id: 2,
    type: "receive",
    amount: "1.2 ETH",
    usdValue: 3600,
    date: "2024-03-19",
    time: "09:15",
    status: "completed",
    address: "0x8765...4321",
    hash: "0x1234...abcd",
  },
  {
    id: 3,
    type: "send",
    amount: "0.3 ETH",
    usdValue: 900,
    date: "2024-03-18",
    time: "16:45",
    status: "pending",
    address: "0x9876...1234",
    hash: "",
  },
  {
    id: 4,
    type: "receive",
    amount: "2.1 ETH",
    usdValue: 6300,
    date: "2024-03-17",
    time: "11:20",
    status: "completed",
    address: "0x5678...9abc",
    hash: "0xef12...3456",
  },
  {
    id: 5,
    type: "send",
    amount: "0.8 ETH",
    usdValue: 2400,
    date: "2024-03-16",
    time: "13:10",
    status: "completed",
    address: "0x4321...8765",
    hash: "0x9876...5432",
  },
];

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch = tx.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.amount.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50";
      case "pending": return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50";
      case "failed": return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Transaction History</h1>
            <p className="text-gray-600 dark:text-gray-400">Keep track of all your wallet activities</p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm mb-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "send", label: "Sent" },
                  { key: "receive", label: "Received" }
                ].map((filterOption) => (
                  <Button
                    key={filterOption.key}
                    variant={filter === filterOption.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterOption.key)}
                    className="transition-all duration-200"
                  >
                    {filterOption.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <Card
                key={transaction.id}
                className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer animate-slideUp"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${
                          transaction.type === "send"
                            ? "bg-red-100 dark:bg-red-900/20"
                            : "bg-green-100 dark:bg-green-900/20"
                        }`}
                      >
                        {transaction.type === "send" ? (
                          <ArrowUpRight
                            className={`w-6 h-6 ${
                              transaction.type === "send"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          />
                        ) : (
                          <ArrowDownLeft
                            className={`w-6 h-6 ${
                              transaction.type === "send"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {transaction.type === "send" ? "Sent" : "Received"}
                          </p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          To: {transaction.address}
                        </p>
                        {transaction.hash && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Hash: {transaction.hash}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold mb-1 ${
                          transaction.type === "send"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {transaction.type === "send" ? "-" : "+"}
                        {transaction.amount}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        ${transaction.usdValue.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{transaction.date} at {transaction.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No transactions found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? "Try adjusting your search criteria" : "Your transaction history will appear here"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Stats */}
        <Card className="border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm mt-8 animate-slideUp" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {transactions.filter(t => t.status === "completed").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {transactions.filter(t => t.status === "pending").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${transactions.filter(t => t.status === "completed").reduce((sum, t) => sum + t.usdValue, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 