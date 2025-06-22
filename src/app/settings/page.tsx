"use client";

import { Bell, Shield, Globe, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";

const settingsSections = [
  {
    title: "Appearance",
    icon: Moon,
    items: [
      {
        name: "Theme",
        description: "Choose your preferred theme",
        type: "theme",
      },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      {
        name: "Transaction Alerts",
        description: "Get notified about your transactions",
        type: "toggle",
      },
      {
        name: "Price Alerts",
        description: "Get notified about price changes",
        type: "toggle",
      },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      {
        name: "Two-Factor Authentication",
        description: "Add an extra layer of security",
        type: "toggle",
      },
      {
        name: "Biometric Authentication",
        description: "Use your fingerprint or face ID",
        type: "toggle",
      },
    ],
  },
  {
    title: "Language & Region",
    icon: Globe,
    items: [
      {
        name: "Language",
        description: "Choose your preferred language",
        type: "select",
      },
      {
        name: "Currency",
        description: "Choose your preferred currency",
        type: "select",
      },
    ],
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <main className="relative flex min-h-screen flex-col p-4 md:p-6">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your wallet preferences and security settings</p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-4">
            {settingsSections.map((section, sectionIndex) => (
              <div
                key={section.title}
                className="animate-slideUp"
                style={{ animationDelay: `${0.1 + sectionIndex * 0.1}s` }}
              >
                <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                        <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.title}</h2>
                    </div>

                    <div className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50/50 dark:bg-slate-700/50 hover:bg-gray-100/50 dark:hover:bg-slate-600/50 transition-colors duration-200"
                          style={{ animationDelay: `${0.2 + sectionIndex * 0.1 + itemIndex * 0.05}s` }}
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>

                          {item.type === "theme" && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setTheme("light")}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                  theme === "light"
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                                }`}
                              >
                                <Sun className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setTheme("dark")}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                  theme === "dark"
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                                }`}
                              >
                                <Moon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setTheme("system")}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                  theme === "system"
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                                }`}
                              >
                                <Laptop className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {item.type === "toggle" && (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          )}

                          {item.type === "select" && (
                            <select className="px-3 py-2 rounded-md border bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                              <option>English</option>
                              <option>Spanish</option>
                              <option>French</option>
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 