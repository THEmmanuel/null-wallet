import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PayPalProvider } from "@/components/providers/PayPalProvider";
import { BottomNav } from "@/components/ui/bottom-nav";
import { AppNav } from "@/components/ui/app-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Null Wallet",
  description: "A secure and private wallet for your digital assets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppNav />
          <PayPalProvider>
            <main className="pb-16">
              {children}
            </main>
            <BottomNav />
          </PayPalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}