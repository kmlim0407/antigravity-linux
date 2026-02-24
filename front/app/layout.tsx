import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import NavBar from "@/components/NavBar";
import IntroAnimation from "@/components/IntroAnimation";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "SMOOKTH",
  description: "논리적인 이해 × 전략적인 훈련. SMOOKTH와 함께합니다.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SMOOKTH",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "SMOOKTH",
    description: "논리적인 이해 × 전략적인 훈련. SMOOKTH와 함께합니다.",
    url: "https://smookth.vercel.app",
    siteName: "SMOOKTH",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMOOKTH",
    description: "논리적인 이해 × 전략적인 훈련. SMOOKTH와 함께합니다.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${outfit.variable} ${jakarta.variable}`}>
        <body className="bg-white text-slate-900">
        <Script id="pwa-prompt-capture" strategy="beforeInteractive">{`
          window.__pwaPromptEvent = null;
          window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            window.__pwaPromptEvent = e;
          });
        `}</Script>
        <ServiceWorkerRegister />
        <IntroAnimation />
        <NavBar />
        <main className="min-h-screen overflow-x-hidden">{children}</main>
      </body>
    </html>
  );
}
