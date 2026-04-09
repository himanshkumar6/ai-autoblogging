import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display, PT_Serif } from "next/font/google";
import { Providers } from "./providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import GlobalLoader from "@/components/GlobalLoader";

import { getAllSettings } from "@/app/actions/settings";
import Script from "next/script";
import AdSlot from "@/components/AdSlot";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });
const ptSerif = PT_Serif({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-pt-serif" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  const siteName = settings.siteName || "NexusPulse";
  const globalNiche = settings.globalNiche || "Cosmic Discoveries & Financial Intelligence";

  const meta: Metadata = {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: settings.siteDescription || `Real-time insights from the intersection of ${globalNiche.toLowerCase()}.`,
    verification: {
      google: "i6B4Yq58IOQudXM1CT_pEhPAS3EdqHbAso6oLal_Eik",
    },
    other: {
      monetag: "cd4e6eaff050723852017d532769ba46"
    }
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
    <html lang="en" className="scroll-smooth bg-[#f8fafc] dark:bg-[#020617]" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${ptSerif.variable} font-sans min-h-screen w-full antialiased selection:bg-accent-blue selection:text-white flex flex-col relative bg-transparent dark:bg-[#020617] overflow-x-hidden m-0 p-0`}>
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

        {/* Monetag Vignette Interstitial Ad */}
        <Script id="monetag-vignette-script" strategy="afterInteractive">
          {`(function(s){s.dataset.zone='10850726',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));`}
        </Script>

        <Providers>
          <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#020617] dark:via-[#09090b] dark:to-[#020617] transition-opacity duration-1000 w-full h-full" />
          
          <GlobalLoader>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </GlobalLoader>
        </Providers>

        {/* Global Social Bar / Overlay Ad */}
        {settings.ads?.ad_social_bar && (
          <div className="bg-transparent dark:bg-transparent w-full m-0 p-0 border-none outline-none overflow-hidden">
            <AdSlot 
              adCode={settings.ads.ad_social_bar} 
              className="!my-0 !py-0 !min-h-0 !bg-transparent dark:!bg-transparent" 
              minHeight="0px"
            />
          </div>
        )}
      </body>
    </html>
  );
}
