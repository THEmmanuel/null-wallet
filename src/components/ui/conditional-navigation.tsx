"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/ui/bottom-nav";
import { AppNav } from "@/components/ui/app-nav";

interface ConditionalNavigationProps {
  children: React.ReactNode;
}

export function ConditionalNavigation({ children }: ConditionalNavigationProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <>
      {!isLandingPage && <AppNav />}
      <main className={isLandingPage ? "" : "pb-16"}>
        {children}
      </main>
      {!isLandingPage && <BottomNav />}
    </>
  );
} 