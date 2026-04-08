import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display, PT_Serif } from "next/font/google";
import { Providers } from "./providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import GlobalLoader from "@/components/GlobalLoader";

import { getAllSettings } from "@/app/actions/settings";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });
const ptSerif = PT_Serif({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-pt-serif" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  const meta: Metadata = {
    title: settings.siteName || "Crypto News",
    description: settings.siteDescription || "AI Powered Crypto Insights & Technical Analysis",
  };

  if (settings.faviconData) {
    meta.icons = {
      icon: settings.faviconData
    };
  }

  return meta;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAllSettings();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${ptSerif.variable} font-sans min-h-screen antialiased selection:bg-accent-blue selection:text-white flex flex-col relative`}>
        {/* Google Analytics 4 Injection */}
        {settings.ga4Id && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4Id}`} strategy="afterInteractive" />
            <Script id="ga-script" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.ga4Id}');
              `}
            </Script>
          </>
        )}

        {/* Global Ad Networks (Popunders / Custom Scripts in Body) */}
        {settings.customHeadScripts && (
           <div dangerouslySetInnerHTML={{ __html: settings.customHeadScripts }} style={{ display: 'none' }} />
        )}
        
        {/* Adsterra Integrations */}
        {settings.adsterraSocialBar && (
           <div dangerouslySetInnerHTML={{ __html: settings.adsterraSocialBar }} />
        )}

        {/* Google AdSense Global Activation */}
        {settings.adsenseEnabled && settings.googleAdSensePublisherId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.googleAdSensePublisherId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <Providers>
          <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#020617] via-[#09090b] to-[#1e1b4b] dark:opacity-100 opacity-0 transition-opacity duration-1000" />
          
          <GlobalLoader>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </GlobalLoader>
        </Providers>
      </body>
    </html>
  );
}
