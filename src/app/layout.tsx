import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PayPalProvider } from "@/components/providers/PayPalProvider";
import { ChainProvider } from "@/contexts/ChainContext";
import { ConditionalNavigation } from "@/components/ui/conditional-navigation";

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
          <ChainProvider>
            <ConditionalNavigation>
              <PayPalProvider>
                {children}
              </PayPalProvider>
            </ConditionalNavigation>
          </ChainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}