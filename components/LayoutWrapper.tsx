"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NewsTicker from "./NewsTicker";
import ParticleBackground from "./ParticleBackground";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isAdmin = pathname.startsWith("/admin");
  const isAccessDenied = pathname.startsWith("/access-denied");

  // Admin routes should NOT have the global public Navbar or Footer wrapper pushing them down.
  // We strictly yield raw children here for the Admin Layout to organically fill the viewport.
  if (isAdmin || isAccessDenied) {
    return <>{children}</>;
  }

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <NewsTicker />
        <main className="flex-grow pt-32">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
