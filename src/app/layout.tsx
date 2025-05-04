import type { Metadata } from "next";
import { Saira } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

const saira = Saira({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-saira",
});

export const metadata: Metadata = {
  title: "Null Wallet: One Wallet. Infinite Possibilities.",
  description: "One Wallet. Infinite Possibilities.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
	  <>
		<html lang="en" suppressHydrationWarning className={saira.variable}>
		  <head />
		  <body>
			<ThemeProvider
			  attribute="class"
			  defaultTheme="system"
			  enableSystem
			  disableTransitionOnChange
			>
			  <div className="antialiased">
				{children}
			  </div>
			</ThemeProvider>
		  </body>
		</html>
	  </>
	)
}