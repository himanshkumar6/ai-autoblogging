import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Crypto News",
  description: "AI Powered Crypto Insights & Technical Analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased selection:bg-accent-blue selection:text-white flex flex-col relative`}>
        <Providers>
          <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#020617] via-[#09090b] to-[#1e1b4b] dark:opacity-100 opacity-0 transition-opacity duration-1000" />
          
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
