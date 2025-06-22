"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Key, Mail, Moon, Sun, Copy, Check } from "lucide-react";
import { authApi } from "@/services/api";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [authMethod, setAuthMethod] = useState<"password" | "token">("token");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [generatedToken, setGeneratedToken] = useState("");
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [tokenCopied, setTokenCopied] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (authMethod === "password" && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await authApi.signup({
                email,
                password,
                authMethod,
            });

            if (response.success) {
                if (authMethod === "token" && response.data.token) {
                    // Show the token modal for token-based signup
                    setGeneratedToken(response.data.token);
                    setShowTokenModal(true);
                } else {
                    // For password-based signup, redirect directly
                    router.push("/wallet");
                }
            } else {
                setError(response.error.message);
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || "An error occurred during signup");
        } finally {
            setLoading(false);
        }
    };

    const copyToken = () => {
        navigator.clipboard.writeText(generatedToken);
        setTokenCopied(true);
        setTimeout(() => setTokenCopied(false), 2000);
    };

    const proceedToWallet = () => {
        router.push("/wallet");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
            </div>

            {/* Token Success Modal */}
            {showTokenModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Wallet Created Successfully!
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Save your access token securely. You'll need it to login.
                            </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Access Token
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={generatedToken}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-600 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white"
                                />
                                <Button
                                    onClick={copyToken}
                                    variant="outline"
                                    size="icon"
                                    className="bg-white dark:bg-slate-600 hover:bg-gray-50 dark:hover:bg-slate-500"
                                >
                                    {tokenCopied ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>Important:</strong> This token is shown only once. Make sure to save it in a secure location like a password manager.
                            </p>
                        </div>

                        <Button
                            onClick={proceedToWallet}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Continue to Wallet
                        </Button>
                    </div>
                </div>
            )}

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
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create Your Wallet</h2>
                        <p className="text-gray-600 dark:text-gray-400">Join the future of secure digital finance</p>
                    </div>

                    {/* Signup Card */}
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

                            <form className="space-y-6" onSubmit={handleSignup}>
                                {authMethod === "token" ? (
                                    <>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                                Token-Based Authentication
                                            </h3>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                We'll generate a secure access token for you. No passwords needed - just save your token safely!
                                            </p>
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
                                                Optional: Add your email for backup and recovery options
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
                                                placeholder="Create a strong password"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Confirm Password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-200"
                                                placeholder="Confirm your password"
                                            />
                                        </div>
                                    </>
                                )}

                                {error && (
                                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        "Create Wallet"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Login Link */}
                    <div className="text-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-gray-500 dark:text-gray-400">
                                    Already have a wallet?
                                </span>
                            </div>
                        </div>

                        <Link href="/auth/login">
                            <Button
                                variant="outline"
                                className="w-full py-3 px-4 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-slate-700/30 transition-all duration-300 transform hover:scale-[1.02]"
                            >
                                Access Existing Wallet
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
} 