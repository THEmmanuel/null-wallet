"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Transaction Successful!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your transaction has been completed successfully. You will receive a confirmation email shortly.
          </p>

          <button
            onClick={() => router.push("/wallet/options")}
            className="inline-flex items-center text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wallet
          </button>
        </div>
      </div>
    </div>
  );
} 