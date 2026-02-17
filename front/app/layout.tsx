import "./globals.css";
import type { ReactNode } from "react";
import { Outfit, Plus_Jakarta_Sans, Noto_Serif_KR } from "next/font/google";
import NavBar from "@/components/NavBar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${outfit.variable} ${jakarta.variable} ${notoSerif.variable}`}>
      <body className="bg-slate-50 text-slate-900">
        <NavBar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
