"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export default function PayPalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState(searchParams.get("amount") || "10.00");
  const [{ isPending }] = usePayPalScriptReducer();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    const order = await actions.order.capture();
    console.log("Order completed:", order);
    router.push("/wallet/success");
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
          <h1 className="text-2xl font-bold mb-6">PayPal Payment</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Amount
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="w-full px-4 py-2 rounded-md border bg-background"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              {isPending ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading PayPal...</p>
                </div>
              ) : (
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 