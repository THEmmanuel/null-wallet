"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Key, Mail, Moon, Sun, Info } from "lucide-react";
import { authApi } from "@/services/api";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sessionManager } from "@/services/session";

export default function LoginPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [authMethod, setAuthMethod] = useState<"password" | "token">("token");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const loginData = {
                authMethod,
                ...(authMethod === "token" ? { token } : { email, password })
            };

            const response = await authApi.login(loginData);
            
            if (response.success) {
                // Fetch user details to store in session storage
                const userId = response.data.userId;
                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4444'}/users/${userId}`);
                const userDetails = await userResponse.json();
                
                // Store session data in IndexedDB
                await sessionManager.setSession({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                    userId: response.data.userId,
                    expiresAt: Date.now() + 3600000, // 1 hour
                    userWallets: userDetails.userWallets,
                    userEmail: userDetails.email
                });
                
                // Store user data in session storage for backward compatibility
                sessionStorage.setItem("authToken", response.data.accessToken);
                sessionStorage.setItem("refreshToken", response.data.refreshToken);
                sessionStorage.setItem("userEmail", userDetails.email || "");
                sessionStorage.setItem("userID", userDetails.userID);
                sessionStorage.setItem("userWallets", JSON.stringify(userDetails.userWallets));
                
                // Store the appropriate wallet address based on current chain
                // Default to Ethereum wallet for now
                const ethereumWallet = userDetails.userWallets.find((w: any) => w.walletName === "Ethereum Wallet");
                if (ethereumWallet) {
                    sessionStorage.setItem("userWalletAddress", ethereumWallet.walletAddress);
                    sessionStorage.setItem("userWalletKey", ethereumWallet.walletKey || "");
                    sessionStorage.setItem("userWalletPhrase", ethereumWallet.walletPhrase || "");
                }
                
                router.push("/wallet");
            } else {
                setError(response.error?.message || "Login failed");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.error?.message || "An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
            </div>

            <main className="relative flex min-h-screen flex-col justify-center p-4 md:p-6">
                {/* Theme Toggle */}
                <div className="absolute top-4 right-4 animate-fadeIn">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all duration-300"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-700" />
                        )}
                    </Button>
                </div>

                <div className="w-full max-w-md mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center animate-fadeIn">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-600 dark:text-gray-400">Access your wallet securely</p>
                    </div>

                    {/* Login Card */}
                    <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        <CardContent className="p-8">
                            {/* Auth Method Toggle */}
                            <div className="flex gap-2 mb-8 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setAuthMethod("token")}
                                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                        authMethod === "token"
                                            ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    <Key className="w-4 h-4 inline-block mr-2" />
                                    Secure Token
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAuthMethod("password")}
                                    className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                        authMethod === "password"
                                            ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    <Mail className="w-4 h-4 inline-block mr-2" />
                                    Email & Password
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={handleLogin}>
                                {authMethod === "token" ? (
                                    <>
                                        <div>
                                            <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Access Token
                                            </label>
                                            <input
                                                id="token"
                                                name="token"
                                                type="text"
                                                required
                                                value={token}
                                                onChange={(e) => setToken(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200 font-mono"
                                                placeholder="Enter your secure token"
                                            />
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                            <div className="flex items-start space-x-2">
                                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                    Enter the access token you received when creating your wallet. Don't have a token? Create a new wallet to get one.
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address (Optional)
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200"
                                                placeholder="your@email.com"
                                            />
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Optional: Add your email for additional security verification
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200"
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                    </>
                                )}

                                {error && (
                                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <Link
                                        href={authMethod === "password" ? "/auth/forgot-password" : "/auth/forgot-token"}
                                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
                                    >
                                        {authMethod === "password" ? "Forgot Password?" : "Lost Token?"}
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Accessing...</span>
                                        </div>
                                    ) : (
                                        "Access Wallet"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Signup Link */}
                    <div className="text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-gray-500 dark:text-gray-400">
                                    Don't have a wallet?
                                </span>
                            </div>
                        </div>

                        <Link href="/auth/signup">
                            <Button
                                variant="outline"
                                className="w-full py-3 px-4 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                Create New Wallet
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}