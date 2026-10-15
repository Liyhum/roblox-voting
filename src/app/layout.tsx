import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TREC KL Awards - Roblox Community Voting",
  description: "Official Voting Platform for TREC KL Roblox Hangout. Vote for the best street drip, tuned cars, and nightlife moments!",
  icons: {
    icon: "/trec-kl/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#06070a] text-zinc-100 antialiased selection:bg-[#ff007f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
