"use client";

import { Bell, Shield, Globe, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              className="bg-card rounded-lg p-6 shadow-sm border border-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <section.icon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    {item.type === "theme" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTheme("light")}
                          className={`p-2 rounded-full ${
                            theme === "light"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={`p-2 rounded-full ${
                            theme === "dark"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <Moon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTheme("system")}
                          className={`p-2 rounded-full ${
                            theme === "system"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <Laptop className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {item.type === "toggle" && (
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                        <span className="sr-only">Enable {item.name}</span>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-primary transition ${
                            false ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}

                    {item.type === "select" && (
                      <select className="px-3 py-1 rounded-md border bg-background">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 