"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthInfo {
  type: "email" | "token";
  value: string;
}

export function AppNav() {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);

  useEffect(() => {
    // Check session storage for auth info
    const email = sessionStorage.getItem("userEmail");
    const token = sessionStorage.getItem("authToken");

    if (email) {
      setAuthInfo({ type: "email", value: email });
    } else if (token) {
      setAuthInfo({ type: "token", value: token });
    }
  }, []);

  const truncateEmail = (email: string) => {
    const [username, domain] = email.split("@");
    if (username.length > 8) {
      return `${username.slice(0, 8)}...@${domain}`;
    }
    return email;
  };

  const truncateToken = (token: string) => {
    return `...${token.slice(-3)}`;
  };

  return (
    <nav className="border-b bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">NullWallet</span>
            </Link>
          </div>

          <div className="flex items-center">
            {authInfo ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {authInfo.type === "email" ? (
                    <span>Logged in as {truncateEmail(authInfo.value)}</span>
                  ) : (
                    <span>Logged in with token {truncateToken(authInfo.value)}</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    sessionStorage.clear();
                    window.location.href = "/auth/login";
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 