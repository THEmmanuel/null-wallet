"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Settings, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Home",
    href: "/home",
    icon: Home,
  },
  {
    name: "Wallet",
    href: "/wallet",
    icon: Wallet,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:p-4">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex h-16 items-center justify-center gap-8 md:gap-20 px-4 md:px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:border md:rounded-full md:shadow-lg">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 md:px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 